"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { skills } from "@/data/resume";

const categoryColors: Record<string, string> = {
  "AI & ML": "from-violet-500 to-purple-500",
  Languages: "from-cyan-500 to-blue-500",
  Backend: "from-emerald-500 to-teal-500",
  Frontend: "from-orange-500 to-amber-500",
  Infrastructure: "from-rose-500 to-pink-500",
};

export default function Skills() {
  return (
    <section id="skills" className="py-32 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeInUp} className="mb-16">
            <span className="text-violet-400 text-sm font-medium tracking-wider uppercase">
              Skills
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Tech Stack
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items]) => (
              <motion.div
                key={category}
                variants={scaleIn}
                className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-2 h-8 rounded-full bg-gradient-to-b ${
                      categoryColors[category] || "from-violet-500 to-cyan-500"
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-white">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm text-zinc-300 bg-zinc-800/60 rounded-lg border border-zinc-700/30 hover:border-zinc-600 hover:text-white transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
