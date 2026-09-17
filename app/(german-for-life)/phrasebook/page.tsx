"use client";

import { useState } from "react";
import PageShell from "../../components/PageShell";
import SearchList from "../../components/SearchList";

const CATEGORIES = [
  "All",
  "Residence & Visa",
  "Housing",
  "Tax & Money",
  "Health & Insurance",
  "Employment",
  "Everyday",
];

const TERMS = [
  {
    term: "Anmeldung",
    category: "Residence & Visa",
    meaning:
      "Registering your address with the local citizens' office. You must do this within 14 days of moving.",
    example: "Ich möchte mich anmelden.",
    translation: "I would like to register my address.",
  },
  {
    term: "Abmeldung",
    category: "Residence & Visa",
    meaning:
      "Deregistering your address — needed if you move abroad or leave Germany for good.",
    example: "Ich melde mich zum 1. Oktober ab.",
    translation: "I am deregistering as of October 1st.",
  },
  {
    term: "Aufenthaltstitel",
    category: "Residence & Visa",
    meaning:
      "General term for a residence permit that allows a non-EU citizen to stay in Germany.",
    example: "Mein Aufenthaltstitel läuft im Dezember ab.",
    translation: "My residence permit expires in December.",
  },
  {
    term: "Aufenthaltserlaubnis",
    category: "Residence & Visa",
    meaning:
      "A temporary residence permit, usually tied to a purpose like work or study.",
    example:
      "Ich habe eine Aufenthaltserlaubnis zum Zweck der Erwerbstätigkeit.",
    translation: "I have a residence permit for the purpose of employment.",
  },
  {
    term: "Niederlassungserlaubnis",
    category: "Residence & Visa",
    meaning:
      "A permanent settlement permit with no expiry date — the long-term goal for many immigrants.",
    example: "Nach 5 Jahren kann man eine Niederlassungserlaubnis beantragen.",
    translation:
      "After 5 years you can apply for a permanent settlement permit.",
  },
  {
    term: "Fiktionsbescheinigung",
    category: "Residence & Visa",
    meaning:
      "A temporary paper proving your permit application is still being processed, so you can stay legally in the meantime.",
    example: "Die Fiktionsbescheinigung gilt bis zur Entscheidung.",
    translation: "The fictional certificate is valid until a decision is made.",
  },
  {
    term: "Ausländerbehörde",
    category: "Residence & Visa",
    meaning:
      "The foreigners' office — handles visas, residence permits, and everything related to non-German citizens.",
    example: "Ich habe einen Termin bei der Ausländerbehörde.",
    translation: "I have an appointment at the foreigners' office.",
  },
  {
    term: "Bürgeramt",
    category: "Residence & Visa",
    meaning:
      "The citizens' office where you register your address, get your ID, and handle general local admin.",
    example: "Termine beim Bürgeramt sind oft Wochen im Voraus ausgebucht.",
    translation:
      "Appointments at the citizens' office are often booked out weeks in advance.",
  },
  {
    term: "Meldebescheinigung",
    category: "Residence & Visa",
    meaning:
      "A registration certificate — official proof of your registered address, often needed for banks, insurance, etc.",
    example: "Für das Konto brauche ich eine Meldebescheinigung.",
    translation: "I need a registration certificate for the bank account.",
  },
  {
    term: "Mietvertrag",
    category: "Housing",
    meaning: "The rental contract between you and your landlord.",
    example: "Bitte unterschreiben Sie den Mietvertrag hier.",
    translation: "Please sign the rental contract here.",
  },
  {
    term: "Kaution",
    category: "Housing",
    meaning:
      "The security deposit, usually up to 3 months' cold rent, paid before moving in.",
    example: "Die Kaution beträgt drei Monatsmieten.",
    translation: "The deposit is three months' rent.",
  },
  {
    term: "Nebenkosten",
    category: "Housing",
    meaning:
      "Additional costs on top of rent — heating, water, building maintenance, etc.",
    example: "Die Nebenkosten sind im Mietpreis nicht enthalten.",
    translation: "The additional costs are not included in the rent price.",
  },
  {
    term: "Nebenkostenabrechnung",
    category: "Housing",
    meaning:
      "The yearly statement reconciling what you prepaid for utilities against what you actually used.",
    example: "Ich habe eine Nachzahlung aus der Nebenkostenabrechnung.",
    translation: "I have an extra payment owed from the utility statement.",
  },
  {
    term: "Kündigungsfrist",
    category: "Housing",
    meaning:
      "The notice period you must give before ending a contract — commonly 3 months for German rental leases.",
    example: "Die Kündigungsfrist beträgt drei Monate.",
    translation: "The notice period is three months.",
  },
  {
    term: "Schufa-Auskunft",
    category: "Housing",
    meaning:
      "A credit report most landlords ask for to check you have no unpaid debts.",
    example: "Bitte legen Sie eine aktuelle Schufa-Auskunft vor.",
    translation: "Please provide a current credit report.",
  },
  {
    term: "WBS",
    category: "Housing",
    meaning:
      "Wohnberechtigungsschein — a certificate proving you qualify for income-restricted subsidized housing.",
    example: "Für diese Wohnung brauchen Sie einen WBS.",
    translation:
      "For this apartment you need a housing entitlement certificate.",
  },
  {
    term: "Hausordnung",
    category: "Housing",
    meaning:
      "The building's house rules — quiet hours, trash sorting, shared space use, etc.",
    example: "Bitte beachten Sie die Hausordnung.",
    translation: "Please follow the house rules.",
  },
  {
    term: "Steuererklärung",
    category: "Tax & Money",
    meaning: "Your annual tax return/declaration to the tax office.",
    example: "Ich muss meine Steuererklärung bis Juli abgeben.",
    translation: "I have to file my tax return by July.",
  },
  {
    term: "Steuer-ID",
    category: "Tax & Money",
    meaning:
      "Your permanent personal tax identification number, sent by mail after you register your address.",
    example: "Wie lautet Ihre Steuer-ID?",
    translation: "What is your tax ID?",
  },
  {
    term: "Finanzamt",
    category: "Tax & Money",
    meaning: "The local tax office responsible for your taxes.",
    example: "Das Finanzamt hat meinen Bescheid geschickt.",
    translation: "The tax office sent my notice.",
  },
  {
    term: "Steuerklasse",
    category: "Tax & Money",
    meaning:
      "Your tax class — determines how much income tax is withheld from your paycheck. Affected by marital status.",
    example: "Nach der Heirat wechseln wir die Steuerklasse.",
    translation: "After marriage we'll switch tax classes.",
  },
  {
    term: "Lohnsteuer",
    category: "Tax & Money",
    meaning:
      "Wage tax — income tax automatically deducted from your salary by your employer.",
    example: "Die Lohnsteuer wird direkt vom Gehalt abgezogen.",
    translation: "Wage tax is deducted directly from the salary.",
  },
  {
    term: "Kleinunternehmer",
    category: "Tax & Money",
    meaning:
      "A small-business tax status letting freelancers below a revenue threshold skip charging VAT.",
    example: "Ich bin Kleinunternehmer und weise keine Mehrwertsteuer aus.",
    translation: "I have small-business status and don't charge VAT.",
  },
  {
    term: "Mehrwertsteuer (MwSt.)",
    category: "Tax & Money",
    meaning:
      "VAT — value-added tax, usually 19% (or 7% reduced rate) added to most goods and services.",
    example: "Der Preis enthält 19% Mehrwertsteuer.",
    translation: "The price includes 19% VAT.",
  },
  {
    term: "Rentenversicherung",
    category: "Tax & Money",
    meaning:
      "Statutory pension insurance — a mandatory deduction from most employees' salaries.",
    example: "Mein Arbeitgeber zahlt in die Rentenversicherung ein.",
    translation: "My employer pays into the pension insurance.",
  },
  {
    term: "Sozialversicherungsnummer",
    category: "Tax & Money",
    meaning:
      "Your social security number, needed for employment and pension records.",
    example: "Ihre Sozialversicherungsnummer finden Sie auf der Karte.",
    translation: "You can find your social security number on the card.",
  },
  {
    term: "Krankenversicherung",
    category: "Health & Insurance",
    meaning:
      "Health insurance — legally required in Germany, either public (GKV) or private (PKV).",
    example: "Ohne Krankenversicherung kann man sich nicht anmelden.",
    translation: "You can't register your address without health insurance.",
  },
  {
    term: "Gesetzliche Krankenversicherung (GKV)",
    category: "Health & Insurance",
    meaning:
      "Public/statutory health insurance — the default for most employees, cost is income-based.",
    example: "Ich bin gesetzlich krankenversichert.",
    translation: "I have public health insurance.",
  },
  {
    term: "Private Krankenversicherung (PKV)",
    category: "Health & Insurance",
    meaning:
      "Private health insurance — usually for high earners, self-employed, or civil servants; cost depends on risk, not income.",
    example: "Als Freelancer habe ich eine private Krankenversicherung.",
    translation: "As a freelancer I have private health insurance.",
  },
  {
    term: "Selbstbeteiligung",
    category: "Health & Insurance",
    meaning:
      "The deductible — the amount you pay yourself before insurance kicks in.",
    example: "Die Selbstbeteiligung liegt bei 300 Euro pro Jahr.",
    translation: "The deductible is 300 euros per year.",
  },
  {
    term: "Versicherungsschein",
    category: "Health & Insurance",
    meaning:
      "The official insurance policy document confirming your coverage and terms.",
    example: "Bewahren Sie Ihren Versicherungsschein gut auf.",
    translation: "Keep your insurance policy document safe.",
  },
  {
    term: "Arbeitsunfähigkeitsbescheinigung (AU)",
    category: "Health & Insurance",
    meaning:
      "A sick note from your doctor, usually required after 3 sick days to give to your employer.",
    example:
      "Ich brauche eine Arbeitsunfähigkeitsbescheinigung für meinen Chef.",
    translation: "I need a sick note for my boss.",
  },
  {
    term: "Hausarzt",
    category: "Health & Insurance",
    meaning:
      "Your family doctor / general practitioner — usually your first stop before seeing a specialist.",
    example: "Mein Hausarzt hat mich zum Spezialisten überwiesen.",
    translation: "My family doctor referred me to a specialist.",
  },
  {
    term: "Arbeitsvertrag",
    category: "Employment",
    meaning:
      "Your employment contract, outlining salary, hours, notice period, and duties.",
    example: "Ich habe meinen Arbeitsvertrag noch nicht unterschrieben.",
    translation: "I haven't signed my employment contract yet.",
  },
  {
    term: "Probezeit",
    category: "Employment",
    meaning:
      "The probation period at the start of a job, typically 6 months, with a shorter notice period.",
    example: "Während der Probezeit beträgt die Kündigungsfrist zwei Wochen.",
    translation: "During the probation period the notice period is two weeks.",
  },
  {
    term: "Kündigungsschutz",
    category: "Employment",
    meaning:
      "Legal protection against unfair dismissal, which kicks in after 6 months at companies with 10+ employees.",
    example: "Nach der Probezeit greift der Kündigungsschutz.",
    translation: "After the probation period, dismissal protection applies.",
  },
  {
    term: "Agentur für Arbeit",
    category: "Employment",
    meaning:
      "The federal employment agency — handles unemployment benefits and job placement.",
    example: "Ich habe mich bei der Agentur für Arbeit arbeitslos gemeldet.",
    translation: "I registered as unemployed at the employment agency.",
  },
  {
    term: "Elterngeld",
    category: "Employment",
    meaning:
      "Parental allowance — a government payment to parents taking time off work after having a child.",
    example: "Wir beantragen Elterngeld für zwölf Monate.",
    translation: "We are applying for parental allowance for twelve months.",
  },
  {
    term: "Kindergeld",
    category: "Employment",
    meaning:
      "Child benefit — a monthly government payment per child, regardless of parents' income.",
    example: "Das Kindergeld wird monatlich ausgezahlt.",
    translation: "Child benefit is paid out monthly.",
  },
  {
    term: "Termin",
    category: "Everyday",
    meaning: "An appointment — for almost everything in Germany, you need one.",
    example: "Ich brauche einen Termin beim Bürgeramt.",
    translation: "I need an appointment at the citizens' office.",
  },
  {
    term: "Widerspruch",
    category: "Everyday",
    meaning:
      "A formal written objection or appeal against an official decision — usually has a strict deadline.",
    example: "Ich lege Widerspruch gegen den Bescheid ein.",
    translation: "I am filing an objection against the decision.",
  },
  {
    term: "Bescheid",
    category: "Everyday",
    meaning:
      "An official written decision or notice from an authority — e.g. a tax assessment or benefits decision.",
    example: "Ich habe heute den Bescheid vom Finanzamt erhalten.",
    translation: "I received the notice from the tax office today.",
  },
  {
    term: "Frist",
    category: "Everyday",
    meaning:
      "A deadline. Missing one in German bureaucracy can mean real consequences, so always check for this word.",
    example: "Die Frist zur Einreichung endet am 15.",
    translation: "The submission deadline ends on the 15th.",
  },
  {
    term: "Behörde",
    category: "Everyday",
    meaning: "A general term for any government office or authority.",
    example: "Welche Behörde ist dafür zuständig?",
    translation: "Which authority is responsible for this?",
  },
  {
    term: "Beglaubigung",
    category: "Everyday",
    meaning:
      "An official certification confirming a copy of a document matches the original — often required for translations or degrees.",
    example: "Die Kopie muss beglaubigt werden.",
    translation: "The copy needs to be certified.",
  },
];

export default function PhrasebookPage() {
  const [category, setCategory] = useState("All");
  const visibleTerms = TERMS.filter(
    (t) => category === "All" || t.category === category,
  );

  return (
    <PageShell
      title="Bureaucracy Phrasebook"
      description="The German words that show up everywhere in official life — explained plainly, with example sentences."
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              category === cat
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <SearchList
        placeholder="Search a word, e.g. 'Kündigung' or 'deposit'..."
        items={visibleTerms}
        filterFn={(t, q) =>
          q.trim() === "" ||
          t.term.toLowerCase().includes(q.toLowerCase()) ||
          t.meaning.toLowerCase().includes(q.toLowerCase())
        }
        emptyMessage="No matches. Try a different word."
        renderItem={(item) => (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-slate-800">{item.term}</h3>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1.5">{item.meaning}</p>
            <div className="mt-3 bg-slate-50 rounded-lg p-3">
              <p className="text-sm text-slate-700 italic">"{item.example}"</p>
              <p className="text-xs text-slate-500 mt-1">{item.translation}</p>
            </div>
          </div>
        )}
      />
    </PageShell>
  );
}
