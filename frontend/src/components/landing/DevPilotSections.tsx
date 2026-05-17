'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DevPilotSections() {
  const features = [
    {
      title: 'AI Resume Analyzer',
      desc: 'Instant ATS scoring, keyword optimization, and recruiter-focused suggestions.',
      image: '/images/resume_ai.png',
      glow: 'rgba(34, 211, 238, 0.4)', // cyan
    },
    {
      title: 'GitHub Intelligence',
      desc: 'Analyze repositories, contribution activity, and developer strengths.',
      image: '/images/github_ai.png',
      glow: 'rgba(167, 139, 250, 0.4)', // violet
    },
    {
      title: 'AI Mock Interviews',
      desc: 'Practice real interview questions with AI-generated feedback.',
      image: '/images/mock_interview_ai.png',
      glow: 'rgba(52, 211, 153, 0.4)', // emerald
    },
    {
      title: 'Career Roadmaps',
      desc: 'Generate personalized developer roadmaps based on your goals.',
      image: '/images/roadmap_ai.png',
      glow: 'rgba(251, 146, 60, 0.4)', // orange
    },
  ];

  const stats = [
    { value: '12K+', label: 'Resumes Analyzed' },
    { value: '3.4K+', label: 'Developers Onboarded' },
    { value: '91%', label: 'ATS Optimization Rate' },
    { value: '24/7', label: 'AI Career Assistance' },
  ];

  return (
    <div className="bg-[#050816] text-white overflow-hidden font-sans selection:bg-violet-500/30">
      {/* Dashboard Preview Section */}
      <section className="relative py-28 px-6 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-violet-400 font-bold tracking-widest uppercase mb-4 text-sm">
              AI Powered Developer Intelligence
            </p>

            <h2 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
              Your Complete
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                Developer Dashboard
              </span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl font-medium">
              DevPilot AI helps developers optimize resumes, analyze GitHub profiles,
              prepare for interviews, and discover career growth opportunities with state-of-the-art realistic AI intelligence.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300">
                Launch Dashboard
              </button>

              <button className="px-8 py-4 rounded-2xl border border-white/20 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all duration-300 font-bold">
                View Demo
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-16 pt-10 border-t border-white/10">
              {stats.slice(0, 2).map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Fake Dashboard UI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-violet-600/30 rounded-full blur-[80px]" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-600/30 rounded-full blur-[80px]" />

            <div className="relative bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-white">Developer Analytics</h3>
                  <p className="text-gray-400 text-sm font-medium mt-1">AI Career Insights</p>
                </div>

                <div className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  ATS Score 91%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-black/40 rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">GitHub Activity</p>
                  <h4 className="text-4xl font-black text-white">1.2K</h4>
                  <span className="text-emerald-400 text-xs font-bold mt-2 block">+32% Growth</span>
                </div>

                <div className="bg-black/40 rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Interview Readiness</p>
                  <h4 className="text-4xl font-black text-white">87%</h4>
                  <span className="text-cyan-400 text-xs font-bold mt-2 block">AI Evaluated</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-3xl p-6 border border-white/10 mb-8 relative overflow-hidden group/suggestion hover:border-white/20 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 translate-x-[-100%] group-hover/suggestion:translate-x-0 transition-transform duration-700 ease-out" />
                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">AI Suggestion</p>
                    </div>
                    <h4 className="text-xl font-bold leading-relaxed text-white">
                      Add backend deployment projects to improve recruiter visibility.
                    </h4>
                  </div>

                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(34,211,238,0.2)] flex-shrink-0 relative group-hover/suggestion:scale-105 transition-transform duration-500">
                    <Image src="/images/bot_avatar.png" alt="AI Avatar" fill className="object-cover" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full bg-gray-800 border-2 border-[#050816] flex items-center justify-center text-xs font-bold z-[${10-i}]`}>
                      U{i}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#050816] flex items-center justify-center text-xs font-bold z-0">
                    +
                  </div>
                </div>
                <button className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-2">
                  View All Metrics &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Realistic Features Grid */}
        <div className="max-w-7xl mx-auto pt-20 border-t border-white/5">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Premium AI Capabilities</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">Experience the future of career development with our hyper-realistic, AI-driven modules designed specifically for developers.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
                
                {/* Glow behind image */}
                <div 
                  className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ backgroundColor: feature.glow }}
                />

                <div className="w-32 h-32 relative mb-8 group-hover:scale-110 transition-transform duration-700 ease-out filter drop-shadow-2xl">
                  <Image src={feature.image} alt={feature.title} fill className="object-contain" />
                </div>

                <h3 className="text-xl font-black text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  {feature.desc}
                </p>
                
                <div className="mt-8 pt-6 border-t border-white/5 w-full">
                  <button className="text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors flex items-center justify-center gap-2 w-full">
                    Explore Module
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
