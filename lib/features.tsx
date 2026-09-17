export const CATEGORIES = [
  {
    slug: "visa-aufenthalt",
    title: "Visa & Aufenthalt",
    description:
      "Residence permits, immigration letters, and everything tied to your status in Germany.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 3c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9 4.5-4.03 4.5-9-2.015-9-4.5-9zM3 12h18"
        />
      </svg>
    ),
  },
  {
    slug: "budget-spending",
    title: "Budget & Spending",
    description:
      "Track spending, split bills, and check prices before you buy.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  {
    slug: "housing",
    title: "Housing",
    description:
      "Rental contracts, deposits, utility bills, and everything about finding and keeping a home.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1h-4.5a1 1 0 01-1-1v-5.25h-5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z"
        />
      </svg>
    ),
  },
  {
    slug: "work-career",
    title: "Work & Career",
    description:
      "Contracts, salary, interviews, and everything about your job in Germany.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 6V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V6m-9 0h12a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2zm0 5h12"
        />
      </svg>
    ),
  },
  {
    slug: "taxes-money",
    title: "Taxes & Money",
    description:
      "Taxes, bills, invoices, and estimating what things really cost.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 9V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4v-2M9 12h9m0 0l-3-3m3 3l-3 3"
        />
      </svg>
    ),
  },
  {
    slug: "documents",
    title: "Documents",
    description:
      "Store, explain, translate, and generate the paperwork German life runs on.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6M9 8h6M5 5h14a1 1 0 011 1v13.586a1 1 0 01-1.707.707L15 17H6l-3.293 3.293A1 1 0 011 19.586V6a1 1 0 011-1z"
        />
      </svg>
    ),
  },
  {
    slug: "german-for-life",
    title: "German for Life in Germany",
    description:
      "Understand what people actually mean, and know what to say back.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    slug: "everyday-germany",
    title: "Everyday Germany",
    description:
      "Driving, recycling, moving, and the small everyday things nobody explains to you.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
  },
];

export const FEATURES = [
  {
    href: "/budget-planner",
    category: "budget-spending",
    title: "Budget Planner",
    description:
      "Set a monthly budget by category and see your daily spending limit — personal or shared with a partner.",
    keywords:
      "budget monthly budget spending limit couple budget shared budget",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
      </svg>
    ),
  },
  {
    href: "/savings-goal",
    category: "budget-spending",
    title: "Savings Goal Tracker",
    description:
      "Set a savings target — including a ready-made Emergency Fund preset — and track your progress.",
    keywords: "savings savings goal emergency fund",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    href: "/subscription-tracker",
    category: "budget-spending",
    title: "Subscription Tracker",
    description:
      "See every subscription and recurring payment in one place, with monthly and yearly totals.",
    keywords: "subscriptions recurring payments netflix spotify",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
    ),
  },
  {
    href: "/bill-splitter",
    category: "budget-spending",
    title: "Bill Splitter",
    description:
      "Split any bill between friends or roommates, with tip calculation built in.",
    keywords: "bill splitter tip calculator restaurant split the bill",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20" />
        <circle cx="7" cy="8" r="3" />
        <circle cx="17" cy="16" r="3" />
      </svg>
    ),
  },
  {
    href: "/shopping-calculator",
    category: "budget-spending",
    title: "Smart Shopping Calculator",
    description:
      'Check discounts, compare unit prices, and see if a "sale" price is actually cheaper.',
    keywords: "discount sale price price per kg unit price was this cheaper",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    href: "/receipt-scanner",
    category: "budget-spending",
    ai: true,
    title: "Receipt Scanner",
    description:
      "Snap or upload a receipt and let AI pull out the items and total for your budget.",
    keywords: "receipt scanner expense scan receipt",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2h9l3 3v17l-3-2-3 2-3-2-3 2-3-2V5a3 3 0 0 1 3-3Z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    ),
  },
  {
    href: "/afford-calculator",
    category: "budget-spending",
    title: "Can I Afford This?",
    description:
      "Check a purchase against your budget and savings before you buy.",
    keywords: "can i afford this affordability big purchase",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    href: "/permit-renewal",
    category: "visa-aufenthalt",
    title: "Visa/Permit Renewal Checklist",
    description:
      "Pick your permit type and see exactly what documents you'll likely need for renewal.",
    keywords:
      "visa permit renewal aufenthaltstitel aufenthaltserlaubnis blue card checklist documents ausländerbehörde",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6M9 8h6M5 5h14a1 1 0 011 1v13.586a1 1 0 01-1.707.707L15 17H6l-3.293 3.293A1 1 0 011 19.586V6a1 1 0 011-1z"
        />
      </svg>
    ),
  },
  // Documents
  {
    href: "/explain",
    category: "documents",
    title: "Explain a Letter",
    description:
      "Upload a confusing letter, get it explained in plain English.",
    keywords:
      "letter mail post confusing official government translate understand brief amtliches schreiben bescheid",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    href: "/cancel",
    category: "documents",
    title: "Cancel a Contract",
    description:
      "Fill in the details, get a ready-to-send cancellation letter.",
    keywords:
      "cancel terminate kündigung gym subscription contract quit end membership",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6M9 8h6M5 5h14a1 1 0 011 1v13.586a1 1 0 01-1.707.707L15 17H6l-3.293 3.293A1 1 0 011 19.586V6a1 1 0 011-1z"
        />
      </svg>
    ),
  },
  {
    href: "/documents",
    category: "documents",
    title: "Document Storage",
    description: "Scan and keep your ID, insurance card, and other documents.",
    keywords: "documents id passport insurance card scan storage papers",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
  },
  {
    href: "/dashboard",
    category: "documents",
    title: "Your Account",
    description:
      "View your account details, change your password, and log out.",
    keywords: "account profile dashboard settings password logout email",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    href: "/document-vault",
    category: "documents",
    title: "Deadline Tracker",
    description:
      "Track your passport, visa, insurance and ID expiry dates so nothing catches you off guard.",
    keywords:
      "passport visa expiry reminder documents id ausweis aufenthaltstitel insurance renew deadline",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
  },
  {
    href: "/formfinder",
    category: "documents",
    title: "Formular Finder",
    description:
      "Search a life situation to see which German forms and offices are involved.",
    keywords:
      "forms formular documents needed baby marriage business unemployed situation",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6M9 8h6M5 5h14a1 1 0 011 1v13.586a1 1 0 01-1.707.707L15 17H6l-3.293 3.293A1 1 0 011 19.586V6a1 1 0 011-1z"
        />
      </svg>
    ),
  },

  // Housing
  {
    href: "/rental-contract-check",
    category: "housing",
    title: "Rental Contract Checker",
    description:
      "Paste your Mietvertrag and get unusual clauses, deposit terms, and notice periods flagged.",
    keywords:
      "rental contract mietvertrag lease clauses deposit kaution kündigungsfrist tenant landlord",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6M9 8h6M5 5h14a1 1 0 011 1v13.586a1 1 0 01-1.707.707L15 17H6l-3.293 3.293A1 1 0 011 19.586V6a1 1 0 011-1z"
        />
      </svg>
    ),
  },
  {
    href: "/scamcheck",
    category: "housing",
    title: "Apartment Scam Checker",
    description:
      "Paste a rental listing and get it checked for common scam patterns.",
    keywords:
      "apartment wohnung rental scam fraud fake listing landlord suspicious",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    href: "/utilitycheck",
    category: "housing",
    title: "Check a Utility Bill",
    description:
      "Upload your Nebenkosten bill, see if any costs look too high.",
    keywords: "utility nebenkosten bill electricity heating water overcharge",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 7h6m-6 4h6m-6 4h4M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"
        />
      </svg>
    ),
  },
  {
    href: "/rentcheck",
    category: "housing",
    title: "Rent Increase Checker",
    description:
      "Check a Mieterhöhung against the legal caps and formal requirements.",
    keywords: "rent landlord mieterhöhung rent increase vermieter apartment",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7m-14 0v8a2 2 0 002 2h3m4-10l2-2m-2 2v10a2 2 0 002 2h3a2 2 0 002-2v-8m-9 8h4"
        />
      </svg>
    ),
  },

  // Work & Career
  {
    href: "/coverletter",
    category: "work-career",
    title: "Cover Letter Maker",
    description:
      "Paste a job posting and your background, get a German Anschreiben.",
    keywords: "anschreiben job application cover letter bewerbung",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    href: "/interviewprep",
    category: "work-career",
    title: "Interview Prep Generator",
    description:
      "Paste a job posting, get likely interview questions and how to answer them.",
    keywords: "interview job vorstellungsgespräch questions prepare hiring",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    href: "/cvchecker",
    category: "work-career",
    title: "Lebenslauf (CV) Checker",
    description:
      "Paste your CV and get it checked against German CV conventions.",
    keywords: "cv resume lebenslauf job application review",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
  },
  {
    href: "/contractcheck",
    category: "work-career",
    title: "Employment Contract Checker",
    description:
      "Paste your Arbeitsvertrag and get it checked against German employment standards.",
    keywords:
      "job contract arbeitsvertrag employment probezeit employer work new job offer",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6M9 8h6M5 5h14a1 1 0 011 1v13.586a1 1 0 01-1.707.707L15 17H6l-3.293 3.293A1 1 0 011 19.586V6a1 1 0 011-1z"
        />
      </svg>
    ),
  },
  {
    href: "/noticeperiod",
    category: "work-career",
    title: "Notice Period Calculator",
    description: "Work out your statutory Kündigungsfrist under §622 BGB.",
    keywords:
      "notice period kündigungsfrist resign quit job fired layoff termination leaving",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    href: "/salary",
    category: "work-career",
    title: "Brutto-Netto Calculator",
    description: "Enter a gross salary, see your estimated take-home pay.",
    keywords:
      "salary gross net paycheck brutto netto take-home pay wage income",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 9V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4v-2M9 12h9m0 0l-3-3m3 3l-3 3"
        />
      </svg>
    ),
  },

  // Taxes & Money
  {
    href: "/insurance",
    category: "taxes-money",
    title: "Insurance Explainer",
    description:
      "Upload your policy, see what's covered, what's not, and what to watch for.",
    keywords: "insurance versicherung policy coverage claim haftpflicht",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"
        />
      </svg>
    ),
  },
  {
    href: "/subscriptions",
    category: "taxes-money",
    title: "Subscription Checker",
    description: "List what you're paying monthly, see what's worth cutting.",
    keywords:
      "subscriptions netflix spotify recurring payments monthly bills streaming",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    href: "/taxcalculator",
    category: "taxes-money",
    title: "Tax Calculator",
    description:
      "Check Kleinunternehmer status and estimate what to set aside.",
    keywords: "tax steuer freelancer kleinunternehmer self employed income",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2M3 12a9 9 0 1018 0 9 9 0 10-18 0z"
        />
      </svg>
    ),
  },
  {
    href: "/invoice",
    category: "taxes-money",
    title: "Freelancer Invoice Generator",
    description:
      "Fill in the details, get a properly formatted German invoice as a PDF.",
    keywords: "invoice rechnung billing freelance client payment",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 7h6m-6 4h6m-6 4h4M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"
        />
      </svg>
    ),
  },

  // German for Life in Germany
  {
    href: "/phrasebook",
    category: "german-for-life",
    title: "Bureaucracy Phrasebook",
    description:
      "Look up the German terms and phrases that come up everywhere in official life.",
    keywords:
      "german words terms vocabulary translation meaning glossary dictionary",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    href: "/chat",
    category: "german-for-life",
    title: "Chat Assistant",
    description: "Ask anything about German life, paperwork, or just chat.",
    keywords: "chat ask question help talk general",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },

  // Everyday Germany
  {
    href: "/moving",
    category: "everyday-germany",
    title: "Moving Checklist",
    description:
      "Everyone to notify when you move address, with your progress saved.",
    keywords: "moving move umzug new address relocate change of address",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    href: "/holidays",
    category: "everyday-germany",
    title: "Public Holidays",
    description:
      "See which public holidays apply in your state before booking an appointment.",
    keywords: "holidays feiertage bank holiday closed office hours calendar",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm5-6h.01M12 14h.01M15 14h.01"
        />
      </svg>
    ),
  },
  {
    href: "/digafinder",
    category: "everyday-germany",
    title: "Health App Finder",
    description: "Search a condition, see if an insurance-covered app exists.",
    keywords:
      "health app diga therapy mental health prescribed app anxiety depression",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
  },
  {
    href: "/recycling",
    category: "everyday-germany",
    title: "Recycling Sorting Guide",
    description: "Search any item to find out which German bin it goes in.",
    keywords: "trash garbage recycling mülltrennung bin waste sort",
    ai: true,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 3h6l1 4H8l1-4z"
        />
      </svg>
    ),
  },
];

export const DOCUMENT_HREFS = ["/documents", "/document-vault"];
export const HIDDEN_FROM_CATEGORIES = [
  "/documents",
  "/document-vault",
  "/dashboard",
];

export function getCategoryFeatures(slug: string) {
  return FEATURES.filter(
    (f) => f.category === slug && !HIDDEN_FROM_CATEGORIES.includes(f.href),
  );
}
