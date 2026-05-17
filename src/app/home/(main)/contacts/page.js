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
          <section className="py-20 px-4 bg-wcea-animated text-white md:min-h-90 relative overflow-hidden">
            {/* Animated gradient particles */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#c49a6c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }} />
            </div>

            <div className="max-w-3xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13l-4.5-2.5L8 15l1-4.5L5 7l4.5-.5L12 3l2.5 3.5L19 7l-4 3.5 1 4.5z"/></svg>
                <span>Get In Touch</span>
              </div>
              <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="hero-sub text-lg md:text-xl text-white/90 mb-8">
                Have a question or need support? Send us a message and we'll respond as soon as possible.
              </p>
              <div className="hero-badges flex flex-wrap justify-center gap-4 text-sm">
                  <div className="glass-wcea px-4 py-2 rounded-lg">
                      <span className="font-bold">{'<24hrs'}</span>
                      <span className="ml-2 text-white/80">Response</span>
                  </div>
                  <div className="glass-wcea px-4 py-2 rounded-lg">
                      <span className="font-bold">Mon–Sat</span>
                      <span className="ml-2 text-white/80">Open</span>
                  </div>
                  <div className="glass-wcea px-4 py-2 rounded-lg">
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
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#8D5D28]/30 focus:border-[#8D5D28] transition-all duration-200"
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
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#8D5D28]/30 focus:border-[#8D5D28] transition-all duration-200"
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
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#8D5D28]/30 focus:border-[#8D5D28] transition-all duration-200"
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
                  className="w-full py-4 rounded-xl font-bold btn-wcea disabled:opacity-50 disabled:cursor-not-allowed"
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
                <h2 className="text-lg font-bold text-wcea-gradient">Quick Details</h2>
                <div className="mt-4 space-y-3 text-[#3f4941]">
                  <p>
                    <span className="font-semibold text-[#191c1b]">Email:</span> <a href="mailto:wceaministryinc17@gmail.com" className="text-[#8D5D28] cursor-pointer hover:text-[#5C4138]">wceaministryinc17@gmail.com</a> 
                  </p>
                  <p>
                    <span className="font-semibold text-[#191c1b]">Facebook:</span> <a href="https://www.facebook.com/WCEAMinistry17" target="_blank" className="text-[#8D5D28] cursor-pointer hover:text-[#5C4138]">World Council Excellence Awards Ministry Inc</a>
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
                <h3 className="text-lg font-bold text-wcea-gradient">Prefer email?</h3>
                <p className="mt-2 text-[#3f4941]">
                  You can also reach us directly:
                </p>
                <a
                  href="mailto:memonidok0217@gmail.com"
                  className="mt-4 inline-flex items-center justify-center w-full py-3 rounded-xl font-bold btn-wcea"
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