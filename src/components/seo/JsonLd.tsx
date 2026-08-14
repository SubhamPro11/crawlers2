import React from "react";

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export interface SoftwareApplicationJsonLdProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

export interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export interface BreadcrumbJsonLdProps {
  items: {
    name: string;
    item: string;
  }[];
}

export const SoftwareApplicationJsonLd: React.FC<SoftwareApplicationJsonLdProps> = ({
  name,
  description,
  url,
  applicationCategory = "DeveloperApplication",
  operatingSystem = "All",
  offers,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    ...(offers && {
      offers: {
        "@type": "Offer",
        price: offers.price,
        priceCurrency: offers.priceCurrency,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};

export const CollectionPageJsonLd: React.FC<CollectionPageJsonLdProps> = ({
  name,
  description,
  url,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};

export const BreadcrumbJsonLd: React.FC<BreadcrumbJsonLdProps> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};

export interface SiteIdentityJsonLdProps {
  siteUrl?: string;
  name?: string;
  description?: string;
  logoUrl?: string;
}

export const SiteIdentityJsonLd: React.FC<SiteIdentityJsonLdProps> = ({
  siteUrl = "https://crawlers.dpdns.org",
  name = "Crawlers",
  description = "A human-curated directory of AI tools, API endpoints, and developer infrastructure with audited licensing and direct source links.",
  logoUrl = "https://crawlers.dpdns.org/favicon.ico",
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name,
        alternateName: ["Crawlers AI", "Crawlers AI Tools Directory"],
        url: siteUrl,
        description,
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/tools?searchQuery={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name,
        url: siteUrl,
        logo: logoUrl,
        description: "Human-curated AI software directory and API registry.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};


