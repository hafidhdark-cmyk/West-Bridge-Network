'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { Mail, MapPin, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

const ADVERTISE_WHATSAPP_LINK = "https://wa.me/2348140097546?text=Hello%20West%20Bridge%20News,%20I%20would%20like%20to%20inquire%20about%20advertising%20on%20WBN.";

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;

    setIsSubmitted(true);

    // Open default mail client prepopulated with user message
    const mailtoUrl = `mailto:westbridgenetwork@gmail.com?subject=${encodeURIComponent(
      subject || 'News Bureau Inquiry'
    )}&body=${encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 800);

    setTimeout(() => {
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitted(false);
    }, 5000);
  };

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
              href="mailto:westbridgenetwork@gmail.com"
              className="text-xs font-extrabold text-wbn-blue hover:underline block pt-1"
            >
              westbridgenetwork@gmail.com
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
              West Bridge News Bureau,<br />
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

          {isSubmitted && (
            <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center gap-3 shadow-md animate-fade-in">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-100">Opening your email app to send directly to westbridgenetwork@gmail.com.</p>
              </div>
            </div>
          )}

          <form className="space-y-4 max-w-2xl" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-wbn-navy uppercase">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Okonkwo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-wbn-navy uppercase">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. samuel@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-wbn-navy focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-wbn-navy uppercase">Your Message</label>
              <textarea
                rows={5}
                placeholder="Write your inquiry or news tip details here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
