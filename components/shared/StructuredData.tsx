"use client";

export default function StructuredData({ 
  card 
}: { 
  card: { name: string; description: string; avatar?: string | null; id: string } 
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: card.name,
    description: card.description,
    ...(card.avatar ? { image: card.avatar } : {}),
    url: `https://cardfoi.vercel.app/${card.id}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
