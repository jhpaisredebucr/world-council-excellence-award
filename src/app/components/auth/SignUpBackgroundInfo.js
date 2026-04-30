"use client";

import Input from "../ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpBackgroundInfo({
    formData,
    setFormData,
    nextStep,
    prevStep,
    isLoading,
    setIsLoading
}) {

    const router = useRouter();
    const [errors, setErrors] = useState({});


    function validate() {

        const {
            firstName,
            middleName,
            lastName,
            dob,
            city,
            barangay,
            streetAddress,
            postalCode
        } = formData;

        const newErrors = {};

        if (!firstName) newErrors.firstName = "Required";
        if (!middleName) newErrors.middleName = "Required";
        if (!lastName) newErrors.lastName = "Required";
        if (!dob) newErrors.dob = "Required";
        if (!city) newErrors.city = "Required";
        if (!barangay) newErrors.barangay = "Required";
        if (!streetAddress) newErrors.streetAddress = "Required";
        if (!postalCode) newErrors.postalCode = "Required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }


    function Next() {
        if (isLoading) return;
        if (!validate()) return;
        setIsLoading(true);
        setTimeout(() => {
            nextStep();
            setIsLoading(false);
        }, 500); // Brief debounce
    }


    function Prev() {
        prevStep();
    }


    return (

        <div className="w-full flex justify-center">

            {/* CARD CONTAINER - Mobile Optimized */}
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8"> 

                {/* HEADER - Mobile Optimized */}
                <div className="mb-6 sm:mb-8 text-center md:text-left flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            Background Information
                        </h2>

                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Tell us more about yourself.
                        </p>
                    </div>
                </div>


                {/* FORM GRID - Mobile Optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">


                    <FormField error={errors.firstName}>
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChange={(val) =>
                                setFormData({
                                    ...formData,
                                    firstName: val
                                })
                            }
                        />
                    </FormField>


                    <FormField error={errors.lastName}>
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(val) =>
                                setFormData({
                                    ...formData,
                                    lastName: val
                                })
                            }
                        />
                    </FormField>


                    <FormField error={errors.middleName}>
                        <Input
                            label="Middle Name"
                            value={formData.middleName}
                            onChange={(val) =>
                                setFormData({
                                    ...formData,
                                    middleName: val
                                })
                            }
                        />
                    </FormField>


                    <FormField error={errors.dob}>
                        <Input
                            label="Date of Birth"
                            type="date"
                            value={formData.dob}
                            onChange={(val) =>
                                setFormData({
                                    ...formData,
                                    dob: val
                                })
                            }
                        />
                    </FormField>


                    <FormField error={errors.city}>
                        <Input
                            label="City"
                            value={formData.city}
                            onChange={(val) =>
                                setFormData({
                                    ...formData,
                                    city: val
                                })
                            }
                        />
                    </FormField>


                    <FormField error={errors.barangay}>
                        <Input
                            label="Barangay"
                            value={formData.barangay}
                            onChange={(val) =>
                                setFormData({
                                    ...formData,
                                    barangay: val
                                })
                            }
                        />
                    </FormField>


                    <FormField error={errors.streetAddress}>
                        <Input
                            label="Street Address"
                            value={formData.streetAddress}
                            onChange={(val) =>
                                setFormData({
                                    ...formData,
                                    streetAddress: val
                                })
                            }
                        />
                    </FormField>


                    <FormField error={errors.postalCode}>
                        <Input
                            label="Postal Code"
                            value={formData.postalCode}
                            onChange={(val) =>
                                setFormData({
                                    ...formData,
                                    postalCode: val
                                })
                            }
                        />
                    </FormField>


                    {/* BUTTONS - Mobile Optimized */}
                    <div className="col-span-1 sm:col-span-2 flex gap-3 sm:gap-4 mt-4 sm:mt-6">


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
                            {isLoading ? "Please wait..." : "Next Step"}
                        </button>

                    </div>


                </div>

            </div>

        </div>

    );
}


/* FIELD WRAPPER */

function FormField({ children, error }) {

    return (
        <div className="flex flex-col">

            {children}

            {error && (
                <p className="text-xs text-red-500 mt-1">
                    {error}
                </p>
            )}

        </div>
    );
}