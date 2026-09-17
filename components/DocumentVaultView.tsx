"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import PageShell from "@/components/PageShell";
import { inputClass, buttonClass } from "@/lib/styles";
import {
  FileClock,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  X,
  FileText,
} from "lucide-react";

interface StoredDocument {
  id: string;
  name: string;
  type: string;
  expiry: string | null;
  file_path: string | null;
}

const SUGGESTED_TYPES = [
  "Passport (Reisepass)",
  "Residence Permit (Aufenthaltstitel)",
  "ID Card (Personalausweis)",
  "Liability Insurance",
  "Health Insurance Card",
  "Vaccination Record",
  "Driving License",
  "Visa",
  "Other",
];

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function statusFor(days: number | null) {
  if (days === null)
    return {
      label: "No expiry tracked",
      color: "text-slate-500 bg-slate-50 border-slate-200",
    };
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

function isImagePath(path: string | null) {
  if (!path) return false;
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(path);
}

function compressImage(
  file: File,
  maxWidth = 1000,
  quality = 0.75,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = (e.target?.result as string) || "";
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DocumentVaultView({
  initialDocs,
}: {
  initialDocs: StoredDocument[];
}) {
  const supabase = createClient();
  const [docs, setDocs] = useState<StoredDocument[]>(initialDocs);
  const [name, setName] = useState("");
  const [type, setType] = useState(SUGGESTED_TYPES[0]);
  const [expiry, setExpiry] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDeleteDoc, setConfirmDeleteDoc] =
    useState<StoredDocument | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  // Fetch small preview thumbnails for any documents with an image attached
  useEffect(() => {
    const imageDocs = docs.filter(
      (d) => d.file_path && isImagePath(d.file_path) && !thumbnails[d.id],
    );
    if (imageDocs.length === 0) return;

    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        imageDocs.map(async (d) => {
          const { data } = await supabase.storage
            .from("documents")
            .createSignedUrl(d.file_path!, 3600);
          return [d.id, data?.signedUrl ?? null] as const;
        }),
      );
      if (cancelled) return;
      setThumbnails((prev) => {
        const next = { ...prev };
        for (const [id, url] of entries) {
          if (url) next[id] = url;
        }
        return next;
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs]);

  async function handleFileChange(selectedFile: File | null | undefined) {
    if (!selectedFile) return;
    setError("");
    if (selectedFile.type.startsWith("image/")) {
      try {
        const compressedDataUrl = await compressImage(selectedFile);
        const blob = await (await fetch(compressedDataUrl)).blob();
        const compressedFile = new File(
          [blob],
          selectedFile.name.replace(/\.[^.]+$/, "") + ".jpg",
          { type: "image/jpeg" },
        );
        setFile(compressedFile);
        setPreview(compressedDataUrl);
        setFileLabel(selectedFile.name);
      } catch {
        setError("Could not process that image.");
      }
    } else {
      setFile(selectedFile);
      setPreview(null);
      setFileLabel(selectedFile.name);
    }
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    setFileLabel("");
  }

  async function addDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in.");
      setSaving(false);
      return;
    }

    let filePath: string | null = null;

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
        expiry: expiry || null,
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
      clearFile();
    }
    setSaving(false);
  }

  async function performDelete(doc: StoredDocument) {
    const prevDocs = docs;
    setDocs((p) => p.filter((d) => d.id !== doc.id));
    setConfirmDeleteDoc(null);

    if (doc.file_path) {
      await supabase.storage.from("documents").remove([doc.file_path]);
    }

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", doc.id);
    if (error) {
      setError(error.message);
      setDocs(prevDocs);
    }
  }

  async function viewFile(filePath: string) {
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
      .sort((a, b) => {
        if (!a.expiry && !b.expiry) return 0;
        if (!a.expiry) return 1;
        if (!b.expiry) return -1;
        return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
      }),
  })).filter((group) => group.docs.length > 0);

  const needsAttention = docs.filter((d) => {
    const days = daysUntil(d.expiry);
    return days !== null && days <= 30;
  });
  const expiredCount = needsAttention.filter(
    (d) => (daysUntil(d.expiry) ?? 0) < 0,
  ).length;
  const soonCount = needsAttention.length - expiredCount;

  return (
    <PageShell
      icon={<FileClock />}
      title="My Documents"
      description="Store your documents and track passport, visa, insurance and ID expiry dates so nothing catches you off guard."
      wide
    >
      {needsAttention.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">
              {needsAttention.length} document
              {needsAttention.length > 1 ? "s" : ""} need attention:
            </span>{" "}
            {expiredCount > 0 && `${expiredCount} expired`}
            {expiredCount > 0 && soonCount > 0 && ", "}
            {soonCount > 0 && `${soonCount} expiring within 30 days`}.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        <form
          onSubmit={addDoc}
          className="lg:sticky lg:top-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-3"
        >
          <h2 className="text-sm font-semibold text-slate-800">
            Add a document
          </h2>

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
              Expiry date (optional)
            </label>
            <input
              type="date"
              className={inputClass}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Attach a scan/photo (optional)
            </label>
            {!file ? (
              <label className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-slate-300 rounded-xl h-24 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
                <Upload className="w-4 h-4 text-teal-500" />
                <span className="text-xs text-teal-600 font-medium">
                  Click to upload
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
              </label>
            ) : (
              <div className="relative border border-slate-200 rounded-xl p-2 flex items-center gap-2">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <span className="text-xs text-slate-600 truncate flex-1">
                  {fileLabel}
                </span>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-slate-400 hover:text-red-500 flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            className={buttonClass}
            disabled={saving || !name.trim()}
          >
            {saving ? "Saving..." : "Add document"}
          </button>

          <p className="text-[11px] text-slate-400 text-center pt-1">
            Attached scans are stored privately in your account.
          </p>
        </form>

        <div>
          {docs.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
              <p className="text-sm text-slate-500">
                No documents tracked yet — add your first one on the left.
              </p>
            </div>
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
                      const hasImage = isImagePath(doc.file_path);
                      return (
                        <div
                          key={doc.id}
                          className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {doc.file_path ? (
                              hasImage ? (
                                <button
                                  type="button"
                                  onClick={() => viewFile(doc.file_path!)}
                                  className="flex-shrink-0"
                                  aria-label="View attached image"
                                >
                                  {thumbnails[doc.id] ? (
                                    <img
                                      src={thumbnails[doc.id]}
                                      alt={doc.name}
                                      className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                                    />
                                  ) : (
                                    <div className="w-11 h-11 rounded-lg bg-slate-100 animate-pulse" />
                                  )}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => viewFile(doc.file_path!)}
                                  className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                  aria-label="View attached file"
                                >
                                  <FileText className="w-5 h-5" />
                                </button>
                              )
                            ) : null}

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {doc.expiry
                                  ? `expires ${new Date(doc.expiry).toLocaleDateString()}`
                                  : "no expiry date set"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full border ${status.color} flex items-center gap-1`}
                            >
                              {days === null ? null : days <= 30 ? (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              {status.label}
                              {days !== null &&
                                (days >= 0
                                  ? ` · ${days}d`
                                  : ` · ${Math.abs(days)}d ago`)}
                            </span>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteDoc(doc)}
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
        </div>
      </div>

      {confirmDeleteDoc && (
        <div
          onClick={() => setConfirmDeleteDoc(null)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Delete this document?
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              &quot;{confirmDeleteDoc.name}&quot; will be permanently removed,
              including its attached file if any. This can&apos;t be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDeleteDoc(null)}
                className="flex-1 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => performDelete(confirmDeleteDoc)}
                className="flex-1 bg-red-500 text-white font-medium py-2.5 rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
