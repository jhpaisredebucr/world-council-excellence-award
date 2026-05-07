"use client";

import { useMemo, useState } from "react";

export default function ContactsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    type: "idle", // idle | success | error
    message: "",
  });

  const canSubmit = useMemo(() => {
    const nameOk = form.name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const messageOk = form.message.trim().length >= 10;
    return nameOk && emailOk && messageOk;
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "idle", message: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      setStatus({
        type: "error",
        message: "Please complete the form (valid email + message at least 10 characters).",
      });
      return;
    }

    // Simple client-only handling (no backend endpoint).
    // If you later add an API route, replace this block with fetch('/api/...').
    setStatus({ type: "idle", message: "Sending..." });

    await new Promise((r) => setTimeout(r, 800));

    setStatus({
      type: "success",
      message: "Message received. We will get back to you soon.",
    });
    setForm({ name: "", email: "", message: "" });
  };

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
          .contact-form {
              opacity: 0;
              animation: fadeUp 0.6s ease forwards;
              animation-delay: 0.3s;
          }
          .quick-details {
              opacity: 0;
              animation: fadeUp 0.6s ease forwards;
              animation-delay: 0.45s;
          }
          .prefer-email {
              opacity: 0;
              animation: fadeUp 0.6s ease forwards;
              animation-delay: 0.6s;
          }
      `}</style>
      <main className="min-h-screen pb-16">
        <div className="mx-auto">
          {/* Hero Section */}
          <section className="py-16 px-4 bg-gradient-to-br from-[#5C4138] to-[#8D5D28] text-white md:min-h-90">

            <div className="max-w-3xl mx-auto text-center">
              <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="hero-sub text-lg md:text-xl text-white/90 mb-8">
                Have a question or need support? Send us a message and we&apos;ll respond as soon as possible.
              </p>
              <div className="hero-badges flex flex-wrap justify-center gap-4 text-sm">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <span className="font-bold">&lt;24hrs</span>
                      <span className="ml-2 text-white/80">Response</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <span className="font-bold">Mon–Sat</span>
                      <span className="ml-2 text-white/80">Open</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <span className="font-bold">9AM – 5PM</span>
                      <span className="ml-2 text-white/80">Hours</span>
                  </div>
              </div>
            </div>
          </section>


          <div className="px-5 md:px-40 py-5 md:py-15 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <section className="contact-form bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#5C4138]/30 focus:border-[#5C4138] transition-all duration-200"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#5C4138]/30 focus:border-[#5C4138] transition-all duration-200"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={6}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#5C4138]/30 focus:border-[#5C4138] transition-all duration-200"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  {status.type !== "idle" && (
                    <p
                      className={
                        status.type === "success"
                          ? "text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl"
                          : "text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl"
                      }
                    >
                      {status.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || status.type === "idle" && status.message === "Sending..."}
                  className="w-full py-4 rounded-xl font-bold bg-[#5C4138] text-white hover:bg-[#4a352d] hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>

                <p className="text-xs text-gray-500 leading-relaxed">
                  By sending this message, you agree that we may contact you back regarding your inquiry.
                </p>
              </form>
            </section>

            <aside className="space-y-4">
              <div className="quick-details bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-lg font-bold text-[#191c1b]">Quick Details</h2>
                <div className="mt-4 space-y-3 text-[#3f4941]">
                  <p>
                    <span className="font-semibold text-[#191c1b]">Email:</span> <a href="mailto:memonidok0217@gmail.com" className="text-blue-500 cursor-pointer">memonidok0217@gmail.com</a> 
                  </p>
                  <p>
                    <span className="font-semibold text-[#191c1b]">Facebook:</span> facebook.com
                  </p>
                  <p>
                    <span className="font-semibold text-[#191c1b]">Hours:</span> Mon–Sat, 9:00 AM–5:00 PM
                  </p>
                  <p>
                    <span className="font-semibold text-[#191c1b]">Location:</span> Philippines (online)
                  </p>
                </div>
              </div>

              <div className="prefer-email bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-bold text-[#191c1b]">Prefer email?</h3>
                <p className="mt-2 text-[#3f4941]">
                  You can also reach us directly:
                </p>
                <a
                  href="mailto:memonidok0217@gmail.com"
                  className="mt-4 inline-flex items-center justify-center w-full py-3 rounded-xl font-bold bg-[#5C4138] text-white hover:bg-[#4a352d] hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                >
                  memonidok0217@gmail.com
                </a>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

