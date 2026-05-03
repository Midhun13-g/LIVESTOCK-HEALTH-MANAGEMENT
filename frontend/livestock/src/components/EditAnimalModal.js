import React, { useState, useEffect } from "react";

const SPECIES_OPTIONS = ["Cattle", "Cow", "Pig", "Sheep", "Goat", "Horse", "Chicken"];

const SPECIES_ICON = {
  Cattle: "🐄", Cow: "🐄", Pig: "🐷", Sheep: "🐑",
  Goat: "🐐", Horse: "🐴", Chicken: "🐔",
};

const STATUS_CONFIG = {
  healthy:   { label: "Healthy",   emoji: "✅", bg: "#f0fdf4", color: "#16a34a", border: "#86efac", activeBg: "#22c55e" },
  treatment: { label: "Treatment", emoji: "⚠️", bg: "#fffbeb", color: "#d97706", border: "#fcd34d", activeBg: "#f59e0b" },
  critical:  { label: "Critical",  emoji: "🚨", bg: "#fff1f2", color: "#dc2626", border: "#fca5a5", activeBg: "#ef4444" },
};

const EditAnimalModal = ({ isOpen, onClose, animalData, onSave }) => {
  const [form, setForm]       = useState({});
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (animalData) setForm({ ...animalData });
  }, [animalData]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // double rAF ensures transition fires after mount
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const fmtDate = (d) => (d ? d.toString().slice(0, 10) : "");
  const handleSave = () => { onSave({ ...form }); onClose(); };

  if (!mounted) return null;

  const overlayStyle = {
    transition: "opacity 0.25s ease, backdrop-filter 0.25s ease",
    opacity: visible ? 1 : 0,
    backdropFilter: visible ? "blur(4px)" : "blur(0px)",
  };

  const modalStyle = {
    transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.4,0.64,1)",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.94)",
  };

  return (
    <div
      style={overlayStyle}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={modalStyle}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
              {SPECIES_ICON[form.species] || "🐾"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Edit Animal</h2>
              <p className="text-xs text-slate-400">
                Updating details for{" "}
                <span className="font-semibold text-slate-600">{form.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-bold hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Bessie"
                className="w-full h-11 px-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
              />
            </div>

            {/* Species */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Species</label>
              <select
                value={form.species || ""}
                onChange={(e) => set("species", e.target.value)}
                className="w-full h-11 px-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">Select species</option>
                {SPECIES_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Breed */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Breed</label>
              <input
                type="text"
                value={form.breed || ""}
                onChange={(e) => set("breed", e.target.value)}
                placeholder="e.g. Holstein"
                className="w-full h-11 px-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
              />
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
              <input
                type="number"
                value={form.weight || ""}
                onChange={(e) => set("weight", e.target.value)}
                placeholder="e.g. 450"
                min="0" step="0.1"
                className="w-full h-11 px-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth</label>
              <input
                type="date"
                value={fmtDate(form.dob)}
                onChange={(e) => set("dob", e.target.value)}
                className="w-full h-11 px-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Next Checkup */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Checkup</label>
              <input
                type="date"
                value={fmtDate(form.next_checkup)}
                onChange={(e) => set("next_checkup", e.target.value)}
                className="w-full h-11 px-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Health Status — full width */}
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Health Status</label>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  const isActive = form.status === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => set("status", key)}
                      style={{
                        background:   isActive ? cfg.activeBg : cfg.bg,
                        color:        isActive ? "#fff"       : cfg.color,
                        border:       `1.5px solid ${isActive ? cfg.activeBg : cfg.border}`,
                        boxShadow:    isActive ? `0 4px 14px ${cfg.activeBg}55` : "none",
                        transition:   "all 0.18s ease",
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                    >
                      <span>{cfg.emoji}</span>
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-mono text-xs shadow-sm">
              Esc
            </kbd>{" "}
            to cancel
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-md shadow-blue-200"
            >
              💾 Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditAnimalModal;
