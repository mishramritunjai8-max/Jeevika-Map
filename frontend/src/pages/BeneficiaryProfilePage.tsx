import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/useAccessibility';
import type { BeneficiaryFormData } from '../types/mapping';
import type { MatchResult } from '../services/recommendationEngine';

interface SavedProfileWithMeta extends BeneficiaryFormData {
  meta?: {
    beneficiaryId?: string;
    livelihoodProfileId?: string;
    recommendations?: MatchResult[];
    actionPlan?: {
      id?: string;
      potential_support_category?: string;
      recommended_enterprise_model?: string;
      nearest_training_center_type?: string;
      implementation_stage?: string;
      officer_notes?: string;
    };
    isOffline?: boolean;
    submittedAt?: string;
  };
}

const LOCAL_STORAGE_PROFILE_KEY = 'jeevika_beneficiary_profile';

export const BeneficiaryProfilePage: React.FC = () => {
  const { isHighContrast } = useAccessibility();
  const [savedProfile] = useState<SavedProfileWithMeta | null>(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Could not parse saved profile', e);
      return null;
    }
  });

  const primaryRec = savedProfile?.meta?.recommendations?.[0];

  return (
    <div>
      {/* Active Generated Profile Showcase Card (if available from /mapping) */}
      {savedProfile ? (
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `2px solid ${isHighContrast ? '#22c55e' : '#15803d'}`,
            borderRadius: '6px',
            padding: '24px',
            marginBottom: '28px',
            boxShadow: isHighContrast ? 'none' : '0 4px 12px rgba(21, 128, 61, 0.08)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="jm-badge jm-badge-green">
                सक्रिय लाभार्थी प्रोफाइल / Generated Beneficiary Dossier
              </span>
              <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                ✓ PM-AJAY Diagnostic Verified
              </span>
            </div>
            <Link
              to="/mapping"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: isHighContrast ? '#ff9933' : '#c2410c',
                textDecoration: 'underline',
              }}
            >
              मैपिंग विज़ार्ड में पुनः संपादित करें (Edit in Wizard)
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: isHighContrast ? '#374151' : '#eff6ff',
                color: '#1e3a8a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '18px',
                border: '1px solid #bfdbfe',
              }}
            >
              {savedProfile.basicInfo.fullName ? savedProfile.basicInfo.fullName[0].toUpperCase() : 'B'}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', margin: 0 }}>
                {savedProfile.basicInfo.fullName} ({savedProfile.basicInfo.age} Years)
              </h2>
              <div style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginTop: '2px' }}>
                {savedProfile.location.district ? `${savedProfile.location.district}, ` : ''}{savedProfile.location.state} • {savedProfile.basicInfo.casteCategory.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>

          {/* Database Reference Strip */}
          {savedProfile.meta && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '10px 14px',
                marginBottom: '16px',
                borderRadius: '4px',
                backgroundColor: isHighContrast ? '#1f2937' : '#f1f5f9',
                border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                fontSize: '11.5px',
                color: isHighContrast ? '#9ca3af' : '#475569',
              }}
            >
              <div>
                <strong>Livelihood Profile UUID:</strong>{' '}
                <code style={{ fontSize: '11px', color: isHighContrast ? '#60a5fa' : '#1e3a8a' }}>
                  {savedProfile.meta.livelihoodProfileId || 'Registered'}
                </code>
              </div>
              <div>
                <strong>Beneficiary UUID:</strong>{' '}
                <code style={{ fontSize: '11px', color: isHighContrast ? '#60a5fa' : '#1e3a8a' }}>
                  {savedProfile.meta.beneficiaryId || 'Registered'}
                </code>
              </div>
              <div style={{ marginLeft: 'auto', color: savedProfile.meta?.isOffline ? '#c2410c' : '#15803d', fontWeight: 600 }}>
                {savedProfile.meta?.isOffline ? '⚡ Saved offline — will sync when connected' : '🔒 Database RLS Protected'}
              </div>
            </div>
          )}

          {/* Key Diagnostic Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              padding: '14px',
              backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
              borderRadius: '6px',
              border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
              marginBottom: primaryRec ? '18px' : '0',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block' }}>
                प्राथमिक कौशल / PRIMARY TRADE
              </span>
              <strong style={{ fontSize: '13.5px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                {savedProfile.existingSkills.primarySkill}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block' }}>
                RPL मूल्यांकन स्थिति / RPL STATUS
              </span>
              <strong style={{ fontSize: '13.5px', color: '#15803d' }}>
                {savedProfile.existingSkills.rplInterest ? 'Fast-Track RPL Eligible (Level 4)' : 'Standard Certification'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block' }}>
                लक्षित मासिक आय / TARGET INCOME
              </span>
              <strong style={{ fontSize: '13.5px', color: '#c2410c' }}>
                {savedProfile.aspirations.targetMonthlyIncome}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block' }}>
                PM-AJAY टूलकिट सहायता / POTENTIAL SUPPORT
              </span>
              <strong style={{ fontSize: '13.5px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                {savedProfile.aspirations.needsToolkitFinancing ? 'Eligible for Toolkit Assistance' : 'Skill Training Only'}
              </strong>
            </div>
          </div>

          {/* Zero-Fabrication Matched NSQF Recommendation Section */}
          {primaryRec && primaryRec.occupation && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: isHighContrast ? '#111827' : '#eff6ff',
                borderRadius: '6px',
                border: `1px solid ${isHighContrast ? '#3b82f6' : '#bfdbfe'}`,
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="jm-badge jm-badge-saffron">
                    प्राथमिक अनुशंसित जॉब रोल / Primary NSQF Recommendation
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>
                    Match Score: {primaryRec.match_score}/100
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                  Official QP-NOS: <strong>{primaryRec.occupation.qp_nos_code}</strong>
                </span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', margin: '0 0 4px' }}>
                {primaryRec.occupation.job_role}
              </h3>
              <div style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '10px' }}>
                Sector Skill Council: <strong>{primaryRec.occupation.sector_skill_council}</strong> • NSQF Level: <strong>{primaryRec.occupation.nsqf_level}</strong> ({primaryRec.occupation.notional_hours} Hours)
              </div>

              <p style={{ fontSize: '13px', lineHeight: 1.5, color: isHighContrast ? '#e5e7eb' : '#334155', margin: '0 0 12px' }}>
                {primaryRec.rationale}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#15803d', fontWeight: 700 }}>✓ मेल खाते कौशल (Matched):</span>{' '}
                  <span style={{ color: isHighContrast ? '#d1d5db' : '#475569' }}>
                    {primaryRec.matched_skills.join(', ')}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#c2410c', fontWeight: 700 }}>⚡ कौशल अंतराल (Skill Gap):</span>{' '}
                  <span style={{ color: isHighContrast ? '#d1d5db' : '#475569' }}>
                    {primaryRec.skill_gaps.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PM-AJAY Server-Generated Convergence Action Plan */}
          {savedProfile.meta?.actionPlan && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: isHighContrast ? '#111827' : '#f0fdf4',
                borderRadius: '6px',
                border: `1px solid ${isHighContrast ? '#22c55e' : '#86efac'}`,
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="jm-badge jm-badge-green">
                    प्रस्तावित कार्ययोजना / PM-AJAY Convergence Pathway
                  </span>
                  <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                    Stage: {savedProfile.meta.actionPlan.implementation_stage?.replace(/_/g, ' ').toUpperCase() || 'FORMULATED'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                  Action Plan ID: <code style={{ fontSize: '11px' }}>{savedProfile.meta.actionPlan.id || 'Generated'}</code>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '10px', fontSize: '12.5px' }}>
                <div>
                  <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>
                    अभिसरण सहायता श्रेणी / SUPPORT CATEGORY
                  </span>
                  <strong style={{ color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                    {savedProfile.meta.actionPlan.potential_support_category?.replace(/_/g, ' ').toUpperCase() || 'SKILL TRAINING'}
                  </strong>
                </div>

                <div>
                  <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>
                    अनुशंसित उद्यम मॉडल / ENTERPRISE MODEL
                  </span>
                  <strong style={{ color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                    {savedProfile.meta.actionPlan.recommended_enterprise_model?.replace(/_/g, ' ').toUpperCase() || 'MICRO ENTERPRISE'}
                  </strong>
                </div>

                <div>
                  <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>
                    प्रशिक्षण संस्थान केंद्र / CENTER TYPE
                  </span>
                  <strong style={{ color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                    {savedProfile.meta.actionPlan.nearest_training_center_type || 'District ITI / PMKK Hub'}
                  </strong>
                </div>
              </div>

              {savedProfile.meta.actionPlan.officer_notes && (
                <div style={{ fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#475569', fontStyle: 'italic', borderTop: `1px dashed ${isHighContrast ? '#374151' : '#cbd5e1'}`, paddingTop: '8px' }}>
                  <strong>अभिसरण टिप्पणी (Officer Assessment):</strong> {savedProfile.meta.actionPlan.officer_notes}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Notice if no profile created yet */
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '4px',
            backgroundColor: isHighContrast ? '#1f2937' : '#eff6ff',
            border: `1px solid ${isHighContrast ? '#60a5fa' : '#bfdbfe'}`,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '13px', color: isHighContrast ? '#ffffff' : '#1e3a8a' }}>
            ℹ️ <strong>कोई सक्रिय लाभार्थी प्रोफाइल नहीं मिला (No Profile Yet):</strong> संपूर्ण 8-चरणीय मैपिंग विज़ार्ड पूरा करके अपनी प्रोफाइल बनाएं।
          </div>
          <Link to="/mapping" className="jm-btn jm-btn-saffron" style={{ padding: '6px 14px', fontSize: '12.5px' }}>
            मैपिंग शुरू करें / Start Mapping
          </Link>
        </div>
      )}

      {/* Module Header Banner */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="jm-badge jm-badge-navy">चरण 02 • समझें (Step 02 • Understand)</span>
            <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 600 }}>
              शासनादेश कोड: PMAJAY-BEN-MOD-02
            </span>
          </div>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#1e3a8a',
              backgroundColor: isHighContrast ? '#374151' : '#eff6ff',
              padding: '3px 8px',
              borderRadius: '3px',
              border: '1px solid #bfdbfe',
            }}
          >
            आर्किटेक्चर विशिष्टता
          </span>
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '4px',
          }}
        >
          लाभार्थी आजीविका प्रोफाइल एवं कौशल इन्वेंट्री
        </h1>
        <div style={{ fontSize: '13.5px', color: isHighContrast ? '#ff9933' : '#c2410c', fontWeight: 600, marginBottom: '12px' }}>
          Beneficiary Livelihood Profiling & Skills Inventory
        </div>

        <p style={{ fontSize: '14px', lineHeight: 1.6, color: isHighContrast ? '#e5e7eb' : '#475569', margin: 0 }}>
          अनुसूचित जाति (SC) परिवारों के हुनरमंद कारीगरों एवं युवाओं का डिजिटल प्रोफाइल तैयार करता है।
          अनौपचारिक कौशल को <strong>पूर्व अनुभव की मान्यता (RPL)</strong> फ्रेमवर्क एवं एनएसक्यूएफ मानकों के तहत सत्यापित करता है।
        </p>
      </div>

      {/* Purpose & Architecture Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#1e3a8a' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              1. सामाजिक-आर्थिक आधार (Baseline)
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            पीएम-अजय योजना के तहत अभिसरण हेतु सत्यापित पहचान एवं घरेलू विवरण:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>परिवार की जनसांख्यिकी एवं जाति सत्यापन संकेतक</li>
            <li>वर्तमान दैनिक/मासिक मजदूरी एवं मौसमी कार्य प्रकृति</li>
            <li>औपचारिक शिक्षा बनाम व्यावहारिक हुनर व अनुभव</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#15803d' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              2. आरपीएल कौशल निदान (RPL Diagnostic)
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            व्यावहारिक कार्य क्षमता का मूल्यांकन कर बिना लंबे पाठ्यक्रम के सीधा एनएसक्यूएफ प्रमाणन:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>औजार संचालन एवं कार्य प्रवीणता मैट्रिक्स</li>
            <li>NCVET QP-NOS मानकों के सापेक्ष कौशल अंतराल की पहचान</li>
            <li>80–120 घंटे के ब्रिज-प्रशिक्षण हेतु तत्परता</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#c2410c' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              3. आकांक्षा एवं गतिशीलता (Mobility)
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            नजदीकी औद्योगिक क्लस्टर में जाने की तत्परता बनाम घर से सूक्ष्म उद्यम की प्राथमिकता:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>जिला स्तर बनाम ब्लॉक स्तर पर आवागमन की सुविधा</li>
            <li>स्व-रोजगार बनाम नियमित वेतनभोगी नौकरी की इच्छा</li>
            <li>स्वयं सहायता समूह (SHG) सहकारी उत्पादन में सहभागिता</li>
          </ul>
        </div>
      </div>

      {/* Action Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
        }}
      >
        <Link to="/mapping" className="jm-btn jm-btn-secondary">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10H5M9 14l-4-4 4-4" />
          </svg>
          <span>आजीविका मैपिंग विज़ार्ड पर जाएँ (Back to Mapping)</span>
        </Link>
        <Link to="/opportunities" className="jm-btn jm-btn-primary">
          <span>स्थानीय अवसर देखें (View Local Opportunities)</span>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 10h10M11 6l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
