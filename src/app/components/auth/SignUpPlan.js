"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPlan({
    formData,
    setFormData,
    nextStep,
    prevStep,
    isLoading,
    setIsLoading
}) {

    const router = useRouter();
    const [error, setError] = useState(null);


    function SetPlan(planId, price) {
        const maxLevels = {
          99: 3,
          199: 5,
          999: 7,
          1999: 10,
          5000: 13,
          17000: 15
        }[price] || 3;

        setFormData(prev => ({
            ...prev,
            planId,
            packagePrice: price,
            maxLevel: maxLevels
        }));

        setError(null);
    }


    function Next() {
        if (isLoading) return;

        if (!formData.planId) {
            setError("Please select a membership plan.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            nextStep();
            setIsLoading(false);
        }, 300);
    }


    function Prev() {
        prevStep();
    }


    return (

        <div className="w-full flex justify-center py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">

            {/* CARD - Mobile Optimized */}
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">

                {/* HEADER - Mobile Optimized */}
                <div className="mb-6 sm:mb-8 text-center md:text-left flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            Choose Your Membership Plan
                        </h2>

                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Select the plan that best fits your needs.
                        </p>
                    </div>
                </div>


                {/* ERROR MESSAGE - Mobile Optimized */}
                {error && (
                    <p className="text-sm text-red-500 mb-4 sm:mb-6">
                        {error}
                    </p>
                )}


                {/* PLAN GRID - Mobile Optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">


                    <PlanCard
                        title="Basic"
                        price="₱99"
                        selected={formData.packagePrice === 99}
                        onClick={() => SetPlan(1, 99)}
                    />


                    <PlanCard
                        title="Standard"
                        price="₱199"
                        selected={formData.packagePrice === 199}
                        onClick={() => SetPlan(2, 199)}
                    />

                    <PlanCard
                        title="Pro"
                        price="₱999"
                        selected={formData.packagePrice === 999}
                        highlight
                        onClick={() => SetPlan(3, 999)}
                    />


                    <PlanCard
                        title="Elite"
                        price="₱1,999"
                        selected={formData.packagePrice === 1999}
                        onClick={() => SetPlan(4, 1999)}
                    />

                    <PlanCard
                        title="Council"
                        price="₱5,000"
                        selected={formData.packagePrice === 5000}
                        onClick={() => SetPlan(5, 5000)}
                    />

                    <PlanCard
                        title="World Council International"
                        price="₱17,000"
                        selected={formData.packagePrice === 17000}
                        onClick={() => SetPlan(6, 17000)}
                    />


                </div>


                {/* BUTTONS */}
                <div className="flex gap-4 mt-10">


                    <button
                        onClick={Prev}
                        className="
                        flex-1
                        h-12 sm:h-14
                        rounded-lg
                        border
                        border-gray-300
                        text-gray-700
                        hover:bg-gray-100
                        transition
                        text-sm sm:text-base
                        min-h-11
                        "
                    >
                        Back
                    </button>


                    <button
                        onClick={Next}
                        disabled={isLoading}
                        className="
                        flex-1
                        min-h-11 h-12 sm:h-14
                        rounded-lg
                        bg-(--primary)
                        text-white
                        font-semibold
                        hover:opacity-90
                        active:scale-[0.98]
                        transition
                        shadow-md
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-sm sm:text-base
                        " 
                    >
                        {isLoading ? "Please wait..." : "Continue"}
                    </button>


                </div>

            </div>

        </div>

    );
}


/* PLAN CARD COMPONENT */

function PlanCard({
    title,
    price,
    selected,
    highlight = false,
    onClick
}) {

    return (

        <button
            onClick={onClick}
            className={`
            relative
            flex flex-col
            items-center
            justify-center
            text-center
            rounded-xl
            border
            p-4 sm:p-6
            transition-all duration-200
            hover:-translate-y-1
            hover:shadow-xl
            active:scale-[0.98]
            
            ${selected
                ? "border-(--primary) ring-2 ring-(--primary)"
                : "border-gray-200 hover:border-gray-300"
            }

            ${highlight
                ? "shadow-lg"
                : ""
            }
            `}
        >

            {highlight && (
                <span className="
                absolute
                top-0
                right-6
                -translate-y-1/2
                bg-[#ffddaf]
                text-xs
                px-3
                py-1
                rounded-full
                font-semibold
                ">
                    Most Popular
                </span>
            )}


            <p className="text-lg font-semibold text-gray-800">
                {title}
            </p>


            <p className="
            text-3xl
            font-bold
            text-(--primary)
            mt-2
            ">
                {price}
            </p>


        </button>

    );
}