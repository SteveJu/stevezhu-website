"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { experience } from "@/data/resume";

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px]" />
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
              Experience
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Where I&apos;ve Worked
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/30 to-transparent" />

            {experience.map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`relative mb-16 last:mb-0 md:w-1/2 ${
                  i % 2 === 0 ? "md:pr-16" : "md:pl-16 md:ml-auto"
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute top-2 w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)] ${
                    i % 2 === 0
                      ? "left-0 md:-right-[7px] md:left-auto"
                      : "left-0 md:-left-[7px]"
                  }`}
                />

                <div className="ml-8 md:ml-0 p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:border-violet-500/20 transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-violet-400 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-zinc-500 text-sm whitespace-nowrap ml-4">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {exp.description.map((desc, j) => (
                      <li key={j} className="text-zinc-400 text-sm flex items-start gap-2">
                        <span className="text-violet-500 mt-1.5 w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" />
                        {desc}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 text-xs text-zinc-400 bg-zinc-800/80 rounded-md border border-zinc-700/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
