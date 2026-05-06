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
    <div className="bg-background text-foreground">
      <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#191c1b]">
              Contact Us
            </h1>
            <p className="mt-4 text-[#3f4941] text-lg">
              Have a question or need support? Send us a message and we’ll respond as soon as possible.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
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
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#5C4138]/30"
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
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#5C4138]/30"
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
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#5C4138]/30"
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
                  className="w-full py-4 rounded-xl font-bold bg-[#5C4138] text-white hover:bg-[#4a352d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>

                <p className="text-xs text-gray-500 leading-relaxed">
                  By sending this message, you agree that we may contact you back regarding your inquiry.
                </p>
              </form>
            </section>

            <aside className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#191c1b]">Quick Details</h2>
                <div className="mt-4 space-y-3 text-[#3f4941]">
                  <p>
                    <span className="font-semibold text-[#191c1b]">Email:</span> support@example.com
                  </p>
                  <p>
                    <span className="font-semibold text-[#191c1b]">Hours:</span> Mon–Sat, 9:00 AM–5:00 PM
                  </p>
                  <p>
                    <span className="font-semibold text-[#191c1b]">Location:</span> Philippines (online)
                  </p>
                </div>
              </div>

              <div className="bg-[var(--primary)/10] border border-[var(--primary)/20] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#191c1b]">Prefer email?</h3>
                <p className="mt-2 text-[#3f4941]">
                  You can also reach us directly:
                </p>
                <a
                  href="mailto:support@example.com"
                  className="mt-4 inline-flex items-center justify-center w-full py-3 rounded-xl font-bold bg-white border border-gray-200 hover:bg-gray-50"
                >
                  support@example.com
                </a>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

