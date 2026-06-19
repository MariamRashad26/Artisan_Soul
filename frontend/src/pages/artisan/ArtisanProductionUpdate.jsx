import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const STAGES = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Quality Control'];
const STAGE_PROGRESS = [10, 30, 60, 80, 90];
const STAGE_ICONS = ['draw', 'content_cut', 'hardware', 'straighten', 'workspace_premium'];
const STAGE_DETAILS = [
  'Review technical specifications and patron custom requests.',
  'Pattern extraction and leather clicking. Ensure grain alignment.',
  'Molding the upper over the bespoke wooden last.',
  'Hand-sewing welt and outsole with waxed linen thread.',
  'Pass order to the Quality Inspection board.',
];

const ArtisanProductionUpdate = () => {
  const { id } = useParams(); // raw URL param e.g. "AS-5649"
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [dbId, setDbId] = useState(null);         // MongoDB _id — used for PUT
  const [productionStage, setProductionStage] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logText, setLogText] = useState('');
  const [workOrderId, setWorkOrderId] = useState(null);
  const [fetchError, setFetchError] = useState('');

  // ─── Fetch order on mount ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrder = async () => {
      // Try multiple ID formats so we always find the order
      const attempts = [
        id,                         // AS-5649
        `#${id}`,                   // #AS-5649
        `#AS-${id}`,                // #AS-AS-5649 (catch-all)
        id?.replace(/^AS-/, ''),    // 5649
      ].filter(Boolean);

      let found = null;
      for (const ref of attempts) {
        try {
          const { data } = await axios.get(`/api/orders/${encodeURIComponent(ref)}`);
          found = data;
          break;
        } catch { /* try next */ }
      }

      if (!found) {
        setFetchError(`Order "${id}" not found. Check the URL.`);
        return;
      }

      setOrderData(found);
      setDbId(found._id);
      const stageIndex = STAGES.indexOf(found.phase);
      setProductionStage(stageIndex !== -1 ? stageIndex : 0);
      if (found.logs) setLogs(found.logs);

      // Find linked WorkOrder
      try {
        const { data: wos } = await axios.get('/api/work-orders');
        const linked = wos.find(wo =>
          (wo.order_id?._id || wo.order_id || '').toString() === found._id.toString()
        );
        if (linked) setWorkOrderId(linked._id);
      } catch { /* ignored */ }
    };

    const load = async () => {
      await fetchOrder();
    };
    load();
  }, [id]);

  // ─── Advance to NEXT stage ──────────────────────────────────────────────────
  const handleAdvanceStage = async () => {
    const nextIndex = productionStage + 1;
    if (nextIndex >= STAGES.length || !dbId) return;

    setIsAdvancing(true);
    try {
      const nextStage = STAGES[nextIndex];

      // Always PUT by MongoDB _id — the most reliable way
      const { data } = await axios.put(`/api/orders/${dbId}`, {
        phase: nextStage,
        progress: STAGE_PROGRESS[nextIndex],
      });

      setProductionStage(nextIndex);
      setOrderData(data);

      const entry = {
        time: new Date().toLocaleTimeString(),
        log: `Stage advanced: "${STAGES[productionStage]}" → "${nextStage}"`,
        user: false,
      };
      const updatedLogs = [entry, ...logs];
      setLogs(updatedLogs);
      await axios.put(`/api/orders/${dbId}`, { logs: updatedLogs });

      if (workOrderId) {
        await axios.put(`/api/work-orders/${workOrderId}`, {
          status: nextIndex >= 4 ? 'Completed' : 'In Progress',
        });
      }

      // Stage 4 = Quality Control → auto-redirect to artisan QC page
      if (nextIndex === 4) {
        await axios.put(`/api/orders/${dbId}`, {
          phase: 'Quality Control',
          status: 'Quality Check',
          progress: 90,
        });
        setTimeout(() => navigate(`/artisan/quality-check/${id}`), 1200);
      }
    } catch (err) {
      console.error('Advance stage error:', err);
      alert('Failed to update stage. Check backend console.');
    } finally {
      setIsAdvancing(false);
    }
  };

  // ─── Revoke to PREVIOUS stage ───────────────────────────────────────────────
  const handleRevokeStage = async () => {
    const prevIndex = productionStage - 1;
    if (prevIndex < 0 || !dbId) return;

    setIsAdvancing(true);
    try {
      const prevStage = STAGES[prevIndex];
      const { data } = await axios.put(`/api/orders/${dbId}`, {
        phase: prevStage,
        progress: STAGE_PROGRESS[prevIndex],
      });
      setProductionStage(prevIndex);
      setOrderData(data);

      const entry = {
        time: new Date().toLocaleTimeString(),
        log: `Stage revoked back to "${prevStage}"`,
        user: false,
      };
      const updatedLogs = [entry, ...logs];
      setLogs(updatedLogs);
      await axios.put(`/api/orders/${dbId}`, { logs: updatedLogs });
    } catch (err) {
      console.error('Revoke stage error:', err);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleLogUpdate = async () => {
    if (!logText.trim() || !dbId) return;
    const entry = { time: new Date().toLocaleTimeString(), log: logText, user: true };
    const updatedLogs = [entry, ...logs];
    setLogs(updatedLogs);
    setLogText('');
    try {
      await axios.put(`/api/orders/${dbId}`, { logs: updatedLogs });
    } catch (err) { console.error(err); }
  };

  const isAtQC = productionStage === 4;

  if (fetchError) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#fafaf9' }}>
        <div className="text-center p-8">
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#BD510D' }}>error</span>
          <h3 className="mt-3 fw-black">{fetchError}</h3>
          <Link to="/artisan/assignments" className="btn btn-dark mt-4 rounded-xl px-6">Back to Assignments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-background-light font-display text-dark" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <header className="bg-white border-bottom border-stone-200 px-6 py-5 sticky-top z-40 shadow-sm">
        <div className="max-w-7xl mx-auto d-flex justify-content-between align-items-center gap-4 flex-wrap">
          <div className="d-flex align-items-center gap-4">
            <Link to="/artisan/assignments"
              className="d-flex align-items-center justify-content-center rounded-xl border border-stone-200 bg-stone-50 text-stone-500"
              style={{ width: 44, height: 44 }}>
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <div className="d-flex align-items-center gap-2 text-primary mb-1">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>precision_manufacturing</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Live Production</span>
              </div>
              <h1 className="fw-black font-serif tracking-tighter mb-0" style={{ fontSize: '1.6rem' }}>
                Order #{id}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 flex-wrap">
            {productionStage > 0 && !isAtQC && (
              <button
                onClick={handleRevokeStage}
                disabled={isAdvancing || !dbId}
                className="btn border border-stone-200 bg-white fw-black text-uppercase"
                style={{ borderRadius: 50, fontSize: '0.75rem', letterSpacing: '0.08em', padding: '10px 20px' }}
              >
                <span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>undo</span>
                Revoke Stage
              </button>
            )}

            {!isAtQC ? (
              <button
                onClick={handleAdvanceStage}
                disabled={isAdvancing || !dbId}
                className="btn text-white border-0 fw-black text-uppercase"
                style={{
                  background: 'linear-gradient(135deg, #BD510D, #d97706)',
                  borderRadius: 50,
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  padding: '10px 28px',
                  boxShadow: '0 4px 16px rgba(189,81,13,0.35)',
                  opacity: !dbId ? 0.6 : 1,
                }}
              >
                {isAdvancing ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Advancing...</>
                ) : productionStage === 3 ? (
                  <><span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>workspace_premium</span>Pass to Quality Control</>
                ) : (
                  <><span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>arrow_forward</span>Complete → {STAGES[productionStage + 1]}</>
                )}
              </button>
            ) : (
              <Link
                to={`/artisan/quality-check/${id}`}
                className="btn text-white border-0 fw-black text-uppercase text-decoration-none"
                style={{
                  background: '#15803d',
                  borderRadius: 50,
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  padding: '10px 28px',
                }}
              >
                <span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>verified</span>
                Open Quality Check
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-[2rem] border border-stone-100 p-6 mb-6 shadow-sm">
          <div className="d-flex justify-content-between mb-2">
            <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#78716c' }}>
              Production Progress
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#BD510D' }}>
              Step {productionStage + 1} / {STAGES.length}
            </span>
          </div>
          <div style={{ height: 10, background: '#f5f0eb', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(productionStage / (STAGES.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, #BD510D, #f59e0b)',
              borderRadius: 10,
              transition: 'width 0.9s ease',
            }} />
          </div>
          <div className="d-flex justify-content-between mt-2">
            {STAGES.map((s, i) => (
              <span key={i} style={{
                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                color: i <= productionStage ? '#BD510D' : '#d6d3d1',
              }}>
                {s.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Stage Timeline */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 mb-6 shadow-sm position-relative overflow-hidden">
          <div className="position-absolute" style={{ top: '-10%', right: '-10%', width: 200, height: 200, background: 'rgba(189,81,13,0.05)', borderRadius: '50%', filter: 'blur(40px)' }} />

          <div className="d-flex justify-content-between align-items-start mb-8">
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#a8a29e', marginBottom: 8 }}>Master Timeline</p>
              <h3 className="fw-black font-serif" style={{ fontSize: '1.4rem', color: '#1c1917' }}>
                {isAtQC ? '🏆 All Stages Complete' : `${STAGES[productionStage]} Stage`}
              </h3>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716c', marginBottom: 0 }}>
                {orderData?.model || 'Bespoke Order'} • {orderData?.status || 'In Production'}
              </p>
            </div>
            <div style={{
              width: 56, height: 56,
              background: 'rgba(189,81,13,0.08)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#BD510D',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{STAGE_ICONS[productionStage]}</span>
            </div>
          </div>

          {/* Vertical Stepper */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 23, top: 8, bottom: 8,
              width: 2, background: '#f5f0eb',
            }} />

            <div className="d-flex flex-column gap-4">
              {STAGES.map((stage, idx) => {
                let status = 'pending';
                if (idx < productionStage) status = 'done';
                if (idx === productionStage) status = 'active';

                return (
                  <div key={idx} className="d-flex gap-4" style={{ opacity: status === 'pending' ? 0.35 : 1, transition: 'opacity 0.5s' }}>
                    {/* Circle */}
                    <div style={{
                      width: 48, height: 48, flexShrink: 0,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: status === 'active' ? '3px solid #BD510D' : '3px solid transparent',
                      background: status === 'done' ? '#BD510D' : status === 'active' ? '#fff' : '#f5f0eb',
                      color: status === 'done' ? '#fff' : status === 'active' ? '#BD510D' : '#d6d3d1',
                      boxShadow: status === 'active' ? '0 0 0 6px rgba(189,81,13,0.12)' : 'none',
                      transform: status === 'active' ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.5s',
                      zIndex: 1,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        {status === 'done' ? 'check' : STAGE_ICONS[idx]}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ paddingTop: 8, flex: 1 }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 style={{ fontWeight: 900, fontSize: '1rem', color: status === 'active' ? '#BD510D' : '#1c1917', marginBottom: 0 }}>
                          {stage}
                        </h5>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                          padding: '3px 10px', borderRadius: 20,
                          background: status === 'active' ? 'rgba(189,81,13,0.1)' : status === 'done' ? '#f0fdf4' : 'transparent',
                          color: status === 'active' ? '#BD510D' : status === 'done' ? '#15803d' : '#a8a29e',
                        }}>
                          {status === 'active' ? 'In Progress' : status === 'done' ? 'Completed ✓' : 'Pending'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#78716c', marginBottom: status === 'active' ? 12 : 0 }}>
                        {STAGE_DETAILS[idx]}
                      </p>
                      {/* Inline advance button at active stage */}
                      {status === 'active' && !isAtQC && (
                        <button
                          onClick={handleAdvanceStage}
                          disabled={isAdvancing || !dbId}
                          style={{
                            background: '#BD510D', color: '#fff', border: 'none',
                            borderRadius: 50, padding: '6px 20px',
                            fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em',
                            textTransform: 'uppercase', cursor: !dbId ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {isAdvancing ? 'Advancing...' : idx === 3
                            ? '→ Pass to Quality Control'
                            : `→ Complete & Move to ${STAGES[idx + 1]}`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QC completion banner */}
          {isAtQC && (
            <div style={{
              marginTop: 28, padding: '20px 24px',
              background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
              border: '1px solid #bbf7d0', borderRadius: 16,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <span className="material-symbols-outlined" style={{ color: '#16a34a', fontSize: 40 }}>workspace_premium</span>
              <div>
                <p style={{ fontWeight: 900, color: '#15803d', fontSize: '1rem', marginBottom: 4 }}>All production stages complete!</p>
                <p style={{ color: '#166534', fontSize: '0.85rem', marginBottom: 12 }}>
                  Ready for final quality inspection. Submit your report to pass this order to Admin QC.
                </p>
                <Link
                  to={`/artisan/quality-check/${id}`}
                  style={{
                    background: '#15803d', color: '#fff', textDecoration: 'none',
                    borderRadius: 50, padding: '8px 24px',
                    fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em',
                    textTransform: 'uppercase', display: 'inline-block',
                  }}
                >
                  → Open Quality Check
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-sm">
          <h3 className="fw-black font-serif mb-5" style={{ fontSize: '1.2rem' }}>Production Log</h3>
          <div className="d-flex gap-3 mb-5">
            <input
              value={logText}
              onChange={e => setLogText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogUpdate()}
              placeholder="Add a note about this stage..."
              className="flex-grow-1 px-4 py-3 border border-stone-100 rounded-xl bg-stone-50"
              style={{ fontSize: '0.9rem', outline: 'none' }}
            />
            <button
              onClick={handleLogUpdate}
              disabled={!dbId}
              style={{
                background: '#BD510D', color: '#fff', border: 'none',
                borderRadius: 12, padding: '0 20px',
                fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Log
            </button>
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {logs.length === 0 && (
              <p style={{ color: '#a8a29e', textAlign: 'center', padding: 24, fontSize: '0.9rem' }}>No log entries yet.</p>
            )}
            {logs.map((entry, i) => (
              <div key={i} className="d-flex gap-3 align-items-start p-3 bg-stone-50 rounded-xl">
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: entry.user ? '#BD510D' : '#a8a29e', marginTop: 2 }}>
                  {entry.user ? 'person' : 'settings'}
                </span>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a8a29e', marginBottom: 2 }}>{entry.time}</p>
                  <p style={{ fontSize: '0.88rem', color: '#1c1917', marginBottom: 0 }}>{entry.log}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtisanProductionUpdate;
