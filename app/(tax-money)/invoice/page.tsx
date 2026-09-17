"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { inputClass } from "@/lib/styles";
import jsPDF from "jspdf";

const emptyItem = () => ({ description: "", quantity: "1", unitPrice: "" });

export default function InvoicePage() {
  const [isKleinunternehmer, setIsKleinunternehmer] = useState(true);
  const [vatRate, setVatRate] = useState("19");

  const [yourName, setYourName] = useState("");
  const [yourAddress, setYourAddress] = useState("");
  const [yourTaxId, setYourTaxId] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState(
    `${new Date().getFullYear()}-001`,
  );
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [serviceDate, setServiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dueInDays, setDueInDays] = useState("14");

  const [items, setItems] = useState([emptyItem()]);

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };
  const addItem = () => setItems([...items, emptyItem()]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const netTotal = items.reduce(
    (sum, item) =>
      sum +
      (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
    0,
  );
  const vatAmount = isKleinunternehmer
    ? 0
    : netTotal * (parseFloat(vatRate) / 100);
  const grossTotal = netTotal + vatAmount;

  const fmt = (n) =>
    n.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = 210;
    let y = margin;

    doc.setFontSize(10);
    doc.text(yourName, margin, y);
    doc.text(yourAddress, pageWidth - margin, y, { align: "right" });
    y += 5;
    const yourAddressLines = yourAddress.split("\n");
    yourAddressLines.slice(1).forEach((line) => {
      doc.text(line, pageWidth - margin, y, { align: "right" });
      y += 5;
    });

    y += 10;
    doc.text("Rechnungsempfänger:", margin, y);
    y += 5;
    clientAddress.split("\n").forEach((line, i) => {
      doc.text(i === 0 ? clientName : line, margin, y);
      y += 5;
      if (i === 0) {
        clientAddress.split("\n").forEach((l) => {
          doc.text(l, margin, y);
          y += 5;
        });
      }
    });

    y = margin + 40;
    doc.setFontSize(16);
    doc.text("Rechnung", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Rechnungsnummer: ${invoiceNumber}`, margin, y);
    y += 5;
    doc.text(
      `Rechnungsdatum: ${new Date(invoiceDate).toLocaleDateString("de-DE")}`,
      margin,
      y,
    );
    y += 5;
    doc.text(
      `Leistungsdatum: ${new Date(serviceDate).toLocaleDateString("de-DE")}`,
      margin,
      y,
    );
    y += 5;
    doc.text(`Steuernummer/USt-IdNr.: ${yourTaxId}`, margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.text("Beschreibung", margin, y);
    doc.text("Menge", 120, y);
    doc.text("Einzelpreis", 145, y);
    doc.text("Gesamt", 175, y);
    y += 2;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    items.forEach((item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const lineTotal = qty * price;
      doc.text(item.description, margin, y, { maxWidth: 90 });
      doc.text(String(qty), 120, y);
      doc.text(fmt(price), 145, y);
      doc.text(fmt(lineTotal), 175, y);
      y += 7;
    });

    y += 3;
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.text(`Nettobetrag: ${fmt(netTotal)}`, pageWidth - margin, y, {
      align: "right",
    });
    y += 6;
    if (isKleinunternehmer) {
      doc.text("Gemäß §19 UStG wird keine Umsatzsteuer berechnet.", margin, y);
      y += 6;
    } else {
      doc.text(
        `zzgl. ${vatRate}% USt: ${fmt(vatAmount)}`,
        pageWidth - margin,
        y,
        { align: "right" },
      );
      y += 6;
    }
    doc.setFontSize(12);
    doc.text(`Gesamtbetrag: ${fmt(grossTotal)}`, pageWidth - margin, y, {
      align: "right",
    });
    y += 15;

    doc.setFontSize(10);
    doc.text(
      `Bitte überweisen Sie den Betrag innerhalb von ${dueInDays} Tagen auf folgendes Konto:`,
      margin,
      y,
    );
    y += 6;
    doc.text(`IBAN: ${iban}`, margin, y);
    y += 5;
    doc.text(`BIC: ${bic}`, margin, y);

    doc.save(`Rechnung-${invoiceNumber}.pdf`);
  };

  return (
    <PageShell
      title="Freelancer Invoice Generator"
      description="Fill in the details, get a properly formatted German invoice as a PDF."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">Your details</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your name / business name
          </label>
          <input
            type="text"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your address
          </label>
          <textarea
            value={yourAddress}
            onChange={(e) => setYourAddress(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your Steuernummer or USt-IdNr.
          </label>
          <input
            type="text"
            value={yourTaxId}
            onChange={(e) => setYourTaxId(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="kleinunternehmer"
            checked={isKleinunternehmer}
            onChange={(e) => setIsKleinunternehmer(e.target.checked)}
          />
          <label htmlFor="kleinunternehmer" className="text-sm text-slate-700">
            I have Kleinunternehmer status (no VAT charged)
          </label>
        </div>

        {!isKleinunternehmer && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              VAT rate
            </label>
            <select
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              className={inputClass}
            >
              <option value="19">19% (standard rate)</option>
              <option value="7">7% (reduced rate)</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              IBAN
            </label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              BIC
            </label>
            <input
              type="text"
              value={bic}
              onChange={(e) => setBic(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">Client details</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Client name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Client address
          </label>
          <textarea
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Invoice details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Invoice number
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment due (days)
            </label>
            <input
              type="number"
              value={dueInDays}
              onChange={(e) => setDueInDays(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Invoice date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service date
            </label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Line items</h3>
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-6">
              <label className="block text-xs text-slate-500 mb-1">
                Description
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Qty</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs text-slate-500 mb-1">
                Unit price (€)
              </label>
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-1">
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(i)}
                  className="text-red-400 hover:text-red-600 text-sm pb-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          + Add line item
        </button>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Net total</span>
            <span className="text-slate-800 font-medium">{fmt(netTotal)}</span>
          </div>
          {!isKleinunternehmer && (
            <div className="flex justify-between">
              <span className="text-slate-500">VAT ({vatRate}%)</span>
              <span className="text-slate-800 font-medium">
                {fmt(vatAmount)}
              </span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold">
            <span className="text-slate-800">Total</span>
            <span className="text-teal-700">{fmt(grossTotal)}</span>
          </div>
        </div>
      </div>

      <button onClick={downloadPDF} className={`${buttonClass} mt-4`}>
        Download invoice as PDF
      </button>
    </PageShell>
  );
}
