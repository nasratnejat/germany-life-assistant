'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const CATEGORIES = ['ID Card', 'Insurance Card', 'Vaccination Record', 'Driver\'s License', 'Other'];
const STORAGE_KEY = 'klar_documents';

function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDocuments(JSON.parse(stored));
    } catch (e) {
      console.error('Could not load documents:', e);
    }
  }, []);

  function saveToStorage(docs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
      setError('');
    } catch (e) {
      setError('Storage is full — try deleting an older document first.');
    }
  }

  function handleFileChange(selectedFile) {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function handleAdd() {
    if (!file || !name) return;
    try {
      const compressedDataUrl = await compressImage(file);
      const newDoc = {
        id: Date.now().toString(),
        name,
        category,
        image: compressedDataUrl,
        dateAdded: new Date().toLocaleDateString('en-GB'),
      };
      const updated = [newDoc, ...documents];
      setDocuments(updated);
      saveToStorage(updated);
      setName('');
      setFile(null);
      setPreview(null);
    } catch (e) {
      setError('Could not process that image.');
    }
  }

  function handleDelete(id) {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    saveToStorage(updated);
    if (viewing?.id === id) setViewing(null);
  }

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-xl font-bold mb-3">K</div>
          <h1 className="text-2xl font-semibold text-slate-800">Document Storage</h1>
          <p className="text-slate-500 text-sm mt-1">Scan and keep your important documents on this device.</p>
          <Link href="/" className="text-teal-600 text-xs mt-2 inline-block hover:underline">← Back to Home</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Document name</label>
            <input className={inputClass} placeholder="e.g. My ID Card" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Category</label>
            <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {!preview ? (
            <label
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl h-32 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
            >
              <p className="text-sm text-slate-500"><span className="text-teal-600 font-medium">Click to scan / upload</span></p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files[0])} />
            </label>
          ) : (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-32 object-contain rounded-xl bg-slate-100" />
              <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-slate-500 hover:text-slate-800">✕</button>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!file || !name}
            className="w-full bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Save document
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>
        )}

        {documents.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-3">
                <img
                  src={doc.image}
                  alt={doc.name}
                  onClick={() => setViewing(doc)}
                  className="w-full h-24 object-cover rounded-lg bg-slate-100 cursor-pointer"
                />
                <p className="text-xs font-medium text-slate-800 mt-2 truncate">{doc.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{doc.category}</span>
                  <button onClick={() => handleDelete(doc.id)} className="text-slate-400 hover:text-red-500 text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {documents.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-6">No documents saved yet.</p>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          Documents are stored only on this device, in this browser — nothing is uploaded anywhere.
        </p>
      </div>

      {viewing && (
        <div
          onClick={() => setViewing(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
        >
          <div className="bg-white rounded-2xl p-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-slate-800">{viewing.name}</p>
              <button onClick={() => setViewing(null)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>
            <img src={viewing.image} alt={viewing.name} className="w-full rounded-lg" />
          </div>
        </div>
      )}
    </main>
  );
}