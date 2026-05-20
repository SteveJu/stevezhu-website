import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import TechnicalSkills from "@/components/TechnicalSkills";
import Photography from "@/components/Photography";
import Contact from "@/components/Contact";
import SiteModeFrame from "@/components/SiteModeFrame";
import dynamic from "next/dynamic";

const BuildStudio = dynamic(() => import("@/components/BuildStudio"));

export default function Home() {
  return (
    <SiteModeFrame showFloatingModeToggle={false}>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Education />
      <TechnicalSkills />
      <Photography />
      <BuildStudio />
      <Contact />
    </SiteModeFrame>
  );
}
