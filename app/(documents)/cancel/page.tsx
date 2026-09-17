"use client";
import { useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
const CONTRACT_TYPES = [
  "Gym Membership",
  "Internet / Phone Contract",
  "Insurance Policy",
  "Streaming Subscription",
  "Other",
];
type FormData = {
  contractType: string;
  yourName: string;
  yourAddress: string;
  companyName: string;
  companyAddress: string;
  contractNumber: string;
  cancelDate: string;
};
export default function CancelPage() {
  const [form, setForm] = useState<FormData>({
    contractType: CONTRACT_TYPES[0],
    yourName: "",
    yourAddress: "",
    companyName: "",
    companyAddress: "",
    contractNumber: "",
    cancelDate: "",
  });
  const [letter, setLetter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit() {
    setLoading(true);
    setLetter("");
    setError("");
    try {
      const response = await fetch("/api/generate-cancellation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setLetter(data.letter || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Could not copy the letter to your clipboard.");
    }
  }
  function downloadPDF() {
    if (!letter) return;
    const doc = new jsPDF();
    const margin = 20;
    const maxWidth = 170;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(letter, maxWidth);
    let cursorY = margin;
    lines.forEach((line: string) => {
      if (cursorY > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });
    doc.save("cancellation-letter.pdf");
  }
  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {" "}
      <div className="w-full max-w-lg">
        {" "}
        {/* Header */}{" "}
        <div className="text-center mb-6">
          {" "}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-xl font-bold mb-3">
            {" "}
            K{" "}
          </div>{" "}
          <h1 className="text-2xl font-semibold text-slate-800">
            {" "}
            Cancellation Letter{" "}
          </h1>{" "}
          <p className="text-slate-500 text-sm mt-1">
            {" "}
            Fill in the details, get a properly worded German cancellation
            letter.{" "}
          </p>{" "}
          <Link
            href="/"
            className="text-teal-600 text-xs mt-2 inline-block hover:underline"
          >
            {" "}
            ← Back to Home{" "}
          </Link>{" "}
        </div>{" "}
        {/* Form */}{" "}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          {" "}
          {/* Contract type */}{" "}
          <div>
            {" "}
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              {" "}
              What are you cancelling?{" "}
            </label>{" "}
            <select
              className={inputClass}
              value={form.contractType}
              onChange={(e) => update("contractType", e.target.value)}
            >
              {" "}
              {CONTRACT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {" "}
                  {type}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>{" "}
          {/* Name + contract number */}{" "}
          <div className="grid grid-cols-2 gap-3">
            {" "}
            <div>
              {" "}
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                {" "}
                Your name{" "}
              </label>{" "}
              <input
                className={inputClass}
                value={form.yourName}
                onChange={(e) => update("yourName", e.target.value)}
                placeholder="Your full name"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                {" "}
                Contract / customer number{" "}
              </label>{" "}
              <input
                className={inputClass}
                value={form.contractNumber}
                onChange={(e) => update("contractNumber", e.target.value)}
                placeholder="Optional"
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* Your address */}{" "}
          <div>
            {" "}
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              {" "}
              Your address{" "}
            </label>{" "}
            <input
              className={inputClass}
              value={form.yourAddress}
              onChange={(e) => update("yourAddress", e.target.value)}
              placeholder="Street, house number, postcode, city"
            />{" "}
          </div>{" "}
          {/* Company name */}{" "}
          <div>
            {" "}
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              {" "}
              Company name{" "}
            </label>{" "}
            <input
              className={inputClass}
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="e.g. FitnessFirst GmbH"
            />{" "}
          </div>{" "}
          {/* Company address */}{" "}
          <div>
            {" "}
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              {" "}
              Company address (optional){" "}
            </label>{" "}
            <input
              className={inputClass}
              value={form.companyAddress}
              onChange={(e) => update("companyAddress", e.target.value)}
            />{" "}
          </div>{" "}
          {/* Cancellation date */}{" "}
          <div>
            {" "}
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              {" "}
              Cancellation date{" "}
            </label>{" "}
            <input
              className={inputClass}
              type="date"
              value={form.cancelDate}
              onChange={(e) => update("cancelDate", e.target.value)}
            />{" "}
            <p className="text-xs text-slate-400 mt-1">
              {" "}
              Leave blank to request cancellation at the earliest possible
              date.{" "}
            </p>{" "}
          </div>{" "}
          {/* Submit */}{" "}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !form.yourName.trim() || !form.companyName.trim() || loading
            }
            className="w-full bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {" "}
            {loading
              ? "Writing your letter..."
              : "Generate cancellation letter"}{" "}
          </button>{" "}
        </div>{" "}
        {/* Error */}{" "}
        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            {" "}
            {error}{" "}
          </div>
        )}{" "}
        {/* Result */}{" "}
        {letter && (
          <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-6">
            {" "}
            <div className="flex items-center justify-between mb-3 gap-3">
              {" "}
              <h3 className="text-sm font-semibold text-slate-700">
                {" "}
                Your letter{" "}
              </h3>{" "}
              <div className="flex gap-2">
                {" "}
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="text-xs font-medium text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100"
                >
                  {" "}
                  {copied ? "Copied!" : "Copy text"}{" "}
                </button>{" "}
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="text-xs font-medium text-white bg-teal-600 px-3 py-1.5 rounded-full hover:bg-teal-700"
                >
                  {" "}
                  Download PDF{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
              {" "}
              {letter}{" "}
            </pre>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </main>
  );
}
