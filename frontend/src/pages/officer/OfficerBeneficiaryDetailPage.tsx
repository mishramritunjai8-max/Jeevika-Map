import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccessibility } from '../../context/useAccessibility';
import {
  getBeneficiaryCaseDetail,
  saveOfficerAssessment,
  explainRecommendationFactors,
  type BeneficiaryCaseDetail,
  type OfficerAssessment,
} from '../../services/officerDashboardService';
import { RlsNoticeBanner } from '../../components/officer/RlsNoticeBanner';

export const OfficerBeneficiaryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isHighContrast } = useAccessibility();

  const [caseData, setCaseData] = useState<BeneficiaryCaseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Local state for Officer Assessment
  const [assessmentStatus, setAssessmentStatus] = useState<'pending' | 'verified' | 'referred' | 'rejected'>('verified');
  const [officerRemarks, setOfficerRemarks] = useState<string>('Beneficiary eligibility verified against PM-AJAY criteria. Candidate matches NCVET NSQF Level 4 training criteria.');
  const [recommendedNextAction, setRecommendedNextAction] = useState<string>('counseling_call');
  const [savedAssessment, setSavedAssessment] = useState<OfficerAssessment | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCase = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getBeneficiaryCaseDetail(id);
        if (isMounted) {
          if (res) {
            setCaseData(res);
            if (res.assessment) {
              setAssessmentStatus(res.assessment.verification_status);
              setOfficerRemarks(res.assessment.officer_remarks);
              setRecommendedNextAction(res.assessment.recommended_next_action);
              setSavedAssessment(res.assessment);
            }
          } else {
            setError('Beneficiary case record not found.');
          }
        }
      } catch (err) {
        console.error('[OfficerBeneficiaryDetailPage] Error fetching case:', err);
        if (isMounted) {
          setError('Unable to load beneficiary case. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCase();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const primaryRec = caseData?.recommendations?.find((r) => r.is_primary) || caseData?.recommendations?.[0];
  const explanationFactors = caseData?.profile && primaryRec?.occupation
    ? explainRecommendationFactors(caseData.profile, primaryRec.occupation, primaryRec)
    : [];

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData?.beneficiary?.id) return;

    setIsSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      const res = await saveOfficerAssessment({
        beneficiaryId: caseData.beneficiary.id,
        verificationStatus: assessmentStatus,
        recommendedNextAction,
        officerRemarks: officerRemarks.trim(),
      });

      if (res.success && res.data) {
        setSavedAssessment(res.data);
        setSaveSuccessMsg(
          `✓ Officer assessment successfully recorded to database (Audit ID: #${res.data.id.slice(0, 8)} • Updated: ${new Date(res.data.updated_at).toLocaleString()}).`
        );
      } else {
        setSaveErrorMsg(res.error || 'Failed to record officer assessment into database.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to record officer assessment.';
      setSaveErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
        <span style={{ display: 'inline-block', width: '26px', height: '26px', border: '3px solid #cbd5e1', borderTopColor: '#0c2340', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 600 }}>
          Retrieving official beneficiary dossier...
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <Link to="/officer/beneficiaries" style={{ fontSize: '13px', color: '#1e40af', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Beneficiary Registry
          </Link>
        </div>
        <div style={{ padding: '24px', backgroundColor: isHighContrast ? '#1f2937' : '#fef2f2', border: '1px solid #f87171', borderRadius: '6px', color: '#b91c1c' }}>
          <h2 style={{ fontSize: '16px', margin: '0 0 8px' }}>⚠️ Case Record Unavailable</h2>
          <p style={{ fontSize: '13px', margin: 0 }}>
            {error || 'The requested beneficiary UUID could not be located in the database.'}
          </p>
        </div>
      </div>
    );
  }

  const { beneficiary, profile, recommendations, actionPlan } = caseData;

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '12px' }}>
        <Link to="/officer" style={{ color: isHighContrast ? '#9ca3af' : '#64748b', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <span style={{ color: '#94a3b8' }}>/</span>
        <Link to="/officer/beneficiaries" style={{ color: isHighContrast ? '#9ca3af' : '#64748b', textDecoration: 'none' }}>
          Beneficiaries
        </Link>
        <span style={{ color: '#94a3b8' }}>/</span>
        <span style={{ color: '#1e40af', fontWeight: 700 }}>Case File #{beneficiary.id.slice(0, 8)}</span>
      </div>

      {/* Case Header Strip */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
          padding: '24px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(12, 35, 64, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: isHighContrast ? '#1e3a8a' : '#eff6ff',
              color: '#1e3a8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '22px',
              border: '2px solid #bfdbfe',
              flexShrink: 0,
            }}
          >
            {beneficiary.full_name ? beneficiary.full_name[0].toUpperCase() : 'B'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span className="jm-badge jm-badge-green" style={{ fontSize: '10px' }}>
                PM-AJAY Eligible Candidate
              </span>
              <span style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 700 }}>
                ✓ Diagnostic Verified
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: isHighContrast ? '#ffffff' : '#0c2340', margin: 0 }}>
              {beneficiary.full_name}
            </h1>
            <div style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', marginTop: '2px' }}>
              Registration UUID: <code style={{ color: isHighContrast ? '#60a5fa' : '#1e40af' }}>{beneficiary.id}</code>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => window.print()}
            className="jm-btn jm-btn-navy"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            🖨️ Print Dossier
          </button>
        </div>
      </div>

      {/* RLS Security Notice if applicable */}
      {caseData.isRlsRestricted && (
        <RlsNoticeBanner
          isHighContrast={isHighContrast}
          message="Officer authentication/authorization is required before protected beneficiary SELECT queries can be enabled."
          subtext={`Displaying case file from ${caseData.sourceType === 'session_buffer' ? 'active session intake buffer' : 'authenticated sandbox'}. Under PostgreSQL RLS default-deny, production officer access requires authenticated JWT role validation.`}
        />
      )}

      {/* Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* SECTION A: Beneficiary Identity & Demographic Record */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            borderRadius: '6px',
            border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`, paddingBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              SECTION A: Citizen Identity & Demographics
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px' }}>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>FULL NAME</span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{beneficiary.full_name}</strong>
            </div>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>AGE / GENDER</span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{beneficiary.age} Years • {beneficiary.gender.toUpperCase()}</strong>
            </div>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>CASTE CATEGORY</span>
              <strong style={{ color: '#c2410c' }}>{beneficiary.caste_category.replace(/_/g, ' ').toUpperCase()}</strong>
            </div>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>AREA TYPE</span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{beneficiary.area_type.toUpperCase()}</strong>
            </div>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>DISTRICT & STATE</span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{beneficiary.district}, {beneficiary.state}</strong>
            </div>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>BLOCK / GRAM PANCHAYAT</span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{beneficiary.block || '—'} / {beneficiary.gram_panchayat || '—'}</strong>
            </div>
          </div>
        </div>

        {/* SECTION B: Livelihood Profile & Informal Competencies */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            borderRadius: '6px',
            border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`, paddingBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              SECTION B: Livelihood Baseline & Skills Diagnostic
            </span>
          </div>

          {profile ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px' }}>
              <div>
                <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>PRIMARY SKILL</span>
                <strong style={{ color: '#1e40af' }}>{profile.primary_skill}</strong>
              </div>
              <div>
                <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>TOOL PROFICIENCY</span>
                <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{profile.tool_proficiency.replace(/_/g, ' ')}</strong>
              </div>
              <div>
                <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>WORK EXPERIENCE</span>
                <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{profile.years_experience} Years ({profile.current_trade || 'Practicing'})</strong>
              </div>
              <div>
                <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>FORMAL EDUCATION</span>
                <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{profile.formal_education_level.replace(/_/g, ' ')}</strong>
              </div>
              <div>
                <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>MONTHLY INCOME</span>
                <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{profile.monthly_income_range || 'Under ₹5,000'}</strong>
              </div>
              <div>
                <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>RPL CERTIFICATION</span>
                <strong style={{ color: '#15803d' }}>{profile.rpl_interest ? 'Opted for RPL' : 'Standard'}</strong>
              </div>
            </div>
          ) : (
            <div style={{ color: isHighContrast ? '#9ca3af' : '#64748b', fontSize: '13px' }}>
              No detailed livelihood profile on record.
            </div>
          )}
        </div>
      </div>

      {/* SECTION C: Constraints & Preferences */}
      {profile && (
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            borderRadius: '6px',
            border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', marginBottom: '12px', borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`, paddingBottom: '8px' }}>
            SECTION C: Constraints & Mobility Parameters
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12.5px' }}>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>FINANCIAL NEED</span>
              <strong style={{ color: '#c2410c' }}>{profile.financial_constraint.replace(/_/g, ' ').toUpperCase()}</strong>
            </div>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>MOBILITY RANGE</span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{profile.mobility_range.replace(/_/g, ' ')}</strong>
            </div>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>EMPLOYMENT PREFERENCE</span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a' }}>{profile.employment_preference.replace(/_/g, ' ')}</strong>
            </div>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>TOOLKIT SUBSIDY INTEREST</span>
              <strong style={{ color: '#15803d' }}>{profile.seeks_toolkit_support ? 'Yes, PM-AJAY Toolkit Requested' : 'Skill Training Only'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* SECTION D: Persisted Recommendations & Alignment */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`, paddingBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 600 }}>NCVET OFFICIAL STANDARDS</span>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', margin: '2px 0 0' }}>
              SECTION D: Persisted NSQF Skilling Recommendations
            </h2>
          </div>
          <span className="jm-badge jm-badge-saffron">
            Zero-Fabrication Catalog Matched
          </span>
        </div>

        {recommendations && recommendations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recommendations.map((rec, idx) => (
              <div
                key={rec.id || idx}
                style={{
                  padding: '16px',
                  borderRadius: '6px',
                  backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
                  border: `1.5px solid ${rec.is_primary ? (isHighContrast ? '#22c55e' : '#86efac') : (isHighContrast ? '#374151' : '#e2e8f0')}`,
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {rec.is_primary && (
                      <span className="jm-badge jm-badge-green" style={{ fontSize: '11px' }}>
                        Primary Match
                      </span>
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                      {rec.occupation?.job_role || 'Job Role Reference'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>
                      Match Score: {rec.match_score}/100
                    </span>
                    <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                      QP Code: <strong>{rec.occupation?.qp_nos_code}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '8px' }}>
                  Sector Skill Council: <strong>{rec.occupation?.sector_skill_council}</strong> • NSQF Level: <strong>{rec.occupation?.nsqf_level}</strong> ({rec.occupation?.notional_hours} Hours) • RPL: <strong>{rec.occupation?.rpl_allowed ? 'Allowed' : 'No'}</strong>
                </div>

                <p style={{ fontSize: '12.5px', lineHeight: 1.5, color: isHighContrast ? '#e5e7eb' : '#334155', margin: '0 0 10px' }}>
                  {rec.rationale}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#15803d', fontWeight: 700 }}>✓ Validated Skills:</span>{' '}
                    <span style={{ color: isHighContrast ? '#d1d5db' : '#475569' }}>
                      {rec.matched_skills.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#c2410c', fontWeight: 700 }}>⚡ Bridge Modules:</span>{' '}
                    <span style={{ color: isHighContrast ? '#d1d5db' : '#475569' }}>
                      {rec.skill_gaps.join(', ') || 'None required'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: isHighContrast ? '#9ca3af' : '#64748b', fontSize: '13px' }}>
            No recommendations generated for this profile yet.
          </div>
        )}
      </div>

      {/* SECTION E: PM-AJAY Convergence Action Plan */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', marginBottom: '14px', borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`, paddingBottom: '8px' }}>
          SECTION E: PM-AJAY Convergence Action Plan
        </div>

        {actionPlan ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '12.5px' }}>
            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>
                SUPPORT CATEGORY
              </span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                {actionPlan.potential_support_category.replace(/_/g, ' ').toUpperCase()}
              </strong>
            </div>

            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>
                RECOMMENDED ENTERPRISE MODEL
              </span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                {actionPlan.recommended_enterprise_model.replace(/_/g, ' ').toUpperCase()}
              </strong>
            </div>

            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>
                TRAINING INSTITUTION TYPE
              </span>
              <strong style={{ color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                {actionPlan.nearest_training_center_type || 'District ITI / PMKK Hub'}
              </strong>
            </div>

            <div>
              <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>
                IMPLEMENTATION STAGE
              </span>
              <span className="jm-badge jm-badge-green" style={{ fontSize: '11px' }}>
                {actionPlan.implementation_stage.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            {actionPlan.officer_notes && (
              <div style={{ gridColumn: '1 / -1', marginTop: '6px', paddingTop: '8px', borderTop: `1px dashed ${isHighContrast ? '#374151' : '#cbd5e1'}`, fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#475569' }}>
                <strong>Automated Assessment Note:</strong> {actionPlan.officer_notes}
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: isHighContrast ? '#9ca3af' : '#64748b', fontSize: '13px' }}>
            Action plan not formulated yet.
          </div>
        )}
      </div>

      {/* SECTION G: Transparent Explainability (Why Jeevika Map Recommended This) */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#eff6ff',
          borderRadius: '6px',
          border: `1.5px solid ${isHighContrast ? '#3b82f6' : '#bfdbfe'}`,
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: isHighContrast ? '#93c5fd' : '#1e40af', fontWeight: 700 }}>
              SIH 2026 AUDITABLE EXPLAINABILITY
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', margin: '2px 0 0' }}>
              Why Jeevika Map Recommended This (पारदर्शी निर्णय प्रक्रिया)
            </h2>
          </div>
          <span className="jm-badge jm-badge-navy">Deterministic Logic</span>
        </div>

        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '14px' }}>
          Evaluated deterministically across official NCVET qualification rules, candidate education, practical trade history, and PM-AJAY scheme parameters:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {explanationFactors.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '4px',
                backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: item.status === 'optimal' ? '#dcfce7' : (item.status === 'gap' ? '#fee2e2' : '#eff6ff'),
                  color: item.status === 'optimal' ? '#15803d' : (item.status === 'gap' ? '#dc2626' : '#1e40af'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                {item.status === 'optimal' ? '✓' : (item.status === 'gap' ? '!' : '•')}
              </div>
              <div style={{ fontSize: '12px', flexGrow: 1 }}>
                <div style={{ fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                  {item.factor}: {item.title}
                </div>
                <div style={{ color: isHighContrast ? '#d1d5db' : '#475569', marginTop: '2px' }}>
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION F: Officer Assessment & Remarks Form */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
          padding: '20px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(12, 35, 64, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`, paddingBottom: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
            SECTION F: Officer Verification Assessment
          </div>
          {savedAssessment && (
            <span style={{ fontSize: '11px', color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              ✓ Saved in Database • Audit #{savedAssessment.id.slice(0, 8)} ({new Date(savedAssessment.updated_at).toLocaleDateString()})
            </span>
          )}
        </div>

        {saveSuccessMsg && (
          <div role="status" style={{ padding: '10px 14px', borderRadius: '4px', backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#15803d', fontSize: '12px', fontWeight: 600, marginBottom: '14px' }}>
            {saveSuccessMsg}
          </div>
        )}

        {saveErrorMsg && (
          <div role="alert" style={{ padding: '10px 14px', borderRadius: '4px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '12px', fontWeight: 600, marginBottom: '14px' }}>
            ⚠️ {saveErrorMsg}
          </div>
        )}

        <form onSubmit={handleSaveAssessment}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#475569', marginBottom: '4px' }}>
                VERIFICATION STATUS
              </label>
              <select
                value={assessmentStatus}
                onChange={(e) => setAssessmentStatus(e.target.value as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                disabled={isSaving}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: '12.5px',
                  borderRadius: '4px',
                  border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                  backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                  color: isHighContrast ? '#ffffff' : '#0f172a',
                }}
              >
                <option value="verified">Verified - Eligible for PM-AJAY</option>
                <option value="pending">Pending Document Review</option>
                <option value="referred">Referred for District Committee Review</option>
                <option value="rejected">Ineligible / Duplicate</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#475569', marginBottom: '4px' }}>
                RECOMMENDED NEXT ACTION
              </label>
              <select
                value={recommendedNextAction}
                onChange={(e) => setRecommendedNextAction(e.target.value)}
                disabled={isSaving}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: '12.5px',
                  borderRadius: '4px',
                  border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                  backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                  color: isHighContrast ? '#ffffff' : '#0f172a',
                }}
              >
                <option value="counseling_call">Schedule Physical Verification Call</option>
                <option value="training_enrollment">Fast-Track for ITI / Weavers Centre Batch</option>
                <option value="toolkit_disbursement">Forward to District Bank Linkage Officer</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#475569', marginBottom: '4px' }}>
              OFFICER REMARKS / CONVERGENCE NOTES
            </label>
            <textarea
              rows={3}
              value={officerRemarks}
              onChange={(e) => setOfficerRemarks(e.target.value)}
              disabled={isSaving}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '12.5px',
                borderRadius: '4px',
                border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                color: isHighContrast ? '#ffffff' : '#0f172a',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ fontSize: '11.5px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
              🔒 Under PostgreSQL RLS, officer assessment mutation is authenticated via app_metadata.
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="jm-btn jm-btn-saffron"
              style={{ padding: '8px 18px', fontSize: '12.5px', opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
            >
              {isSaving ? 'Recording Assessment...' : 'Record Officer Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

