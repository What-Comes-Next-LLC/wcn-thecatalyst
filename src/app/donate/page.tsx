'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/SectionWrapper";

const DonationButton = ({ amount, link, label }: { amount: string; link: string; label?: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Link href={link}>
      <button className="w-full relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-wcn-accent1 to-wcn-accent2 rounded-xl opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative bg-black/40 backdrop-blur-lg border-2 border-wcn-accent1/20 hover:border-wcn-accent1/40 px-6 py-4 rounded-xl transition-all duration-300">
          <span className="text-2xl font-bold bg-gradient-to-r from-wcn-accent2 to-wcn-text bg-clip-text text-transparent">${amount}</span>
          {label && <p className="text-sm mt-1 text-wcn-text/80">{label}</p>}
        </div>
      </button>
    </Link>
  </motion.div>
);

export default function DonatePage() {
  return (
    <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-accent1 to-wcn-dark" textColor="text-wcn-text">
      {/* Watermark Logo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="absolute inset-0 w-full h-full rotate-12 scale-150">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            fill
            className="object-contain opacity-[0.05] mix-blend-soft-light"
            priority
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 z-10">
        {/* Header Section */}
        <motion.div
          className="text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src="/images/logo.png"
              alt="Company Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          {/* Main Heading */}
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/">
              <span className="bg-gradient-to-r from-wcn-accent2 via-wcn-text to-wcn-accent2 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                Invest in The Future of Fitness
              </span>
            </Link>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-wcn-text/90 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join our pre-seed funding round to build an AI platform that empowers real trainers, preserves human connection, and transforms how people build lasting fitness habits.
          </motion.p>
        </motion.div>

        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Product & Company Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-wcn-accent2 to-wcn-text bg-clip-text text-transparent">
                The Catalyst Platform
              </h2>
              <p className="text-wcn-text/90">
                We're building an AI-enhanced coaching platform that solves the fitness industry's biggest challenge: sustainable behavior change. Our behavior-first approach helps trainers create personalized "Day in the Life" plans that drive long-term client success.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-wcn-accent1/10">
                  <div className="text-2xl font-bold text-wcn-accent2">3x</div>
                  <div className="text-sm text-wcn-text/80">Better client retention</div>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-wcn-accent1/10">
                  <div className="text-2xl font-bold text-wcn-accent2">100%</div>
                  <div className="text-sm text-wcn-text/80">Privacy-first design</div>
                </div>
              </div>
              
              <p className="text-wcn-accent2/80">
                Detroit-based, minority-owned startup built by someone who lived the transformation journey. We're not just building software—we're rebuilding an industry.
              </p>
            </div>
          </motion.div>

          {/* Center Column: Featured Video */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link href="/">
              <div className="relative w-[406px] h-[720px] max-w-full mx-auto rounded-2xl overflow-hidden border-2 border-wcn-accent1/20 cursor-pointer hover:border-wcn-accent1/40 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <video 
                  src="/videos/newpromo.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>
          </motion.div>

          {/* Right Column: Investment Levels */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-wcn-accent1/20">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-wcn-accent2 to-wcn-text bg-clip-text text-transparent">
                Investment Levels
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <DonationButton amount="10" link="https://donate.stripe.com/dRm7sN8MS3c75JL6Y5cwg01" label="First Step" />
                <DonationButton amount="50" link="https://donate.stripe.com/dRmcN73sy7snc8996dcwg02" label="Building Momentum" />
                <DonationButton amount="100" link="https://donate.stripe.com/7sY28t4wCcMHgopfuBcwg03" label="Breakthrough" />
                <DonationButton amount="250" link="https://donate.stripe.com/aFadRb0gmcMH4FH3LTcwg04" label="Catalyst Fuel" />
                <DonationButton amount="Custom" link="https://donate.stripe.com/14A7sN3sy7sndcd3LTcwg00" label="Name Your Amount" />
              </div>
            </div>

            {/* Trust & Founder Info */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-3 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-wcn-accent1/10">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  alt="Secure payment via Stripe"
                  width={50}
                  height={20}
                  className="opacity-70"
                />
                <span className="text-sm text-wcn-text/60">Secure investment via Stripe</span>
              </div>
              
              <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-wcn-accent1/10">
                <p className="text-sm text-wcn-text/80 mb-1">
                  <strong>Founder:</strong> Jason Rashaad
                </p>
                <p className="text-xs text-wcn-text/60">
                  NASM-CPT | Detroit, MI | Built in Recovery
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}