import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Photography from "@/components/sections/Photography";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="bg-zinc-950 text-white min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Photography />
      <Contact />
    </main>
  );
}
