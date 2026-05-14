import React from 'react';

export default function LoadingSpinner({ fullScreen, size = 'md', text }) {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';

  if (fullScreen) {
    return (
      <div className="loading-full">
        <div className={`spinner spinner-lg`} />
        {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>}
      </div>
    );
  }

  return <div className={`spinner ${sizeClass}`} />;
}
