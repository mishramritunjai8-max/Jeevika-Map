import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/useAccessibility';
import {
  getBeneficiaryRegistry,
  type BeneficiaryRegistryItem,
} from '../../services/officerDashboardService';
import { RlsNoticeBanner } from '../../components/officer/RlsNoticeBanner';

export const OfficerRegistryPage: React.FC = () => {
  const { isHighContrast } = useAccessibility();

  const [items, setItems] = useState<BeneficiaryRegistryItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRlsRestricted, setIsRlsRestricted] = useState<boolean>(false);
  const [rlsMessage, setRlsMessage] = useState<string | undefined>();

  // Filter & search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [nsqfFilter, setNsqfFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [occupationFilter, setOccupationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchRegistry = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBeneficiaryRegistry({
          searchQuery,
          gender: genderFilter,
          status: statusFilter,
          sortBy,
          page: currentPage,
          pageSize,
        });

        if (isMounted) {
          setItems(res.items);
          setTotalCount(res.totalCount);
          setIsRlsRestricted(res.isRlsRestricted);
          setRlsMessage(res.rlsMessage);
        }
      } catch (err) {
        console.error('[OfficerRegistryPage] Failed to fetch registry:', err);
        if (isMounted) {
          setError('Unable to load beneficiary registry. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRegistry();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, genderFilter, statusFilter, sortBy, currentPage, refreshKey]);


  // Client-side additional filters for NSQF & occupation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (nsqfFilter !== 'all') {
        const targetLevel = parseInt(nsqfFilter, 10);
        if (item.primaryRecommendation?.nsqfLevel !== targetLevel) {
          return false;
        }
      }
      if (occupationFilter !== 'all') {
        if (!item.primaryRecommendation?.qpNosCode?.includes(occupationFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [items, nsqfFilter, occupationFilter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/officer"
              style={{
                fontSize: '12px',
                color: isHighContrast ? '#9ca3af' : '#64748b',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              ← Dashboard Overview
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 700 }}>Registry</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: isHighContrast ? '#ffffff' : '#0c2340', margin: '4px 0 2px' }}>
            District Beneficiary Registry
          </h1>
          <div style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#475569' }}>
            Comprehensive directory of verified candidates registered for PM-AJAY skill development and micro-enterprise linkage.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="jm-btn jm-btn-navy"
            style={{ padding: '8px 14px', fontSize: '12.5px' }}
          >
            ↻ Refresh Registry
          </button>
        </div>
      </div>

      {/* RLS Security Notice */}
      {isRlsRestricted && (
        <RlsNoticeBanner
          isHighContrast={isHighContrast}
          message={rlsMessage}
          subtext="Protected beneficiary records require authenticated officer credentials to list full district tables. Active session registrations are displayed for authorized intake auditing."
        />
      )}

      {/* Filter and Search Bar Card */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
          padding: '16px',
          marginBottom: '20px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(12, 35, 64, 0.04)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          {/* Search Box */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#475569', marginBottom: '4px' }}>
              SEARCH BENEFICIARY NAME / UUID
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar or UUID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Filter: Gender */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#475569', marginBottom: '4px' }}>
              GENDER
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
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
            >
              <option value="all">All Genders (सभी लिंग)</option>
              <option value="female">Female (महिला)</option>
              <option value="male">Male (पुरुष)</option>
              <option value="transgender">Transgender (ट्रांसजेंडर)</option>
            </select>
          </div>

          {/* Filter: NSQF Level */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#475569', marginBottom: '4px' }}>
              NSQF LEVEL
            </label>
            <select
              value={nsqfFilter}
              onChange={(e) => setNsqfFilter(e.target.value)}
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
            >
              <option value="all">All NSQF Levels</option>
              <option value="4">NSQF Level 4 (Technical/Skilled)</option>
            </select>
          </div>

          {/* Filter: Occupation Reference */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#475569', marginBottom: '4px' }}>
              OCCUPATION ALIGNMENT
            </label>
            <select
              value={occupationFilter}
              onChange={(e) => setOccupationFilter(e.target.value)}
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
            >
              <option value="all">All Active Catalog Roles</option>
              <option value="TSC/Q7303">TSC/Q7303 (Two Shaft Weaver)</option>
              <option value="SGJ/Q0101">SGJ/Q0101 (Solar PV Installer)</option>
              <option value="AGR/Q1201">AGR/Q1201 (Organic Grower)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#475569', marginBottom: '4px' }}>
              SORT ORDER
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
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
            >
              <option value="recent">Newest Registrations First</option>
              <option value="oldest">Oldest Registrations First</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingTop: '8px', borderTop: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}` }}>
          <div>
            Showing <strong>{filteredItems.length}</strong> of <strong>{totalCount}</strong> candidates
          </div>
          {(searchQuery || genderFilter !== 'all' || nsqfFilter !== 'all' || occupationFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setGenderFilter('all');
                setNsqfFilter('all');
                setOccupationFilter('all');
                setStatusFilter('all');
              }}
              style={{ background: 'none', border: 'none', color: '#c2410c', fontWeight: 700, cursor: 'pointer', fontSize: '11.5px' }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
          padding: '20px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(12, 35, 64, 0.04)',
        }}
      >
        {/* Loading Indicator */}
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
            <span style={{ display: 'inline-block', width: '22px', height: '22px', border: '2px solid #cbd5e1', borderTopColor: '#0c2340', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: '10px', fontSize: '13px' }}>Querying beneficiary database...</div>
          </div>
        )}

        {/* Error Message */}
        {!loading && error && (
          <div style={{ padding: '16px', borderRadius: '4px', backgroundColor: isHighContrast ? '#1f2937' : '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Table Content */}
        {!loading && !error && filteredItems.length > 0 && (
          <>
            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: isHighContrast ? '#1f2937' : '#f1f5f9', borderBottom: `2px solid ${isHighContrast ? '#374151' : '#cbd5e1'}` }}>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Registration ID</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Beneficiary Name</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Age / Gender</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>District / State</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Primary Trade / Skill</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Top NSQF Recommendation</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Match Score</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Status</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                        backgroundColor: isHighContrast ? 'transparent' : '#ffffff',
                      }}
                    >
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>
                        <code style={{ color: isHighContrast ? '#60a5fa' : '#1e40af' }}>
                          {item.id.length > 16 ? `${item.id.slice(0, 8)}...${item.id.slice(-4)}` : item.id}
                        </code>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                        {item.fullName}
                      </td>
                      <td style={{ padding: '12px', color: isHighContrast ? '#d1d5db' : '#475569' }}>
                        {item.age} Yrs • {item.gender.toUpperCase()}
                      </td>
                      <td style={{ padding: '12px', color: isHighContrast ? '#d1d5db' : '#475569' }}>
                        {item.district}, {item.state}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 600, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                        {item.profile?.primarySkill || 'Assessment Pending'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {item.primaryRecommendation ? (
                          <div>
                            <div style={{ fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                              {item.primaryRecommendation.jobRole}
                            </div>
                            <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                              Level {item.primaryRecommendation.nsqfLevel} • {item.primaryRecommendation.qpNosCode}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {item.primaryRecommendation ? (
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 800,
                              color: '#15803d',
                              backgroundColor: isHighContrast ? '#14532d' : '#dcfce7',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            {item.primaryRecommendation.matchScore}%
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className="jm-badge jm-badge-green" style={{ fontSize: '11px' }}>
                          {item.profile?.status === 'submitted' ? 'Active Dossier' : 'Registered'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Link
                          to={`/officer/beneficiaries/${item.id}`}
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
                          <span>Case File</span>
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

            {/* Pagination Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}` }}>
              <div style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                    backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
                    color: isHighContrast ? '#ffffff' : '#0c2340',
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage <= 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                    backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
                    color: isHighContrast ? '#ffffff' : '#0c2340',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage >= totalPages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div
            style={{
              padding: '44px 20px',
              textAlign: 'center',
              backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
              borderRadius: '6px',
              border: `1px dashed ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📂</div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340', margin: '0 0 4px' }}>
              No matching beneficiary cases found.
            </h3>
            <p style={{ fontSize: '12.5px', color: isHighContrast ? '#9ca3af' : '#64748b', maxWidth: '400px', margin: '0 auto 14px' }}>
              Try clearing search parameters or registering a candidate via the citizen mapping flow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
