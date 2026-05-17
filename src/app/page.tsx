import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Photography from "@/components/Photography";
import Contact from "@/components/Contact";
import SiteModeFrame from "@/components/SiteModeFrame";

export default function Home() {
  return (
    <SiteModeFrame>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Photography />
      <Contact />
    </SiteModeFrame>
  );
}
