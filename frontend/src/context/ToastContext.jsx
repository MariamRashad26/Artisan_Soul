import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showConfirm = useCallback((message, onConfirm, onCancel) => {
    setConfirm({ message, onConfirm, onCancel });
  }, []);

  const handleConfirm = () => {
    if (confirm?.onConfirm) confirm.onConfirm();
    setConfirm(null);
  };

  const handleCancel = () => {
    if (confirm?.onCancel) confirm.onCancel();
    setConfirm(null);
  };

  const iconMap = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  const colorMap = {
    success: { bar: 'bg-emerald-500', icon: 'text-emerald-400', bg: 'border-emerald-500/30' },
    error: { bar: 'bg-rose-500', icon: 'text-rose-400', bg: 'border-rose-500/30' },
    warning: { bar: 'bg-amber-500', icon: 'text-amber-400', bg: 'border-amber-500/30' },
    info: { bar: 'bg-primary', icon: 'text-primary', bg: 'border-primary/30' },
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast Stack */}
      <div
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '360px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => {
          const colors = colorMap[toast.type] || colorMap.info;
          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'all',
                background: 'rgba(22, 15, 8, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: '1rem',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                animation: 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span className={`material-symbols-outlined fs-5 mt-1 flex-shrink-0 ${colors.icon}`}>{iconMap[toast.type]}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.5, flex: 1 }}>
                {toast.message}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0, lineHeight: 1 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
              </button>
              <div className={`${colors.bar}`} style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%', opacity: 0.6 }} />
            </div>
          );
        })}
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)',
              animation: 'zoomIn 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined text-rose-500">warning</span>
              </div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1c1917', letterSpacing: '-0.02em' }}>
                Confirm Action
              </h4>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#57534e', fontWeight: 500, lineHeight: 1.6, marginBottom: '2rem' }}>
              {confirm.message}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{ padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #e7e5e4', background: '#fff', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#57534e', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{ padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: 'none', background: '#1c1917', color: '#fff', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
