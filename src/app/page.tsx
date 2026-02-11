import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Photography from "@/components/Photography";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="snap-y snap-mandatory overflow-y-scroll h-screen">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Photography />
      <Contact />
    </main>
  );
}