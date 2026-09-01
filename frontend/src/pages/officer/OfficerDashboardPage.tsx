import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/useAccessibility';
import {
  getOfficerDashboardMetrics,
  getBeneficiaryRegistry,
  type DashboardMetrics,
  type BeneficiaryRegistryItem,
} from '../../services/officerDashboardService';
import { OfficerStatCard } from '../../components/officer/OfficerStatCard';
import { RlsNoticeBanner } from '../../components/officer/RlsNoticeBanner';

export const OfficerDashboardPage: React.FC = () => {
  const { isHighContrast } = useAccessibility();

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBeneficiaries: 0,
    completedProfiles: 0,
    recommendationsGenerated: 0,
    actionPlansGenerated: 0,
    isRlsRestricted: false,
  });

  const [recentBeneficiaries, setRecentBeneficiaries] = useState<BeneficiaryRegistryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metricData, registryData] = await Promise.all([
          getOfficerDashboardMetrics(),
          getBeneficiaryRegistry({ pageSize: 5, sortBy: 'recent' }),
        ]);

        if (isMounted) {
          setMetrics(metricData);
          setRecentBeneficiaries(registryData.items);
        }
      } catch (err) {
        console.error('[OfficerDashboardPage] Error loading dashboard:', err);
        if (isMounted) {
          setError('Unable to load beneficiary registry. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* 1. Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          padding: '20px 24px',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="jm-badge jm-badge-navy">
              PM-AJAY • DISTRICT OPERATIONS
            </span>
            <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 600 }}>
              PORTAL REF: GIA-Nodal-2026
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: isHighContrast ? '#ffffff' : '#0c2340', margin: 0 }}>
            Officer Command Center & Livelihood Monitoring
          </h1>
          <div style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#475569', marginTop: '2px' }}>
            Real-time tracking of PM-AJAY candidate intake, diagnostic profiles, and NSQF alignment.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/officer/beneficiaries"
            className="jm-btn jm-btn-saffron"
            style={{ padding: '8px 18px', fontSize: '13px', textDecoration: 'none' }}
          >
            Open Beneficiary Registry →
          </Link>
        </div>
      </div>

      {/* 2. RLS Security / Authorization Notice */}
      {metrics.isRlsRestricted && (
        <RlsNoticeBanner
          isHighContrast={isHighContrast}
          message={metrics.rlsMessage}
          subtext="Beneficiary intake is active and strictly isolated by PostgreSQL Row Level Security. Authenticated officer access ensures confidential monitoring without public exposure of citizen records."
        />
      )}

      {/* 3. Summary Statistic Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <OfficerStatCard
          title="Total Beneficiaries"
          hindiTitle="कुल पंजीकृत लाभार्थी"
          count={metrics.totalBeneficiaries}
          accentColor="#0c2340"
          isHighContrast={isHighContrast}
          sublabel="Intake Verified"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          }
        />

        <OfficerStatCard
          title="Livelihood Profiles"
          hindiTitle="मूल्यांकित आजीविका प्रोफाइल"
          count={metrics.completedProfiles}
          accentColor="#1e40af"
          isHighContrast={isHighContrast}
          sublabel="Diagnostic Completed"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          }
        />

        <OfficerStatCard
          title="Recommendations"
          hindiTitle="एनएसक्यूएफ कौशल अनुशंसाएं"
          count={metrics.recommendationsGenerated}
          accentColor="#c2410c"
          isHighContrast={isHighContrast}
          sublabel="Zero-Fabrication Aligned"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          }
        />

        <OfficerStatCard
          title="Action Plans"
          hindiTitle="तैयार अभिसरण कार्ययोजनाएं"
          count={metrics.actionPlansGenerated}
          accentColor="#15803d"
          isHighContrast={isHighContrast}
          sublabel="Convergence Formulated"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          }
        />
      </div>

      {/* 4. Recent Beneficiaries Table Section */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
          padding: '24px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(12, 35, 64, 0.04)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 600 }}>
              हाल ही में दर्ज मामले / RECENT CASE INTAKE
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', margin: '2px 0 0' }}>
              Recent Beneficiaries
            </h2>
          </div>

          <Link
            to="/officer/beneficiaries"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: isHighContrast ? '#60a5fa' : '#1e3a8a',
              textDecoration: 'none',
            }}
          >
            View Complete Registry ({metrics.totalBeneficiaries}) →
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '36px', textAlign: 'center', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
            <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #cbd5e1', borderTopColor: '#0c2340', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: '10px', fontSize: '13px' }}>Loading beneficiary records...</div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{ padding: '20px', borderRadius: '4px', backgroundColor: isHighContrast ? '#1f2937' : '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Table View */}
        {!loading && !error && recentBeneficiaries.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: isHighContrast ? '#1f2937' : '#f1f5f9', borderBottom: `2px solid ${isHighContrast ? '#374151' : '#cbd5e1'}` }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Registration ID</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Name</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Age / Gender</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Location</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Primary Livelihood Interest</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Status</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Created Date</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBeneficiaries.map((ben) => (
                  <tr
                    key={ben.id}
                    style={{
                      borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                      backgroundColor: isHighContrast ? 'transparent' : '#ffffff',
                    }}
                  >
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>
                      <code style={{ color: isHighContrast ? '#60a5fa' : '#1e40af' }}>
                        {ben.id.length > 18 ? `${ben.id.slice(0, 8)}...${ben.id.slice(-4)}` : ben.id}
                      </code>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                      {ben.fullName}
                    </td>
                    <td style={{ padding: '12px', color: isHighContrast ? '#d1d5db' : '#475569' }}>
                      {ben.age} Yrs • {ben.gender.toUpperCase()}
                    </td>
                    <td style={{ padding: '12px', color: isHighContrast ? '#d1d5db' : '#475569' }}>
                      {ben.district}, {ben.state}
                    </td>
                    <td style={{ padding: '12px', color: isHighContrast ? '#ffffff' : '#0c2340', fontWeight: 600 }}>
                      {ben.profile?.primarySkill || ben.primaryRecommendation?.jobRole || 'Assessment Initiated'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="jm-badge jm-badge-green" style={{ fontSize: '11px' }}>
                        {ben.profile?.status === 'submitted' ? 'Profile Completed' : 'Intake Logged'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                      {new Date(ben.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Link
                        to={`/officer/beneficiaries/${ben.id}`}
                        className="jm-btn jm-btn-navy"
                        style={{
                          padding: '6px 12px',
                          fontSize: '11.5px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>View Dossier</span>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 10h10M11 6l4 4-4 4" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recentBeneficiaries.length === 0 && (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
              borderRadius: '6px',
              border: `1px dashed ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340', margin: '0 0 4px' }}>
              No beneficiary cases are currently available.
            </h3>
            <p style={{ fontSize: '12.5px', color: isHighContrast ? '#9ca3af' : '#64748b', maxWidth: '420px', margin: '0 auto 16px' }}>
              Beneficiary records registered via the citizen mapping wizard will appear here once submitted and verified.
            </p>
            <Link
              to="/mapping"
              className="jm-btn jm-btn-navy"
              style={{ padding: '8px 16px', fontSize: '12.5px', textDecoration: 'none' }}
            >
              Open Citizen Intake Wizard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
