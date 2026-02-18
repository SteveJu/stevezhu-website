"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { photographyAlbums } from "@/data/resume";

export default function Photography() {
  return (
    <section id="photography" className="py-32 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]" />
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
              Photography
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Through My Lens
            </h2>
            <p className="text-zinc-400 mt-4 text-lg max-w-2xl">
              Capturing moments and stories in the streets of New York City and beyond.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photographyAlbums.map((album) => (
              <motion.div
                key={album.id}
                variants={scaleIn}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer"
              >
                {/* Placeholder gradient for albums without images */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />

                {/* Album info overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent">
                  <h3 className="text-xl font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">{album.description}</p>
                  <motion.div
                    className="mt-3 flex items-center gap-2 text-sm text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span>View Album</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>

                {/* Decorative camera icon for empty albums */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-700 group-hover:text-zinc-600 transition-colors">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeInUp}
            className="text-center text-zinc-500 mt-8 text-sm"
          >
            Photos coming soon — album covers and galleries being curated.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
