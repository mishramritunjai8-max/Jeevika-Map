// ==============================================================================
// Service: Jeevika Saathi Chat Service
// Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
//
// Purpose:
// Client-side orchestrator that connects the floating chat UI with the
// serverless 'chat-assistant' Edge Function and provides a verified
// deterministic offline fallback.
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { OFFICIAL_PILOT_OCCUPATIONS } from './occupationCatalogService';
import type { ChatMessage, ChatRequestPayload, ChatResponsePayload, LivelihoodPathwayData } from '../types/chat';

/**
 * Generates an RFC4122 v4 UUID
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Client-side intelligent fallback matching against verified local catalog and general topics
 */
const getLocalDeterministicResponse = (
  userMessage: string
): ChatResponsePayload => {
  const qLower = userMessage.toLowerCase();
  const isDevanagari = /[\u0900-\u097F]/.test(userMessage);

  // 1. Greetings & Identity
  if (qLower.includes('hello') || qLower.includes('hi') || qLower.includes('namaste') || qLower.includes('नमस्ते') || qLower.includes('hey') || qLower.includes('who are you') || qLower.includes('kaun ho')) {
    return {
      success: true,
      reply: isDevanagari
        ? 'नमस्ते! मैं जीविका साथी हूँ 🤝।\n\nमैं पीएम-अजय (PM-AJAY) और जीविका मैप का आधिकारिक डिजिटल सहायक हूँ। आप मुझसे कौशल प्रशिक्षण, सरकारी अनुदान (टूलकिट सहायता), स्वरोज़गार, करियर मार्गदर्शन या किसी भी सामान्य विषय पर पूछ सकते हैं। आप आज क्या जानना चाहते हैं?'
        : 'Namaste! Main Jeevika Saathi hoon 🤝. Main PM-AJAY aur Jeevika Map ka digital assistant hoon. Aap mujhse skill training, govt toolkit grants, self-employment, career guidance ya general sawalon ke baare mein pooch sakte hain.',
      quickActions: ['🎓 Skill सीखना', '💼 Job ढूँढना', '🏪 अपना काम शुरू करना', '📋 योजना ढूँढना', '📍 जिले में अवसर देखना'],
      isFallback: true,
    };
  }

  // 2. NSQF & Skilling Framework
  if (qLower.includes('nsqf') || qLower.includes('कौशल ढांचा')) {
    return {
      success: true,
      reply: isDevanagari
        ? 'राष्ट्रीय कौशल योग्यता ढांचा (NSQF) भारत सरकार का मानकीकृत कौशल फ्रेमवर्क है (Level 1 से 8)।\n\nजीविका मैप (Jeevika Map) में सूचीबद्ध सभी जॉब रोल NCVET और NSQF के अनुसार सत्यापित हैं, जिससे आपका प्रमाण पत्र पूरे देश में मान्य होता है और आपको PM-AJAY टूलकिट अनुदान का सीधा लाभ मिलता है।'
        : 'NSQF (National Skills Qualification Framework) certifies skills from Level 1 to 8 across India. In Jeevika Map, all recommended job roles are NCVET & NSQF-aligned, giving you nationwide industry certification and PM-AJAY grant eligibility.',
      quickActions: ['🎓 NSQF Job Roles देखें', '📋 PM-AJAY सहायता समझें', '🚀 Start Mapping'],
      isFallback: true,
    };
  }

  // 3. Resume & Interview Guidance
  if (qLower.includes('resume') || qLower.includes('cv') || qLower.includes('बायोडाटा') || qLower.includes('interview') || qLower.includes('इंटरव्यू') || qLower.includes('साक्षात्कार')) {
    return {
      success: true,
      reply: isDevanagari
        ? 'एक प्रभावी बायोडाटा (Resume) और इंटरव्यू की तैयारी के मुख्य बिंदु:\n\n1. **मूल जानकारी**: पूरा नाम, मोबाइल नंबर और गृह जिला।\n2. **व्यावहारिक कौशल**: आपका मुख्य हुनर (जैसे सिलाई, वायरिंग, सोलर, बुनाई) और अनुभव के वर्ष।\n3. **कौशल प्रमाणन**: NSQF / ITI / RPL प्रमाण पत्र।\n4. **इंटरव्यू टिप्स**: अपने पिछले काम और टूल्स (औज़ारों) के बारे में आत्मविश्वास से समझाएं।\n\nJeevika Map पर "Start Mapping" पूरा करके आप अपना डिजिटल आजीविका डॉसियर भी स्वतः तैयार कर सकते हैं!'
        : 'Key steps for Resume & Interview Preparation:\n\n1. Contact & Location Details\n2. Core Trade Skills & Tool Proficiency\n3. NSQF / RPL / ITI Certifications\n4. Interview tip: Confidently explain your practical experience.\n\nYou can also generate your verified Digital Livelihood Dossier directly via "Start Mapping" on Jeevika Map!',
      quickActions: ['🚀 डिजिटल प्रोफाइल बनाएं', '🎓 Skill कोर्सेज देखें', '💼 अवसर देखें'],
      isFallback: true,
    };
  }

  // 4. PM-AJAY Scheme
  if (qLower.includes('pm-ajay') || qLower.includes('pmajay') || qLower.includes('पीएम-अजय') || qLower.includes('योजना')) {
    return {
      success: true,
      reply: isDevanagari
        ? 'पीएम-अजय (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार की प्रमुख योजना है।\n\n**प्रमुख लाभ**:\n• अनुसूचित जाति (SC) कारीगरों व युवाओं को ₹50,000 तक की टूलकिट एवं पूंजी अनुदान सहायता।\n• NCVET प्रमाणित निःशुल्क कौशल प्रशिक्षण व पूर्व अनुभव प्रमाणन (RPL)।\n• स्वयं सहायता समूहों (SHG) व मुद्रा/स्टैंड-अप इंडिया के साथ ऋण लिंकेज।\n• आदर्श ग्राम क्लस्टर आधारित साझा सुविधा केंद्र (CFC)।'
        : 'PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) provides up to ₹50,000 toolkit subsidy and capital grant for eligible SC artisans, free NSQF skill training, RPL certification, and SHG enterprise credit linkages.',
      quickActions: ['📋 टूलकिट अनुदान देखें', '🎓 Skill मैपिंग शुरू करें', '📍 प्रशिक्षण केंद्र खोजें'],
      isFallback: true,
    };
  }

  // 5. Match against specific pilot occupations in Jeevika Map
  const matched = OFFICIAL_PILOT_OCCUPATIONS.find((occ) => {
    const role = occ.job_role.toLowerCase();
    const sector = occ.sector_skill_council.toLowerCase();
    const desc = occ.description.toLowerCase();
    const qp = occ.qp_nos_code.toLowerCase();

    if ((qLower.includes('solar') || qLower.includes('सौर') || qLower.includes('सोलर') || qLower.includes('pump')) && (role.includes('solar') || sector.includes('green') || desc.includes('solar'))) return true;
    if ((qLower.includes('weav') || qLower.includes('बुनाई') || qLower.includes('बुनकर') || qLower.includes('saree') || qLower.includes('handloom')) && (role.includes('weaver') || sector.includes('textile') || desc.includes('weaving'))) return true;
    if ((qLower.includes('food') || qLower.includes('अनाज') || qLower.includes('पापड़') || qLower.includes('मसाला') || qLower.includes('dairy') || qLower.includes('दूध')) && (role.includes('food') || sector.includes('food') || desc.includes('processing'))) return true;
    if ((qLower.includes('electric') || qLower.includes('बिजली') || qLower.includes('wiring') || qLower.includes('वायरिंग')) && (role.includes('electrical') || sector.includes('power') || desc.includes('wiring'))) return true;
    if ((qLower.includes('mason') || qLower.includes('मिस्त्री') || qLower.includes('निर्माण')) && (role.includes('mason') || sector.includes('construction') || desc.includes('masonry'))) return true;
    if ((qLower.includes('leather') || qLower.includes('चमड़ा') || qLower.includes('जूता')) && (role.includes('leather') || sector.includes('leather') || desc.includes('leather'))) return true;
    if ((qLower.includes('kheti') || qLower.includes('कृषि') || qLower.includes('जैविक') || qLower.includes('organic')) && (role.includes('organic') || sector.includes('agriculture') || desc.includes('organic'))) return true;
    return qLower.includes(qp) || role.split(' ').some((w) => w.length > 4 && qLower.includes(w));
  });

  if (matched) {
    const pathway: LivelihoodPathwayData = {
      goal: userMessage,
      relevantSkill: matched.job_role,
      nsqfJobRole: `${matched.job_role} (${matched.qp_nos_code})`,
      qpNosCode: matched.qp_nos_code,
      nsqfLevel: matched.nsqf_level,
      schemeSupport: 'PM-AJAY टूलकिट अनुदान (₹50,000 तक) एवं NCVET कौशल प्रमाणन',
      opportunity: `${matched.sector_skill_council} क्लस्टर एवं स्थानीय मांग लिंकेज`,
      nextStep: 'पोर्टल पर "Start Mapping" के माध्यम से अपनी प्रोफाइल रजिस्टर करें।',
    };

    return {
      success: true,
      reply: isDevanagari
        ? `बिल्कुल! आपके लक्ष्य के लिए Jeevika Map में सत्यापित आजीविका मार्ग उपलब्ध है:\n\n• **जॉब रोल**: ${matched.job_role}\n• **QP-NOS कोड**: ${matched.qp_nos_code} (NSQF Level ${matched.nsqf_level})\n• **प्रशिक्षण अवधि**: ${matched.notional_hours} घंटे\n• **सरकारी सहायता**: PM-AJAY टूलकिट सहायता (₹50,000 तक) और RPL पूर्व अनुभव प्रमाणन।`
        : `Bilkul! Aapke goal ke liye Jeevika Map mein verified livelihood pathway available hai:\n\n• **Job Role**: ${matched.job_role}\n• **QP-NOS Code**: ${matched.qp_nos_code} (NSQF Level ${matched.nsqf_level})\n• **Training Duration**: ${matched.notional_hours} Hours\n• **Govt Support**: PM-AJAY toolkit sahayata (Up to ₹50,000) aur RPL certification.`,
      pathway,
      whyExplanation: `यह अनुशंसा आपके कौशल विवरण और NCVET National Qualifications Register (NQR) के आधिकारिक रिकॉर्ड ${matched.qp_nos_code} पर आधारित है।`,
      quickActions: ['🎓 Skill मैपिंग शुरू करें', '🏪 टूलकिट अनुदान देखें', '📍 प्रशिक्षण केंद्र खोजें'],
      isFallback: true,
    };
  }

  // 6. Honest message when offline / unindexed query without AI connection
  return {
    success: false,
    reply: isDevanagari
      ? '⚠️ जीविका साथी AI सेवा अभी कनेक्ट नहीं है (Supabase कॉन्फ़िगरेशन अनुपलब्ध है)।\n\nसामान्य ज्ञान या विस्तृत AI संवाद के लिए कृपया बैकएंड AI सेवा कनेक्ट करें। आप नीचे दिए गए विकल्पों से आधिकारिक PM-AJAY योजनाएं व आजीविका मैपिंग देख सकते हैं।'
      : '⚠️ Jeevika Saathi AI service is currently not connected (Supabase configuration missing).\n\nFor open-ended AI conversation, please connect the backend AI service. You can use the options below to explore verified PM-AJAY schemes and livelihood pathways.',
    quickActions: ['🚀 Start Mapping', '📋 PM-AJAY योजना देखें', '📍 जिले में अवसर देखें'],
    isFallback: true,
  };
};

/**
 * Sends message to Jeevika Saathi AI and retrieves grounded answer
 */
export const sendChatMessage = async (
  payload: ChatRequestPayload
): Promise<ChatMessage> => {
  const timestamp = new Date().toISOString();

  // If Supabase is unconfigured, notify clearly that live AI requires backend connection
  if (!isSupabaseConfigured()) {
    console.warn('[ChatService] Supabase credentials (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) are not configured.');
    const fallbackRes = getLocalDeterministicResponse(payload.message);
    return {
      id: generateUUID(),
      role: 'assistant',
      content: fallbackRes.reply,
      timestamp,
      pathway: fallbackRes.pathway,
      quickActions: fallbackRes.quickActions,
      whyExplanation: fallbackRes.whyExplanation,
      isFallback: true,
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('chat-assistant', {
      body: {
        message: payload.message,
        history: payload.history,
        district: payload.district,
        state: payload.state,
      },
    });

    if (error || !data || !data.success) {
      console.warn('[ChatService] chat-assistant Edge Function returned error:', error || data);
      const isDevanagari = /[\u0900-\u097F]/.test(payload.message);
      const fallbackContent = isDevanagari
        ? '⚠️ जीविका साथी AI सेवा से अभी संपर्क नहीं हो सका। कृपया कुछ क्षण बाद पुनः प्रयास करें या सीधे "Start Mapping" का उपयोग करें।'
        : '⚠️ Jeevika Saathi AI service is temporarily unavailable. Please try again in a moment or explore "Start Mapping".';

      return {
        id: generateUUID(),
        role: 'assistant',
        content: data?.reply || fallbackContent,
        timestamp,
        pathway: data?.pathway,
        quickActions: data?.quickActions || ['🚀 Start Mapping', '📋 योजनाएं देखें'],
        whyExplanation: data?.whyExplanation,
        isFallback: true,
      };
    }

    return {
      id: generateUUID(),
      role: 'assistant',
      content: data.reply,
      timestamp,
      pathway: data.pathway,
      quickActions: data.quickActions,
      whyExplanation: data.whyExplanation,
      isFallback: Boolean(data.isFallback),
    };
  } catch (err) {
    console.warn('[ChatService] Network exception invoking chat-assistant:', err);
    const isDevanagari = /[\u0900-\u097F]/.test(payload.message);
    return {
      id: generateUUID(),
      role: 'assistant',
      content: isDevanagari
        ? '⚠️ जीविका साथी AI सेवा से अभी संपर्क नहीं हो सका। कृपया कुछ क्षण बाद पुनः प्रयास करें।'
        : '⚠️ Jeevika Saathi AI service is temporarily unreachable. Please try again in a moment.',
      timestamp,
      quickActions: ['🚀 Start Mapping', '📋 योजनाएं देखें'],
      isFallback: true,
    };
  }
};
