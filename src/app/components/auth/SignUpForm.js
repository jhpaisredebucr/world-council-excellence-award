"use client"
import { useState } from "react";
import SignUpInfo from "./SignUpInfo";
import SignUpBackgroundInfo from "./SignUpBackgroundInfo";
import SignUpPlan from "./SignUpPlan";
import SignUpPayment from "./SignUpPayment";
import SignUpApproval from "./SignUpApproval";

// 🔧 Toggle this ON/OFF for debugging
const DEBUG_PRESET = false;

const STEP_TITLES = [
  "",
  "Account Information",
  "Background Information", 
  "Choose Plan",
  "Payment Details",
  "Approval"
];

const STEP_DESCRIPTIONS = [
  "",
  "Create your account credentials",
  "Tell us more about yourself",
  "Select your membership plan",
  "Complete your payment",
  "Review your submission"
];

export default function SignUpForm({ refCode }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const generatePresetData = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const randomPhone = `09${Math.floor(100000000 + Math.random() * 900000000)}`;

    return {
      username: `user${randomNumber}`,
      email: `user${randomNumber}@test.com`,
      contactNumber: randomPhone,
      referralCode: refCode || `MEM-8WJOE4`,
      password: "12345678",
      confirmPassword: "12345678",

      firstName: "Paulo Reeve",
      middleName: "Castillano",
      lastName: "Buta",
      dob: "1995-05-15",
      city: "Imus",
      barangay: "Alapan",
      streetAddress: `${randomNumber} Sample Street`,
      postalCode: "4103",

      packagePrice: null,
      maxLevel: null,

      paymentMethod: "gcash",
      paymentProof: null,
      paymentUrl: "",
      captchaToken: null,

      status: "pending"
    };
  };

  const generateEmptyData = () => ({
    username: "",
    email: "",
    contactNumber: "",
    referralCode: refCode || "",
    password: "",
    confirmPassword: "",

    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    city: "",
    barangay: "",
    streetAddress: "",
    postalCode: "",

    packagePrice: null,
    maxLevel: null,

    paymentMethod: "",
    paymentProof: null,
    paymentUrl: "",
    captchaToken: null,

    status: "pending"
  });

  const [formData, setFormData] = useState(() =>
    DEBUG_PRESET ? generatePresetData() : generateEmptyData()
  );

  const nextStep = () => !isLoading && setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => !isLoading && setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
      {/* Mobile-optimized container */}
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Progress Indicator - Mobile First */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
            Create Your Account
          </h1>
          
          {/* Mobile: Compact progress indicator - Centered */}
          <div className="sm:hidden max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {step} of 5
              </span>
              <span className="text-sm font-medium text-(--primary)">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-(--primary) h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {STEP_DESCRIPTIONS[step]}
            </p>
          </div>
          
          {/* Desktop: Percentage progress bar - Centered */}
          <div className="hidden sm:block max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {step} of 5
              </span>
              <span className="text-sm font-medium text-(--primary)">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-(--primary) h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              {STEP_DESCRIPTIONS[step]}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="w-full">
          {step === 1 && (
            <SignUpInfo
              formData={formData}
              setFormData={setFormData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              nextStep={nextStep}
              prevStep={prevStep}
              refCode={refCode}
            />
          )}
          {step === 2 && (
            <SignUpBackgroundInfo
              formData={formData}
              setFormData={setFormData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && (
            <SignUpPlan
              formData={formData}
              setFormData={setFormData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 4 && (
            <SignUpPayment
              formData={formData}
              setFormData={setFormData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 5 && (
            <SignUpApproval
              formData={formData}
              setFormData={setFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
        </div>
      </div>
    </div>
  );
}