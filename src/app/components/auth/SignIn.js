'use client';

import Input from "../ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SemanticCard from "../card/SemanticCard";

export default function SignInForm() {
    const router = useRouter();

    const [username, setUsername] = useState("riveu");
    const [password, setPassword] = useState("yeolswi");

    const [errors, setErrors] = useState({
        username: "",
        password: "",
        general: ""
    });

    const [loading, setLoading] = useState(false);


    function validate() {
        let newErrors = { username: "", password: "", general: "" };

        if (!username) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";

        setErrors(newErrors);

        return !newErrors.username && !newErrors.password;
    }


    async function HandleSignIn() {
        if (!validate()) return;

        setLoading(true);
        setErrors(prev => ({ ...prev, general: "" }));

        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (data.success) {
                router.replace(
                    data.user.role === "admin"
                        ? "/u/admin/dashboard"
                        : "/u/dashboard"
                );
            } else {
                setErrors(prev => ({
                    ...prev,
                    general: data.message || "Login failed"
                }));
            }

        } catch (err) {
            setErrors(prev => ({
                ...prev,
                general: "Something went wrong. Try again."
            }));
        } finally {
            setLoading(false);
        }
    }


    function HandleSignUp() {
        router.push("/home/signup");
    }


    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            HandleSignIn();
        }
    }


    return (

        <div className="w-full flex justify-center px-4">

            {/* CARD */}
            <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl border border-gray-100 p-8 md:p-10">

                {/* HEADER */}
                <div className="mb-8 text-center md:text-left flex justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Welcome Back
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Sign in to access your account
                        </p>
                    </div>
                    

                    <button
                        onClick={() => router.push("/home")}
                        className="mb-4 inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        ← Back to Homepage
                    </button>
                </div>


                {/* ERROR */}
                {errors.general && (
                    <div className="mb-4">
                        <SemanticCard semantic="error">
                            {errors.general}
                        </SemanticCard>
                    </div>
                )}


                {/* INPUTS */}
                <div className="space-y-4">

                    <Input
                        label="Username"
                        value={username}
                        onChange={(val) => {
                            setUsername(val);
                            setErrors(prev => ({
                                ...prev,
                                username: "",
                                general: ""
                            }));
                        }}
                        onKeyDown={handleKeyDown}
                        error={errors.username}
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(val) => {
                            setPassword(val);
                            setErrors(prev => ({
                                ...prev,
                                password: "",
                                general: ""
                            }));
                        }}
                        onKeyDown={handleKeyDown}
                        error={errors.password}
                    />

                </div>


                {/* BUTTON */}
                <button
                    onClick={HandleSignIn}
                    disabled={loading}
                    className={`
                        w-full mt-6 h-12 rounded-lg font-semibold text-white
                        transition-all duration-200
                        active:scale-[0.98]

                        ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-(--primary) hover:opacity-90"
                        }
                    `}
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>


                {/* SIGN UP LINK */}
                <p className="text-sm text-gray-600 mt-5 text-center">
                    Don’t have an account?
                    <button
                        onClick={HandleSignUp}
                        className="ml-2 text-(--primary) font-medium hover:underline"
                    >
                        Create one
                    </button>
                </p>

            </div>

        </div>
    );
}