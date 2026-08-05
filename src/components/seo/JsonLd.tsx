import React from "react";

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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
