import React, { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';

interface LivelihoodPathwayVisualizerProps {
  isHighContrast?: boolean;
}

interface PersonaData {
  id: string;
  name: string;
  age: number;
  location: string;
  category: string;
  currentTrade: string;
  currentIncome: string;
  education: string;
  skills: {
    name: string;
    level: string;
    experience: string;
    rplCandidate: boolean;
  }[];
  localOpportunity: {
    clusterName: string;
    marketDemand: string;
    economicDrivers: string[];
    nearestHub: string;
  };
  nsqfPathway: {
    jobRole: string;
    qpNosCode: string;
    nsqfLevel: number;
    trainingHours: number;
    pmajayGrant: string;
    projectedIncome: string;
    accreditingBody: string;
  };
}

const PERSONAS: PersonaData[] = [
  {
    id: 'artisan',
    name: 'Savitri Baitha',
    age: 31,
    location: 'Varanasi District, Uttar Pradesh',
    category: 'Scheduled Caste (PM-AJAY Target Group)',
    currentTrade: 'Informal Jacquard Loom Assistant',
    currentIncome: '₹6,500 – ₹7,800 / month (Intermittent)',
    education: 'Primary (Class 8)',
    skills: [
      { name: 'Traditional Handloom Weaving', level: 'Intermediate', experience: '8 Years', rplCandidate: true },
      { name: 'Yarn Knotting & Shedding', level: 'Expert', experience: '8 Years', rplCandidate: true },
      { name: 'Natural Vegetable Dyeing', level: 'Basic', experience: '2 Years', rplCandidate: false },
    ],
    localOpportunity: {
      clusterName: 'Varanasi Mega Handloom & Silk Textile Cluster',
      marketDemand: 'High export and boutique domestic demand for certified GI-tagged artisanal fabrics',
      economicDrivers: ['ODOP (One District One Product)', 'PM-MITRA Integration', 'Khadi & Village Industries (KVIC)'],
      nearestHub: 'Weavers Service Centre (WSC), Chowkaghat',
    },
    nsqfPathway: {
      jobRole: 'Master Jacquard Weaver & Quality Auditor',
      qpNosCode: 'TSC/Q7303 (Textile Sector Skill Council)',
      nsqfLevel: 4,
      trainingHours: 120, // RPL Bridge hours
      pmajayGrant: '₹50,000 Toolkit & Micro-Credit Subsidy',
      projectedIncome: '₹22,000 – ₹28,000 / month (Stable)',
      accreditingBody: 'NCVET / Textile SSC',
    },
  },
  {
    id: 'solar',
    name: 'Rameshwar Meghwal',
    age: 27,
    location: 'Nagaur District, Rajasthan',
    category: 'Scheduled Caste (PM-AJAY Target Group)',
    currentTrade: 'Informal Electrical & Water Pump Helper',
    currentIncome: '₹8,000 – ₹9,200 / month (Daily Wage)',
    education: 'Secondary (Class 10)',
    skills: [
      { name: 'Single-phase Wiring & Grounding', level: 'Intermediate', experience: '5 Years', rplCandidate: true },
      { name: 'Submersible Pump Overhaul', level: 'Intermediate', experience: '4 Years', rplCandidate: true },
      { name: 'Inverter & Battery Servicing', level: 'Basic', experience: '1.5 Years', rplCandidate: false },
    ],
    localOpportunity: {
      clusterName: 'Marwar Renewable Energy & Agri-Solar Corridor',
      marketDemand: 'Surging requirement for PM-KUSUM solar agricultural pump installations and micro-grid maintenance',
      economicDrivers: ['PM-KUSUM Scheme', 'State Solar Energy Policy', 'Rural Enterprise Cooperatives'],
      nearestHub: 'Government Industrial Training Institute (ITI), Nagaur',
    },
    nsqfPathway: {
      jobRole: 'Solar PV System Installation & Maintenance Technician (Suryamitra)',
      qpNosCode: 'SGJ/Q0101 (Skill Council for Green Jobs)',
      nsqfLevel: 4,
      trainingHours: 160,
      pmajayGrant: '₹65,000 Diagnostic Toolkit & Working Capital Linkage',
      projectedIncome: '₹24,000 – ₹32,000 / month (Enterprise)',
      accreditingBody: 'NCVET / SCGJ',
    },
  },
  {
    id: 'agro',
    name: 'Anita Valmiki',
    age: 29,
    location: 'Hoshangabad District, Madhya Pradesh',
    category: 'Scheduled Caste (PM-AJAY Target Group)',
    currentTrade: 'Seasonal Agricultural Crop Sorter',
    currentIncome: '₹5,500 – ₹7,000 / month (Seasonal)',
    education: 'Secondary (Class 10)',
    skills: [
      { name: 'Grain & Seed Quality Grading', level: 'Expert', experience: '6 Years', rplCandidate: true },
      { name: 'Solar Food Dehydration', level: 'Basic', experience: '1 Year', rplCandidate: false },
      { name: 'Micro-packaging & Sealing', level: 'Basic', experience: '2 Years', rplCandidate: false },
    ],
    localOpportunity: {
      clusterName: 'Narmada Valley Organic & Pulse Processing Cluster',
      marketDemand: 'Growing rural women producer groups (SHGs) setting up decentralized flour, pulses and organic spice value addition units',
      economicDrivers: ['PM-FME (Micro Food Processing Enterprises)', 'NRLM SHG Federations', 'APMC Mandi Linkages'],
      nearestHub: 'Krishi Vigyan Kendra (KVK), Powarkheda',
    },
    nsqfPathway: {
      jobRole: 'Micro Food Processing Enterprise Supervisor',
      qpNosCode: 'FIC/Q9001 (Food Industry Capacity & Skill Initiative)',
      nsqfLevel: 5,
      trainingHours: 180,
      pmajayGrant: '₹75,000 Common Facility Center (CFC) Capital Support',
      projectedIncome: '₹20,000 – ₹26,000 / month (SHG Dividend + Wage)',
      accreditingBody: 'NCVET / FICSI',
    },
  },
];

export const LivelihoodPathwayVisualizer: React.FC<LivelihoodPathwayVisualizerProps> = ({
  isHighContrast = false,
}) => {
  const { t } = useTranslation();
  const [activePersonaId, setActivePersonaId] = useState<string>('artisan');

  const selectedPersona = PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];

  return (
    <section
      id="livelihood-mapping"
      aria-labelledby="livelihood-vis-title"
      style={{
        backgroundColor: isHighContrast ? '#0a0a0a' : '#f8fafc',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#e2e8f0'}`,
        padding: '72px 0',
      }}
    >
      <div className="jm-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
          <span className="jm-badge jm-badge-green" style={{ marginBottom: '10px' }}>
            {t.visBadge}
          </span>
          <h2
            id="livelihood-vis-title"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 32px)',
              fontWeight: 800,
              color: isHighContrast ? '#ffffff' : '#0c2340',
              marginBottom: '6px',
            }}
          >
            {t.visTitle}
          </h2>
          <div style={{ fontSize: '15px', fontWeight: 600, color: isHighContrast ? '#ff9933' : '#c2410c', marginBottom: '10px' }}>
            {t.visSubtitle}
          </div>
          <p
            style={{
              fontSize: '15px',
              color: isHighContrast ? '#d1d5db' : '#475569',
              lineHeight: 1.6,
            }}
          >
            {t.visDesc}
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div
          role="tablist"
          aria-label={t.visSelectLabel}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '36px',
          }}
        >
          {PERSONAS.map((persona) => {
            const isSelected = persona.id === activePersonaId;
            return (
              <button
                key={persona.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActivePersonaId(persona.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  borderRadius: '4px',
                  border: isSelected
                    ? `2px solid ${isHighContrast ? '#ff9933' : '#0c2340'}`
                    : `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                  backgroundColor: isSelected
                    ? (isHighContrast ? '#1f2937' : '#ffffff')
                    : (isHighContrast ? '#111827' : '#f1f5f9'),
                  color: isHighContrast ? '#ffffff' : '#0f172a',
                  cursor: 'pointer',
                  boxShadow: isSelected && !isHighContrast ? '0 4px 10px rgba(12, 35, 64, 0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? (isHighContrast ? '#ff9933' : '#0c2340') : '#cbd5e1',
                    color: isSelected ? (isHighContrast ? '#000000' : '#ffffff') : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {persona.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{persona.name}</div>
                  <div style={{ fontSize: '11px', color: isHighContrast ? '#d1d5db' : '#64748b' }}>
                    {persona.currentTrade}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 4-Stage Connected Pathway Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            position: 'relative',
          }}
          className="pathway-grid"
        >
          {/* Stage 1: Beneficiary Profile */}
          <div
            style={{
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              border: `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              borderRadius: '6px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isHighContrast ? 'none' : '0 2px 5px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span className="jm-badge jm-badge-neutral" style={{ fontSize: '10.5px' }}>
                चरण 1 • Stage 1
              </span>
              <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                ✓ सत्यापित (Verified)
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', marginBottom: '2px' }}>
              लाभार्थी प्रोफाइल
            </h2>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              Beneficiary Profile & Baseline
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', flexGrow: 1 }}>
              <div style={{ padding: '8px', backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>FULL NAME & AGE</span>
                <strong>{selectedPersona.name} ({selectedPersona.age} Years)</strong>
              </div>
              <div style={{ padding: '8px', backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>LOCATION & DEMOGRAPHICS</span>
                <strong>{selectedPersona.location}</strong>
                <div style={{ color: '#c2410c', fontSize: '11px', fontWeight: 600, marginTop: '2px' }}>
                  {selectedPersona.category}
                </div>
              </div>
              <div style={{ padding: '8px', backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>CURRENT INFORMAL EARNINGS</span>
                <strong style={{ color: '#dc2626' }}>{selectedPersona.currentIncome}</strong>
              </div>
            </div>

            <div style={{ marginTop: '16px', borderTop: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}`, paddingTop: '10px', fontSize: '11.5px', color: '#64748b' }}>
              Education Level: <strong>{selectedPersona.education}</strong>
            </div>
          </div>

          {/* Stage 2: Identified Skills Assessment */}
          <div
            style={{
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              border: `1.5px solid ${isHighContrast ? '#ff9933' : '#fed7aa'}`,
              borderRadius: '6px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isHighContrast ? 'none' : '0 2px 5px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span className="jm-badge jm-badge-saffron" style={{ fontSize: '10.5px' }}>
                चरण 2 • Stage 2
              </span>
              <span style={{ fontSize: '11px', color: '#c2410c', fontWeight: 600 }}>
                RPL पात्र (Eligible)
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', marginBottom: '2px' }}>
              कौशल मूल्यांकन
            </h2>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              Skills & RPL Prior Learning Assessment
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', flexGrow: 1 }}>
              {selectedPersona.skills.map((skill, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: isHighContrast ? '#1f2937' : '#fff7ed',
                    border: `1px solid ${isHighContrast ? '#374151' : '#fed7aa'}`,
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a', fontSize: '12.5px' }}>
                      {skill.name}
                    </strong>
                    <span style={{ fontSize: '10.5px', color: '#c2410c', fontWeight: 700 }}>
                      {skill.level}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '11px' }}>
                    <span>अनुभव / Tenure: {skill.experience}</span>
                    {skill.rplCandidate && <span style={{ color: '#15803d', fontWeight: 600 }}>✓ RPL पात्र</span>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', borderTop: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}`, paddingTop: '10px', fontSize: '11.5px', color: '#64748b' }}>
              सत्यापन: <strong>ग्राम पंचायत सर्वेक्षण (Surveyed)</strong>
            </div>
          </div>

          {/* Stage 3: Local Opportunities */}
          <div
            style={{
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              border: `1.5px solid ${isHighContrast ? '#60a5fa' : '#bfdbfe'}`,
              borderRadius: '6px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isHighContrast ? 'none' : '0 2px 5px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span className="jm-badge jm-badge-navy" style={{ fontSize: '10.5px' }}>
                चरण 3 • Stage 3
              </span>
              <span style={{ fontSize: '11px', color: '#1e3a8a', fontWeight: 600 }}>
                क्लस्टर मांग (Cluster Synced)
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', marginBottom: '2px' }}>
              स्थानीय अवसर
            </h2>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              District Demand & Value Chains
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', flexGrow: 1 }}>
              <div style={{ padding: '8px', backgroundColor: isHighContrast ? '#1f2937' : '#eff6ff', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '10.5px', display: 'block' }}>औद्योगिक क्लस्टर / CLUSTER</span>
                <strong style={{ color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                  {selectedPersona.localOpportunity.clusterName}
                </strong>
              </div>

              <div style={{ padding: '8px', backgroundColor: isHighContrast ? '#1f2937' : '#eff6ff', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '10.5px', display: 'block' }}>बाजार खपत / MARKET ABSORPTION</span>
                <p style={{ margin: 0, fontSize: '11.5px', color: isHighContrast ? '#d1d5db' : '#334155' }}>
                  {selectedPersona.localOpportunity.marketDemand}
                </p>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '10.5px', display: 'block', marginBottom: '4px' }}>
                  प्रमुख योजनाएं / KEY DRIVERS
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedPersona.localOpportunity.economicDrivers.map((driver, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '10.5px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: isHighContrast ? '#374151' : '#e2e8f0',
                        color: isHighContrast ? '#ffffff' : '#1e293b',
                      }}
                    >
                      {driver}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', borderTop: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}`, paddingTop: '10px', fontSize: '11.5px', color: '#64748b' }}>
              प्रशिक्षण केंद्र: <strong>{selectedPersona.localOpportunity.nearestHub}</strong>
            </div>
          </div>

          {/* Stage 4: NSQF Skill Pathway */}
          <div
            style={{
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              border: `2px solid ${isHighContrast ? '#22c55e' : '#15803d'}`,
              borderRadius: '6px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isHighContrast
                ? '0 0 0 1px #22c55e'
                : '0 8px 18px -4px rgba(21, 128, 61, 0.12), 0 2px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span className="jm-badge jm-badge-green" style={{ fontSize: '10.5px' }}>
                चरण 4 • अंतिम कौशल मार्ग
              </span>
              <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                NSQF Level {selectedPersona.nsqfPathway.nsqfLevel}
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', marginBottom: '2px' }}>
              एनएसक्यूएफ कौशल मार्ग
            </h2>
            <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 600, marginBottom: '14px' }}>
              {selectedPersona.nsqfPathway.jobRole}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', flexGrow: 1 }}>
              <div style={{ padding: '8px', backgroundColor: isHighContrast ? '#1f2937' : '#f0fdf4', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                <span style={{ color: '#166534', fontSize: '10.5px', display: 'block' }}>क्वालिफिकेशन पैक / QP-NOS</span>
                <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a', fontSize: '12px' }}>
                  {selectedPersona.nsqfPathway.qpNosCode}
                </strong>
              </div>

              <div style={{ padding: '8px', backgroundColor: isHighContrast ? '#1f2937' : '#f0fdf4', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                <span style={{ color: '#166534', fontSize: '10.5px', display: 'block' }}>पीएम-अजय अनुदान / PM-AJAY GRANT</span>
                <strong style={{ color: '#c2410c', fontSize: '12px' }}>
                  {selectedPersona.nsqfPathway.pmajayGrant}
                </strong>
              </div>

              <div style={{ padding: '8px', backgroundColor: isHighContrast ? '#1f2937' : '#f0fdf4', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                <span style={{ color: '#166534', fontSize: '10.5px', display: 'block' }}>अनुमानित आय वृद्धि / INCOME DELTA</span>
                <strong style={{ color: '#15803d', fontSize: '13.5px' }}>
                  {selectedPersona.nsqfPathway.projectedIncome}
                </strong>
              </div>
            </div>

            <div style={{ marginTop: '16px', borderTop: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}`, paddingTop: '10px', fontSize: '11.5px', color: '#64748b' }}>
              प्रत्यायन परिषद (Accreditation): <strong>{selectedPersona.nsqfPathway.accreditingBody}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
