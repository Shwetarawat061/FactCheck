import { Newspaper, HeartPulse, TrendingUp, Share2, SearchCode, Shield, CheckCircle2, XCircle, AlertTriangle, HelpCircle, FileCheck2 } from 'lucide-react';

export interface VerificationDomain {
  id: string;
  name: string;
  tag: string;
  badge: string;
  icon: typeof Newspaper;
  shortDesc: string;
  fullDesc: string;
  methodology: string;
  keySources: string[];
  exampleClaims: string[];
}

export const VERIFICATION_DOMAINS: VerificationDomain[] = [
  {
    id: 'news',
    name: 'News & Current Affairs',
    tag: 'CORE_FEATURE',
    badge: 'Core Feature',
    icon: Newspaper,
    shortDesc: 'Verify breaking news headlines, viral political quotes, and trending policy claims.',
    fullDesc: 'Cross-examines developing headlines, political press statements, and viral current affair rumors against tier-1 wire services (AP, Reuters, AFP) and verified public records before disinformation propagates.',
    methodology: 'Wire service triangulation, primary press release comparison, official public record verification, and temporal event validation.',
    keySources: ['Reuters & AP Wires', 'Primary Government Gazettes', 'Archived Press Releases', 'Public Record Registries'],
    exampleClaims: [
      'The UN passed a universal AI embargo resolution in 2026.',
      'A nationwide emergency alert test was scheduled for this Sunday.',
      'The Prime Minister announced a 10% emergency fuel subsidy cut.'
    ]
  },
  {
    id: 'health',
    name: 'Health & Science',
    tag: 'PEER_REVIEWED',
    badge: 'Evidence-Based',
    icon: HeartPulse,
    shortDesc: 'Check medical myths, diet claims, wellness trends, and scientific statistics.',
    fullDesc: 'Evaluates medical recommendations, wellness viral remedies, and statistical scientific assertions against indexed medical literature (PubMed, WHO, CDC, Cochrane Reviews) with strict pharmacological caution.',
    methodology: 'Systematic review alignment, meta-analysis validation, WHO/CDC clinical consensus cross-check, and risk ratio verification.',
    keySources: ['PubMed & Cochrane Library', 'WHO Global Health Observatories', 'CDC Surveillance Data', 'Peer-Reviewed Journals'],
    exampleClaims: [
      'Coffee causes cancer.',
      'Humans only use 10% of their brains.',
      'Daily 2000mg Vitamin C eliminates the common cold in 24 hours.'
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Business',
    tag: 'SEC_AUDIT',
    badge: 'Market Data',
    icon: TrendingUp,
    shortDesc: 'Examine corporate claims, earnings rumors, market metrics, and product launches.',
    fullDesc: 'Audits claims regarding corporate earnings, market share statistics, cryptocurrency disclosures, and executive statements with strict non-investment advisory safeguards and regulatory filing cross-referencing.',
    methodology: 'SEC EDGAR filings cross-referencing, central bank statistic verification, audited annual report inspection, and corporate investor relations releases.',
    keySources: ['SEC EDGAR Filings', 'Federal Reserve Economic Data (FRED)', 'Audited Corporate Disclosures', 'Global Stock Exchanges'],
    exampleClaims: [
      'Tesla announced an immediate 40% price cut across all Model Y vehicles.',
      'The Federal Reserve lowered benchmark interest rates by 100 basis points yesterday.',
      'Apple acquired a generative AI company for $15 billion in cash.'
    ]
  },
  {
    id: 'social',
    name: 'Social Media & Viral Claims',
    tag: 'OSINT_VIRAL',
    badge: 'Viral Detection',
    icon: Share2,
    shortDesc: 'Analyze forwarded messages, transcribed screenshot claims, and manipulated stats.',
    fullDesc: 'Dissects viral messaging forwards, meme infographics, transcribed screenshots, and deceptive cherry-picked statistics by locating originating primary contexts and uncropped archival records.',
    methodology: 'Provenance tracing, quote context restoration, graphic transcription verification, and selective framing analysis.',
    keySources: ['Original Video Transcripts', 'Full Uncut Speech Archives', 'Original Data Sheet Repositories', 'Fact-Checking Consortiums'],
    exampleClaims: [
      'A secret law bans phone calls between 10 PM and 6 AM.',
      'A viral chart shows 90% inflation across basic food items this month.',
      'An uncropped viral video proves a public figure walked off an interview.'
    ]
  },
  {
    id: 'forensics',
    name: 'Forensic & Digital Evidence Claims',
    tag: 'ADVANCED_OSINT',
    badge: 'Advanced Extension',
    icon: SearchCode,
    shortDesc: 'Investigate alleged digital tampering, manipulated audio/visual evidence, and deepfakes.',
    fullDesc: 'Examines assertions concerning synthetic voice clones, AI-generated imagery, manipulated documents, and suspicious multimedia as an advanced forensic investigation suite without speculative overreach.',
    methodology: 'Metadata provenance verification, synthetic artifact indicators, reverse visual search indexing, and cryptographic watermark verification.',
    keySources: ['C2PA Provenance Registries', 'Digital Image Reverse Databases', 'Audio Spectrogram Repositories', 'Forensic OSINT Desks'],
    exampleClaims: [
      'A leaked audio recording of a world leader was created by generative AI.',
      'Satellite imagery of a disputed port has been digitally altered.',
      'A viral photograph of an explosion is actually from a 2018 video game.'
    ]
  }
];

export interface RecommendedVerdict {
  category: 'True' | 'False' | 'Partially True' | 'Misleading' | 'Unverified';
  code: string;
  badgeClass: string;
  borderClass: string;
  textClass: string;
  icon: typeof CheckCircle2;
  definition: string;
  auditStandard: string;
}

export const RECOMMENDED_VERDICTS: RecommendedVerdict[] = [
  {
    category: 'True',
    code: 'TRUE',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    icon: CheckCircle2,
    definition: 'Reliable, verifiable evidence directly corroborates and supports the claim.',
    auditStandard: 'Requires concordant verification across multiple independent top-level sources with zero authoritative contradictions.'
  },
  {
    category: 'False',
    code: 'FALSE',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/60',
    borderClass: 'border-rose-500/40',
    textClass: 'text-rose-400',
    icon: XCircle,
    definition: 'Reliable, authoritative evidence explicitly contradicts and disproves the claim.',
    auditStandard: 'Must be actively contradicted by empirical records or verified registries; not merely absent from search queries.'
  },
  {
    category: 'Partially True',
    code: 'PARTIALLY_TRUE',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/60',
    borderClass: 'border-amber-500/40',
    textClass: 'text-amber-400',
    icon: AlertTriangle,
    definition: 'Some parts of the statement are accurate, while key details are inaccurate or exaggerated.',
    auditStandard: 'Assigned when empirical core exists but accompanying statistics, dates, or quantitative metrics deviate from records.'
  },
  {
    category: 'Misleading',
    code: 'MISLEADING',
    badgeClass: 'bg-orange-950/60 text-orange-300 border-orange-500/60',
    borderClass: 'border-orange-500/40',
    textClass: 'text-orange-400',
    icon: AlertTriangle,
    definition: 'The claim omits crucial context, presents selective facts, or leads to a deceptively false conclusion.',
    auditStandard: 'Assigned when raw assertions are technically literal or out-of-context quotes, yet framed in a manipulative or distorted manner.'
  },
  {
    category: 'Unverified',
    code: 'UNVERIFIED',
    badgeClass: 'bg-[#21262D] text-[#8B949E] border-[#30363D]',
    borderClass: 'border-[#30363D]',
    textClass: 'text-[#8B949E]',
    icon: HelpCircle,
    definition: 'Insufficient reliable evidence is currently indexed or available to substantiate or refute.',
    auditStandard: 'Strict Safeguard: FactCheckAI NEVER labels a claim False merely because evidence is scarce. Scarcity triggers Unverified.'
  }
];

export const WORKFLOW_STAGES = [
  {
    step: '01',
    name: 'Claim Submission',
    desc: 'Accepts raw text, headline, viral quote, or transcribed screenshot assertions without format constraints.',
    detail: 'Strips prompt injections and normalizes assertions.'
  },
  {
    step: '02',
    name: 'AI Claim Analysis',
    desc: 'Extracts core factual propositions, identifies verifiable claims, and generates search targets.',
    detail: 'Identifies entities, timeframe, metrics, and relationships.'
  },
  {
    step: '03',
    name: 'Web & Evidence Retrieval',
    desc: 'Retrieves multi-domain public web sources, academic indexes, and regulatory archives via Google Search grounding.',
    detail: 'Enforces independent top-level domain diversity.'
  },
  {
    step: '04',
    name: 'Evidence-Based Verdict',
    desc: 'Synthesizes objective verdict, confidence score, verbatim citations, and auditable reasoning steps.',
    detail: 'Includes calibrated certainty and evidentiary caveats.'
  }
];
