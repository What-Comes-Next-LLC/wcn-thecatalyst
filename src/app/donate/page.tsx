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
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 rounded-xl opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative bg-black/40 backdrop-blur-lg border-2 border-amber-500/20 hover:border-amber-500/40 px-6 py-4 rounded-xl transition-all duration-300">
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">${amount}</span>
          {label && <p className="text-sm mt-1 text-amber-100/80">{label}</p>}
        </div>
      </button>
    </Link>
  </motion.div>
);

export default function DonatePage() {
  return (
    <SectionWrapper bgColor="bg-gradient-to-b from-amber-950 via-rose-950 to-black" textColor="text-amber-50">
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Content Section - Takes up 3 columns */}
          <motion.div
            className="lg:col-span-3 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="relative w-32 h-32 mx-auto lg:mx-0">
              <Image
                src="/images/logo.png"
                alt="Company Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            {/* Heading and Description */}
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                  Help Build The Catalyst
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl text-amber-200/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                An AI platform that empowers real trainers—not replaces them.
              </motion.p>
              <motion.p 
                className="text-amber-400/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                What Comes Next? is a Detroit-based, minority-owned startup built in recovery and powered by tech for good.
              </motion.p>
            </div>

            {/* Video Section */}
            <motion.div 
              className="relative aspect-video rounded-2xl overflow-hidden border-2 border-amber-500/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <video 
                src="/videos/promo.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="object-cover w-full h-full"
              />
            </motion.div>
          </motion.div>

          {/* Donation Grid - Takes up 2 columns */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-amber-500/20">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
                Choose Your Impact
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <DonationButton amount="1" link="https://www.whatcomesnextllc.us/product/a-dollar/" label="Quick Support" />
                <DonationButton amount="10" link="https://www.whatcomesnextllc.us/product/pot-of-coffee/" label="Pot of Coffee" />
                <DonationButton amount="50" link="https://www.whatcomesnextllc.us/product/stack-the-set/" label="Stack the Set" />
                <DonationButton amount="100" link="https://www.whatcomesnextllc.us/product/lift-off/" label="Lift Off" />
                <DonationButton amount="250" link="https://www.whatcomesnextllc.us/product/rep-for-the-record/" label="Rep for Record" />
                <DonationButton amount="500" link="https://www.whatcomesnextllc.us/product/founder-fuel/" label="Founder Fuel" />
              </div>
            </div>

            {/* Trust Indicators */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex items-center justify-center lg:justify-start space-x-3 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-amber-500/10">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  alt="Secure payment via Stripe"
                  width={50}
                  height={20}
                  className="opacity-70"
                />
                <span className="text-sm text-amber-200/60">Secure checkout via WooCommerce</span>
              </div>
              <p className="text-center lg:text-left text-sm text-amber-200/60">
                Founder: Jason Rashaad | Detroit, MI
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}