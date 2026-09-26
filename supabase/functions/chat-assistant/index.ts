// ==============================================================================
// Supabase Edge Function: chat-assistant ("Jeevika Saathi 🤝")
// Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
//
// Purpose:
// Hybrid AI Conversational Assistant.
// 1. Answers general educational, career, conversational, and practical questions
//    using Groq's high-speed Llama-3 model intelligence.
// 2. Grounded specifically in verified Jeevika Map data (NSQF catalog, PM-AJAY
//    scheme guidelines) for official government livelihood queries.
// 3. Multi-lingual support with automatic mirroring for Hindi, Hinglish, and English.
// ==============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RequestPayload {
  message: string;
  history?: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  district?: string;
  state?: string;
}

interface OccupationRecord {
  id: string;
  qp_nos_code: string;
  job_role: string;
  sector_skill_council: string;
  nsqf_level: number;
  notional_hours: number;
  rpl_allowed: boolean;
  entry_qualification_minimum: string;
  description: string;
}

// Fallback verified occupations if DB query is unreachable
const VERIFIED_FALLBACK_OCCUPATIONS: OccupationRecord[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    qp_nos_code: 'TSC/Q7303',
    job_role: 'Master Jacquard Weaver & Quality Auditor',
    sector_skill_council: 'Textile Sector Skill Council',
    nsqf_level: 4,
    notional_hours: 120,
    rpl_allowed: true,
    entry_qualification_minimum: 'Class 8 or 3 years informal weaving experience',
    description: 'Setting up and operating handloom jacquard mechanisms, graph sheets, yarn tensioning, fabric quality inspection.',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    qp_nos_code: 'SGJ/Q0101',
    job_role: 'Solar PV System Installation & Maintenance Technician (Suryamitra)',
    sector_skill_council: 'Skill Council for Green Jobs',
    nsqf_level: 4,
    notional_hours: 160,
    rpl_allowed: true,
    entry_qualification_minimum: 'Class 10 or 2 years electrical trade experience',
    description: 'Installs, tests, commissions, and maintains standalone solar photovoltaic systems, agricultural solar pumps, and inverters.',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    qp_nos_code: 'FIC/Q9001',
    job_role: 'Micro Food Processing Enterprise Supervisor',
    sector_skill_council: 'Food Industry Capacity & Skill Initiative',
    nsqf_level: 4,
    notional_hours: 180,
    rpl_allowed: true,
    entry_qualification_minimum: 'Class 8 or practical experience in grains/spices processing',
    description: 'Supervises decentralized primary agro-processing, seed cleaning, grading, hygienic packaging, and compliance with local FSSAI guidelines.',
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    qp_nos_code: 'ELE/Q1401',
    job_role: 'Rural Electrical Maintenance Technician & Wireman',
    sector_skill_council: 'Electronics & Power Sector Skill Council',
    nsqf_level: 3,
    notional_hours: 140,
    rpl_allowed: true,
    entry_qualification_minimum: 'Class 8 or informal electrical wiring experience',
    description: 'Executes domestic and agricultural single-phase/three-phase wiring, submersible motor starter troubleshooting, and grounding inspections.',
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    qp_nos_code: 'CON/Q0102',
    job_role: 'General Mason & Rural Infrastructure Builder',
    sector_skill_council: 'Construction Skill Development Council of India',
    nsqf_level: 3,
    notional_hours: 120,
    rpl_allowed: true,
    entry_qualification_minimum: 'Ability to read and write or 1 year construction work',
    description: 'Lays brickwork, stone masonry, plastering, floor screeding, and basic reinforced concrete foundations for rural housing and sanitation structures.',
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    qp_nos_code: 'LSS/Q2301',
    job_role: 'Footwear & Traditional Leather Craft Artisan',
    sector_skill_council: 'Leather Sector Skill Council',
    nsqf_level: 3,
    notional_hours: 150,
    rpl_allowed: true,
    entry_qualification_minimum: 'Ability to read and write or generational craft background',
    description: 'Patterns, cuts, skives, stitches, and finishes leather footwear and traditional leather goods with modernized hand and mechanized tools.',
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    qp_nos_code: 'AGR/Q1201',
    job_role: 'Organic Grower & Bio-Input Producer',
    sector_skill_council: 'Agriculture Skill Council of India',
    nsqf_level: 4,
    notional_hours: 140,
    rpl_allowed: true,
    entry_qualification_minimum: 'Class 5 or practical farming background',
    description: 'Produces organic crops, prepares bio-fertilizers, vermicompost, and natural pest repellents, following NPOP organic certification norms.',
  },
];

// Verified PM-AJAY convergence guidelines summary
const VERIFIED_PMAJAY_INFO = `
PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) Official Scheme Rules:
- Ministry: Ministry of Social Justice and Empowerment (MoSJE), Government of India.
- Target Group: Scheduled Caste (SC) individuals and families, rural/semi-urban artisans, women, and youth.
- Direct Toolkit & Capital Subsidy: Up to ₹50,000 grant assistance for verified SC artisans and micro-entrepreneurs.
- Skill Training & Certification: Free NSQF-aligned training with certified Assessment Bodies and NCVET accreditation.
- Recognition of Prior Learning (RPL): Experienced traditional craftspeople can obtain direct certification through assessment without undergoing long full-time courses.
- SHG & Enterprise Credit Linkage: Convergence with Mudra, Stand-Up India, and state SC Finance Development Corporations.
- Adarsh Gram Clusters: Infrastructure support, Common Facility Centres (CFCs), and collective machinery hubs.
`;

/**
 * Searches relevant verified occupation records based on user query
 */
function findRelevantOccupations(query: string, records: OccupationRecord[]): OccupationRecord[] {
  const qLower = query.toLowerCase();
  const matched: OccupationRecord[] = [];

  for (const rec of records) {
    const roleLower = rec.job_role.toLowerCase();
    const descLower = rec.description.toLowerCase();
    const sectorLower = rec.sector_skill_council.toLowerCase();
    const codeLower = rec.qp_nos_code.toLowerCase();

    if (
      (qLower.includes('solar') || qLower.includes('सौर') || qLower.includes('सोलर') || qLower.includes('pump') || qLower.includes('suryamitra')) &&
      (roleLower.includes('solar') || sectorLower.includes('green') || descLower.includes('solar'))
    ) {
      matched.push(rec);
    } else if (
      (qLower.includes('weav') || qLower.includes('बुनाई') || qLower.includes('बुनकर') || qLower.includes('saree') || qLower.includes('कपड़ा') || qLower.includes('handloom') || qLower.includes('jacquard')) &&
      (roleLower.includes('weaver') || sectorLower.includes('textile') || descLower.includes('weaving'))
    ) {
      matched.push(rec);
    } else if (
      (qLower.includes('food') || qLower.includes('अनाज') || qLower.includes('अचार') || qLower.includes('पापड़') || qLower.includes('मसाला') || qLower.includes('processing') || qLower.includes('agro') || qLower.includes('dairy') || qLower.includes('दूध')) &&
      (roleLower.includes('food') || sectorLower.includes('food') || descLower.includes('processing'))
    ) {
      matched.push(rec);
    } else if (
      (qLower.includes('electric') || qLower.includes('बिजली') || qLower.includes('वायरिंग') || qLower.includes('motor') || qLower.includes('तार') || qLower.includes('wiring')) &&
      (roleLower.includes('electrical') || sectorLower.includes('power') || descLower.includes('wiring'))
    ) {
      matched.push(rec);
    } else if (
      (qLower.includes('mason') || qLower.includes('मिस्त्री') || qLower.includes('मकान') || qLower.includes('निर्माण') || qLower.includes('brick') || qLower.includes('cement')) &&
      (roleLower.includes('mason') || sectorLower.includes('construction') || descLower.includes('masonry'))
    ) {
      matched.push(rec);
    } else if (
      (qLower.includes('leather') || qLower.includes('चमड़ा') || qLower.includes('जूता') || qLower.includes('chappal') || qLower.includes('footwear')) &&
      (roleLower.includes('leather') || sectorLower.includes('leather') || descLower.includes('leather'))
    ) {
      matched.push(rec);
    } else if (
      (qLower.includes('kheti') || qLower.includes('कृषि') || qLower.includes('जैविक') || qLower.includes('organic') || qLower.includes('farm') || qLower.includes('खाद')) &&
      (roleLower.includes('organic') || sectorLower.includes('agriculture') || descLower.includes('organic'))
    ) {
      matched.push(rec);
    } else if (qLower.includes(codeLower) || roleLower.split(' ').some((w) => w.length > 4 && qLower.includes(w))) {
      matched.push(rec);
    }
  }

  return matched.slice(0, 3);
}

/**
 * Intelligent deterministic fallback when external AI API is unavailable
 */
function buildDeterministicFallback(
  userQuery: string,
  matchedOccs: OccupationRecord[],
  langMode: 'hindi' | 'english' | 'hinglish'
) {
  const qLower = userQuery.toLowerCase();

  // 1. Greetings
  if (qLower.includes('hello') || qLower.includes('hi') || qLower.includes('namaste') || qLower.includes('नमस्ते') || qLower.includes('hey') || qLower.includes('who are you') || qLower.includes('kaun ho')) {
    if (langMode === 'hindi') {
      return {
        reply: 'नमस्ते! मैं जीविका साथी हूँ 🤝।\n\nमैं पीएम-अजय (PM-AJAY) और जीविका मैप का आधिकारिक डिजिटल सहायक हूँ। आप मुझसे कौशल प्रशिक्षण, सरकारी अनुदान (टूलकिट सहायता), स्वरोज़गार, करियर मार्गदर्शन या किसी भी सामान्य विषय पर पूछ सकते हैं। आप आज क्या जानना चाहते हैं?',
        quickActions: ['🎓 Skill सीखना', '💼 Job ढूँढना', '🏪 अपना काम शुरू करना', '📋 योजना ढूँढना', '📍 जिले में अवसर देखना'],
        isFallback: true,
      };
    } else if (langMode === 'hinglish') {
      return {
        reply: 'Namaste! Main Jeevika Saathi hoon 🤝.\n\nMain PM-AJAY aur Jeevika Map ka digital assistant hoon. Aap mujhse skill training, govt toolkit grants, self-employment, career guidance ya general sawalon ke baare mein pooch sakte hain. Aap aaj kya explore karna chahte hain?',
        quickActions: ['🎓 Skill Seekhna', '💼 Job Dhoondhna', '🏪 Apna Kaam Shuru Karna', '📋 Yojana Dekhna'],
        isFallback: true,
      };
    } else {
      return {
        reply: 'Hello! I am Jeevika Saathi 🤝, your digital guide for the PM-AJAY Jeevika Map platform.\n\nI can assist you with skill certifications, government toolkit subsidies, self-employment pathways, or general career guidance. How can I assist you today?',
        quickActions: ['🎓 Learn a Skill', '💼 Find a Job', '🏪 Start a Business', '📋 Explore Schemes'],
        isFallback: true,
      };
    }
  }

  // 2. Questions about NSQF
  if (qLower.includes('nsqf') || qLower.includes('कौशल ढांचा')) {
    if (langMode === 'hindi') {
      return {
        reply: 'राष्ट्रीय कौशल योग्यता ढांचा (NSQF - National Skills Qualification Framework) एक राष्ट्रव्यापी योग्यता प्रणाली है जो कौशल, ज्ञान और व्यावहारिक योग्यता को लेवल 1 से 8 तक मानकीकृत करती है।\n\nजीविका मैप (Jeevika Map) में सभी जॉब रोल (जैसे सौर मित्र, मास्टर बुनकर, खाद्य प्रसंस्करण) NCVET और NSQF के मानकों के अनुसार सत्यापित हैं, जिससे आपकी ट्रेनिंग पूरे भारत में मान्य होती है।',
        quickActions: ['🎓 NSQF Job Roles देखें', '📋 PM-AJAY सहायता समझें', '🚀 Start Mapping'],
        isFallback: true,
      };
    } else if (langMode === 'hinglish') {
      return {
        reply: 'NSQF (National Skills Qualification Framework) ek nation-wide qualification standard hai jo skills aur experience ko Level 1 se Level 8 tak certify karta hai.\n\nJeevika Map mein listed sabhi roles (Solar, Handloom, Food Processing, Wiring, etc.) NCVET aur NSQF certified hain, jisse aapka certificate poore India mein valid hota hai.',
        quickActions: ['🎓 NSQF Job Roles Dekhein', '📋 PM-AJAY Grants', '🚀 Start Mapping'],
        isFallback: true,
      };
    } else {
      return {
        reply: 'NSQF (National Skills Qualification Framework) is a nationally integrated, competency-based framework that organizes qualifications according to a series of levels (Level 1 to Level 8).\n\nIn Jeevika Map, all recommended job roles are aligned with NCVET/NSQF standards, ensuring nationwide industry recognition and direct PM-AJAY grant eligibility.',
        quickActions: ['🎓 Explore NSQF Job Roles', '📋 PM-AJAY Scheme Info', '🚀 Start Mapping'],
        isFallback: true,
      };
    }
  }

  // 3. Questions about Resume / Interview / Career Preparation
  if (qLower.includes('resume') || qLower.includes('cv') || qLower.includes('बायोडाटा') || qLower.includes('interview') || qLower.includes('इंटरव्यू') || qLower.includes('साक्षात्कार')) {
    if (langMode === 'hindi') {
      return {
        reply: 'एक प्रभावी बायोडाटा (Resume) और इंटरव्यू की तैयारी के मुख्य बिंदु:\n\n1. **मूल जानकारी**: पूरा नाम, मोबाइल नंबर और गृह जिला।\n2. **व्यावहारिक कौशल**: आपका मुख्य हुनर (जैसे सिलाई, वायरिंग, सोलर, बुनाई) और अनुभव के वर्ष।\n3. **कौशल प्रमाणन**: NSQF / ITI / RPL प्रमाण पत्र।\n4. **इंटरव्यू टिप्स**: अपने पिछले काम और टूल्स (औज़ारों) के बारे में आत्मविश्वास से समझाएं।\n\nJeevika Map पर "Start Mapping" पूरा करके आप अपना डिजिटल आजीविका डॉसियर भी स्वतः तैयार कर सकते हैं!',
        quickActions: ['🚀 डिजिटल प्रोफाइल बनाएं', '🎓 Skill कोर्सेज देखें', '💼 अवसर देखें'],
        isFallback: true,
      };
    } else {
      return {
        reply: 'Key steps for Resume & Interview Preparation:\n\n1. **Contact & Basic Details**: Full name, contact number, and district.\n2. **Core Trade Skills**: Your hands-on experience and tool proficiency.\n3. **Certifications**: Mention any NSQF / RPL / ITI credentials.\n4. **Interview Tip**: Clearly explain hands-on projects and problem-solving examples.\n\nYou can also generate your verified Digital Livelihood Dossier directly by completing "Start Mapping" on Jeevika Map!',
        quickActions: ['🚀 Create Livelihood Dossier', '🎓 Explore Skills', '💼 Local Opportunities'],
        isFallback: true,
      };
    }
  }

  // 4. Questions about PM-AJAY
  if (qLower.includes('pm-ajay') || qLower.includes('pmajay') || qLower.includes('पीएम-अजय') || qLower.includes('योजना')) {
    if (langMode === 'hindi') {
      return {
        reply: 'पीएम-अजय (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार की प्रमुख योजना है।\n\n**प्रमुख लाभ**:\n• अनुसूचित जाति (SC) कारीगरों व युवाओं को ₹50,000 तक की टूलकिट एवं पूंजी अनुदान सहायता।\n• NCVET प्रमाणित निःशुल्क कौशल प्रशिक्षण व पूर्व अनुभव प्रमाणन (RPL)।\n• स्वयं सहायता समूहों (SHG) व मुद्रा/स्टैंड-अप इंडिया के साथ ऋण लिंकेज।\n• आदर्श ग्राम क्लस्टर आधारित साझा सुविधा केंद्र (CFC)।',
        quickActions: ['📋 टूलकिट अनुदान देखें', '🎓 Skill मैपिंग शुरू करें', '📍 प्रशिक्षण केंद्र खोजें'],
        isFallback: true,
      };
    } else {
      return {
        reply: 'PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) is a flagship initiative of the Ministry of Social Justice and Empowerment, Government of India.\n\n**Core Highlights**:\n• Up to ₹50,000 toolkit subsidy and capital grant for eligible SC artisans.\n• Free NSQF-aligned skill certification and Recognition of Prior Learning (RPL).\n• SHG and micro-enterprise credit linkages under Mudra and Stand-Up India.\n• Common Facility Centres (CFC) in high-priority cluster villages.',
        quickActions: ['📋 PM-AJAY Toolkit Grant', '🎓 Start Livelihood Mapping', '📍 Find Training Hub'],
        isFallback: true,
      };
    }
  }

  // 5. Matched specific occupation in Jeevika Map
  if (matchedOccs.length > 0) {
    const primary = matchedOccs[0];
    const pathway = {
      goal: userQuery,
      relevantSkill: primary.job_role,
      nsqfJobRole: `${primary.job_role} (${primary.qp_nos_code})`,
      qpNosCode: primary.qp_nos_code,
      nsqfLevel: primary.nsqf_level,
      schemeSupport: 'PM-AJAY टूलकिट अनुदान (Up to ₹50,000) एवं NCVET कौशल प्रमाणन',
      opportunity: `${primary.sector_skill_council} क्लस्टर एवं स्थानीय मांग लिंकेज`,
      nextStep: 'पोर्टल पर "Start Mapping" के माध्यम से अपनी प्रोफाइल रजिस्टर करें।',
    };

    const whyExplanation = `यह अनुशंसा आपके कौशल विवरण और NCVET National Qualifications Register (NQR) के रिकॉर्ड ${primary.qp_nos_code} पर आधारित है।`;

    if (langMode === 'hindi') {
      return {
        reply: `बिल्कुल! आपके लक्ष्य के लिए Jeevika Map में सत्यापित आजीविका मार्ग उपलब्ध है:\n\n• **जॉब रोल**: ${primary.job_role}\n• **QP-NOS कोड**: ${primary.qp_nos_code} (NSQF Level ${primary.nsqf_level})\n• **प्रशिक्षण अवधि**: ${primary.notional_hours} घंटे\n• **सरकारी सहायता**: PM-AJAY टूलकिट सहायता (₹50,000 तक) और RPL पूर्व अनुभव प्रमाणन।\n\nआप नीचे दिए गए विकल्पों से आगे बढ़ सकते हैं:`,
        pathway,
        whyExplanation,
        quickActions: ['🎓 Skill मैपिंग शुरू करें', '🏪 टूलकिट अनुदान देखें', '📍 प्रशिक्षण केंद्र खोजें'],
        isFallback: true,
      };
    } else if (langMode === 'hinglish') {
      return {
        reply: `Bilkul! Aapke goal ke liye Jeevika Map mein verified livelihood pathway available hai:\n\n• **Job Role**: ${primary.job_role}\n• **QP-NOS Code**: ${primary.qp_nos_code} (NSQF Level ${primary.nsqf_level})\n• **Training Duration**: ${primary.notional_hours} Hours\n• **Govt Support**: PM-AJAY toolkit sahayata (Up to ₹50,000) aur RPL certification.\n\nAap niche diye gaye options se aage badh sakte hain:`,
        pathway,
        whyExplanation,
        quickActions: ['🎓 Skill Mapping Shuru Karein', '🏪 Toolkit Anudaan Dekhein', '📍 Training Center Dhoondhein'],
        isFallback: true,
      };
    } else {
      return {
        reply: `Here is the verified Jeevika Map livelihood pathway matching your goal:\n\n• **Job Role**: ${primary.job_role}\n• **QP-NOS Code**: ${primary.qp_nos_code} (NSQF Level ${primary.nsqf_level})\n• **Training Duration**: ${primary.notional_hours} Notional Hours\n• **Govt Support**: PM-AJAY Toolkit Subsidy (Up to ₹50,000) and RPL Certification.\n\nYou can proceed using the actions below:`,
        pathway,
        whyExplanation,
        quickActions: ['🎓 Start Livelihood Mapping', '🏪 Explore PM-AJAY Grants', '📍 Find Training Hub'],
        isFallback: true,
      };
    }
  }

  // 6. Honest service message when AI service is unavailable
  if (langMode === 'hindi') {
    return {
      reply: `⚠️ जीविका साथी AI सेवा अभी अस्थायी रूप से अनुपलब्ध है।\n\nकृपया कुछ देर बाद पुनः प्रयास करें या सीधे "Start Mapping" के माध्यम से अपनी आजीविका प्रोफाइल व योजनाएं देखें।`,
      quickActions: ['🚀 Start Mapping', '📋 PM-AJAY योजना देखें', '📍 जिले में अवसर देखें'],
      isFallback: true,
    };
  } else if (langMode === 'hinglish') {
    return {
      reply: `⚠️ Jeevika Saathi AI assistant abhi temporarily unavailable hai.\n\nKripya thodi der baad dobara try karein ya seedhe "Start Mapping" se apni livelihood profile check karein.`,
      quickActions: ['🚀 Start Mapping', '📋 PM-AJAY Yojana', '📍 District Opportunities'],
      isFallback: true,
    };
  } else {
    return {
      reply: `⚠️ Jeevika Saathi AI assistant is temporarily unavailable.\n\nPlease try again in a moment or use "Start Mapping" to explore livelihood opportunities directly.`,
      quickActions: ['🚀 Start Mapping', '📋 Explore Schemes', '📍 District Hubs'],
      isFallback: true,
    };
  }
}

/**
 * Detects approximate language/script mode of user prompt
 */
function detectLanguage(text: string): 'hindi' | 'english' | 'hinglish' {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return 'hindi';

  const lower = text.toLowerCase();
  const hinglishMarkers = [
    'karna', 'karo', 'mujhe', 'chahiye', 'kaise', 'kare', 'kya', 'hai', 'hain', 'mein',
    'shuru', 'seekhna', 'dhoondhna', 'kaunsi', 'kaun', 'aap', 'mera', 'meri', 'bataiye', 'mil', 'sakta', 'banao', 'batao'
  ];

  const isHinglish = hinglishMarkers.some((marker) => lower.includes(marker));
  if (isHinglish) return 'hinglish';

  return 'english';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: RequestPayload = await req.json();
    const userMessage = (payload.message || '').trim();

    if (!userMessage) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Message text is required.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const langMode = detectLanguage(userMessage);

    // 1. Fetch live active occupations from Supabase DB or use verified catalog
    let activeOccupations = VERIFIED_FALLBACK_OCCUPATIONS;
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: dbOccs } = await supabase
          .from('occupation_catalog')
          .select('id, qp_nos_code, job_role, sector_skill_council, nsqf_level, notional_hours, rpl_allowed, entry_qualification_minimum, description')
          .eq('is_active', true);
        if (dbOccs && dbOccs.length > 0) {
          activeOccupations = dbOccs;
        }
      }
    } catch (_dbErr) {
      console.warn('[ChatAssistant] DB query fallback used:', _dbErr);
    }

    // 2. Retrieve relevant grounded records matching user intent
    const matchedOccupations = findRelevantOccupations(userMessage, activeOccupations);

    // 3. Check for Groq API key
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const groqModel = Deno.env.get('GROQ_MODEL') || 'llama-3.3-70b-versatile';

    if (!groqApiKey) {
      console.warn('[ChatAssistant] GROQ_API_KEY secret is not set in Supabase Edge Function environment.');
      const fallbackResult = buildDeterministicFallback(userMessage, matchedOccupations, langMode);
      return new Response(
        JSON.stringify({
          success: true,
          ...fallbackResult,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Construct comprehensive hybrid system instruction
    const systemInstructionText = `You are "Jeevika Saathi 🤝", a helpful, empathetic, and versatile bilingual conversational AI assistant for the Government of India's PM-AJAY Jeevika Map platform.

CORE PRINCIPLES & INSTRUCTIONS:
1. GENERAL KNOWLEDGE & EVERYDAY CONVERSATION:
   - For general educational, science (e.g. photosynthesis), coding (e.g. Python), career guidance (e.g. resume writing, interview preparation), and conversational questions, answer directly, thoroughly, and naturally using your general AI knowledge.
   - Do NOT force unrelated questions into Jeevika Map.
   - Do NOT claim that general questions require Jeevika Map data verification.

2. JEEVIKA MAP & GOVERNMENT LIVELIHOOD PATHWAYS:
   - When a user asks about livelihood trades (e.g. solar technician, tailoring/sewing, weaving, dairy farming, electrical, masonry), government schemes (PM-AJAY toolkit grants up to ₹50,000 for SC beneficiaries), NSQF qualification levels, or RPL skill certification, provide structured, verified guidance using the verified Jeevika Map context provided with the prompt.
   - Never fabricate non-existent government schemes, unauthorized grant sums, or fake QP/NOS codes.

3. MIXED QUERIES:
   - If a question combines general guidance and livelihood trades (e.g. "How do I start a business in dairy farming?"), give practical general advice along with relevant Jeevika Map training and grant pathways.

4. LANGUAGE & TONE:
   - Automatically mirror the user's language:
     - If the user asks in Hindi (Devanagari), reply in polite, clear Hindi.
     - If the user asks in Hinglish (Roman Hindi, e.g. "Mujhe job chahiye"), reply in natural, conversational Hinglish.
     - If the user asks in English, reply in clean, accessible English.
   - Structure your answers with clear formatting, bullet points, and bold text for readability.`;

    // 5. Build conversation payload for Groq OpenAI-compatible Chat Completions API
    const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      {
        role: 'system',
        content: systemInstructionText,
      },
    ];

    // Add conversation history if available
    if (payload.history && Array.isArray(payload.history) && payload.history.length > 0) {
      const recentHistory = payload.history.slice(-8);
      for (const turn of recentHistory) {
        if (turn.content && turn.content.trim()) {
          messages.push({
            role: turn.role === 'assistant' ? 'assistant' : 'user',
            content: turn.content.trim(),
          });
        }
      }
    }

    // Prepare current user turn content
    let currentTurnText = userMessage;
    if (matchedOccupations.length > 0) {
      const contextText = `[VERIFIED JEEVIKA MAP DATA RELEVANT TO QUERY]
${VERIFIED_PMAJAY_INFO}

MATCHED NSQF QUALIFICATION RECORDS:
${JSON.stringify(matchedOccupations, null, 2)}`;

      currentTurnText = `${contextText}\n\n[USER QUESTION]\n${userMessage}`;
    }

    messages.push({
      role: 'user',
      content: currentTurnText,
    });

    const aiRes = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: groqModel,
        messages,
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('[ChatAssistant] Groq API HTTP Error:', aiRes.status, errText);
      const fallbackResult = buildDeterministicFallback(userMessage, matchedOccupations, langMode);
      return new Response(
        JSON.stringify({
          success: true,
          ...fallbackResult,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiRes.json();
    const candidateText = aiData?.choices?.[0]?.message?.content;

    if (!candidateText) {
      console.warn('[ChatAssistant] Groq returned empty text response:', JSON.stringify(aiData));
      const fallbackResult = buildDeterministicFallback(userMessage, matchedOccupations, langMode);
      return new Response(
        JSON.stringify({
          success: true,
          ...fallbackResult,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build structured pathway if a verified occupation matched
    let pathway = undefined;
    let whyExplanation = undefined;
    if (matchedOccupations.length > 0) {
      const primary = matchedOccupations[0];
      pathway = {
        goal: userMessage,
        relevantSkill: primary.job_role,
        nsqfJobRole: `${primary.job_role} (${primary.qp_nos_code})`,
        qpNosCode: primary.qp_nos_code,
        nsqfLevel: primary.nsqf_level,
        schemeSupport: 'PM-AJAY टूलकिट अनुदान (Up to ₹50,000) एवं NCVET कौशल प्रमाणन',
        opportunity: `${primary.sector_skill_council} क्लस्टर एवं स्थानीय मांग लिंकेज`,
        nextStep: 'पोर्टल पर "Start Mapping" के माध्यम से अपनी प्रोफाइल रजिस्टर करें।',
      };
      whyExplanation = `यह विकल्प आपके द्वारा पूछे गए हुनर और NCVET National Qualifications Register (NQR) के रिकॉर्ड (${primary.qp_nos_code}) के सीधे मिलान पर आधारित है।`;
    }

    const quickActions =
      langMode === 'english'
        ? ['🎓 Learn a Skill', '💼 Find a Job', '🏪 Start a Business', '📋 Explore Schemes']
        : ['🎓 Skill सीखना', '💼 Job ढूँढना', '🏪 अपना काम शुरू करना', '📋 योजना ढूँढना', '📍 जिले में अवसर देखना'];

    return new Response(
      JSON.stringify({
        success: true,
        reply: candidateText,
        pathway,
        whyExplanation,
        quickActions,
        isFallback: false,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[ChatAssistant] Unexpected error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Connection error. Please try again.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
