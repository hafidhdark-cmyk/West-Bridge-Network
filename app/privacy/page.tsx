import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | West Bridge News',
  description:
    'West Bridge News (WBN) Privacy Policy explaining reader data protection, cookies usage, Google AdSense compliance, and reader rights.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page Header */}
        <div className="bg-wbn-navy text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
          <span className="text-xs text-wbn-cobalt uppercase font-extrabold tracking-widest flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Data Protection &amp; Legal Compliance</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-editorial-heading leading-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Last Updated: August 2026. West Bridge News (WBN) is dedicated to protecting reader privacy, transparency, and data security.
          </p>
        </div>

        {/* Policy Body Content */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Overview */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-xl font-extrabold text-wbn-navy font-editorial-heading flex items-center gap-2">
              <Shield className="w-5 h-5 text-wbn-blue" />
              1. Information We Collect
            </h2>
            <p>
              West Bridge News (&quot;WBN&quot;, &quot;we&quot;, &quot;our&quot;) operates <strong>https://westbridgenews.com</strong>. We collect zero personal data from casual readers unless voluntarily provided through newsroom inquiries, comment submissions, or email subscriptions.
            </p>
            <p>
              Automated analytical log data collected when accessing our site includes your device Internet Protocol (IP) address, browser type, operating system version, referring pages, time spent per article, and standard web request telemetry.
            </p>
          </section>

          {/* Section 2: Cookies & Google AdSense */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-xl font-extrabold text-wbn-navy font-editorial-heading flex items-center gap-2">
              <Eye className="w-5 h-5 text-wbn-blue" />
              2. Cookies &amp; Advertising Partners (Google AdSense)
            </h2>
            <p>
              We partner with third-party advertising vendors, including <strong>Google AdSense</strong>, to serve relevant advertisements to our readers.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to West Bridge News or other websites across the Internet.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting Google&apos;s <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-wbn-blue underline">Ads Settings</a> or by opting out at <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-wbn-blue underline">www.aboutads.info</a>.
              </li>
            </ul>
          </section>

          {/* Section 3: Data Usage */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-xl font-extrabold text-wbn-navy font-editorial-heading flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-wbn-blue" />
              3. How We Use Information
            </h2>
            <p>
              Data collected is strictly used to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Optimize website load speeds, CDN routing, and mobile responsiveness.</li>
              <li>Analyze reader engagement across news categories to refine investigative reporting.</li>
              <li>Detect and prevent security threats, bot attacks, and illegal traffic manipulation.</li>
              <li>Respond to reader inquiries, press releases, and editorial feedback.</li>
            </ul>
          </section>

          {/* Section 4: Contact Information */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-wbn-navy font-editorial-heading">
              4. Data Privacy Inquiries
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy or your data rights, please contact our Editorial Bureau at:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-wbn-navy text-xs">
              West Bridge News Privacy Desk<br />
              Email: <a href="mailto:westbridgenetwork@gmail.com" className="text-wbn-blue underline">westbridgenetwork@gmail.com</a><br />
              Website: <a href="https://westbridgenews.com" className="text-wbn-blue underline">https://westbridgenews.com</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
