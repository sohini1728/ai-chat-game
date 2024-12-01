"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function LandingPage() {
  const words = [
    {
      text: "Welcome to SIMUCHAT",
      className: "text-white font-black text-center",
    },
  ];

  const features = [
    { title: "AI Companions", description: "Form meaningful connections" },
    { title: "Dynamic Stories", description: "Every chat is unique" },
    { title: "Multiple Modes", description: "From friendly to thrilling" },
  ];

  return (
    <div className="min-h-screen text-white selection:bg-purple-500/30 selection:text-purple-200">
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center space-y-12 px-4 max-w-4xl mx-auto">
          <TypewriterEffectSmooth
            words={words}
            className="text-5xl md:text-7xl !mb-8 flex items-center justify-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-purple-200/90 text-xl md:text-2xl font-light leading-relaxed"
          >
            Experience the next generation of AI storytelling. Immerse yourself
            in dynamic conversations, thrilling adventures, and meaningful
            connections.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            <Link href="/modes">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
                Start Your Adventure
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="backdrop-blur-sm bg-purple-900/20 border-2 border-purple-500/30 rounded-xl p-8 hover:bg-purple-800/20 transition-all duration-300 hover:border-purple-500/50 shadow-lg shadow-purple-500/5"
              >
                <h3 className="text-2xl font-semibold text-purple-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-purple-200/90 text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[15%] w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[15%] w-40 h-40 bg-purple-700/10 rounded-full blur-xl"
        />
      </div>
    </div>
  );
}
