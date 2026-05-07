"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import Image from "next/image";
import AdsSidebar from "@/app/components/ui/AdsSidebar";
export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#fafaf8] text-foreground font-sans selection:bg-[--success-color] selection:text-background">

<style>{`
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    .hero-headline {
        opacity: 0;
        animation: fadeUp 0.8s ease forwards;
        animation-delay: 0.1s;
    }
    .hero-sub {
        opacity: 0;
        animation: fadeUp 0.8s ease forwards;
        animation-delay: 0.3s;
    }
    .hero-ctas {
        opacity: 0;
        animation: fadeUp 0.8s ease forwards;
        animation-delay: 0.5s;
    }
    .section-heading {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
        animation-delay: 0.2s;
    }
    .partner-logo {
        opacity: 0;
        animation: fadeIn 0.6s ease forwards;
    }
    .feature-eyebrow {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
        animation-delay: 0.1s;
    }
    .feature-title {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
        animation-delay: 0.2s;
    }
    .feature-text {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
        animation-delay: 0.3s;
    }
    .feature-image {
        opacity: 0;
        animation: fadeIn 0.7s ease forwards;
        animation-delay: 0.2s;
    }
    .membership-header {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
        animation-delay: 0.2s;
    }
    .pricing-card {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
    }
`}</style>

<main className="relative min-h-screen mt-16">
        {/* ── HERO ── */}
        <section className="relative min-h-100 flex items-center overflow-hidden pb-10">

          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home-hero.png"
              alt="Community garden at sunrise"
              fill
              className="w-full h-full object-cover opacity-40"
              sizes="100vw"
              priority
            />

            {/* BLUE OVERLAY */}
            <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/0 to-transparent" />

            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(25,28,27,0.7) 0%, rgba(25,28,27,0.2) 100%)",
              }}
            />
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-15 md:py-20">
            <div className="max-w-2xl">
              <h1 className="hero-headline font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
                Cultivating{" "}
                <span className="text-[#dc8b70] italic">Community</span> and
                Wellness for All.
              </h1>

              <p className="hero-sub text-white/90 text-xl mb-10 leading-relaxed max-w-xl">
                Empowering local voices through collaborative initiatives,
                wellness programs, and the shared prestige of an editorial
                vision for our future.
              </p>

              <div className="hero-ctas flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/u/products')}
                  className="bg-[#5C4138] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#4a352d] active:scale-[0.98] transition-all duration-300"
                >
                  Explore Programs
                </button>

                <button
                  onClick={() => router.push('/home/signup')}
                  className="bg-white text-[#5C4138] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#f4f4f0] active:scale-[0.98] transition-all duration-300 border-1 border-[#5C4138]"
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full leading-none z-20">
            <svg
              className="block w-full h-30"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="#ffffff"
                d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,234.7C1120,245,1280,235,1360,229.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              />
            </svg>
          </div>

        </section>

        {/* ── PARTNERS ── */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
              <h2 className="section-heading font-sans text-sm font-bold text-[#5C4138] mb-12 tracking-[0.2em] uppercase">
              Our Partners
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 md:grayscale opacity-90 hover:grayscale-0 transition-all duration-500">
              <Image
                src="/images/logos/acsr.png"
                alt="Partner 1"
                width={120}
                height={80}
                className="partner-logo h-auto w-auto"
                style={{ animationDelay: "0.1s" }}
                priority
              />
              <Image
                src="/images/logos/memo-ni-dok.png"
                alt="Partner 2"
                width={120}
                height={80}
                className="partner-logo h-auto w-auto"
                style={{ animationDelay: "0.2s" }}
                priority
              />
              <Image
                src="/images/logos/wcea.png"
                alt="Partner 3"
                width={120}
                height={80}
                className="partner-logo h-auto w-auto"
                style={{ animationDelay: "0.3s" }}
                priority
              />
              <Image
                src="/images/logos/whea.jpeg"
                alt="Partner 3"
                width={120}
                height={80}
                className="partner-logo h-auto w-auto"
                style={{ animationDelay: "0.4s" }}
                priority
              />
              <Image
                src="/images/logos/gaf-champ.png"
                alt="Partner 3"
                width={120}
                height={80}
                className="partner-logo h-auto w-auto"
                style={{ animationDelay: "0.5s" }}
                priority
              />
            </div>
          </div>
        </section>

        {/* ── FEATURE HIGHLIGHT ── */}
        <section className="bg-[#f4f4f0] py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            {/* Image column */}
            <div className="feature-image w-full md:w-1/2 relative aspect-4/5 overflow-hidden rounded-xl">
              <div className="aspect-square bg-(--primary)/20 absolute -top-10 -left-10 w-full h-full rounded-full blur-3xl" />
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT0rBpcN2a-tjV4mS3gYH8zVVm-Dp7foNAQFbCkdbCUWkp6lOf7JD118QcKjcty8fkI-Q3kIYg3pFNz_10kUjoCtSd74bNKa1SsnqmoURH-JS0LItmX9xPPcfPbMPyZ0iVkyCP1dNpbxaIcS0p-7wUtjMJkhK1Ya-zFquYBq62K8zjaRkFHN4BwXIEaqZ3lvmCZ_zO4HFU51RIiEzhaAbFAkelnlZYmDfXhd68inCbLEaWglf1kGiycVRCjkWCTFq9RpkExSwS6Mkw"
                alt="Diverse hands stacked together"
                fill
                className="relative z-10 object-cover rounded-xl shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Text column */}
            <div className="w-full  md:w-1/2">
              <span className="feature-eyebrow text-[#5C4138] font-bold tracking-widest uppercase text-xs mb-4 block">
                Civic Vision
              </span>
              <h2 className="feature-title font-serif text-4xl md:text-5xl font-bold text-[#191c1b] leading-tight mb-8">
                A New Standard for{" "}
                <span className="text-[#5C4138] italic">Shared Growth</span>
              </h2>
              <div className="space-y-6 text-[#3f4941] text-lg">
                <p className="feature-text">
                  We believe that wellness is not just an individual journey,
                  but a community-wide endeavor. By merging editorial prestige
                  with local action, we create a sanctuary for ideas and health.
                </p>
                <div className="flex items-start gap-4">

                  <p className="feature-text">
                    <span className="font-bold text-[#191c1b]">
                      Sustainable Impact:
                    </span>{" "}
                    Long-term goals rooted in community resilience.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  {/* Groups icon (SVG inline) */}
                  <svg
                    className="text-(--primary) mt-1 shrink-0 w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zM3 7a4 4 0 118 0"
                    />
                  </svg>
                  <p className="feature-text">
                    <span className="font-bold text-[#191c1b]">
                      Inclusive Access:
                    </span>{" "}
                    Programs designed for every member of our diverse fabric.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MEMBERSHIP ── */}
        <section className="bg-[#fafaf8] py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="membership-header text-center mb-20">
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#191c1b] mb-6">
                Join Our Growing Community
              </h2>
              <p className="text-[#3f4941] text-lg max-w-2xl mx-auto">
                Choose a tier that best fits your commitment to community
                wellness and sustainable living.
              </p>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* ── Basic ── */}
              <div className="pricing-card bg-white p-8 rounded-2xl flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" style={{ animationDelay: "0.3s" }}>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#191c1b] mb-2">
                    Basic
                  </h3>
                  <p className="text-sm text-[#3f4941] mb-2">3 levels deep network</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-primary">
                      ₱99
                    </span>
                    <span className="text-[#3f4941] text-sm">/lifetime</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 grow">
                  {["3 levels deep network", "Benefits", "Benefits", "Benefits"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center gap-3 text-[#3f4941]">
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
                <button
                  onClick={() => router.push('/home/memberships')}
                  className="w-full py-4 rounded-xl font-bold border-2 border-[#5C4138] text-[#5C4138] hover:bg-[#5C4138] hover:text-white transition-all duration-300 active:scale-[0.98]">
                  Get Started
                </button>
              </div>

              {/* ── Standard (featured) ── */}
              <div className="pricing-card bg-white p-8 rounded-2xl flex flex-col ring-2 ring-[#5C4138] relative shadow-xl shadow-[#5C4138]/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{ animationDelay: "0.45s" }}>
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#8D5D28] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#191c1b] mb-2">
                    Standard
                  </h3>
                  <p className="text-sm text-[#3f4941] mb-2">5 levels deep network</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-primary">
                      ₱199
                    </span>
                    <span className="text-[#3f4941] text-sm">/lifetime</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 grow">
                  {[
                    "5 levels deep network",
                    "Benefits",
                    "Benefits",
                    "Benefits",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/home/signup?plan=standard')}
                  className="w-full py-4 rounded-xl font-bold bg-[#5C4138] text-white shadow-lg hover:shadow-xl hover:bg-[#4a352d] active:scale-[0.98] transition-all duration-300">
                  Get Started
                </button>
              </div>

              {/* ── Pro ── */}
              <div className="pricing-card bg-white p-8 rounded-2xl flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" style={{ animationDelay: "0.6s" }}>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#191c1b] mb-2">
                    Pro
                  </h3>
                  <p className="text-sm text-[#3f4941] mb-2">7 levels deep network</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-primary">
                      ₱999
                    </span>
                    <span className="text-[#3f4941] text-sm">/lifetime</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 grow">
                  {[
                    "7 levels deep network",
                    "Benefits",
                    "Benefits",
                    "Benefits",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#3f4941]">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/home/memberships')}
                  className="w-full py-4 rounded-xl font-bold border-2 border-[#5C4138] text-[#5C4138] hover:bg-[#5C4138] hover:text-white transition-all duration-300 active:scale-[0.98]">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* <AdsSidebar /> */}
      </main>

{/* Footer */}
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

/* ── Small reusable check icon ── */
function CheckIcon() {
  return (
    <svg
      className="text-primary shrink-0 w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.293a1 1 0 00-1.414 0L10 14.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l6-6a1 1 0 000-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}