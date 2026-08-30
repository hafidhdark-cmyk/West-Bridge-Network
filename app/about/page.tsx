import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Award, Globe, Users, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | West Bridge News',
  description:
    'Learn about West Bridge News (WBN), our mission, editorial principles, investigative integrity, and news bureau operations across West Africa and global markets.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page Header */}
        <div className="bg-wbn-navy text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
          <span className="text-xs text-wbn-cobalt uppercase font-extrabold tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Digital News Organization</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-editorial-heading leading-tight">
            About West Bridge News
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            West Bridge News (WBN) is an independent premier digital news platform committed to speed, investigative accuracy, and non-partisan journalism across West Africa and international markets.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-wbn-blue">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-wbn-navy font-editorial-heading">Our Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To deliver real-time, fact-checked, and comprehensive news reporting that empowers readers, promotes civic transparency, and provides deep analytical insight into regional governance, commerce, security, and technology.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-wbn-navy font-editorial-heading">Editorial Standards</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We uphold unyielding editorial independence. Our newsroom strictly separates reporting from commercial partnerships, adhering to strict multi-source verification protocols prior to publishing any report.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-wbn-navy font-editorial-heading border-b border-slate-100 pb-4">
            Our Newsroom Pillars
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-wbn-navy text-base">
                <ShieldCheck className="w-5 h-5 text-wbn-blue" />
                <span>Verification</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every story undergoes rigorous fact-checking and editorial review before broadcast or publication.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-wbn-navy text-base">
                <Users className="w-5 h-5 text-wbn-blue" />
                <span>Independence</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Free from political alignment or corporate bias, our loyalty remains solely to the truth and our readers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-wbn-navy text-base">
                <Globe className="w-5 h-5 text-wbn-blue" />
                <span>Regional Impact</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deep on-the-ground coverage across Nigeria, ECOWAS sub-regions, and global economic hubs.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
