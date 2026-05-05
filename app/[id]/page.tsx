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
  };
}
 
export default async function PublicCardPage({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) notFound();

  const Template = templateMap[card.template ?? "minimal"] || MinimalTemplate;

  return <Template card={card} />;
}
