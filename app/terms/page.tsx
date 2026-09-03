import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Disclaimer | West Bridge News',
  description:
    'West Bridge News (WBN) Terms of Service, copyright notices, content licensing, and publishing disclaimers.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page Header */}
        <div className="bg-wbn-navy text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
          <span className="text-xs text-wbn-cobalt uppercase font-extrabold tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Legal Agreement &amp; Content Licensing</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-editorial-heading leading-tight">
            Terms of Service &amp; Disclaimer
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            By accessing or using West Bridge News (westbridgenews.com), you agree to be bound by the following terms, conditions, and publishing disclaimers.
          </p>
        </div>

        {/* Policy Body Content */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Intellectual Property & Copyright */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-xl font-extrabold text-wbn-navy font-editorial-heading flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-wbn-blue" />
              1. Intellectual Property &amp; Copyright
            </h2>
            <p>
              All original investigative reporting, text, articles, headlines, graphics, photos, and branding published on <strong>West Bridge News (WBN)</strong> are protected by international copyright laws and trade governance.
            </p>
            <p>
              No portion of WBN content may be reproduced, redistributed, scraped, or republished on third-party portals without explicit written authorization or clear hyperlinked attribution to <strong>https://westbridgenews.com</strong>.
            </p>
          </section>

          {/* Section 2: Reader Conduct & Comments Policy */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-xl font-extrabold text-wbn-navy font-editorial-heading flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-wbn-blue" />
              2. Reader Conduct &amp; Discussion Guidelines
            </h2>
            <p>
              WBN welcomes constructive civic discourse in article comment sections. However, readers agree not to post:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Hate speech, defamatory remarks, harassment, or threats against individuals or groups.</li>
              <li>Unauthorized commercial promotions, spam links, or malicious code.</li>
              <li>Unverified rumors or false impersonation of public officials.</li>
            </ul>
            <p className="text-xs text-slate-500 italic">
              WBN editorial moderators reserve the absolute right to remove non-compliant comments.
            </p>
          </section>

          {/* Section 3: Editorial Disclaimer & Corrections */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-xl font-extrabold text-wbn-navy font-editorial-heading flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-wbn-blue" />
              3. Editorial Disclaimer &amp; Corrections Policy
            </h2>
            <p>
              While WBN enforces strict fact-checking protocols, articles are provided for informational and journalistic purposes. WBN assumes no legal liability for independent commercial or personal decisions made by readers based on published articles.
            </p>
            <p>
              If a factual error occurs, our newsroom is committed to issuing immediate public corrections in accordance with our transparent editorial policy.
            </p>
          </section>

          {/* Section 4: Governing Law */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-wbn-navy font-editorial-heading">
              4. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with international digital publishing laws and sub-regional media regulatory frameworks.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-wbn-navy text-xs">
              West Bridge News Legal Desk<br />
              Email: <a href="mailto:westbridgenetwork@gmail.com" className="text-wbn-blue underline">westbridgenetwork@gmail.com</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
