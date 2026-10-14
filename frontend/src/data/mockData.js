export const newsDatabase = [
  {
    id: "news-1",
    title: "ISRO Readies Reusable Launch Vehicle for Hypersonic Runway Landing Tests",
    category: "Science & Tech",
    source: "ISRO Space Dispatch",
    date: "October 13, 2026",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1517976487502-570a98ef7535?auto=format&fit=crop&w=800&q=80",
    content: "The Indian Space Research Organisation (ISRO) is set to conduct landing experiments for its winged Reusable Launch Vehicle (RLV). Unlike conventional expendable rockets that burn up in the atmosphere after dropping off payloads, the RLV glides autonomously back to Earth and lands on an airstrip. This engineering breakthrough is projected to cut space access costs by up to 70%.",
    visualExplanation: {
      type: "flowchart",
      title: "How the Reusable Launch Vehicle Operates",
      steps: [
        { phase: "Stage 1: Launch", description: "Rocket booster lifts the winged orbiter to high altitude." },
        { phase: "Stage 2: Separation", description: "Satellite payload enters orbit; orbiter begins re-entry." },
        { phase: "Stage 3: Thermal Gliding", description: "Heat shields absorb re-entry friction while gliding without engine power." },
        { phase: "Stage 4: Autonomous Touchdown", description: "Onboard AI radar steers the vehicle onto a runway runway landing gear." }
      ]
    },
    knowledgeLevels: {
      beginner: "Think of regular rockets like disposable paper cups—you use them once and throw them away. ISRO is building a reusable mug! It's an airplane-shaped spaceship that drops satellites into space and then flies back to land on an airport runway so scientists can wash it and use it again tomorrow.",
      intermediate: "ISRO's RLV combines rocket propulsion with aircraft aerodynamics. Instead of splashing into the ocean, the craft uses autonomous guidance algorithms, control fins, and ceramic thermal tiles to navigate hypersonic re-entry and touch down precisely on an airstrip, dramatically reducing recurring launch expenditures.",
      advanced: "The hypersonic flight test focuses on low L/D (lift-to-drag) ratio aerodynamics during terminal area energy management (TAEM). Guidance laws reconcile high-angle-of-attack deceleration with crosswind runway alignment, validating autonomous radar altimetry and pneumatic braking systems."
    },
    jargons: [
      {
        term: "Expendable Rocket",
        definition: "A rocket designed for single-use only; its stages burn up in the atmosphere or crash into the sea after launch.",
        context: "Traditional rockets are expendable, making every launch cost hundreds of crores."
      },
      {
        term: "Hypersonic",
        definition: "Speeds exceeding Mach 5 (more than 5 times the speed of sound, or roughly 6,174 km/h).",
        context: "During atmospheric re-entry, the spacecraft encounters hypersonic air resistance."
      },
      {
        term: "Autonomous Guidance",
        definition: "An autopilot computer system that makes steering calculations in milliseconds without human intervention.",
        context: "The vehicle uses autonomous guidance because human reaction times are too slow during re-entry."
      }
    ]
  },
  {
    id: "news-2",
    title: "Global Central Banks Fast-Track Interoperable Digital Currency Settlement",
    category: "Business & Economy",
    source: "Financial Express Bureau",
    date: "October 12, 2026",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    content: "A coalition of international central banks, including the Reserve Bank of India (RBI), unveiled a unified cross-border settlement framework for Central Bank Digital Currencies (CBDCs). The trial eliminates intermediary correspondent banking chains, reducing international wire transfer times from 3 business days to under 4 seconds while slashing remittance fees.",
    visualExplanation: {
      type: "comparison",
      title: "Traditional Wire vs. Cross-Border CBDC",
      steps: [
        { phase: "Traditional Transfer (3-5 Days)", description: "Local Bank → Domestic Central Bank → Swift Relay → Foreign Correspondent Bank → Beneficiary Bank. (High fees, manual reconciliation)." },
        { phase: "CBDC Direct Settlement (4 Seconds)", description: "Sender Wallet → Multi-CBDC Shared Distributed Ledger → Instant Smart Contract FX Conversion → Receiver Wallet." }
      ]
    },
    knowledgeLevels: {
      beginner: "Sending money to another country usually takes days and loses money to banking fees because multiple foreign banks have to talk to each other. With this new digital cash system, central banks can send money instantly across borders just like sending an instant WhatsApp message.",
      intermediate: "Central Bank Digital Currencies (CBDCs) are direct digital liabilities of central banks. The new framework uses distributed ledgers to settle foreign exchange transfers peer-to-peer between commercial banks without needing intermediate correspondent banks or SWIFT delays.",
      advanced: "The multi-CBDC (mCBDC) architecture employs automated market makers (AMMs) and hash time-locked contracts (HTLC) across interoperable sovereign ledgers, mitigating Herstatt settlement risk and counterparty exposure in wholesale cross-currency liquidity corridors."
    },
    jargons: [
      {
        term: "CBDC (Central Bank Digital Currency)",
        definition: "A digital form of a country's sovereign currency issued and backed directly by its central bank (unlike private cryptocurrencies like Bitcoin).",
        context: "India's Digital Rupee (e-Rupee) is an official CBDC."
      },
      {
        term: "Correspondent Banking",
        definition: "Third-party banks that act as middlemen to transfer funds across countries that don't have direct financial connections.",
        context: "Cutting out correspondent banks saves billions in transaction fees."
      }
    ]
  },
  {
    id: "news-3",
    title: "Parliamentary Committee Unveils Comprehensive Artificial Intelligence Governance Act",
    category: "Politics & Policy",
    source: "National Law Review",
    date: "October 11, 2026",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    content: "The standing committee on technology presented the draft AI Governance Bill, proposing risk-based certification tiers for generative algorithms. Systems deployed in healthcare, criminal justice, and credit scoring will require compulsory bias audits and watermark transparency for synthesized audio and video.",
    visualExplanation: {
      type: "hierarchy",
      title: "Three-Tier AI Risk Classification",
      steps: [
        { phase: "Unacceptable Risk (Banned)", description: "Cognitive behavioral manipulation, social scoring, biometric mass surveillance." },
        { phase: "High Risk (Heavily Audited)", description: "Healthcare diagnostics, recruitment algorithms, court sentencing tools." },
        { phase: "Low / Minimal Risk (Self-Regulated)", description: "AI spam filters, video game NPC chatbots, basic text summarizers." }
      ]
    },
    knowledgeLevels: {
      beginner: "Governments are creating new rules for AI: if an AI does simple things like recommend a movie, it has few rules; but if an AI decides who gets a bank loan or healthcare, humans must inspect its code to ensure it doesn't unfairly discriminate.",
      intermediate: "The draft AI Act categorizes applications into risk tiers. High-risk systems must prove non-discrimination, maintain algorithmic explainability, and embed tamper-evident watermarks on synthetic deepfake media.",
      advanced: "The statute mandates third-party algorithmic impact assessments (AIAs), rigorous training data provenance verification under differential privacy standards, and strict liability regimes for autonomous decision systems causing material civil harm."
    },
    jargons: [
      {
        term: "Algorithmic Bias",
        definition: "Systematic and repeatable errors in computer algorithms that create unfair outcomes, such as favoring one demographic over another.",
        context: "The law requires audits to detect algorithmic bias before an AI can screen job resumes."
      },
      {
        term: "Deepfake / Synthetic Media",
        definition: "Video, audio, or images artificially generated or manipulated using machine learning models to realistically mimic real people.",
        context: "Watermarking rules will ensure people can verify whether a political speech video is authentic."
      }
    ]
  },
  {
    id: "news-4",
    title: "Breakthrough Solid-State Battery Achieves 1,000-Kilometer Range in Extreme Heat",
    category: "Science & Tech",
    source: "Energy & Materials Journal",
    date: "October 09, 2026",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1558441719-8b489c63f732?auto=format&fit=crop&w=800&q=80",
    content: "Material researchers have produced a ceramic-based solid-state lithium cell that prevents dendrite short-circuits. Unlike conventional liquid lithium-ion packs prone to thermal runaway in high tropical temperatures, the prototype showed zero degradation after 2,000 rapid charging cycles at 50°C.",
    visualExplanation: {
      type: "comparison",
      title: "Liquid Electrolyte vs Solid-State Cell",
      steps: [
        { phase: "Traditional Lithium-ion", description: "Uses flammable liquid chemical electrolyte. Risk of battery fires when punctured or overheated; degrades after 800 cycles." },
        { phase: "Solid-State Ceramic", description: "Uses non-flammable solid ceramic layer. Impossible to catch fire, double the energy density, charges in 10 minutes." }
      ]
    },
    knowledgeLevels: {
      beginner: "Today's phone and electric car batteries have a flammable liquid inside that gets hot and can catch fire. This new battery replaces that liquid with a solid ceramic slab. It charges in minutes, never catches fire, and lets cars drive 1,000 km on one charge!",
      intermediate: "Solid-state batteries replace volatile liquid organic electrolytes with solid ceramic or polymer separators. This suppresses lithium dendrite formation, allowing pure lithium metal anodes with twice the volumetric energy density.",
      advanced: "The cell employs a sulfide-halide solid electrolyte interface showing ionic conductivity of 12 mS/cm at ambient temperature. In-situ pressure modulators maintain chemo-mechanical contact, preventing interfacial delamination under high current density stripping."
    },
    jargons: [
      {
        term: "Thermal Runaway",
        definition: "A chain reaction in battery cells where overheating causes further heat release, leading to fire or explosion.",
        context: "Solid-state cells eliminate thermal runaway because they contain no flammable liquids."
      },
      {
        term: "Dendrites",
        definition: "Microscopic, needle-like lithium crystals that grow inside batteries during charging and can poke through separators, causing dangerous short circuits.",
        context: "Ceramic barriers block dendrites from growing."
      }
    ]
  }
];

export const allCategories = [
  "All",
  "Science & Tech",
  "Business & Economy",
  "Politics & Policy",
  "Environment & Climate",
  "Health & Medicine",
  "Sports"
];