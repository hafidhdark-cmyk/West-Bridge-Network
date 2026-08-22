'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CATEGORIES } from '@/components/Header';
import { Lock, Mail, ShieldCheck, FileText, HelpCircle, X } from 'lucide-react';

const OFFICIAL_WHATSAPP_LINK = "https://chat.whatsapp.com/FSqZA2tOXbv0luyOPa7iKD?s=cl&p=a&ilr=4";

interface FooterProps {
  onSelectCategory?: (category: string) => void;
}

export default function Footer({ onSelectCategory }: FooterProps) {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
  };

  const closeModal = () => {
    setModalTitle(null);
    setModalContent(null);
  };

  return (
    <>
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

          {/* Active Legal & Bureau Contact Links */}
          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider">Legal & Bureau Desk</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => openModal(
                    'WBN Editorial Guidelines',
                    'West Bridge Network (WBN) adheres to the highest standards of investigative journalism, strict fact-checking, non-partisan independence, and immediate correction protocols.'
                  )}
                  className="hover:text-white transition-colors hover:underline text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-wbn-blue" />
                  <span>Editorial Guidelines</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal(
                    'Privacy Policy & Reader Data Protection',
                    'WBN respects your privacy. We collect zero personal data without explicit consent. Analytics and performance cookies are used strictly to optimize site delivery speed.'
                  )}
                  className="hover:text-white transition-colors hover:underline text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-wbn-blue" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <a
                  href="mailto:ads@westbridgenetwork.com?subject=Corporate%20Advertising%20Inquiry%20-%20WBN"
                  className="hover:text-white transition-colors hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-wbn-blue" />
                  <span>Advertise With Us</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@westbridgenetwork.com?subject=News%20Tip%20/%20Editorial%20Bureau"
                  className="hover:text-white transition-colors hover:underline flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-wbn-blue" />
                  <span>Contact News Bureau</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-slate-500">
          <div>© 2026 West Bridge Network (WBN). All rights reserved.</div>
          <Link
            href="/admin"
            className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 text-[11px]"
          >
            <Lock className="w-3 h-3" />
            <span>Publisher Admin Studio</span>
          </Link>
        </div>
      </footer>

      {/* Interactive Policy Modal Dialog */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 animate-fade-in text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-wbn-navy font-editorial-heading">{modalTitle}</h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{modalContent}</p>
            <div className="pt-2 text-right">
              <button onClick={closeModal} className="bg-wbn-navy text-white font-bold text-xs px-5 py-2 rounded-xl">
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
