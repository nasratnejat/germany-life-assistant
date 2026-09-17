"use client";

import PageShell from "../../components/PageShell";
import SearchList from "../../components/SearchList";

const SITUATIONS = [
  {
    situation: "Having a baby",
    forms: [
      {
        name: "Geburtsurkunde (birth certificate)",
        where: "Standesamt, after the hospital reports the birth",
      },
      {
        name: "Antrag auf Elterngeld",
        where:
          "Your state's Elterngeldstelle, usually online (e.g. ELFE portal)",
      },
      {
        name: "Antrag auf Kindergeld",
        where: "Familienkasse (part of the Agentur für Arbeit)",
      },
      {
        name: "Anmeldung des Kindes",
        where:
          "Automatic with your own Anmeldung once the birth certificate is issued",
      },
    ],
  },
  {
    situation: "Starting a business or freelancing",
    forms: [
      {
        name: "Gewerbeanmeldung",
        where:
          "Gewerbeamt — only needed if you're not a Freiberufler (freelancer in a liberal profession)",
      },
      {
        name: "Fragebogen zur steuerlichen Erfassung",
        where: "Finanzamt, usually filed online via ELSTER",
      },
      {
        name: "IHK/HWK registration",
        where:
          "Automatic once you file a Gewerbeanmeldung, if applicable to your trade",
      },
    ],
  },
  {
    situation: "Losing a job / becoming unemployed",
    forms: [
      {
        name: "Arbeitslosmeldung",
        where:
          "Agentur für Arbeit — register in person or online within 3 days of knowing your end date",
      },
      { name: "Antrag auf Arbeitslosengeld", where: "Agentur für Arbeit" },
      {
        name: "Arbeitsbescheinigung",
        where: "Requested from your former employer",
      },
    ],
  },
  {
    situation: "Moving to a new address",
    forms: [
      {
        name: "Anmeldung einer Wohnung",
        where:
          "Bürgeramt — bring your ID and a Wohnungsgeberbestätigung from your landlord",
      },
    ],
  },
  {
    situation: "Getting married",
    forms: [
      {
        name: "Anmeldung zur Eheschließung",
        where: "Standesamt in the city where one of you lives",
      },
      {
        name: "Ledigkeitsbescheinigung (if you're a foreign national)",
        where: "Your home country's consulate or registry office",
      },
    ],
  },
  {
    situation: "Converting a foreign driving license",
    forms: [
      {
        name: "Antrag auf Umschreibung eines ausländischen Führerscheins",
        where:
          "Führerscheinstelle, usually part of your local Bürgeramt or Landratsamt",
      },
    ],
  },
  {
    situation: "Enrolling a child in daycare or school",
    forms: [
      {
        name: "Kita-Anmeldung",
        where: "Your city's online Kita-Portal, or directly with the Kita",
      },
      {
        name: "Schulanmeldung",
        where:
          "Handled by your local Schulamt — you usually receive a letter once your child reaches school age",
      },
    ],
  },
  {
    situation: "Applying for or extending a residence permit",
    forms: [
      {
        name: "Antrag auf Erteilung/Verlängerung eines Aufenthaltstitels",
        where: "Ausländerbehörde — book an appointment online well in advance",
      },
    ],
  },
  {
    situation: "Filing your annual tax return",
    forms: [
      {
        name: "Steuererklärung (Mantelbogen + Anlage N for employees)",
        where: "Filed online via ELSTER, or on paper from your Finanzamt",
      },
    ],
  },
  {
    situation: "Registering as Kleinunternehmer",
    forms: [
      {
        name: "Kleinunternehmerregelung request",
        where:
          "Included in the Fragebogen zur steuerlichen Erfassung when you register with the Finanzamt",
      },
    ],
  },
  {
    situation: "Death of a family member",
    forms: [
      {
        name: "Sterbeurkunde (death certificate)",
        where:
          "Standesamt, after a doctor issues the medical death certificate",
      },
      {
        name: "Notify pension insurance, health insurance, banks, and insurers",
        where: "Each institution directly — no single central form",
      },
    ],
  },
  {
    situation: "Applying for child benefit",
    forms: [
      {
        name: "Antrag auf Kindergeld",
        where:
          "Familienkasse — bring the child's birth certificate and your Steuer-ID",
      },
    ],
  },
  {
    situation: "Applying for student financial aid (BAföG)",
    forms: [
      {
        name: "BAföG-Antrag",
        where:
          "Your university's Studierendenwerk / Amt für Ausbildungsförderung",
      },
    ],
  },
  {
    situation: "Opening a bank account",
    forms: [
      {
        name: "Kontoeröffnungsantrag",
        where:
          "Directly with the bank — bring your ID and a Meldebescheinigung",
      },
    ],
  },
  {
    situation: "Registering a car",
    forms: [
      {
        name: "Fahrzeug-Zulassung",
        where:
          "KFZ-Zulassungsstelle — bring your eVB-Nummer (insurance confirmation), ID, and Fahrzeugbrief",
      },
    ],
  },
  {
    situation: "Requesting your tax ID (Steuer-ID)",
    forms: [
      {
        name: "Steuer-ID lookup request",
        where:
          "Bundeszentralamt für Steuern (BZSt) online form — it's otherwise mailed automatically after your Anmeldung",
      },
    ],
  },
];

export default function FormFinderPage() {
  return (
    <PageShell
      title="Formular Finder"
      description="Search a life situation to see which German forms and offices are involved."
    >
      <SearchList
        placeholder="Search a situation, e.g. 'baby', 'moving', 'unemployed'..."
        items={SITUATIONS}
        filterFn={(item, q) =>
          q.trim() === "" ||
          item.situation.toLowerCase().includes(q.toLowerCase()) ||
          item.forms.some((f) => f.name.toLowerCase().includes(q.toLowerCase()))
        }
        emptyMessage="No matches. Try a different situation."
        renderItem={(item) => (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">
              {item.situation}
            </h3>
            <div className="space-y-2">
              {item.forms.map((form, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm text-slate-700 font-medium">
                    {form.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{form.where}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      />
    </PageShell>
  );
}
