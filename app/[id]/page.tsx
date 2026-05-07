import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCard } from "@/lib/cards";
import type { UserCard } from "@/lib/cards";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import CoverTemplate from "@/components/templates/CoverTemplate";
import SidebarTemplate from "@/components/templates/SidebarTemplate";
import TerminalTemplate from "@/components/templates/TerminalTemplate";
import GlassTemplate from "@/components/templates/GlassTemplate";
import TimelineTemplate from "@/components/templates/TimelineTemplate";
import StructuredData from "@/components/shared/StructuredData";

type Props = {
  params: Promise<{ id: string }>;
};

const templateMap: Record<string, React.ComponentType<{ card: UserCard }>> = {
  minimal: MinimalTemplate,
  cover: CoverTemplate,
  sidebar: SidebarTemplate,
  terminal: TerminalTemplate,
  glass: GlassTemplate,
  timeline: TimelineTemplate
  };
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  
  if (!card) return { title: `Not Found | Cardfoi` };
  
  return {
    title: `${card.name} | Cardfoi`,
    description: card.description,
    openGraph: {
      title: `${card.name} | Cardfoi`,
      description: card.description,
      url: `https://cardfoi.vercel.app/${id}`,
      type: "profile",
      images: card.avatar ? [card.avatar] : ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${card.name} | Cardfoi`,
      description: card.description,
      images: card.avatar ? [card.avatar] : ["/og-image.png"],
    },
    alternates: {
      canonical: `https://cardfoi.vercel.app/${id}`,
    },
  };
}
 
export default async function PublicCardPage({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) notFound();

  const Template = templateMap[card.template ?? "minimal"] || MinimalTemplate;

  return (
    <>
      <StructuredData card={card} />
      <Template card={card} />
    </>
  );
}
