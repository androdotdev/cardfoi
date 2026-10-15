import Feature from "@/components/landingPage/Section/Feature";
import Footer from "@/components/landingPage/Section/Footer";
import Hero from "@/components/landingPage/Section/Hero";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f8f5] text-[#171916]">
      <Hero />
      <Feature />
      <Footer />
    </main>
  );
}
