"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NavBarButton } from "../../../components/ui/Button";

const membershipPlans = [
    {
        name: "Basic",
        price: 99,
        levelDepth: 3,
        features: [
            "Access to basic dashboard",
            "3 levels deep network",
            "Basic support",
            "Member ID card"
        ]
    },
    {
        name: "Standard",
        price: 199,
        levelDepth: 5,
        features: [
            "Full dashboard access",
            "5 levels deep network",
            "Priority support",
            "Commission tracking",
            "Member ID card"
        ]
    },
    {
        name: "Pro",
        price: 999,
        levelDepth: 7,
        features: [
            "Advanced analytics",
            "7 levels deep network",
            "Team management",
            "Higher commission rates",
            "Priority support",
            "Member ID card"
        ]
    },
    {
        name: "Elite",
        price: 1999,
        levelDepth: 10,
        features: [
            "Elite dashboard features",
            "10 levels deep network",
            "Team leadership tools",
            "Best commission rates",
            "24/7 VIP support",
            "Exclusive events access",
            "Member ID card"
        ]
    },
    {
        name: "Council",
        price: 5000,
        levelDepth: 13,
        features: [
            "Council membership",
            "13 levels deep network",
            "Leadership training",
            "Top commission rates",
            "Dedicated account manager",
            "Exclusive events access",
            "Regional meetings",
            "Member ID card"
        ]
    },
    {
        name: "World Council International",
        price: 17000,
        levelDepth: 15,
        features: [
            "International status",
            "15 levels deep network",
            "Global leadership",
            "Maximum commission rates",
            "Personal concierge",
            "World summit invitations",
            "Board input privileges",
            "VIP Recognition",
            "Member ID card"
        ]
    }
];

export default function Membership() {
    const router = useRouter();
    const [showAllPlans, setShowAllPlans] = useState(false);

    return (
        <div className="min-h-screen bg-[#fafaf8] mt-16">

            {/* Hero Section */}
            <div className="py-16 px-4 bg-gradient-to-br from-[#5C4138] to-[#8D5D28] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Membership Plans</h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Choose your path to success. Our membership plans give you access to our exclusive network marketing platform, with different levels of depth and benefits to match your goals.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <span className="font-bold">₱99 - ₱17,000</span>
                            <span className="ml-2 text-white/80">Price Range</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <span className="font-bold">3 - 15</span>
                            <span className="ml-2 text-white/80">Network Levels</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <span className="font-bold">6</span>
                            <span className="ml-2 text-white/80">Plans Available</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Plan</h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Select the membership plan that best fits your business goals. Each plan unlocks more network depth and exclusive benefits.
                    </p>
                </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {membershipPlans.slice(0, showAllPlans ? membershipPlans.length : 3).map((plan, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Plan Header */}
                            <div className="text-[#5C4138] mb-4">
                                <h3 className="text-2xl font-bold">{plan.name}</h3>
                                <p className="text-sm opacity-80">{plan.levelDepth} levels deep network</p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-800">₱{plan.price.toLocaleString()}</span>
                                <span className="text-gray-600 text-sm ml-1">/lifetime</span>
                            </div>

                            {/* Features */}
                            <div className="flex-1 mb-6">
                                <ul className="space-y-2">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <svg className="w-5 h-5 text-[#5C4138] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => router.push(`/home/signup?plan=${plan.name.toLowerCase()}`)}
                                className="w-full py-3 rounded-xl font-bold bg-[#5C4138] text-white hover:bg-[#4a352d] hover:shadow-lg transition-all duration-300 active:scale-95"
                            >
                                Get Started
                            </button>
                        </div>
))}
                </div>

                {/* See More Button */}
                {membershipPlans.length > 3 && (
                    <div className="text-center mt-8">
                        <button 
                            onClick={() => setShowAllPlans(!showAllPlans)}
                            className="px-6 py-3 bg-[#5C4138] text-white rounded-xl font-bold hover:bg-[#4a352d] hover:shadow-lg transition duration-300 active:scale-95"
                        >
                            {showAllPlans ? "Show Less" : "See More Plans"}
                        </button>
                    </div>
                )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
                    
                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-xl p-4">
                            <h3 className="font-bold text-gray-800 mb-2">What do the levels mean?</h3>
                            <p className="text-gray-600">
                                The levels represent how deep your network goes. For example, with 5 levels, you earn commissions from your direct referrals (Level 1), their referrals (Level 2), and so on up to Level 5.
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4">
                            <h3 className="font-bold text-gray-800 mb-2">Can I upgrade my plan later?</h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade to a higher membership plan at any time. The difference in price will be applied to your account.
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4">
                            <h3 className="font-bold text-gray-800 mb-2">Is the membership lifetime?</h3>
                            <p className="text-gray-600">
                                Yes, once you purchase a membership plan, it&apos;s yours for life. You only need to maintain your account in good standing.
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4">
                            <h3 className="font-bold text-gray-800 mb-2">What payment methods are accepted?</h3>
                            <p className="text-gray-600">
                                We accept G-Cash, bank transfers, and credit/debit cards through our secure payment portal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

{/* CTA Section */}
            <div className="py-16 px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                    Join thousands of members who are building their network and earning commissions. Choose your plan today!
                </p>
                <button 
                    onClick={() => router.push("/home/signup")}
                    className="px-8 py-4 bg-[#5C4138] text-white rounded-xl font-bold text-lg hover:bg-[#4a352d] hover:shadow-xl transition duration-300 active:scale-95"
                >
                    Sign Up Now
                </button>
            </div>

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
    )
}
