//CLIENT COMPONENT

"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ─── Field layout constants (percentages of the form image) ─────────────────
// These map each text overlay to its position on mnd_membership_form.png
const FIELD_POSITIONS = {
  date:            { top: "10.2%", left: "68%",   width: "26%"  },
  name:            { top: "14.2%", left: "16%",   width: "38%"  },
  birthday:        { top: "14.2%", left: "63%",   width: "20%"  },
  age:             { top: "14.2%", left: "90%",   width: "8%"   },
  completeAddress: { top: "18.0%", left: "28%",   width: "66%"  },
  nationality:     { top: "21.6%", left: "18%",   width: "14%"  },
  gender:          { top: "21.6%", left: "43%",   width: "10%"  },
  cpNumber:        { top: "21.6%", left: "63%",   width: "30%"  },
  email:           { top: "25.2%", left: "12%",   width: "32%"  },
  facebook:        { top: "25.2%", left: "58%",   width: "36%"  },
  endorsedBy:      { top: "29.0%", left: "18%",   width: "26%"  },
  nominatedBy:     { top: "29.0%", left: "62%",   width: "32%"  },
  dateOfPayment:   { top: "54.5%", left: "62%",   width: "30%"  },
};

const CHECKBOX_OPTIONS = [
  { id: "membership",    label: "MEMBERSHIP",                                    price: "₱2,999"  },
  { id: "wellness",      label: "WELLNESS CERTIFICATION TRAINING (3 SESSIONS)", price: "₱12,000" },
  { id: "licenses",      label: "ASSISTANCE ON LICENSES",                        price: null      },
  { id: "franchise",     label: "FRANCHISE",                                     price: null      },
  { id: "degree",        label: "WELLNESS DEGREE",                               price: null      },
  { id: "productSeal",   label: "PRODUCT SEAL APPLICATION",                      price: "₱17,000" },
  { id: "rebranding",    label: "PRODUCT REBRANDING APPLICATION",                price: "₱17,000" },
];

const PAYMENT_MODES = [
  { id: "gcash", label: "GCash",        detail: "09184880626 – BOBBY BRIMON"  },
  { id: "bdo",   label: "BDO",          detail: "001010294375 – BANCO DE ORO" },
];

// ─── Initial form state ──────────────────────────────────────────────────────
const INITIAL = {
  date: "",  name: "", birthday: "", age: "",
  completeAddress: "", nationality: "", gender: "", cpNumber: "",
  email: "", facebook: "", endorsedBy: "", nominatedBy: "",
  dateOfPayment: "", modeOfPayment: "",
  selectedOptions: [],
};

export default function MembershipFormPage() {
  const [form,       setForm]       = useState(INITIAL);
  const [loading,    setLoading]    = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [toast,      setToast]      = useState(null); // { type: "success"|"error", msg }
  const previewRef = useRef(null);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleOption = (id) =>
    setForm((f) => ({
      ...f,
      selectedOptions: f.selectedOptions.includes(id)
        ? f.selectedOptions.filter((o) => o !== id)
        : [...f.selectedOptions, id],
    }));

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ─── Submit to API ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch("/api/membership", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        showToast("success", `Submitted! Reference ID: ${data.referenceId}`);
      } else {
        showToast("error", data.errors?.join(" ") ?? "Submission failed.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Generate PDF from the preview overlay ─────────────────────────────────
  const generatePDF = async () => {
    if (!previewRef.current) return;
    setPdfLoading(true);
    try {
      const canvas  = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png", 0.95);
      
      // Calculate proper PDF dimensions (A4 ratio)
      const pdfWidth = 210; // mm (A4 width)
      const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      // Legal document header
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      
      // Header with formal styling
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('WCEA', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Individual Membership Application Form', pageWidth / 2, 28, { align: 'center' });
      
      // Document control number and date
      pdf.setFontSize(10);
      pdf.text(`Document No: WCEA-MEM-${Date.now().toString().slice(-6)}`, margin, 40);
      pdf.text(`Date Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, pageWidth - margin, 40, { align: 'right' });
      
      // Formal line separator
      pdf.setLineWidth(0.5);
      pdf.line(margin, 45, pageWidth - margin, 45);
      
      // Add image with proper scaling and centering
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      const xOffset = margin;
      const yOffset = 55; // Start after header
      
      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
      
      // Footer
      const footerY = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page 1 of 1`, pageWidth / 2, footerY, { align: 'center' });
      
      pdf.save(`WCEA-Membership-${form.name || "Form"}-${Date.now()}.pdf`);
      showToast("success", "PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  // ─── Tiny labelled input ───────────────────────────────────────────────────
  const Field = ({ label, id, type = "text", placeholder, className = "" }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-xs font-bold text-white uppercase tracking-widest">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder ?? label}
        value={form[id]}
        onChange={set(id)}
        className="border-b-2 border-white focus:border-red-700 bg-transparent py-1.5 text-sm text-white placeholder-white outline-none transition-colors duration-200"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-(--primary) via-(--primary)/50 to-blue-950 font-sans">

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl text-white text-sm font-semibold transition-all ${
toast.type === "success" ? "bg-[var(--secondary)]" : "bg-[var(--error-color)]"
          }`}
        >
          {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 xl:grid-cols-2 gap-10">

        {/* ════════════════════════════════════════════════════════════════════
            LEFT — Input form
        ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <p className="text-red-300 text-xs font-bold tracking-[0.25em] uppercase mb-1">
              Memo Ni Dok Health Ministry Inc.
            </p>
            <h1 className="text-3xl font-black text-white leading-tight">
              Individual Membership<br />
              <span className="text-red-400">Application</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <Field label="Date" id="date" type="date" />

            {/* Personal */}
            <div className="grid grid-cols-3 gap-4">
              <Field label="Full Name"  id="name"     className="col-span-2" />
              <Field label="Age"        id="age"      type="number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Birthday"  id="birthday"  type="date" />
              <Field label="Gender"    id="gender"    placeholder="e.g. Male / Female" />
            </div>
            <Field label="Complete Address" id="completeAddress" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nationality" id="nationality" />
              <Field label="CP Number"   id="cpNumber"    type="tel" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email"    id="email"    type="email" />
              <Field label="Facebook" id="facebook" placeholder="FB profile name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Endorsed By"  id="endorsedBy"  />
              <Field label="Nominated By" id="nominatedBy" />
            </div>

            {/* Options */}
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">
                Check &amp; Choose
              </p>
              <div className="space-y-2">
                {CHECKBOX_OPTIONS.map(({ id, label, price }) => (
                  <label
                    key={id}
className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 bg-[var(--background)] ${
                      form.selectedOptions.includes(id)
                        ? "border-[var(--primary)] bg-[var(--primary)]/5"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.selectedOptions.includes(id)}
                      onChange={() => toggleOption(id)}
className="accent-[var(--primary)] w-4 h-4"
                    />
                    <span className="text-sm text-white font-medium flex-1">{label}</span>
                    {price && (
                      <span className="text-xs font-bold text-red-400">{price}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">
                Mode of Payment
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_MODES.map(({ id, label, detail }) => (
                  <label
                    key={id}
className={`flex flex-col gap-0.5 p-3 rounded-xl cursor-pointer border transition-all duration-200 bg-[var(--background)] ${
                      form.modeOfPayment === id
                        ? "border-[var(--secondary)] bg-[var(--secondary)]/5"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="modeOfPayment"
                      value={id}
                      checked={form.modeOfPayment === id}
                      onChange={set("modeOfPayment")}
                      className="sr-only"
                    />
                    <span className="text-sm font-bold text-white">{label}</span>
                    <span className="text-xs text-white ">{detail}</span>
                  </label>
                ))}
              </div>
            </div>

            <Field label="Date of Payment" id="dateOfPayment" type="date" />

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
className="flex-1 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary)] via-[var(--primary)]/90 to-[var(--primary)]/70 hover:from-[var(--primary)]/90 hover:to-[var(--primary)]/80 disabled:opacity-50 transition-all shadow-lg shadow-[var(--primary)]/25"
              >
                {loading ? "Submitting…" : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={generatePDF}
                disabled={pdfLoading}
className="flex-1 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-br from-[var(--secondary)] via-[var(--secondary)]/90 to-[var(--secondary)]/70 hover:from-[var(--secondary)]/90 hover:to-[var(--secondary)]/80 disabled:opacity-50 transition-all shadow-lg shadow-[var(--secondary)]/25"
              >
                {pdfLoading ? "Generating…" : "⬇ Download PDF"}
              </button>
            </div>
          </form>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT — Live PDF preview (form image + overlaid text)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-4">
          <p className="text-white/50 text-xs text-center uppercase tracking-widest">
            Live Preview — exactly what will be exported as PDF
          </p>

          {/* Wrapper — keeps the image as the sizing reference */}
          <div
            ref={previewRef}
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{ lineHeight: 1 }}
          >
            {/* Background: the membership form image */}
            <img
              src="/images/forms/mnd_membership_form.png"
              alt="Memo Ni Dok Membership Form"
              className="w-full h-auto block"
              crossOrigin="anonymous"
            />

            {/* ── Overlaid text fields ── */}
            {Object.entries(FIELD_POSITIONS).map(([key, pos]) => {
              let display = form[key] ?? "";
              // Format dates nicely for display
              if (display && (key === "date" || key === "birthday" || key === "dateOfPayment")) {
                try {
                  display = new Date(display).toLocaleDateString("en-PH", {
                    year: "numeric", month: "short", day: "numeric",
                  });
                } catch {}
              }
              return (
                <div
                  key={key}
                  style={{
                    position: "absolute",
                    top:      pos.top,
                    left:     pos.left,
                    width:    pos.width,
                    fontSize: "1.35%",        // scales with container width
                    lineHeight: "1.1",
color:    "#000000",           // Ensure black text for PDF
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    border: "none",           // Remove any borders
                    padding: "0",
                    margin: "0",
                    boxSizing: "border-box",
                  }}
                >
                  {display}
                </div>
              );
            })}

            {/* ── Checkbox overlays ── */}
            {CHECKBOX_OPTIONS.map(({ id }, idx) => (
              <div
                key={id}
                style={{
                  position: "absolute",
                  top:  `${67.5 + idx * 3.55}%`,
                  left: "3.2%",
                  width: "3%",
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6%",
                  color: "#b91c1c",
                  fontWeight: "900",
                }}
              >
                {form.selectedOptions.includes(id) ? "✓" : ""}
              </div>
            ))}
          </div>

         
        </div>
      </div>
    </div>
  );
}