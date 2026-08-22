import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  // Determine correct base origin considering reverse proxies / custom domains
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const isLocalEnv = process.env.NODE_ENV === "development";
  const redirectBase = !isLocalEnv && forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : origin;

  // Handle upstream OAuth errors (e.g. user cancelled or access denied)
  if (authError || authErrorDescription) {
    console.error("[Auth Callback Error]", authError, authErrorDescription);
    const errorParam = encodeURIComponent(authError || "oauth_error");
    const descParam = encodeURIComponent(authErrorDescription || "Authentication was cancelled or failed");
    return NextResponse.redirect(
      `${redirectBase}/login?error=${errorParam}&error_description=${descParam}&next=${encodeURIComponent(next)}`
    );
  }

  if (code) {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore cookie set errors in server context
            }
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${redirectBase}${next}`);
      }

      console.error("[Auth Callback] Code exchange error:", error.message);
      return NextResponse.redirect(
        `${redirectBase}/login?error=exchange_failed&error_description=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
      );
    }
  }

  // Fallback if no code and no error
  return NextResponse.redirect(`${redirectBase}/login?error=missing_auth_code&next=${encodeURIComponent(next)}`);
}

