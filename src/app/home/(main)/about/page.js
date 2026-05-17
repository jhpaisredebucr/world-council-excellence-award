"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import AdsSidebar from "@/app/components/ui/AdsSidebar";

export default function About() {
  const router = useRouter();

  return (
    <div className="bg-[#fafaf8] text-foreground font-sans selection:bg-[--success-color] selection:text-background mt-16">
<main className="relative min-h-screen">

        <style>{`
            @keyframes fadeUp {
                from { opacity: 0; transform: translateY(28px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to   { opacity: 1; }
            }
            .hero-title {
                opacity: 0;
                animation: fadeUp 0.7s ease forwards;
                animation-delay: 0.1s;
            }
            .hero-sub {
                opacity: 0;
                animation: fadeUp 0.7s ease forwards;
                animation-delay: 0.25s;
            }
            .hero-badges {
                opacity: 0;
                animation: fadeUp 0.7s ease forwards;
                animation-delay: 0.4s;
            }
            .section-heading {
                opacity: 0;
                animation: fadeUp 0.6s ease forwards;
                animation-delay: 0.3s;
            }
            .section-sub {
                opacity: 0;
                animation: fadeUp 0.6s ease forwards;
                animation-delay: 0.45s;
            }
            .vision-card {
                opacity: 0;
                animation: fadeUp 0.6s ease forwards;
            }
            .mission-card {
                opacity: 0;
                animation: fadeUp 0.6s ease forwards;
                animation-delay: 0.15s;
            }
            .story-item {
                opacity: 0;
                animation: fadeUp 0.6s ease forwards;
            }
            .partner-logo {
                opacity: 0;
                animation: fadeIn 0.6s ease forwards;
            }
            .cta-section {
                opacity: 0;
                animation: fadeUp 0.7s ease forwards;
                animation-delay: 0.2s;
            }
        `}</style>

{/* ── HERO ── */}
        <section className="py-20 px-4 bg-wcea-animated text-white md:min-h-90 relative overflow-hidden">
          {/* Animated gradient particles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#c49a6c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }} />
          </div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
                  <span>Who We Are</span>
                </div>
                <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                <p className="hero-sub text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Learn more about our mission to deliver health care wellness to every family and community through direct selling.
                </p>
                <div className="hero-badges flex flex-wrap justify-center gap-4 text-sm">
                    <div className="glass-wcea px-4 py-2 rounded-lg">
                        <span className="font-bold">Wellness</span>
                        <span className="ml-2 text-white/80">Mission</span>
                    </div>
                    <div className="glass-wcea px-4 py-2 rounded-lg">
                        <span className="font-bold">Direct Selling</span>
                        <span className="ml-2 text-white/80">Method</span>
                    </div>
                    <div className="glass-wcea px-4 py-2 rounded-lg">
                        <span className="font-bold">Global</span>
                        <span className="ml-2 text-white/80">Reach</span>
                    </div>
                </div>
            </div>
        </section>

{/* ── MISSION & VISION ── */}
        <section className="py-16 md:py-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                    {/* VISION */}
                    <div className="vision-card bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#8D5D28] card-wcea">
                        <h3 className="text-lg md:text-xl font-bold text-wcea-gradient mb-3">
                            VISION
                        </h3>
                        <blockquote className="text-sm sm:text-base text-gray-600 italic leading-relaxed">
                            TO BE THE NEXT BIG THING ON WELLNESS AND HEALTH CARE DIRECT SELLING COMPANY
                        </blockquote>
                    </div>

                    {/* MISSION */}
                    <div className="mission-card bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#5C4138]">
                        <h3 className="text-lg md:text-xl font-bold text-wcea-gradient mb-3">
                            MISSION
                        </h3>
                        <blockquote className="text-sm sm:text-base text-gray-600 italic leading-relaxed">
                            DELIVER HEALTH CARE WELLNESS IN EVERY FAMILY AND COMMUNITY
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>

        {/* ── STORY ── */}
        <section className="py-16 px-4 bg-wcea-gradient-soft">
            <div className="max-w-3xl mx-auto">
                <h2 className="section-heading text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center wcea-heading-underline wcea-heading-underline-center">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                    <p className="story-item">
                        We are transforming the wellness industry by combining cutting-edge health products
                        with the power of direct selling. Our network empowers entrepreneurs to bring
                        life-changing wellness solutions directly to families and communities.
                    </p>
                    <p className="story-item" style={{ animationDelay: "0.15s" }}>
                        <span className="font-semibold text-gray-800">Global Reach:</span> Serving families worldwide through dedicated distributors.
                    </p>
                    <p className="story-item" style={{ animationDelay: "0.3s" }}>
                        <span className="font-semibold text-gray-800">Proven Products:</span> Science-backed wellness solutions for every need.
                    </p>
                </div>
            </div>
        </section>

        {/* ── PARTNERS ── */}
        <section className="py-16 md:py-20 px-4 sm:px-6 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <h2 className="section-heading text-xs font-bold text-[#5C4138] mb-10 tracking-[0.2em] uppercase wcea-heading-underline wcea-heading-underline-center">
                    Trusted Partners
                </h2>

                <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-20 grayscale opacity-90 hover:grayscale-0 transition-all duration-500">
                    <Image src="/images/logos/acsr.png" alt="ACSR" width={100} height={70} className="partner-logo" style={{ animationDelay: "0.1s" }} />
                    <Image src="/images/logos/memo-ni-dok.png" alt="Memo Ni Dok" width={100} height={70} className="partner-logo" style={{ animationDelay: "0.2s" }} />
                    <Image src="/images/logos/wcea.png" alt="WCEA" width={100} height={70} className="partner-logo" style={{ animationDelay: "0.3s" }} />
                    <Image src="/images/logos/whea.jpeg" alt="WHEA" width={100} height={70} className="partner-logo" style={{ animationDelay: "0.4s" }} />
                    <Image src="/images/logos/gaf-champ.png" alt="GAF Champ" width={100} height={70} className="partner-logo" style={{ animationDelay: "0.5s" }} />
                </div>
            </div>
        </section>

        {/* ── QUICK LINKS ── */}
        <section className="py-16 px-4 sm:px-6 bg-white">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="section-heading text-2xl md:text-3xl font-bold text-gray-800 mb-8 wcea-heading-underline wcea-heading-underline-center">Quick Links</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { href: "/home", label: "Home", icon: "🏠" },
                        { href: "/home/memberships", label: "Memberships", icon: "⭐" },
                        { href: "/home/contacts", label: "Contact Us", icon: "📧" },
                        { href: "/home/signup", label: "Register Now", icon: "📝" },
                        { href: "/home/signin", label: "Sign In", icon: "🔑" },
                        { href: "/privacy", label: "Privacy Policy", icon: "🔒" },
                        { href: "/terms", label: "Terms of Service", icon: "📋" },
                        { href: "/refund-policy", label: "Refund Policy", icon: "💰" },
                    ].map((link, i) => (
                        <button
                            key={i}
                            onClick={() => router.push(link.href)}
                            className="info-card flex flex-col items-center gap-2 p-5 bg-wcea-gradient-soft rounded-2xl border border-[#8D5D28]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                        >
                            <span className="text-2xl">{link.icon}</span>
                            <span className="text-sm font-semibold text-[#5C4138]">{link.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section py-20 md:py-24 px-4 sm:px-6 bg-wcea-animated relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Wellness?
            </h2>

            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Join our mission to deliver health and wellness to every family.
            </p>

            <button
              onClick={() => router.push("/home/signup")}
              className="btn-wcea-pulse px-8 py-4 rounded-xl font-bold text-lg"
            >
              Become a Member
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
