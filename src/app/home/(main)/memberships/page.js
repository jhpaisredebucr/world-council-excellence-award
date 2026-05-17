"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

const membershipPlans = [
    {
        name: "HP - Basic",
        price: 99,
        billingLabel: "1 year",
        levelDepth: 3,
        features: [
            "3 levels deep network",
        ]
    },
    {
        name: "HP - Standard",
        price: 199,
        billingLabel: "1 year",
        levelDepth: 5,
        features: [
            "5 levels deep network",
        ]
    },
    {
        name: "HP - Pro",
        price: 999,
        billingLabel: "1 year",
        levelDepth: 7,
        features: [
            "7 levels deep network",
        ]
    },
    {
        name: "HP - Elite",
        price: 1999,
        billingLabel: "2 year",
        levelDepth: 10,
        features: [
            "10 levels deep network",
            "100k Accident Insurance",
        ]
    },
    {
        name: "HP - Council",
        price: 5000,
        billingLabel: "2 year",
        levelDepth: 13,
        features: [
            "13 levels deep network",
            "1M Accident Insurance",
        ]
    },
    {
        name: "HP - Global President",
        price: 17000,
        billingLabel: "5 year",
        levelDepth: 15,
        features: [
            "15 levels deep network",
            "2m Accident Insurance",
        ]
    }
];


export default function Membership() {
    const router = useRouter();
    const [showAllPlans, setShowAllPlans] = useState(false);

    return (
        <div className="min-h-screen bg-[#fafaf8] mt-16">

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
                .plan-card {
                    opacity: 0;
                    animation: fadeUp 0.6s ease forwards;
                }
                .faq-item {
                    opacity: 0;
                    animation: fadeIn 0.6s ease forwards;
                }
                .cta-section {
                    opacity: 0;
                    animation: fadeUp 0.7s ease forwards;
                    animation-delay: 0.2s;
                }
            `}</style>

            {/* Hero Section */}
            <section className="py-20 px-4 bg-wcea-animated text-white md:min-h-90 relative overflow-hidden">
              {/* Animated gradient particles */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#c49a6c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }} />
              </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
                      <span>Choose Your Path</span>
                    </div>
                    <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">
                        Membership Plans
                    </h1>
                    <p className="hero-sub text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Choose your path to success. Our membership plans give you access to our exclusive network marketing platform, with different levels of depth and benefits to match your goals.
                    </p>
                    <div className="hero-badges flex flex-wrap justify-center gap-4 text-sm">
                        <div className="glass-wcea px-4 py-2 rounded-lg">
                            <span className="font-bold">₱99 - ₱17,000</span>
                            <span className="ml-2 text-white/80">Price Range</span>
                        </div>
                        <div className="glass-wcea px-4 py-2 rounded-lg">
                            <span className="font-bold">3 - 15</span>
                            <span className="ml-2 text-white/80">Network Levels</span>
                        </div>
                        <div className="glass-wcea px-4 py-2 rounded-lg">
                            <span className="font-bold">6</span>
                            <span className="ml-2 text-white/80">Plans Available</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="section-heading text-3xl font-bold text-gray-800 mb-4 wcea-heading-underline wcea-heading-underline-center">Choose Your Plan</h2>
                    <p className="section-sub text-gray-600 max-w-xl mx-auto">
                        Select the membership plan that best fits your business goals. Each plan unlocks more network depth and exclusive benefits.
                    </p>
                </div>

                {/* HP Info Section */}
                <div className="flex justify-center mb-10">
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-wcea-gradient-soft rounded-2xl border border-[#8D5D28]/20 shadow-sm">
                    <div className="shrink-0 w-10 h-10 bg-wcea-gradient rounded-full flex items-center justify-center">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {membershipPlans.slice(0, showAllPlans ? membershipPlans.length : 3).map((plan, index) => (
                        <div
                            key={index}
                            className="plan-card bg-white border border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            style={{ animationDelay: `${0.5 + index * 0.12}s` }}
                        >
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-wcea-gradient">{plan.name}</h3>
                                <p className="text-sm opacity-80 text-gray-600">{plan.levelDepth} levels deep network</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold">₱{plan.price.toLocaleString()}</span>
                                <span className="text-gray-600 text-sm ml-1">/{plan.billingLabel}</span>
                            </div>


                            <div className="flex-1 mb-6">
                                <ul className="space-y-2">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <svg className="w-5 h-5 text-[#8D5D28] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => router.push(`/home/signup?plan=${plan.name.toLowerCase()}`)}
                                className="w-full py-3 rounded-xl font-bold btn-wcea"
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

                {membershipPlans.length > 3 && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowAllPlans(!showAllPlans)}
                            className="px-6 py-3 btn-wcea rounded-xl font-bold"
                        >
                            {showAllPlans ? "Show Less" : "See More Plans"}
                        </button>
                    </div>
                )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="section-heading text-3xl font-bold text-gray-800 mb-8 text-center wcea-heading-underline wcea-heading-underline-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: "What do the levels mean?",
                                a: "The levels represent how deep your network goes. For example, with 5 levels, you earn commissions from your direct referrals (Level 1), their referrals (Level 2), and so on up to Level 5."
                            },
                            {
                                q: "Do I need to renew my membership?",
                                a: "Yes, memberships require renewal after the plan period ends. Basic, Standard, and Pro plans are valid for 1 year. Elite and Council plans are valid for 2 years. Global President plan is valid for 5 years. Renew your plan to continue enjoying the benefits and network depth."
                            },
                            {
                                q: "What payment methods are accepted?",
                                a: "We accept G-Cash, bank transfers, and credit/debit cards through our secure payment portal."
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="faq-item border border-gray-200 rounded-xl p-4 hover:border-[#8D5D28]/30 hover:shadow-md transition-all duration-300"
                                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
                            >
                                <h3 className="font-bold text-[#5C4138] mb-2">{item.q}</h3>
                                <p className="text-gray-600">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section py-16 px-4 bg-wcea-animated relative overflow-hidden text-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
              </div>
                <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Ready to Start Your Journey?</h2>
                <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto relative z-10">
                    Join thousands of members who are building their network and earning commissions. Choose your plan today!
                </p>
                <button
                    onClick={() => router.push("/home/signup")}
                    className="px-8 py-4 bg-white text-[#5C4138] rounded-xl font-bold text-lg hover:bg-[#f5f0eb] hover:shadow-xl transition duration-300 active:scale-95 relative z-10"
                >
                    Sign Up Now
                </button>
            </div>
        </div>
    );
}