"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Upload, X, Trash2, AlertTriangle } from "lucide-react";

interface StoredDocument {
  id: string;
  name: string;
  category: string;
  image: string;
  dateAdded: string;
}

const CATEGORIES = [
  "ID Card",
  "Insurance Card",
  "Vaccination Record",
  "Driver's License",
  "Other",
];
const STORAGE_KEY = "klar_documents";

function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.7,
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

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [viewing, setViewing] = useState<StoredDocument | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDocuments(JSON.parse(stored));
    } catch (e) {
      console.error("Could not load documents:", e);
    }
  }, []);

  function saveToStorage(docs: StoredDocument[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
      setError("");
    } catch (e) {
      setError("Storage is full — try deleting an older document first.");
    }
  }

  function handleFileChange(selectedFile: File | null | undefined) {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function handleAdd() {
    if (!file || !name) return;
    try {
      const compressedDataUrl = await compressImage(file);
      const newDoc: StoredDocument = {
        id: Date.now().toString(),
        name,
        category,
        image: compressedDataUrl,
        dateAdded: new Date().toLocaleDateString("en-GB"),
      };
      const updated = [newDoc, ...documents];
      setDocuments(updated);
      saveToStorage(updated);
      setName("");
      setFile(null);
      setPreview(null);
    } catch (e) {
      setError("Could not process that image.");
    }
  }

  function confirmDelete(id: string) {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    saveToStorage(updated);
    if (viewing?.id === id) setViewing(null);
    setConfirmDeleteId(null);
  }

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";

  const docPendingDelete = documents.find((d) => d.id === confirmDeleteId);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-xl font-bold mb-3">
            K
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Document Storage
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Scan and keep your important documents on this device.
          </p>
          <Link
            href="/"
            className="text-teal-600 text-xs mt-2 inline-block hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          {/* Upload — left column */}
          <div className="lg:sticky lg:top-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Add a document
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Document name
              </label>
              <input
                className={inputClass}
                placeholder="e.g. My ID Card"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Category
              </label>
              <select
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {!preview ? (
              <label
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl h-36 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-teal-500" />
                <p className="text-sm text-slate-500 text-center px-4">
                  <span className="text-teal-600 font-medium">
                    Click to scan / upload
                  </span>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-36 object-contain rounded-xl bg-slate-100"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={!file || !name}
              className="w-full bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Save document
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center pt-1">
              Stored only on this device — nothing is uploaded anywhere.
            </p>
          </div>

          {/* Documents — right column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Your documents
              </h2>
              {documents.length > 0 && (
                <span className="text-xs text-slate-400">
                  {documents.length} saved
                </span>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <p className="text-sm text-slate-400">
                  No documents saved yet — add your first one on the left.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="group bg-white border border-slate-200 rounded-2xl p-3 hover:shadow-md hover:border-teal-300 transition-all"
                  >
                    <div className="relative">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        onClick={() => setViewing(doc)}
                        className="w-full h-28 object-cover rounded-lg bg-slate-100 cursor-pointer"
                      />
                      <button
                        onClick={() => setConfirmDeleteId(doc.id)}
                        aria-label={`Delete ${doc.name}`}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-medium text-slate-800 mt-2 truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full truncate">
                        {doc.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">
                        {doc.dateAdded}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image viewer */}
      {viewing && (
        <div
          onClick={() => setViewing(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
        >
          <div
            className="bg-white rounded-2xl p-4 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-slate-800">
                {viewing.name}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmDeleteId(viewing.id)}
                  className="text-slate-400 hover:text-red-500"
                  aria-label="Delete document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewing(null)}
                  className="text-slate-400 hover:text-slate-800"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <img
              src={viewing.image}
              alt={viewing.name}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {docPendingDelete && (
        <div
          onClick={() => setConfirmDeleteId(null)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-[60]"
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
              &quot;{docPendingDelete.name}&quot; will be permanently removed
              from this device. This can&apos;t be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(docPendingDelete.id)}
                className="flex-1 bg-red-500 text-white font-medium py-2.5 rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
