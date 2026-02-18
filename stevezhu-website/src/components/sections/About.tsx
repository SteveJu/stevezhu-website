"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { education } from "@/data/resume";

export default function About() {
  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeInUp} className="mb-16">
            <span className="text-violet-400 text-sm font-medium tracking-wider uppercase">
              About Me
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Engineer. Researcher. Creator.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            <motion.div variants={fadeInUp} className="space-y-6">
              <p className="text-zinc-400 text-lg leading-relaxed">
                I&apos;m a software engineer passionate about building intelligent systems
                that make a real impact. Currently at <span className="text-white font-medium">Meta</span>,
                where I work on AI-powered safety systems protecting young users on Instagram.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed">
                My journey spans from studying computer science at{" "}
                <span className="text-white font-medium">Ohio State</span>, to AI research at{" "}
                <span className="text-white font-medium">Stanford</span>, to machine learning at{" "}
                <span className="text-white font-medium">Columbia</span>. I thrive at the intersection
                of cutting-edge AI and practical engineering.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed">
                When I&apos;m not coding, you&apos;ll find me exploring NYC with my camera,
                capturing portraits and city moments.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-semibold text-white mb-8">Education</h3>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="relative pl-6 border-l border-zinc-800 hover:border-violet-500/50 transition-colors"
                  >
                    <div className="absolute left-0 top-1 w-2 h-2 -translate-x-[5px] rounded-full bg-violet-500" />
                    <h4 className="text-white font-medium">{edu.school}</h4>
                    <p className="text-zinc-400 text-sm mt-1">{edu.degree}</p>
                    <p className="text-zinc-500 text-sm mt-1">{edu.period}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
