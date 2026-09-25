// ==============================================================================
// Translations Dictionary: Jeevika Map Landing Page
// Supported Languages: en (English), hi (Hindi), mr (Marathi), te (Telugu), bn (Bengali)
// ==============================================================================

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'te' | 'bn';

export interface Translations {
  // TopGovBar
  govIndia: string;
  govMinistry: string;
  skipToMain: string;
  textSize: string;
  contrastStandard: string;
  contrastHigh: string;
  langLabel: string;

  // Navbar
  portalSubtitle: string;
  navHome: string;
  navHowItWorks: string;
  navPathways: string;
  navImpact: string;
  navAbout: string;
  navOfficer: string;
  startMappingBtn: string;

  // Hero Section
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubtitle: string;
  heroPillSkill: string;
  heroPillJob: string;
  heroPillSelf: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroCardHeader: string;
  heroCardLiveBadge: string;
  heroCardCategory: string;
  heroCardTrade: string;
  heroCardIncome: string;
  heroCardRecommended: string;
  heroCardGovtGrant: string;
  heroCardAction: string;

  // Trust Strip (Pillars)
  pillar1Badge: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Badge: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Badge: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Badge: string;
  pillar4Title: string;
  pillar4Desc: string;

  // How It Works
  howBadge: string;
  howTitle: string;
  howSubtitle: string;
  howDesc: string;
  step1Stage: string;
  step1Tagline: string;
  step1Desc: string;
  step1Meta: string;
  step2Stage: string;
  step2Tagline: string;
  step2Desc: string;
  step2Meta: string;
  step3Stage: string;
  step3Tagline: string;
  step3Desc: string;
  step3Meta: string;
  step4Stage: string;
  step4Tagline: string;
  step4Desc: string;
  step4Meta: string;

  // Visualizer / Pathways
  visBadge: string;
  visTitle: string;
  visSubtitle: string;
  visDesc: string;
  visSelectLabel: string;
  visCurrentProfile: string;
  visMarketOpportunity: string;
  visNsqfPathway: string;
  visGrantSubsidy: string;
  visProjectedIncome: string;
  visTrainingDuration: string;
  visRplEligible: string;
  visAccreditedBy: string;
  visStartMappingCta: string;

  // Impact Stats
  statNoticeTitle: string;
  statNoticeDesc: string;
  statBadge: string;
  statTitle: string;
  statSubtitle: string;
  statDesc: string;
  stat1Num: string;
  stat1Label: string;
  stat1Sub: string;
  stat1Tag: string;
  stat2Num: string;
  stat2Label: string;
  stat2Sub: string;
  stat2Tag: string;
  stat3Num: string;
  stat3Label: string;
  stat3Sub: string;
  stat3Tag: string;
  stat4Num: string;
  stat4Label: string;
  stat4Sub: string;
  stat4Tag: string;

  // Footer
  footerAboutDesc: string;
  footerMinistryDesc: string;
  footerSectionsTitle: string;
  footerFrameworkTitle: string;
  footerGovernanceTitle: string;
  footerHome: string;
  footerHowItWorks: string;
  footerPathways: string;
  footerImpact: string;
  footerOfficerPortal: string;
  footerStartMapping: string;
  footerDisclaimersTitle: string;
  footerDisclaimerText: string;
  footerGovtOfIndia: string;
  footerNationalEmblem: string;
  footerCopyright: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  // --------------------------------------------------------------------------
  // ENGLISH (Default)
  // --------------------------------------------------------------------------
  en: {
    govIndia: 'Government of India',
    govMinistry: 'Ministry of Social Justice & Empowerment (PM-AJAY)',
    skipToMain: 'Skip to Main Content',
    textSize: 'Text Size:',
    contrastStandard: 'Standard View',
    contrastHigh: 'High Contrast',
    langLabel: 'Language:',

    portalSubtitle: 'Livelihood & NSQF Skilling Intelligence Portal',
    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navPathways: 'Livelihood Pathways',
    navImpact: 'Pilot Impact',
    navAbout: 'About PM-AJAY',
    navOfficer: 'Officer Portal',
    startMappingBtn: 'Start Livelihood Mapping',

    heroBadge: 'PM-AJAY Livelihood Intelligence & NSQF Skilling',
    heroHeadline1: 'Find your right livelihood pathway.',
    heroHeadline2: 'Connect with NSQF-certified skilling.',
    heroSubtitle: 'Find the right livelihood pathway • NSQF Skilling Trajectories',
    heroPillSkill: 'Skill Training',
    heroPillJob: 'Employment Opportunities',
    heroPillSelf: 'Self-Employment',
    heroPrimaryCta: 'Start Livelihood Mapping',
    heroSecondaryCta: 'Explore Pilot Pathways',
    heroCardHeader: 'Verified Beneficiary Pathway Simulation',
    heroCardLiveBadge: 'Pilot Case Study',
    heroCardCategory: 'Target Demographic: Scheduled Caste Artisans & Youth (PM-AJAY)',
    heroCardTrade: 'Current Trade: Informal Craft / Traditional Vocation',
    heroCardIncome: 'Current Income: ₹6,500 – ₹9,000 / month (Intermittent)',
    heroCardRecommended: 'Recommended Qualification: NSQF Level 4 Certified Job Role',
    heroCardGovtGrant: 'PM-AJAY Financial Support: ₹50,000 Toolkit Subsidy & Credit Linkage',
    heroCardAction: 'View Livelihood Trajectory',

    pillar1Badge: 'Mandate',
    pillar1Title: 'PM-AJAY Convergence',
    pillar1Desc: 'Targeted socio-economic livelihood convergence for Scheduled Caste (SC) beneficiaries under the Ministry of Social Justice & Empowerment.',
    pillar2Badge: 'Intelligence',
    pillar2Title: 'District Livelihood Mapping',
    pillar2Desc: 'Micro-level mapping of local resource clusters, raw materials, traditional artisanal skills, and real market demand.',
    pillar3Badge: 'Standardization',
    pillar3Title: 'NCVET / NSQF Alignment',
    pillar3Desc: 'All job roles and skilling trajectories are indexed against the National Skills Qualification Framework (Level 1 to 8).',
    pillar4Badge: 'Inclusion',
    pillar4Title: 'Multilingual & Voice-First',
    pillar4Desc: 'Intuitive vernacular interfaces and voice-assisted input designed for grassroots enumerators and rural learners.',

    howBadge: 'Operational Methodology',
    howTitle: 'How Jeevika Map Operates',
    howSubtitle: '4-Stage Evidence-Based Progression',
    howDesc: 'A seamless four-step progression connecting grassroots skills to nationwide NCVET certification, local enterprise, and PM-AJAY direct support.',
    step1Stage: 'Discover',
    step1Tagline: 'Household & Cluster Profiling',
    step1Desc: 'Grassroots enumerators and community cadres capture verified socio-economic profiles, traditional crafts, and existing livelihood assets.',
    step1Meta: 'Socio-Economic Base • Cluster Geo-Tagging',
    step2Stage: 'Understand',
    step2Tagline: 'Competency & Demand Synthesis',
    step2Desc: 'The platform benchmarks informal experience against formal qualification standards and synthesizes district industrial cluster demand.',
    step2Meta: 'Recognition of Prior Learning (RPL) Evaluation',
    step3Stage: 'Recommend',
    step3Tagline: 'NSQF-Aligned Trajectory',
    step3Desc: 'Personalized NSQF Qualification Packs (QP-NOS) are recommended for short-term bridge training to reliably upgrade household earning capacity.',
    step3Meta: 'National Qualifications Matrix • QP-NOS Matching',
    step4Stage: 'Act',
    step4Tagline: 'Convergence & Scheme Linkage',
    step4Desc: 'Seamless linkage to PM-AJAY capital subsidies, toolkit grants up to ₹50,000, accredited training center enrollment, and SHG credit.',
    step4Meta: 'PM-AJAY Capital Grant • Accredited Enrollment',

    visBadge: 'Livelihood Intelligence Simulator',
    visTitle: 'Interactive Livelihood Pathways',
    visSubtitle: 'Simulate Realistic Beneficiary Upward Trajectories',
    visDesc: 'Explore how informal traditional artisans transition from unorganized daily wages to NSQF-certified enterprise with PM-AJAY convergence support.',
    visSelectLabel: 'Select Pilot Beneficiary Persona:',
    visCurrentProfile: 'Baseline Profile & Informal Competencies',
    visMarketOpportunity: 'Local District Economic Opportunity',
    visNsqfPathway: 'NSQF Skilling Trajectory (NCVET Aligned)',
    visGrantSubsidy: 'PM-AJAY Financial & Capital Linkage',
    visProjectedIncome: 'Projected Monthly Income (Post-Certification)',
    visTrainingDuration: 'Bridge Training Duration',
    visRplEligible: 'RPL Prior Experience Certification Allowed',
    visAccreditedBy: 'Accrediting Sector Skill Council',
    visStartMappingCta: 'Start Mapping Your Own Pathway',

    statNoticeTitle: 'Pilot Modeling Notice',
    statNoticeDesc: 'Metrics presented below are synthesized pilot projections designed to demonstrate platform capability and are not official census records.',
    statBadge: 'Pilot Scope & Modeling',
    statTitle: 'Demonstrated Convergence Impact',
    statSubtitle: 'Targeted Milestones Across Priority Clusters',
    statDesc: 'Real-world data architecture designed to scale across 750+ districts nationwide under PM-AJAY guidelines.',
    stat1Num: '12+',
    stat1Label: 'Pilot Districts Mapped',
    stat1Sub: 'Priority cluster corridors across UP, Rajasthan, MP, Bihar & Tamil Nadu',
    stat1Tag: 'Pilot Model',
    stat2Num: '180+',
    stat2Label: 'NSQF Job Roles Indexed',
    stat2Sub: 'Official Qualification Packs (QP-NOS) across 14 Sector Skill Councils',
    stat2Tag: 'NCVET Standards',
    stat3Num: '3.1x',
    stat3Label: 'Average Income Delta',
    stat3Sub: 'Projected household income growth comparing informal wage to certified enterprise',
    stat3Tag: 'Projected Model',
    stat4Num: '100%',
    stat4Label: 'Voice & Vernacular Accessibility',
    stat4Sub: 'Comprehensive multi-language support and voice-assisted digital entry',
    stat4Tag: 'Inclusion Standard',

    footerAboutDesc: 'Under Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY), Jeevika Map provides AI-driven livelihood intelligence, NSQF skilling trajectories, and direct scheme convergence for SC communities.',
    footerMinistryDesc: 'Ministry of Social Justice & Empowerment, Government of India.',
    footerSectionsTitle: 'Portal Sections',
    footerFrameworkTitle: 'Standards & Frameworks',
    footerGovernanceTitle: 'Government Convergence',
    footerHome: 'Platform Home',
    footerHowItWorks: 'How It Works',
    footerPathways: 'Livelihood Pathways',
    footerImpact: 'Pilot Impact',
    footerOfficerPortal: 'Officer Command Console',
    footerStartMapping: 'Start Beneficiary Mapping',
    footerDisclaimersTitle: 'Platform Disclaimers',
    footerDisclaimerText: 'Jeevika Map is a government convergence platform. Grant sanction and training admissions are subject to verification under official PM-AJAY guidelines.',
    footerGovtOfIndia: 'Government of India',
    footerNationalEmblem: 'Satyameva Jayate',
    footerCopyright: '© Jeevika Map • PM-AJAY Livelihood Convergence Platform. All rights reserved.',
  },

  // --------------------------------------------------------------------------
  // HINDI (Preserved Official Devanagari Wording)
  // --------------------------------------------------------------------------
  hi: {
    govIndia: 'भारत सरकार',
    govMinistry: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय (पीएम-अजय)',
    skipToMain: 'मुख्य सामग्री पर जाएँ',
    textSize: 'अक्षर आकार:',
    contrastStandard: 'सामान्य दृश्य',
    contrastHigh: 'कंट्रास्ट दृश्य',
    langLabel: 'भाषा:',

    portalSubtitle: 'आजीविका एवं एनएसक्यूएफ कौशल पोर्टल',
    navHome: 'होम',
    navHowItWorks: 'यह कैसे काम करता है',
    navPathways: 'आजीविका के अवसर',
    navImpact: 'पायलट प्रभाव',
    navAbout: 'हमारे बारे में',
    navOfficer: 'अधिकारी पोर्टल',
    startMappingBtn: 'आजीविका मैपिंग शुरू करें',

    heroBadge: 'पीएम-अजय आजीविका अभिसरण एवं एनएसक्यूएफ कौशल',
    heroHeadline1: 'अपनी आजीविका का सही रास्ता खोजें।',
    heroHeadline2: 'एनएसक्यूएफ प्रमाणित कौशल से जुड़ें।',
    heroSubtitle: 'Find the right livelihood pathway • NSQF Skilling Trajectories',
    heroPillSkill: 'कौशल प्रशिक्षण',
    heroPillJob: 'रोज़गार अवसर',
    heroPillSelf: 'स्वरोज़गार',
    heroPrimaryCta: 'आजीविका मैपिंग शुरू करें',
    heroSecondaryCta: 'पायलट मार्ग देखें',
    heroCardHeader: 'सत्यापित लाभार्थी मार्ग सिमुलेशन',
    heroCardLiveBadge: 'पायलट केस स्टडी',
    heroCardCategory: 'लक्षित वर्ग: अनुसूचित जाति कारीगर एवं युवा (पीएम-अजय)',
    heroCardTrade: 'वर्तमान कार्य: अनौपचारिक शिल्प / पारंपरिक व्यवसाय',
    heroCardIncome: 'वर्तमान आय: ₹6,500 – ₹9,000 / माह (अनियमित)',
    heroCardRecommended: 'अनुशंसित योग्यता: एनएसक्यूएफ लेवल 4 प्रमाणित जॉब रोल',
    heroCardGovtGrant: 'पीएम-अजय वित्तीय सहायता: ₹50,000 टूलकिट अनुदान एवं ऋण लिंकेज',
    heroCardAction: 'आजीविका प्रक्षेपवक्र देखें',

    pillar1Badge: 'शासनादेश',
    pillar1Title: 'पीएम-अजय अभिसरण',
    pillar1Desc: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय अंतर्गत अनुसूचित जाति (SC) परिवारों के समग्र आजीविका संवर्धन हेतु लक्षित रूपरेखा।',
    pillar2Badge: 'आसूचना',
    pillar2Title: 'जिला आजीविका मैपिंग',
    pillar2Desc: 'स्थानीय संसाधन क्लस्टर, कच्चे माल, पारंपरिक कौशल एवं वास्तविक बाजार मांग का सूक्ष्म स्तरीय विश्लेषण।',
    pillar3Badge: 'मानकीकरण',
    pillar3Title: 'एनसीवीईटी / एनएसक्यूएफ मानक',
    pillar3Desc: 'सभी कार्य भूमिकाएं राष्ट्रीय कौशल योग्यता फ्रेमवर्क (Level 1 से 8) एवं सरकारी प्रमाणपत्रों से जुड़ी हैं।',
    pillar4Badge: 'समावेशन',
    pillar4Title: 'बहुभाषी एवं आवाज-प्रथम',
    pillar4Desc: 'जमीनी प्रगणकों एवं ग्रामीण शिक्षार्थियों हेतु सहज हिंदी इंटरफेस एवं आवाज आधारित प्रविष्टि (Voice Input)।',

    howBadge: 'कार्यप्रणाली',
    howTitle: 'जीविका मैप कैसे काम करता है',
    howSubtitle: '4-चरणीय साक्ष्य-आधारित प्रगति',
    howDesc: 'एक सरल चार-चरणीय प्रमाण-आधारित प्रक्रिया जो जमीनी कौशल को मान्यता प्राप्त प्रमाणन, स्थानीय उद्यम एवं पीएम-अजय प्रत्यक्ष सरकारी सहायता से जोड़ती है।',
    step1Stage: 'खोजें',
    step1Tagline: 'परिवार एवं क्लस्टर सर्वेक्षण',
    step1Desc: 'जमीनी प्रगणक एवं सामुदायिक मित्र सामाजिक-आर्थिक स्थिति, पारंपरिक हुनर, कार्य अनुभव और घरेलू आजीविका संसाधनों का प्रामाणिक विवरण एकत्र करते हैं।',
    step1Meta: 'सामाजिक-आर्थिक आधार • क्लस्टर जियो-टैगिंग (Geo-Tagging)',
    step2Stage: 'समझें',
    step2Tagline: 'कौशल एवं बाजार मांग विश्लेषण',
    step2Desc: 'प्लेटफॉर्म व्यावहारिक कार्य अनुभव का औपचारिक कौशल मानकों से मिलान करता है और जिले के औद्योगिक क्लस्टर, कच्चे माल एवं स्थानीय रोजगार मांग का विश्लेषण करता है।',
    step2Meta: 'पूर्व अनुभव की मान्यता (RPL) मूल्यांकन',
    step3Stage: 'अनुशंसा',
    step3Tagline: 'एनएसक्यूएफ कौशल मार्ग निर्धारण',
    step3Desc: 'व्यक्तिगत प्रोफाइल के आधार पर प्रमाणित एनएसक्यूएफ योग्यता पैक (QP-NOS) सुझाए जाते हैं, जिससे कम अवधि के ब्रिज-प्रशिक्षण द्वारा आय क्षमता में स्थायी वृद्धि हो सके।',
    step3Meta: 'राष्ट्रीय कौशल मैट्रिक्स • QP-NOS मैचिंग',
    step4Stage: 'कार्य योजना',
    step4Tagline: 'पीएम-अजय अनुदान एवं योजना जुड़ाव',
    step4Desc: 'पीएम-अजय वित्तीय सहायता, आधुनिक टूलकिट हेतु पूंजीगत सब्सिडी, मान्यता प्राप्त प्रशिक्षण केंद्रों में निःशुल्क नामांकन एवं स्वयं सहायता समूह (SHG) उद्यम से सीधा जुड़ाव।',
    step4Meta: 'पीएम-अजय पूंजीगत सब्सिडी • प्रमाणित नामांकन',

    visBadge: 'आजीविका सिमुलेटर',
    visTitle: 'इंटरैक्टिव आजीविका मार्ग',
    visSubtitle: 'वास्तविक लाभार्थी प्रगति का सिमुलेशन',
    visDesc: 'देखें कि कैसे अनौपचारिक पारंपरिक कारीगर एनएसक्यूएफ प्रमाणन और पीएम-अजय योजना के सहयोग से दैनिक मजदूरी से स्थायी उद्यम तक पहुंचते हैं।',
    visSelectLabel: 'पायलट लाभार्थी चुनें:',
    visCurrentProfile: 'मूल प्रोफाइल एवं अनौपचारिक दक्षता',
    visMarketOpportunity: 'स्थानीय जिला आर्थिक अवसर',
    visNsqfPathway: 'एनएसक्यूएफ कौशल मार्ग (NCVET अनुसार)',
    visGrantSubsidy: 'पीएम-अजय वित्तीय एवं पूंजीगत सहायता',
    visProjectedIncome: 'प्रक्षेपित मासिक आय (प्रमाणन उपरांत)',
    visTrainingDuration: 'ब्रिज प्रशिक्षण अवधि',
    visRplEligible: 'पूर्व अनुभव प्रमाणन (RPL) मान्य',
    visAccreditedBy: 'मान्यता प्राप्त सेक्टर स्किल काउंसिल',
    visStartMappingCta: 'अपनी आजीविका का मार्ग खोजें',

    statNoticeTitle: 'पायलट प्रक्षेपण सूचना',
    statNoticeDesc: 'नीचे प्रस्तुत मूल्य प्रणाली सत्यापन हेतु मॉडल किए गए पायलट प्रक्षेपण हैं। इन्हें आधिकारिक जनगणना आंकड़े न माना जाए।',
    statBadge: 'पायलट दायरा एवं प्रभाव',
    statTitle: 'प्रदर्शित अभिसरण प्रभाव',
    statSubtitle: 'प्राथमिकता क्लस्टरों में निर्धारित लक्ष्य',
    statDesc: 'पीएम-अजय दिशानिर्देशों के तहत देशभर के 750+ जिलों में विस्तार हेतु डिज़ाइन किया गया डेटा ढांचा।',
    stat1Num: '12+',
    stat1Label: 'पायलट जिले मानचित्रित',
    stat1Sub: 'यूपी, राजस्थान, एमपी, बिहार एवं तमिलनाडु के प्रमुख क्लस्टर क्षेत्र',
    stat1Tag: 'पायलट मॉडल',
    stat2Num: '180+',
    stat2Label: 'एनएसक्यूएफ जॉब रोल सूचीबद्ध',
    stat2Sub: '14 सेक्टर स्किल काउंसिलों में मान्यता प्राप्त क्वालिफिकेशन पैक (QP-NOS)',
    stat2Tag: 'एनसीवीईटी मानक',
    stat3Num: '3.1x',
    stat3Label: 'औसत आय वृद्धि अनुमान',
    stat3Sub: 'असंगठित मजदूरी की तुलना में प्रमाणित कारीगर उद्यम से अनुमानित पारिवारिक आय',
    stat3Tag: 'प्रक्षेपित मॉडल',
    stat4Num: '100%',
    stat4Label: 'आवाज एवं मातृभाषा सुविधा',
    stat4Sub: 'जमीनी प्रगणकों एवं नागरिकों हेतु सहज हिंदी एवं आवाज आधारित इनपुट',
    stat4Tag: 'समावेशन मानक',

    footerAboutDesc: 'प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) अंतर्गत आजीविका आसूचना, कौशल मानचित्रण एवं एनसीवीईटी-एनएसक्यूएफ त्वरित आजीविका फ्रेमवर्क।',
    footerMinistryDesc: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार।',
    footerSectionsTitle: 'पोर्टल अनुभाग',
    footerFrameworkTitle: 'मानक एवं फ्रेमवर्क',
    footerGovernanceTitle: 'सरकारी अभिसरण',
    footerHome: 'मुख्य पृष्ठ',
    footerHowItWorks: 'कार्यप्रणाली',
    footerPathways: 'आजीविका एवं कौशल मार्ग',
    footerImpact: 'पायलट प्रभाव',
    footerOfficerPortal: 'अधिकारी कमांड कंसोल',
    footerStartMapping: 'लाभार्थी मैपिंग शुरू करें',
    footerDisclaimersTitle: 'पोर्टल डिस्क्लेमर',
    footerDisclaimerText: 'जीविका मैप एक सरकारी अभिसरण मंच है। अनुदान स्वीकृति एवं प्रशिक्षण प्रवेश आधिकारिक पीएम-अजय दिशानिर्देशों के सत्यापन के अधीन हैं।',
    footerGovtOfIndia: 'भारत सरकार',
    footerNationalEmblem: 'सत्यमेव जयते',
    footerCopyright: '© जीविका मैप • पीएम-अजय आजीविका अभिसरण मंच। सर्वाधिकार सुरक्षित।',
  },

  // --------------------------------------------------------------------------
  // MARATHI (मराठी)
  // --------------------------------------------------------------------------
  mr: {
    govIndia: 'भारत सरकार',
    govMinistry: 'सामाजिक न्याय व अधिकारिता मंत्रालय (PM-AJAY)',
    skipToMain: 'मुख्य सामग्रीकडे जा',
    textSize: 'अक्षर आकार:',
    contrastStandard: 'सामान्य दृश्य',
    contrastHigh: 'कंट्रास्ट दृश्य',
    langLabel: 'भाषा:',

    portalSubtitle: 'उपजीविका व NSQF कौशल्य पोर्टल',
    navHome: 'मुख्यपृष्ठ',
    navHowItWorks: 'हे कसे कार्य करते',
    navPathways: 'उपजीविका मार्ग',
    navImpact: 'पायलट प्रभाव',
    navAbout: 'आमच्याबद्दल',
    navOfficer: 'अधिकारी पोर्टल',
    startMappingBtn: 'उपजीविका मॅपिंग सुरू करा',

    heroBadge: 'PM-AJAY उपजीविका अभिसरण व NSQF कौशल्य',
    heroHeadline1: 'आपल्या उपजीविकेचा योग्य मार्ग शोधा.',
    heroHeadline2: 'NSQF प्रमाणित कौशल्यांशी जोडा.',
    heroSubtitle: 'योग्य उपजीविका मार्ग शोधा • NSQF कौशल्य मार्ग',
    heroPillSkill: 'कौशल्य प्रशिक्षण',
    heroPillJob: 'रोजगार संधी',
    heroPillSelf: 'स्वयंरोजगार',
    heroPrimaryCta: 'उपजीविका मॅपिंग सुरू करा',
    heroSecondaryCta: 'पायलट मार्ग पहा',
    heroCardHeader: 'सत्यापित लाभार्थी मार्ग सिम्युलेशन',
    heroCardLiveBadge: 'पायलट केस स्टडी',
    heroCardCategory: 'लक्षित गट: अनुसूचित जाती कारागीर व युवक (PM-AJAY)',
    heroCardTrade: 'सध्याचे काम: अनौपचारिक हस्तकला / पारंपारिक व्यवसाय',
    heroCardIncome: 'सध्याचे उत्पन्न: ₹6,500 – ₹9,000 / महिना (अनियमित)',
    heroCardRecommended: 'शिफारस केलेले कौशल्य: NSQF स्तर 4 प्रमाणित जॉब रोल',
    heroCardGovtGrant: 'PM-AJAY आर्थिक साहाय्य: ₹50,000 टूलकिट अनुदान व कर्ज जोडणी',
    heroCardAction: 'उपजीविका मार्ग पहा',

    pillar1Badge: 'शासनादेश',
    pillar1Title: 'PM-AJAY अभिसरण',
    pillar1Desc: 'सामाजिक न्याय व अधिकारिता मंत्रालयांतर्गत अनुसूचित जाती (SC) कुटुंबांच्या सर्वांगीण उपजीविका विकासासाठी लक्षित आराखडा.',
    pillar2Badge: 'बुद्धिमत्ता',
    pillar2Title: 'जिल्हा उपजीविका मॅपिंग',
    pillar2Desc: 'स्थानिक संसाधने, कच्चा माल, पारंपारिक कौशल्ये आणि प्रत्यक्ष बाजारपेठेतील मागणीचे सूक्ष्म विश्लेषण.',
    pillar3Badge: 'मानकीकरण',
    pillar3Title: 'NCVET / NSQF मानके',
    pillar3Desc: 'सर्व कार्य भूमिका राष्ट्रीय कौशल्य पात्रता फ्रेमवर्क (स्तर 1 ते 8) आणि सरकारी प्रमाणपत्रांशी जोडलेल्या आहेत.',
    pillar4Badge: 'समावेशन',
    pillar4Title: 'बहुभाषिक व व्हॉईस-प्रथम',
    pillar4Desc: 'ग्रामीण प्रगणक व विद्यार्थ्यांसाठी सोपे प्रादेशिक इंटरफेस आणि व्हॉईस इनपुट सुविधा.',

    howBadge: 'कार्यपद्धती',
    howTitle: 'जीविका मॅप कसे कार्य करते',
    howSubtitle: '4-टप्प्यांची पुरावा-आधारित प्रगती',
    howDesc: 'स्थानिक कौशल्यांना अधिकृत प्रमाणपत्र, स्थानिक उद्योग आणि PM-AJAY थेट सरकारी साहाय्याशी जोडणारी सुलभ प्रक्रिया.',
    step1Stage: 'शोधा',
    step1Tagline: 'कुटुंब व क्लस्टर सर्वेक्षण',
    step1Desc: 'प्रगणक सामाजिक-आर्थिक स्थिती, पारंपारिक कौशल्ये, कामाचा अनुभव आणि उपजीविका साधनांची अचूक नोंद घेतात.',
    step1Meta: 'सामाजिक-आर्थिक आधार • क्लस्टर जिओ-टॅगिंग',
    step2Stage: 'समजून घ्या',
    step2Tagline: 'कौशल्य व बाजार मागणी विश्लेषण',
    step2Desc: 'प्लॅटफॉर्म व्यावहारिक कामाचा अनुभव औपचारिक मानकांशी जुळवतो आणि स्थानिक उद्योगांमधील मागणीचे विश्लेषण करतो.',
    step2Meta: 'मागील अनुभवाची मान्यता (RPL) मूल्यमापन',
    step3Stage: 'शिफारस',
    step3Tagline: 'NSQF कौशल्य मार्ग निश्चिती',
    step3Desc: 'कमी कालावधीच्या ब्रिज-प्रशिक्षणाद्वारे उत्पन्न वाढवण्यासाठी प्रमाणित NSQF पात्रता पॅक (QP-NOS) सुचवले जातात.',
    step3Meta: 'राष्ट्रीय कौशल्य मॅट्रिक्स • QP-NOS मॅचिंग',
    step4Stage: 'कृती आराखडा',
    step4Tagline: 'PM-AJAY अनुदान व योजना जोडणी',
    step4Desc: 'PM-AJAY आर्थिक साहाय्य, आधुनिक टूलकिटसाठी भांडवली अनुदान, मोफत प्रशिक्षण आणि स्वयंसहाय्यता गट (SHG) जोडणी.',
    step4Meta: 'PM-AJAY भांडवली अनुदान • प्रमाणित नोंदणी',

    visBadge: 'उपजीविका सिम्युलेटर',
    visTitle: 'परस्परसंवादी उपजीविका मार्ग',
    visSubtitle: 'वास्तविक लाभार्थी प्रगतीचे सिम्युलेशन',
    visDesc: 'अनौपचारिक कारागीर NSQF प्रमाणन आणि PM-AJAY योजनेच्या साहाय्याने शाश्वत उद्योगाकडे कसे वाटचाल करतात ते पहा.',
    visSelectLabel: 'पायलट लाभार्थी निवडा:',
    visCurrentProfile: 'मूळ प्रोफाइल व अनौपचारिक कौशल्ये',
    visMarketOpportunity: 'स्थानिक जिल्हा आर्थिक संधी',
    visNsqfPathway: 'NSQF कौशल्य मार्ग (NCVET संरेखित)',
    visGrantSubsidy: 'PM-AJAY आर्थिक व भांडवली जोडणी',
    visProjectedIncome: 'अपेक्षित मासिक उत्पन्न (प्रमाणपत्रांनंतर)',
    visTrainingDuration: 'प्रशिक्षण कालावधी',
    visRplEligible: 'RPL पूर्व अनुभव प्रमाणन पात्र',
    visAccreditedBy: 'मान्यताप्राप्त सेक्टर स्किल कौन्सिल',
    visStartMappingCta: 'आपला उपजीविका मार्ग शोधा',

    statNoticeTitle: 'पायलट मॉडेलिंग सूचना',
    statNoticeDesc: 'खाली दर्शविलेली आकडेवारी प्रणाली चाचणीसाठी तयार केलेली पायलट प्रक्षेपण मूल्ये आहेत.',
    statBadge: 'पायलट व्याप्ती व प्रभाव',
    statTitle: 'प्रदर्शित अभिसरण प्रभाव',
    statSubtitle: 'प्राधान्य क्लस्टर्समधील निर्धारित उद्दिष्टे',
    statDesc: 'PM-AJAY मार्गदर्शक तत्त्वांनुसार देशभरातील 750+ जिल्ह्यांमध्ये विस्तारासाठी डेटा रचना.',
    stat1Num: '12+',
    stat1Label: 'पायलट जिल्हे मॅप केलेले',
    stat1Sub: 'यूपी, राजस्थान, एमपी, बिहार व तामिळनाडूतील प्रमुख क्लस्टर क्षेत्र',
    stat1Tag: 'पायलट मॉडेल',
    stat2Num: '180+',
    stat2Label: 'NSQF जॉब रोल्स सूचीबद्ध',
    stat2Sub: '14 सेक्टर स्किल कौन्सिल्समध्ये मान्यताप्राप्त पात्रता पॅक (QP-NOS)',
    stat2Tag: 'NCVET मानके',
    stat3Num: '3.1x',
    stat3Label: 'सरासरी उत्पन्न वाढ अंदाज',
    stat3Sub: 'असंघटित रोजंदारीच्या तुलनेत प्रमाणित कारागीर उद्योगातून अंदाजित उत्पन्न',
    stat3Tag: 'प्रक्षेपित मॉडेल',
    stat4Num: '100%',
    stat4Label: 'आवाज व मातृभाषा सुविधा',
    stat4Sub: 'नागरिकांसाठी सोपे प्रादेशिक व आवाज आधारित इनपुट',
    stat4Tag: 'समावेशन मानक',

    footerAboutDesc: 'प्रधानमंत्री अनुसूचित जाती अभ्युदय योजना (PM-AJAY) अंतर्गत उपजीविका माहिती, कौशल्य मॅपिंग आणि NCVET-NSQF उपजीविका फ्रेमवर्क.',
    footerMinistryDesc: 'सामाजिक न्याय व अधिकारिता मंत्रालय, भारत सरकार.',
    footerSectionsTitle: 'पोर्टल विभाग',
    footerFrameworkTitle: 'मानके व फ्रेमवर्क',
    footerGovernanceTitle: 'शासकीय अभिसरण',
    footerHome: 'मुख्य पृष्ठ',
    footerHowItWorks: 'कार्यपद्धती',
    footerPathways: 'उपजीविका व कौशल्य मार्ग',
    footerImpact: 'पायलट प्रभाव',
    footerOfficerPortal: 'अधिकारी कमांड कन्सोल',
    footerStartMapping: 'लाभार्थी मॅपिंग सुरू करा',
    footerDisclaimersTitle: 'पोर्टल अस्वीकरण',
    footerDisclaimerText: 'जीविका मॅप हा एक शासकीय अभिसरण मंच आहे. अनुदान मंजुरी अधिकृत PM-AJAY मार्गदर्शक तत्त्वांच्या सत्यापनावर अवलंबून आहे.',
    footerGovtOfIndia: 'भारत सरकार',
    footerNationalEmblem: 'सत्यमेव जयते',
    footerCopyright: '© जीविका मॅप • PM-AJAY उपजीविका अभिसरण मंच. सर्व हक्क राखीव.',
  },

  // --------------------------------------------------------------------------
  // TELUGU (తెలుగు)
  // --------------------------------------------------------------------------
  te: {
    govIndia: 'భారత ప్రభుత్వం',
    govMinistry: 'సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ (PM-AJAY)',
    skipToMain: 'ప్రధాన విషయానికి వెళ్లండి',
    textSize: 'టెక్స్ట్ సైజు:',
    contrastStandard: 'సాధారణ వీక్షణ',
    contrastHigh: 'హై కాంట్రాస్ట్',
    langLabel: 'భాష:',

    portalSubtitle: 'జీవనోపాధి మరియు NSQF స్కిల్లింగ్ పోర్టల్',
    navHome: 'హోమ్',
    navHowItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    navPathways: 'జీవనోపాధి మార్గాలు',
    navImpact: 'పైలట్ ప్రభావం',
    navAbout: 'మా గురించి',
    navOfficer: 'అధికారుల పోర్టల్',
    startMappingBtn: 'జీవనోపాధి మ్యాపింగ్ ప్రారంభించండి',

    heroBadge: 'PM-AJAY జీవనోపాధి కన్వర్జెన్స్ & NSQF నైపుణ్యాలు',
    heroHeadline1: 'మీ సరైన జీవనోపాధి మార్గాన్ని కనుగొనండి.',
    heroHeadline2: 'NSQF ధృవీకరించబడిన నైపుణ్యాలతో కనెక్ట్ అవ్వండి.',
    heroSubtitle: 'సరైన జీవనోపాధి మార్గాన్ని కనుగొనండి • NSQF స్కిల్లింగ్ మార్గాలు',
    heroPillSkill: 'నైపుణ్య శిక్షణ',
    heroPillJob: 'ఉపాధి అవకాశాలు',
    heroPillSelf: 'స్వయం ఉపాధి',
    heroPrimaryCta: 'జీవనోపాధి మ్యాపింగ్ ప్రారంభించండి',
    heroSecondaryCta: 'పైలట్ మార్గాలను అన్వేషించండి',
    heroCardHeader: 'ధృవీకరించబడిన లబ్ధిదారుల మార్గం సిమ్యులేషన్',
    heroCardLiveBadge: 'పైలట్ కేస్ స్టడీ',
    heroCardCategory: 'లక్ష్య సమూహం: షెడ్యూల్డ్ కులాల కళాకారులు & యువత (PM-AJAY)',
    heroCardTrade: 'ప్రస్తుత వృత్తి: సాంప్రదాయ చేతివృత్తులు / రోజువారీ పని',
    heroCardIncome: 'ప్రస్తుత ఆదాయం: ₹6,500 – ₹9,000 / నెలకు',
    heroCardRecommended: 'సిఫార్సు చేయబడిన అర్హత: NSQF లెవెల్ 4 సర్టిఫైడ్ జాబ్ రోల్',
    heroCardGovtGrant: 'PM-AJAY ఆర్థిక సహాయం: ₹50,000 టూల్‌కిట్ గ్రాంట్ & క్రెడిట్ లింకేజ్',
    heroCardAction: 'జీవనోపాధి మార్గాన్ని చూడండి',

    pillar1Badge: 'ఆదేశం',
    pillar1Title: 'PM-AJAY కన్వర్జెన్స్',
    pillar1Desc: 'సామాజిక న్యాయం & సాధికారత మంత్రిత్వ శాఖ ఆధ్వర్యంలో షెడ్యూల్డ్ కులాల (SC) కుటుంబాల జీవనోపాధి సాధికారతకు ప్రత్యేక ప్రణాళిక.',
    pillar2Badge: 'ఇంటెలిజెన్స్',
    pillar2Title: 'జిల్లా జీవనోపాధి మ్యాపింగ్',
    pillar2Desc: 'స్థానిక వనరుల క్లస్టర్లు, ముడి సరుకులు, సాంప్రదాయ నైపుణ్యాలు మరియు మార్కెట్ డిమాండ్ సమగ్ర విశ్లేషణ.',
    pillar3Badge: 'ప్రామాణీకరణ',
    pillar3Title: 'NCVET / NSQF ప్రమాణాలు',
    pillar3Desc: 'అన్ని ఉద్యోగ పాత్రలు జాతీయ నైపుణ్య అర్హతల ఫ్రేమ్‌వర్క్ (లెవెల్ 1 నుండి 8) మరియు ప్రభుత్వ ధృవీకరణలతో అనుసంధానించబడ్డాయి.',
    pillar4Badge: 'సమ్మిళితత్వం',
    pillar4Title: 'బహుభాషా & వాయిస్-ఫస్ట్',
    pillar4Desc: 'గ్రామీణ అభ్యాసకులు మరియు ఫీల్డ్ ఎన్యూమరేటర్ల కోసం సులభమైన స్థానిక భాష ఇంటర్‌ఫేస్ మరియు వాయిస్ ఇన్‌పుట్.',

    howBadge: 'కార్యవిధానం',
    howTitle: 'జీవిక మ్యాప్ ఎలా పనిచేస్తుంది',
    howSubtitle: '4-దశల ఆధారిత పురోగతి',
    howDesc: 'స్థానిక నైపుణ్యాలను గుర్తింపు పొందిన సర్టిఫికేషన్, స్థానిక పరిశ్రమలు మరియు PM-AJAY ప్రభుత్వ సహాయంతో అనుసంధానించే సరళమైన ప్రక్రియ.',
    step1Stage: 'కనుగొనండి',
    step1Tagline: 'కుటుంబ & క్లస్టర్ ప్రొఫైలింగ్',
    step1Desc: 'ఎన్యూమరేటర్లు సామాజిక-ఆర్థిక స్థితి, సాంప్రదాయ నైపుణ్యాలు మరియు జీవనోపాధి వనరుల వివరాలను నమోదు చేస్తారు.',
    step1Meta: 'సామాజిక-ఆర్థిక ఆధారం • క్లస్టర్ జియో-ట్యాగింగ్',
    step2Stage: 'అర్థం చేసుకోండి',
    step2Tagline: 'నైపుణ్యాలు & డిమాండ్ విశ్లేషణ',
    step2Desc: 'ఈ ప్లాట్‌ఫామ్ పని అనుభవాన్ని నైపుణ్య ప్రమాణాలతో సరిపోల్చి, స్థానిక పరిశ్రమల డిమాండ్‌ను విశ్లేషిస్తుంది.',
    step2Meta: 'పూర్వ అనుభవ గుర్తింపు (RPL) మూల్యాంకనం',
    step3Stage: 'సిఫార్సు',
    step3Tagline: 'NSQF నైపుణ్య మార్గం నిర్ణయం',
    step3Desc: 'స్వల్పకాలిక శిక్షణ ద్వారా ఆదాయాన్ని పెంచడానికి సర్టిఫైడ్ NSQF క్వాలిఫికేషన్ ప్యాక్‌లు (QP-NOS) సిఫార్సు చేయబడతాయి.',
    step3Meta: 'నేషనల్ స్కిల్స్ మ్యాట్రిక్స్ • QP-NOS మ్యాచింగ్',
    step4Stage: 'కార్యాచరణ',
    step4Tagline: 'PM-AJAY గ్రాంట్లు & పథకాల లింకేజ్',
    step4Desc: 'PM-AJAY ఆర్థిక సహాయం, టూల్‌కిట్‌ల కోసం మూలధన రాయితీ, ఉచిత శిక్షణ మరియు స్వయం సహాయక సంఘాల (SHG) అనుసంధానం.',
    step4Meta: 'PM-AJAY క్యాపిటల్ గ్రాంట్ • సర్టిఫైడ్ నమోదు',

    visBadge: 'జీవనోపాధి సిమ్యులేటర్',
    visTitle: 'ఇంటరాక్టివ్ జీవనోపాధి మార్గాలు',
    visSubtitle: 'లబ్ధిదారుల పురోగతి సిమ్యులేషన్',
    visDesc: 'కళాకారులు NSQF సర్టిఫికేషన్ మరియు PM-AJAY మద్దతుతో స్థిరమైన ఉపాధి వైపు ఎలా పురోగమిస్తారో చూడండి.',
    visSelectLabel: 'పైలట్ లబ్ధిదారుని ఎంచుకోండి:',
    visCurrentProfile: 'ప్రాథమిక ప్రొఫైల్ & నైపుణ్యాలు',
    visMarketOpportunity: 'స్థానిక జిల్లా ఆర్థిక అవకాశాలు',
    visNsqfPathway: 'NSQF నైపుణ్య మార్గం (NCVET ప్రకారం)',
    visGrantSubsidy: 'PM-AJAY ఆర్థిక మరియు మూలధన సహాయం',
    visProjectedIncome: 'అంచనా వేసిన నెలవారీ ఆదాయం',
    visTrainingDuration: 'శిక్షణ వ్యవధి',
    visRplEligible: 'RPL పూర్వ అనుభవ సర్టిఫికేషన్ అనుమతించబడింది',
    visAccreditedBy: 'గుర్తింపు పొందిన సెక్టార్ స్కిల్ కౌన్సిల్',
    visStartMappingCta: 'మీ స్వంత మార్గాన్ని మ్యాప్ చేయండి',

    statNoticeTitle: 'పైలట్ మోడలింగ్ నోటీసు',
    statNoticeDesc: 'దిగువ చూపిన గణాంకాలు ప్లాట్‌ఫామ్ సామర్థ్యాన్ని ప్రదర్శించడానికి రూపొందించబడిన పైలట్ ప్రొజెక్షన్లు.',
    statBadge: 'పైలట్ పరిధి & ప్రభావం',
    statTitle: 'నిరూపితమైన కన్వర్జెన్స్ ప్రభావం',
    statSubtitle: 'ప్రాధాన్యతా క్లస్టర్లలో లక్ష్యాలు',
    statDesc: 'PM-AJAY మార్గదర్శకాల ప్రకారం దేశవ్యాప్తంగా 750+ జిల్లాలలో విస్తరణకు అనువైన డేటా నిర్మాణం.',
    stat1Num: '12+',
    stat1Label: 'మ్యాప్ చేయబడిన పైలట్ జిల్లాలు',
    stat1Sub: 'యూపీ, రాజస్థాన్, ఎంపీ, బీహార్ & తమిళనాడులోని ప్రముఖ క్లస్టర్లు',
    stat1Tag: 'పైలట్ మోడల్',
    stat2Num: '180+',
    stat2Label: 'NSQF ఉద్యోగ పాత్రలు',
    stat2Sub: '14 సెక్టార్ స్కిల్ కౌన్సిళ్లలో గుర్తింపు పొందిన క్వాలిఫికేషన్ ప్యాక్‌లు (QP-NOS)',
    stat2Tag: 'NCVET ప్రమాణాలు',
    stat3Num: '3.1x',
    stat3Label: 'సగటు ఆదాయ పెరుగుదల అంచనా',
    stat3Sub: 'అసంఘటిత వేతనంతో పోలిస్తే సర్టిఫైడ్ ఎంటర్‌ప్రైజ్ నుండి అంచనా వేసిన ఆదాయం',
    stat3Tag: 'ప్రొజెక్టెడ్ మోడల్',
    stat4Num: '100%',
    stat4Label: 'వాయిస్ & మాతృభాష సదుపాయం',
    stat4Sub: 'పౌరుల కోసం సులభమైన స్థానిక భాష మరియు వాయిస్ ఆధారిత ఇన్‌పుట్',
    stat4Tag: 'సమ్మిళిత ప్రమాణం',

    footerAboutDesc: 'ప్రధాన మంత్రి అనుసూచిత్ జాతి అభ్యుదయ యోజన (PM-AJAY) కింద జీవనోపాధి ఇంటెలిజెన్స్, స్కిల్లింగ్ మరియు NCVET-NSQF జీవనోపాధి ఫ్రేమ్‌వర్క్.',
    footerMinistryDesc: 'సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ, భారత ప్రభుత్వం.',
    footerSectionsTitle: 'పోర్టల్ విభాగాలు',
    footerFrameworkTitle: 'ప్రమాణాలు & ఫ్రేమ్‌వర్క్‌లు',
    footerGovernanceTitle: 'ప్రభుత్వ కన్వర్జెన్స్',
    footerHome: 'ముఖ్య పేజీ',
    footerHowItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    footerPathways: 'జీవనోపాధి & నైపుణ్య మార్గాలు',
    footerImpact: 'పైలట్ ప్రభావం',
    footerOfficerPortal: 'ఆఫీసర్ కమాండ్ కన్సోల్',
    footerStartMapping: 'లబ్ధిదారుల మ్యాపింగ్ ప్రారంభించండి',
    footerDisclaimersTitle: 'పోర్టల్ డిస్క్లైమర్',
    footerDisclaimerText: 'జీవిక మ్యాప్ ఒక ప్రభుత్వ వేదిక. గ్రాంట్ మంజూరు అధికారిక PM-AJAY మార్గదర్శకాల ధృవీకరణకు లోబడి ఉంటుంది.',
    footerGovtOfIndia: 'భారత ప్రభుత్వం',
    footerNationalEmblem: 'సత్యమేవ జయతే',
    footerCopyright: '© జీవిక మ్యాప్ • PM-AJAY జీవనోపాధి కన్వర్జెన్స్ పోర్టల్. సర్వహక్కులు ప్రత్యేకించబడ్డాయి.',
  },

  // --------------------------------------------------------------------------
  // BENGALI (বাংলা)
  // --------------------------------------------------------------------------
  bn: {
    govIndia: 'ভারত সরকার',
    govMinistry: 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক (PM-AJAY)',
    skipToMain: 'মূল বিষয়বস্তুতে যান',
    textSize: 'অক্ষরের আকার:',
    contrastStandard: 'সাধারণ দৃশ্য',
    contrastHigh: 'উচ্চ বৈসাদৃশ্য',
    langLabel: 'ভাষা:',

    portalSubtitle: 'জীবিকা ও NSQF দক্ষতা পোর্টাল',
    navHome: 'হোম',
    navHowItWorks: 'এটি কীভাবে কাজ করে',
    navPathways: 'জীবিকার পথ',
    navImpact: 'পাইলট প্রভাব',
    navAbout: 'আমাদের সম্পর্কে',
    navOfficer: 'অফিসার পোর্টাল',
    startMappingBtn: 'জীবিকা ম্যাপিং শুরু করুন',

    heroBadge: 'PM-AJAY জীবিকা অভিসরণ ও NSQF দক্ষতা',
    heroHeadline1: 'আপনার জীবিকার সঠিক পথ সন্ধান করুন।',
    heroHeadline2: 'NSQF প্রত্যয়িত দক্ষতার সাথে যুক্ত হন।',
    heroSubtitle: 'সঠিক জীবিকার পথ খুঁজুন • NSQF দক্ষতার গতিপথ',
    heroPillSkill: 'দক্ষতা প্রশিক্ষণ',
    heroPillJob: 'কর্মসংস্থানের সুযোগ',
    heroPillSelf: 'স্বনির্ভরতা',
    heroPrimaryCta: 'জীবিকা ম্যাপিং শুরু করুন',
    heroSecondaryCta: 'পাইলট পথ অন্বেষণ করুন',
    heroCardHeader: 'যাচাইকৃত সুবিধাভোগী পথ সিমুলেশন',
    heroCardLiveBadge: 'পাইলট কেস স্টাডি',
    heroCardCategory: 'লক্ষ্যযুক্ত জনগোষ্ঠী: তফশিলি জাতি কারিগর ও যুবসমাজ (PM-AJAY)',
    heroCardTrade: 'বর্তমান পেশা: অনানুষ্ঠানিক হস্তশিল্প / ঐতিহ্যবাহী কাজ',
    heroCardIncome: 'বর্তমান আয়: ₹6,500 – ₹9,000 / প্রতি মাসে',
    heroCardRecommended: 'সুপারিশকৃত যোগ্যতা: NSQF লেভেল 4 প্রত্যয়িত কাজের ভূমিকা',
    heroCardGovtGrant: 'PM-AJAY আর্থিক সহায়তা: ₹50,000 টুলকিট অনুদান ও ঋণ সংযোগ',
    heroCardAction: 'জীবিকার গতিপথ দেখুন',

    pillar1Badge: 'নির্দেশনা',
    pillar1Title: 'PM-AJAY অভিসরণ',
    pillar1Desc: 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রকের অধীনে তফশিলি জাতি (SC) পরিবারের সার্বিক জীবিকা উন্নয়নে লক্ষ্যযুক্ত কাঠামো।',
    pillar2Badge: 'বুদ্ধিমত্তা',
    pillar2Title: 'জেলা জীবিকা ম্যাপিং',
    pillar2Desc: 'স্থানীয় সম্পদ ক্লাস্টার, কাঁচামাল, ঐতিহ্যবাহী দক্ষতা এবং প্রকৃত বাজার চাহিদার পুঙ্খানুপুঙ্খ বিশ্লেষণ।',
    pillar3Badge: 'মানকীকরণ',
    pillar3Title: 'NCVET / NSQF মানদণ্ড',
    pillar3Desc: 'সমস্ত কাজের ভূমিকা জাতীয় দক্ষতা যোগ্যতা কাঠামোর (লেভেল 1 থেকে 8) সাথে সমন্বিত।',
    pillar4Badge: 'অন্তর্ভুক্তি',
    pillar4Title: 'বহুভাষিক ও ভয়েস-ফার্স্ট',
    pillar4Desc: 'তৃণমূল কর্মী ও গ্রামীণ শিক্ষার্থীদের জন্য সহজ স্থানীয় ইন্টারফেস এবং ভয়েস ইনপুট সুবিধা।',

    howBadge: 'কার্যপদ্ধতি',
    howTitle: 'জীবিকা ম্যাপ কীভাবে কাজ করে',
    howSubtitle: '৪-পর্যায়ের প্রমাণ-ভিত্তিক অগ্রগতি',
    howDesc: 'তৃণমূল দক্ষতাকে আনুষ্ঠানিক শংসাপত্র, স্থানীয় উদ্যোগ এবং PM-AJAY সরকারি সহায়তার সাথে যুক্ত করার সহজ প্রক্রিয়া।',
    step1Stage: 'খুঁজুন',
    step1Tagline: 'পরিবার ও ক্লাস্টার সমীক্ষা',
    step1Desc: 'সমীক্ষকরা আর্থ-সামাজিক অবস্থা, ঐতিহ্যবাহী দক্ষতা এবং জীবিকা সম্পদের খাঁটি তথ্য সংগ্রহ করেন।',
    step1Meta: 'আর্থ-সামাজিক ভিত্তি • ক্লাস্টার জিও-ট্যাগিং',
    step2Stage: 'বুঝুন',
    step2Tagline: 'দক্ষতা ও বাজার চাহিদা বিশ্লেষণ',
    step2Desc: 'প্ল্যাটফর্মটি কাজের অভিজ্ঞতাকে আনুষ্ঠানিক মানদণ্ডের সাথে তুলনা করে এবং স্থানীয় বাজার চাহিদা বিশ্লেষণ করে।',
    step2Meta: 'পূর্ব অভিজ্ঞতার স্বীকৃতি (RPL) মূল্যায়ন',
    step3Stage: 'সুপারিশ',
    step3Tagline: 'NSQF দক্ষতা পথ নির্ধারণ',
    step3Desc: 'স্বল্পমেয়াদী প্রশিক্ষণের মাধ্যমে আয় বাড়ানোর জন্য অনুমোদিত NSQF যোগ্যতা প্যাক (QP-NOS) সুপারিশ করা হয়।',
    step3Meta: 'জাতীয় দক্ষতা ম্যাট্রিক্স • QP-NOS ম্যাচিং',
    step4Stage: 'কর্মপরিকল্পনা',
    step4Tagline: 'PM-AJAY অনুদান ও প্রকল্পের সংযোগ',
    step4Desc: 'PM-AJAY আর্থিক সহায়তা, টুলকিটের জন্য মূলধনী ভর্তুকি, বিনামূল্যে প্রশিক্ষণ এবং স্বনির্ভর গোষ্ঠীর (SHG) সাথে সংযোগ।',
    step4Meta: 'PM-AJAY মূলধনী ভর্তুকি • প্রত্যয়িত ভর্তি',

    visBadge: 'জীবিকা সিমুলেটর',
    visTitle: 'ইন্টারেক্টিভ জীবিকা পথ',
    visSubtitle: 'সুবিধাভোগী অগ্রগতির সিমুলেশন',
    visDesc: 'কারিগররা কীভাবে NSQF শংসাপত্র এবং PM-AJAY সহায়তায় স্থায়ী উদ্যোগ গড়ে তোলে তা দেখুন।',
    visSelectLabel: 'পাইলট সুবিধাভোগী নির্বাচন করুন:',
    visCurrentProfile: 'মূল প্রোফাইল ও অনানুষ্ঠানিক দক্ষতা',
    visMarketOpportunity: 'স্থানীয় জেলার অর্থনৈতিক সুযোগ',
    visNsqfPathway: 'NSQF দক্ষতার পথ (NCVET অনুযায়ী)',
    visGrantSubsidy: 'PM-AJAY আর্থিক ও মূলধনী সহায়তা',
    visProjectedIncome: 'প্রত্যাশিত মাসিক আয় (শংসাপত্রের পর)',
    visTrainingDuration: 'প্রশিক্ষণের সময়কাল',
    visRplEligible: 'RPL পূর্ব অভিজ্ঞতা শংসাপত্র প্রযোজ্য',
    visAccreditedBy: 'স্বীকৃত সেক্টর স্কিল কাউন্সিল',
    visStartMappingCta: 'আপনার জীবিকার পথ সন্ধান করুন',

    statNoticeTitle: 'পাইলট মডেলিং বিজ্ঞপ্তি',
    statNoticeDesc: 'নিচে প্রদর্শিত পরিসংখ্যানগুলি প্ল্যাটফর্মের কার্যকারিতা প্রদর্শনের জন্য তৈরি পাইলট মডেল।',
    statBadge: 'পাইলট পরিসর ও প্রভাব',
    statTitle: 'প্রদর্শিত অভিসরণ প্রভাব',
    statSubtitle: 'অগ্রাধিকার ক্লাস্টারে নির্ধারিত লক্ষ্য',
    statDesc: 'PM-AJAY নির্দেশিকা অনুসারে দেশব্যাপী ৭৫০+ জেলায় সম্প্রসারণের জন্য ডিজাইন করা ডেটা কাঠামো।',
    stat1Num: '12+',
    stat1Label: 'পাইলট জেলা ম্যাপ করা হয়েছে',
    stat1Sub: 'ইউপি, রাজস্থান, এমপি, বিহার ও তামিলনাড়ুর প্রধান ক্লাস্টার এলাকা',
    stat1Tag: 'পাইলট মডেল',
    stat2Num: '180+',
    stat2Label: 'NSQF চাকরির ভূমিকা তালিকাভুক্ত',
    stat2Sub: '১৪টি সেক্টর স্কিল কাউন্সিলে স্বীকৃত যোগ্যতা প্যাক (QP-NOS)',
    stat2Tag: 'NCVET মানদণ্ড',
    stat3Num: '3.1x',
    stat3Label: 'গড় আয় বৃদ্ধির অনুমান',
    stat3Sub: 'অসংগঠিত মজুরির তুলনায় প্রত্যয়িত কারিগর উদ্যোগ থেকে আনুমানিক পারিবারিক আয়',
    stat3Tag: 'প্রকল্পিত মডেল',
    stat4Num: '100%',
    stat4Label: 'ভয়েস ও মাতৃভাষা সুবিধা',
    stat4Sub: 'নাগরিকদের জন্য সহজ স্থানীয় ও ভয়েস ভিত্তিক ইনপুট',
    stat4Tag: 'অন্তর্ভুক্তি মানদণ্ড',

    footerAboutDesc: 'প্রধানমন্ত্রী তফশিলি জাতি অভ্যুদয় যোজনা (PM-AJAY) এর অধীনে জীবিকা তথ্য, দক্ষতা ম্যাপিং এবং NCVET-NSQF জীবিকা কাঠামো।',
    footerMinistryDesc: 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক, ভারত সরকার।',
    footerSectionsTitle: 'পোর্টাল বিভাগ',
    footerFrameworkTitle: 'মানক ও কাঠামো',
    footerGovernanceTitle: 'সরকারি অভিসরণ',
    footerHome: 'মূল পাতা',
    footerHowItWorks: 'কীভাবে কাজ করে',
    footerPathways: 'জীবিকা ও দক্ষতার পথ',
    footerImpact: 'পাইলট প্রভাব',
    footerOfficerPortal: 'অফিসার কমান্ড কনসোল',
    footerStartMapping: 'সুবিধাভোগী ম্যাপিং শুরু করুন',
    footerDisclaimersTitle: 'পোর্টাল দাবিত্যাগ',
    footerDisclaimerText: 'জীবিকা ম্যাপ একটি সরকারি প্ল্যাটফর্ম। অনুদান অনুমোদন এবং প্রশিক্ষণ ভর্তি PM-AJAY নির্দেশিকা যাচাইয়ের সাপেক্ষে।',
    footerGovtOfIndia: 'ভারত সরকার',
    footerNationalEmblem: 'সত্য়মেব জয়তে',
    footerCopyright: '© জীবিকা ম্যাপ • PM-AJAY জীবিকা অভিসরণ প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।',
  },
};

export const getTranslation = (lang: string): Translations => {
  const code = (lang || 'en').toLowerCase() as SupportedLanguage;
  return TRANSLATIONS[code] || TRANSLATIONS.en;
};
