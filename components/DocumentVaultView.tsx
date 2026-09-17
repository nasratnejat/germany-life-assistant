"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PageShell from "@/components/PageShell";
import { inputClass, buttonClass } from "@/lib/styles";
import {
  FileClock,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
} from "lucide-react";

const SUGGESTED_TYPES = [
  "Passport (Reisepass)",
  "Residence Permit (Aufenthaltstitel)",
  "ID Card (Personalausweis)",
  "Liability Insurance",
  "Health Insurance Card",
  "Driving License",
  "Visa",
  "Other",
];

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function statusFor(days) {
  if (days < 0)
    return { label: "Expired", color: "text-red-700 bg-red-50 border-red-200" };
  if (days <= 30)
    return {
      label: "Expiring soon",
      color: "text-amber-700 bg-amber-50 border-amber-200",
    };
  return {
    label: "Valid",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  };
}

export default function DocumentVaultView({ initialDocs }) {
  const supabase = createClient();
  const [docs, setDocs] = useState(initialDocs);
  const [name, setName] = useState("");
  const [type, setType] = useState(SUGGESTED_TYPES[0]);
  const [expiry, setExpiry] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function addDoc(e) {
    e.preventDefault();
    if (!name.trim() || !expiry) return;
    setSaving(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let filePath = null;

    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file);
      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      filePath = path;
    }

    const { data, error } = await supabase
      .from("documents")
      .insert({
        name: name.trim(),
        type,
        expiry,
        user_id: user.id,
        file_path: filePath,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      setDocs((prev) => [...prev, data]);
      setName("");
      setExpiry("");
      setFile(null);
    }
    setSaving(false);
  }

  async function removeDoc(id, filePath) {
    const prevDocs = docs;
    setDocs((p) => p.filter((d) => d.id !== id));

    if (filePath) {
      await supabase.storage.from("documents").remove([filePath]);
    }

    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) {
      setError(error.message);
      setDocs(prevDocs);
    }
  }

  async function viewFile(filePath) {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 60);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    } else if (error) {
      setError(error.message);
    }
  }

  const groupedDocs = SUGGESTED_TYPES.map((groupType) => ({
    type: groupType,
    docs: docs
      .filter((d) => d.type === groupType)
      .sort((a, b) => new Date(a.expiry) - new Date(b.expiry)),
  })).filter((group) => group.docs.length > 0);

  return (
    <PageShell
      icon={<FileClock />}
      title="Document Expiry Vault"
      description="Track your passport, visa, insurance and ID expiry dates so nothing catches you off guard."
    >
      <form
        onSubmit={addDoc}
        className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 space-y-3"
      >
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            Document name
          </label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My passport"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Type
            </label>
            <select
              className={inputClass}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {SUGGESTED_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Expiry date
            </label>
            <input
              type="date"
              className={inputClass}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            Attach a scan/photo (optional)
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-slate-600"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button type="submit" className={buttonClass} disabled={saving}>
          {saving ? "Saving..." : "Add document"}
        </button>
      </form>

      {docs.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No documents tracked yet — add your first one above.
        </p>
      ) : (
        <div className="space-y-6">
          {groupedDocs.map((group) => (
            <div key={group.type}>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                {group.type} · {group.docs.length}
              </h2>
              <div className="space-y-3">
                {group.docs.map((doc) => {
                  const days = daysUntil(doc.expiry);
                  const status = statusFor(days);
                  return (
                    <div
                      key={doc.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate flex items-center gap-1.5">
                          {doc.name}
                          {doc.file_path && (
                            <button
                              onClick={() => viewFile(doc.file_path)}
                              className="text-teal-600 hover:text-teal-700"
                              aria-label="View attached file"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          expires {new Date(doc.expiry).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${status.color} flex items-center gap-1`}
                        >
                          {days <= 30 ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          {status.label}
                          {days >= 0
                            ? ` · ${days}d`
                            : ` · ${Math.abs(days)}d ago`}
                        </span>
                        <button
                          onClick={() => removeDoc(doc.id, doc.file_path)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
