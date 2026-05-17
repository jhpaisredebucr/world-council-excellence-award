"use client";
import { useState } from "react";
import Button from "../components/ui/Button";

export default function AdvisoryPage() {
    // Toggle states for collapsible sections
    const [showBenefits, setShowBenefits] = useState(true);
    const [showQualification, setShowQualification] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);
    const [showEarnings, setShowEarnings] = useState(false);
    const [showGlobal, setShowGlobal] = useState(false);

    return (
        <div className="min-h-screen bg-wcea-gradient-soft py-8 px-4">
            <div className="max-w-3xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl relative overflow-hidden">
                {/* Decorative top gradient */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-wcea-gradient" />
                
                <h1 className="text-3xl font-bold text-wcea-gradient mb-4 text-center">
                    Office of the Chairman – Advisory 2026
                </h1>

                <p className="mb-8 text-gray-700 text-center max-w-xl mx-auto">
                    Every District Club composes of 12 Dignitary Humanitarian Members which will give you benefits to one another.
                </p>

                {/* Benefits Section */}
                <div className="mb-4">
                    <Button
                        onClick={() => setShowBenefits(!showBenefits)}
                        className="w-full text-left btn-wcea flex items-center justify-between"
                    >
                        <span>Benefits</span>
                        <span className={`transition-transform duration-300 ${showBenefits ? 'rotate-180' : ''}`}>▼</span>
                    </Button>
                    {showBenefits && (
                        <ul className="list-decimal list-inside mt-2 space-y-1.5 text-gray-700 p-4 bg-[#f5efe6] rounded-lg">
                            <li>ASIAN ILC TRIP (if submitted 12 New Members and runs within January 17 to 31)</li>
                            <li>Free Hotel and Dinner</li>
                            <li>Free Airfare</li>
                            <li>ILC Awards</li>
                            <li>City Mission Tour</li>
                            <li>Training (personal travel tax, city foods, personal expenses not included)</li>
                            <li>Humanitarian Funds Support</li>
                            <li>Accident Insurance</li>
                            <li>RCD Budget Funds</li>
                            <li>Access to IHF Digital Rural Bank Account</li>
                            <li>WCEA Awards</li>
                        </ul>
                    )}
                </div>

                {/* How to Qualify */}
                <div className="mb-4">
                    <Button
                        onClick={() => setShowQualification(!showQualification)}
                        className="w-full text-left btn-wcea flex items-center justify-between"
                    >
                        <span>How to Qualify?</span>
                        <span className={`transition-transform duration-300 ${showQualification ? 'rotate-180' : ''}`}>▼</span>
                    </Button>
                    {showQualification && (
                        <ul className="list-decimal list-inside mt-2 space-y-1.5 text-gray-700 p-4 bg-[#f5efe6] rounded-lg">
                            <li>Be a registered WCEA Member and attend the WCEA Acceptance Ordaining Day</li>
                            <li>Run for 20 Days Ranking</li>
                            <li>Letter of Intent to join</li>
                            <li>Submitted 12 New Dignitaries</li>
                            <li>Appearance of 12 Dignitaries on February 23, 2026</li>
                        </ul>
                    )}
                </div>

                {/* Requirements */}
                <div className="mb-4">
                    <Button
                        onClick={() => setShowRequirements(!showRequirements)}
                        className="w-full text-left btn-wcea flex items-center justify-between"
                    >
                        <span>Requirements</span>
                        <span className={`transition-transform duration-300 ${showRequirements ? 'rotate-180' : ''}`}>▼</span>
                    </Button>
                    {showRequirements && (
                        <ul className="list-decimal list-inside mt-2 space-y-1.5 text-gray-700 p-4 bg-[#f5efe6] rounded-lg">
                            <li>WCEA Form</li>
                            <li>Recent Diploma and TOR</li>
                            <li>3R Photo size</li>
                            <li>Lifetime Membership – 12k PHP</li>
                        </ul>
                    )}
                </div>

                {/* Ways of Earnings */}
                <div className="mb-4">
                    <Button
                        onClick={() => setShowEarnings(!showEarnings)}
                        className="w-full text-left btn-wcea flex items-center justify-between"
                    >
                        <span>Ways of Earnings</span>
                        <span className={`transition-transform duration-300 ${showEarnings ? 'rotate-180' : ''}`}>▼</span>
                    </Button>
                    {showEarnings && (
                        <ul className="list-decimal list-inside mt-2 space-y-1.5 text-gray-700 p-4 bg-[#f5efe6] rounded-lg">
                            <li>Enrollment Funds – earn 1500 to 2k PHP per referral</li>
                            <li>Nutrition Training – earn 2k PHP per referral</li>
                            <li>Memo Ni Dok Franchise – 15k PHP per branch</li>
                            <li>EcoTownship – 2.5%</li>
                            <li>Wellness Products – 10%–47% discount</li>
                            <li>Humanitarian Mart Franchise – 2k PHP per membership</li>
                            <li>International Degree Funds – 5k to 20k per course/enrolled student</li>
                            <li>Digital Rural Bank – daily income per cash in/out</li>
                            <li>Every 10 Franchise of Memo Ni Dok Clinic – 150k PHP + Free Asian Tour Year-Round</li>
                        </ul>
                    )}
                </div>

                {/* Global & Celebrity Benefits */}
                <div className="mb-4">
                    <Button
                        onClick={() => setShowGlobal(!showGlobal)}
                        className="w-full text-left btn-wcea flex items-center justify-between"
                    >
                        <span>Globally Hybrid & Unique Benefits</span>
                        <span className={`transition-transform duration-300 ${showGlobal ? 'rotate-180' : ''}`}>▼</span>
                    </Button>
                    {showGlobal && (
                        <ul className="list-decimal list-inside mt-2 space-y-1.5 text-gray-700 p-4 bg-[#f5efe6] rounded-lg">
                            <li>Celebrity Instant Daily Payout</li>
                            <li>Celebrity Direct Selling with Benefits</li>
                            <li>Celebrity Direct Referral – 500</li>
                            <li>Unlimited Direct Referrals</li>
                            <li>No Flashout</li>
                            <li>Celebrity Bonus 1000 Pair – Until 10 levels then repeats</li>
                            <li>Celebrity Cash Products – 5k PHP voucher every completed Direct 10</li>
                            <li>Celebrity Rank Bonus – 5k to 100k</li>
                            <li>Free ILC ASIAN Tour Incentives</li>
                            <li>Free Local Tour Incentives</li>
                            <li>Celebrity Repeat Orders Discount Income – 10% to 50%</li>
                            <li>Celebrity Global Pool – Cooperative Humanitarian Support income</li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}