'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CATEGORIES } from '@/components/Header';
import { ShieldCheck, FileText, HelpCircle, Info, Scale } from 'lucide-react';

const OFFICIAL_WHATSAPP_LINK = "https://chat.whatsapp.com/FSqZA2tOXbv0luyOPa7iKD?s=cl&p=a&ilr=4";
const ADVERTISE_WHATSAPP_LINK = "https://wa.me/2348140097546?text=Hello%20West%20Bridge%20Network,%20I%20would%20like%20to%20inquire%20about%20advertising%20on%20WBN.";

interface FooterProps {
  onSelectCategory?: (category: string) => void;
}

export default function Footer({ onSelectCategory }: FooterProps) {
  return (
    <footer className="bg-wbn-navy text-slate-300 text-xs py-12 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image src="/logo.png" alt="WBN Logo" fill className="object-contain" />
            </div>
            <span className="font-black text-white text-lg font-editorial-heading">west bridge network</span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed">
            West Bridge Network (WBN) is a premier digital news platform committed to speed, accuracy, and investigative integrity across West Africa and global markets.
          </p>
        </div>

        {/* Active Editorial Hub Links */}
        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider">Editorial Hubs</h4>
          <ul className="space-y-2">
            {CATEGORIES.slice(1, 7).map((c) => (
              <li key={c.name}>
                {onSelectCategory ? (
                  <button
                    onClick={() => onSelectCategory(c.name)}
                    className="hover:text-white transition-colors text-slate-400 hover:underline"
                  >
                    {c.name} Coverage
                  </button>
                ) : (
                  <Link href={`/?category=${c.name}`} className="hover:text-white transition-colors text-slate-400 hover:underline">
                    {c.name} Coverage
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Standalone Legal & Bureau Desk Links */}
        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider">Company &amp; Legal Desk</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors hover:underline flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5 text-wbn-blue" />
                <span>About Us</span>
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors hover:underline flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-wbn-blue" />
                <span>Contact News Bureau</span>
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors hover:underline flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-wbn-blue" />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors hover:underline flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-wbn-blue" />
                <span>Terms of Service &amp; Disclaimer</span>
              </Link>
            </li>
            <li>
              <a
                href={ADVERTISE_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors hover:underline flex items-center gap-1.5 text-emerald-400 font-bold pt-1"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>Advertise With Us</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Active WhatsApp Group Link */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider">WhatsApp Group Chat</h4>
          <p className="text-slate-400">Get breaking headlines directly delivered to your phone.</p>
          <a
            href={OFFICIAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow w-full text-center"
          >
            <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
            <span>Join our WhatsApp group chat</span>
          </a>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 text-slate-500 text-center sm:text-left flex flex-wrap justify-between items-center gap-4">
        <div>© 2026 West Bridge Network (WBN). All rights reserved.</div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/about" className="hover:text-slate-300">About</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-slate-300">Contact</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-300">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
