'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

const ADVERTISE_WHATSAPP_LINK = "https://wa.me/2348140097546?text=Hello%20West%20Bridge%20Network,%20I%20would%20like%20to%20inquire%20about%20advertising%20on%20WBN.";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page Header */}
        <div className="bg-wbn-navy text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
          <span className="text-xs text-wbn-cobalt uppercase font-extrabold tracking-widest flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Editorial &amp; Corporate Desk</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-editorial-heading leading-tight">
            Contact News Bureau
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Have a news tip, correction request, press release, or advertising inquiry? Reach out directly to our editorial bureau team.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-wbn-blue">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-wbn-navy text-base">News Bureau Email</h3>
            <p className="text-xs text-slate-500">For news tips, press releases, and editorial feedback:</p>
            <a
              href="mailto:contact@westbridgenews.com"
              className="text-xs font-extrabold text-wbn-blue hover:underline block pt-1"
            >
              contact@westbridgenews.com
            </a>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <WhatsAppIcon className="w-5 h-5 text-emerald-600 fill-current" />
            </div>
            <h3 className="font-bold text-wbn-navy text-base">Advertising &amp; Partnerships</h3>
            <p className="text-xs text-slate-500">Connect with our corporate media team on WhatsApp:</p>
            <a
              href={ADVERTISE_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-extrabold text-emerald-600 hover:underline block pt-1"
            >
              +234 814 009 7546
            </a>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-wbn-navy">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-wbn-navy text-base">Regional Headquarters</h3>
            <p className="text-xs text-slate-500">
              West Bridge Network News Bureau,<br />
              Abuja &amp; Lagos Editorial Desks,<br />
              Nigeria.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-wbn-navy font-editorial-heading border-b border-slate-100 pb-4">
            Send a Direct Message
          </h2>

          <form className="space-y-4 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-wbn-navy uppercase">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Okonkwo"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-wbn-navy uppercase">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. samuel@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-wbn-navy uppercase">Subject</label>
              <input
                type="text"
                placeholder="News Tip / Editorial Correction / Advertising Inquiry"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-wbn-navy uppercase">Your Message</label>
              <textarea
                rows={5}
                placeholder="Write your inquiry or news tip details here..."
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-wbn-navy hover:bg-wbn-blue text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all inline-flex items-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
