"use client";

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

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
    .info-card {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
    }
    .stat-item {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
    }
    .media-card {
        opacity: 0;
        animation: fadeUp 0.6s ease forwards;
    }
`}</style>

<main className="relative min-h-screen mt-16">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative min-h-100 flex items-center overflow-hidden pb-10 bg-wcea-animated">

          {/* Animated gradient overlay particles */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c49a6c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8D5D28]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          </div>

          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home-hero.png"
              alt="Community"
              fill
              className="w-full h-full object-cover opacity-20"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#5C4138]/80 via-[#5C4138]/60 to-[#8D5D28]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d2b25]/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-15 md:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
                <span>WCEA Excellence Network</span>
              </div>
              <h1 className="hero-headline font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
                Cultivating{" "}
                <span className="text-[#f0d5b8] italic">Community</span> and
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
                  className="btn-wcea-pulse px-8 py-4 rounded-xl font-bold text-lg"
                >
                  Explore Programs
                </button>
                <button
                  onClick={() => router.push('/home/signup')}
                  className="glass-wcea text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/25 active:scale-[0.98] transition-all duration-300"
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full leading-none z-20">
            <svg className="block w-full h-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#ffffff" d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,234.7C1120,245,1280,235,1360,229.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
            </svg>
          </div>
        </section>

        {/* ═══════════════ PARTNERS ═══════════════ */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <h2 className="section-heading font-sans text-sm font-bold text-[#5C4138] mb-12 tracking-[0.2em] uppercase wcea-heading-underline wcea-heading-underline-center">
              Our Partners
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 md:grayscale opacity-90 hover:grayscale-0 transition-all duration-500">
              {["acsr.png", "memo-ni-dok.png", "wcea.png", "whea.jpeg", "gaf-champ.png"].map((src, i) => (
                <Image key={src} src={`/images/logos/${src}`} alt={`Partner ${i + 1}`} width={120} height={80} className="partner-logo h-auto w-auto" style={{ animationDelay: `${0.1 + i * 0.1}s` }} priority />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ ABOUT WCEA ═══════════════ */}
        <section className="bg-wcea-gradient-soft py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="section-heading font-serif text-4xl md:text-5xl font-bold text-[#191c1b] mb-6">
              What is <span className="text-wcea-gradient">WCEA</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              The <strong>World Council Excellence Award</strong> is a humanitarian membership organization dedicated to 
              transforming communities through wellness, direct selling, and sustainable economic empowerment. 
              We provide a platform that combines health products, network marketing, and community development 
              to create opportunities for every family.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Feature image carousel + text layout */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              {/* ── AUTO-ROTATING CAROUSEL ── */}
              <Carousel />

              <div className="w-full md:w-1/2">
                <span className="feature-eyebrow text-wcea-gradient font-bold tracking-widest uppercase text-xs mb-4 block">Our Mission</span>
                <h2 className="feature-title font-serif text-4xl md:text-5xl font-bold text-[#191c1b] leading-tight mb-8">
                  A New Standard for{" "}
                  <span className="text-wcea-gradient italic">Shared Growth</span>
                </h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#8D5D28]">
                    <h3 className="text-lg md:text-xl font-bold text-wcea-gradient mb-3">VISION</h3>
                    <blockquote className="text-base text-gray-600 italic leading-relaxed">
                      TO BE THE NEXT BIG THING ON WELLNESS AND HEALTH CARE DIRECT SELLING COMPANY
                    </blockquote>
                  </div>
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#5C4138]">
                    <h3 className="text-lg md:text-xl font-bold text-wcea-gradient mb-3">MISSION</h3>
                    <blockquote className="text-base text-gray-600 italic leading-relaxed">
                      DELIVER HEALTH CARE WELLNESS IN EVERY FAMILY AND COMMUNITY
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ STATS ═══════════════ */}
        <section className="bg-wcea-gradient py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-center text-white/90 text-sm font-bold tracking-[0.2em] uppercase mb-12">Our Reach</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "1,000+", label: "Active Members" },
                { number: "6", label: "Membership Plans" },
                { number: "15", label: "Network Levels" },
                { number: "100%", label: "Community Focused" },
              ].map((stat, i) => (
                <div key={i} className="stat-item text-center" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ MEDIA / GALLERY ═══════════════ */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="section-heading font-serif text-4xl md:text-5xl font-bold text-[#191c1b] mb-6">
              <span className="text-wcea-gradient">In Action</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See how WCEA is making a difference in communities through wellness programs, 
              humanitarian missions, and life-changing events.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Media Card 1 - Video Placeholder */}
            <div className="media-card bg-wcea-gradient-soft rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300" style={{ animationDelay: "0.1s" }}>
              <div className="relative aspect-video bg-wcea-gradient-dark flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-[#5C4138] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">Watch Video</div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#191c1b] mb-2">WCEA Humanitarian Mission</h3>
                <p className="text-sm text-gray-600">See how our members are transforming communities through wellness and direct selling initiatives.</p>
              </div>
            </div>

            {/* Media Card 2 - Image Placeholder */}
            <div className="media-card bg-wcea-gradient-soft rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300" style={{ animationDelay: "0.2s" }}>
              <div className="relative aspect-video bg-wcea-gradient flex items-center justify-center">
                <div className="text-center p-4">
                  <svg className="w-12 h-12 text-white/60 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white/60 text-xs">Community Event</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#191c1b] mb-2">Community Wellness Event</h3>
                <p className="text-sm text-gray-600">Highlights from our recent community wellness programs and membership gatherings.</p>
              </div>
            </div>

            {/* Media Card 3 - Image Placeholder */}
            <div className="media-card bg-wcea-gradient-soft rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300" style={{ animationDelay: "0.3s" }}>
              <div className="relative aspect-video bg-wcea-gradient-gold flex items-center justify-center">
                <div className="text-center p-4">
                  <svg className="w-12 h-12 text-white/60 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/60 text-xs">Training Session</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#191c1b] mb-2">Leadership Training</h3>
                <p className="text-sm text-gray-600">Empowering our members with skills, knowledge, and direct selling expertise.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section className="bg-[#f4f4f0] py-24 px-6">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="section-heading font-serif text-4xl md:text-5xl font-bold text-[#191c1b] mb-6">
              How It <span className="text-wcea-gradient">Works</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Getting started with WCEA is simple. Join our humanitarian mission and start building your network today.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Choose a Plan", desc: "Select the membership tier that matches your goals and commitment level." },
              { step: "02", title: "Register & Pay", desc: "Complete your registration and secure your membership." },
              { step: "03", title: "Build Your Network", desc: "Refer others and earn commissions from multiple levels of depth." },
              { step: "04", title: "Earn & Grow", desc: "Unlock rewards, insurance, and exclusive benefits as you grow." },
            ].map((item, i) => (
              <div key={i} className="info-card text-center p-6" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                <div className="w-14 h-14 bg-wcea-gradient rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="font-bold text-[#191c1b] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ KEY BENEFITS ═══════════════ */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="section-heading font-serif text-4xl md:text-5xl font-bold text-[#191c1b] mb-6">
              Why Join <span className="text-wcea-gradient">WCEA</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience a unique blend of humanitarian values and entrepreneurial opportunity.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "💰", title: "Multiple Income Streams", desc: "Earn through referrals, product sales, franchise opportunities, and more." },
              { icon: "🏥", title: "Accident Insurance", desc: "Elite plans and above include accident insurance coverage for peace of mind." },
              { icon: "🌏", title: "Global Network", desc: "Connect with a growing community of humanitarian members worldwide." },
              { icon: "📈", title: "Deep Network Levels", desc: "Earn commissions from up to 15 levels deep depending on your plan." },
              { icon: "🎓", title: "Leadership Training", desc: "Access training programs to develop your skills and grow your business." },
              { icon: "🏆", title: "Exclusive Rewards", desc: "Qualify for ILC trips, awards, bonuses, and global recognition." },
            ].map((item, i) => (
              <div key={i} className="info-card bg-wcea-gradient-soft p-6 rounded-2xl border border-[#8D5D28]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-[#191c1b] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ MEMBERSHIP ═══════════════ */}
        <section className="bg-[#fafaf8] py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="membership-header text-center mb-12">
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#191c1b] mb-6">
                Join Our <span className="text-wcea-gradient">Growing Community</span>
              </h2>
              <p className="text-[#3f4941] text-lg max-w-2xl mx-auto">
                Choose a tier that best fits your commitment to community wellness and sustainable living.
              </p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-wcea-gradient-soft rounded-2xl border border-[#8D5D28]/20 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-wcea-gradient rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#5C4138]">HP = Humanitarian Plan</p>
                  <p className="text-xs text-gray-600">Empowering communities through wellness and direct selling</p>
                </div>
              </div>
            </div>

            {/* Pricing cards - FIXED: badge sits fully inside the card's top padding */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Basic */}
              <div className="pricing-card bg-white rounded-2xl flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden" style={{ animationDelay: "0.3s" }}>
                <div className="p-8 pb-0 flex flex-col h-full">
                  <div className="text-center mb-6 pt-4">
                    <h3 className="text-2xl font-bold text-[#191c1b] mb-2">HP - Basic</h3>
                    <p className="text-sm text-gray-500 mb-4">3 levels deep network</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-serif font-bold text-wcea-gradient">₱99</span>
                      <span className="text-gray-500 text-sm">/1 year</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 grow px-2">
                    <li className="flex items-center gap-3 text-[#3f4941]"><CheckIcon /><span>3 levels deep network</span></li>
                  </ul>
                  <div className="p-4 border-t border-gray-100 -mx-8 px-8">
                    <button onClick={() => router.push('/home/memberships')} className="w-full py-4 rounded-xl font-bold border-2 border-[#5C4138] text-[#5C4138] hover:bg-wcea-gradient hover:text-white transition-all duration-300 active:scale-[0.98]">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>

              {/* Standard - Featured */}
              <div className="pricing-card bg-white rounded-2xl flex flex-col relative shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 overflow-hidden z-10" style={{ animationDelay: "0.45s" }}>
                {/* Top accent bar with card-wcea border */}
                <div className="h-2 bg-wcea-gradient" />
                <div className="p-8 pb-0 flex flex-col h-full">
                  {/* Most Popular badge - INSIDE the card at the top */}
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-wcea-gradient-gold text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
                      Most Popular
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-[#191c1b] mb-2">HP - Standard</h3>
                    <p className="text-sm text-gray-500 mb-4">5 levels deep network</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-serif font-bold text-wcea-gradient">₱199</span>
                      <span className="text-gray-500 text-sm">/1 year</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 grow px-2">
                    <li className="flex items-center gap-3 text-[#3f4941]"><CheckIcon /><span>5 levels deep network</span></li>
                  </ul>
                  <div className="p-4 border-t border-gray-100 -mx-8 px-8">
                    <button onClick={() => router.push('/home/signup?plan=standard')} className="w-full py-4 rounded-xl font-bold btn-wcea shadow-lg active:scale-[0.98] transition-all duration-300">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>

              {/* Pro */}
              <div className="pricing-card bg-white rounded-2xl flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden" style={{ animationDelay: "0.6s" }}>
                <div className="p-8 pb-0 flex flex-col h-full">
                  <div className="text-center mb-6 pt-4">
                    <h3 className="text-2xl font-bold text-[#191c1b] mb-2">HP - Pro</h3>
                    <p className="text-sm text-gray-500 mb-4">7 levels deep network</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-serif font-bold text-wcea-gradient">₱999</span>
                      <span className="text-gray-500 text-sm">/1 year</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 grow px-2">
                    <li className="flex items-center gap-3 text-[#3f4941]"><CheckIcon /><span>7 levels deep network</span></li>
                  </ul>
                  <div className="p-4 border-t border-gray-100 -mx-8 px-8">
                    <button onClick={() => router.push('/home/memberships')} className="w-full py-4 rounded-xl font-bold border-2 border-[#5C4138] text-[#5C4138] hover:bg-wcea-gradient hover:text-white transition-all duration-300 active:scale-[0.98]">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="py-20 px-6 bg-wcea-animated relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of members who are building their network, earning commissions, and making a positive impact in their communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push("/home/signup")} className="btn-wcea-pulse px-8 py-4 rounded-xl font-bold text-lg">
                Sign Up Now
              </button>
              <button onClick={() => router.push("/home/memberships")} className="glass-wcea text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/25 transition-all duration-300">
                View Plans
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="text-[#8D5D28] shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.293a1 1 0 00-1.414 0L10 14.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l6-6a1 1 0 000-1.414z" clipRule="evenodd" />
    </svg>
  );
}

/* ── AUTO-ROTATING CAROUSEL ── */
const CAROUSEL_SLIDES = [
  {
    gradient: "from-[#5C4138] to-[#8D5D28]",
    icon: (
      <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zM3 7a4 4 0 118 0" />
      </svg>
    ),
    label: "Wellness Programs",
    desc: "Community health and wellness initiatives"
  },
  {
    gradient: "from-[#8D5D28] to-[#c49a6c]",
    icon: (
      <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    label: "Health Initiatives",
    desc: "Wellness programs for every family"
  },
  {
    gradient: "from-[#3d2b25] to-[#5C4138]",
    icon: (
      <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    label: "Humanitarian Missions",
    desc: "Making a difference worldwide"
  },
  {
    gradient: "from-[#6e4f3e] to-[#a67c4a]",
    icon: (
      <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    label: "Leadership Training",
    desc: "Empowering future leaders"
  },
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (index) => {
    setCurrent(index);
    startTimer();
  };

  const slide = CAROUSEL_SLIDES[current];

  return (
    <div className="feature-image w-full md:w-1/2 relative overflow-hidden rounded-xl">
      <div className="aspect-4/5 relative overflow-hidden rounded-xl">
        {/* Gradient background instead of image */}
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} rounded-xl`} />
        {/* Decorative pattern circles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        </div>
        {/* Icon and label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 opacity-80">{slide.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-2">{slide.label}</h3>
          <p className="text-white/70 text-sm">{slide.desc}</p>
        </div>
        {/* Bottom overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl pointer-events-none" />
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-[#8D5D28] w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
