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
        <section className="py-16 px-4 bg-gradient-to-br from-[#5C4138] to-[#8D5D28] text-white md:min-h-90">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                <p className="hero-sub text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Learn more about our mission to deliver health care wellness to every family and community through direct selling.
                </p>
                <div className="hero-badges flex flex-wrap justify-center gap-4 text-sm">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <span className="font-bold">Wellness</span>
                        <span className="ml-2 text-white/80">Mission</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <span className="font-bold">Direct Selling</span>
                        <span className="ml-2 text-white/80">Method</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
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
                    <div className="vision-card bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <h3 className="text-lg md:text-xl font-bold text-[#5C4138] mb-3">
                            VISION
                        </h3>
                        <blockquote className="text-sm sm:text-base text-gray-600 italic leading-relaxed">
                            TO BE THE NEXT BIG THING ON WELLNESS AND HEALTH CARE DIRECT SELLING COMPANY
                        </blockquote>
                    </div>

                    {/* MISSION */}
                    <div className="mission-card bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <h3 className="text-lg md:text-xl font-bold text-[#5C4138] mb-3">
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
        <section className="py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="section-heading text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
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
                <h2 className="section-heading text-xs font-bold text-[#5C4138] mb-10 tracking-[0.2em] uppercase">
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

        {/* ── CTA ── */}
        <section className="cta-section py-20 md:py-24 px-4 sm:px-6 bg-[var(--primary)/20]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#191c1b] mb-4">
              Ready to Transform Wellness?
            </h2>

            <p className="text-[#3f4941] text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Join our mission to deliver health and wellness to every family.
            </p>

            <button
              onClick={() => router.push("/home/signup")}
              className="bg-[--primary] px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all duration-300"
            >
              Become a Member
            </button>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-zinc-100 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-6">
            <div className="text-center md:text-left">
              <div className="text-lg font-serif text-primary mb-1">
                World Council Executive Alliances
              </div>
              <p className="text-zinc-600">
                © World Council Executive Alliances. Built for the community.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {["Privacy Policy", "Terms of Service", "Contact Us"].map((link) => (
                <a
                  key={link}
                  href={link === "Privacy Policy" ? "/privacy-policy.html" : link === "Terms of Service" ? "/terms-of-service.html" : "#"}
                  className="text-zinc-600 hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-zinc-200 mt-6 pt-4 text-center text-xs text-zinc-500">
            Website designed & developed by{" "}
            <a href="https://www.facebook.com/profile.php?id=100063680607062" target="_blank" className="font-semibold text-primary underline">
              Bok Tech
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}