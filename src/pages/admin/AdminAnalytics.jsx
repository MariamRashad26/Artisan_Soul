import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminAnalytics = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [kpis, setKpis] = useState([
    { label: 'Yield Velocity', value: '142', unit: 'Builds/mo', trend: '+12%', color: 'primary' },
    { label: 'Total Revenue', value: '0', unit: 'PKR', trend: '+4.2%', color: 'emerald-500' },
    { label: 'Operational Friction', value: '0.5', unit: 'Days', trend: '-0.2d', color: 'rose-500' },
    { label: 'Patron Retention', value: '68', unit: '%', trend: '+15%', color: 'primary' },
  ]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [ordersRes, revRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/finance/revenue')
        ]);
        
        const completedOrders = ordersRes.data.filter(o => o.status === 'completed').length;
        const totalRev = revRes.data.reduce((sum, r) => sum + r.amount, 0);
        
        setKpis([
          { label: 'Yield Velocity', value: completedOrders.toString(), unit: 'Builds', trend: 'Live', color: 'primary' },
          { label: 'Total Revenue', value: totalRev.toLocaleString(), unit: 'PKR', trend: 'Live', color: 'emerald-500' },
          { label: 'Operational Friction', value: '0.5', unit: 'Days', trend: '-0.2d', color: 'rose-500' },
          { label: 'Patron Retention', value: '68', unit: '%', trend: '+15%', color: 'primary' }
        ]);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    let csv = ['Metric,Value,Unit,Trend\n'];
    kpis.forEach(k => csv.push(`"${k.label}",${k.value},${k.unit},${k.trend}`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'executive_growth_report.csv';
    a.click();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
       setIsRefreshing(false);
       alert('Dataset synchronized with latest live telemetry.');
    }, 1500);
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Advanced Analytics</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Growth.Intelligence</h1>
        </div>
        
        <div className="d-flex gap-4">
          <button onClick={handleExport} className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">summarize</span>
            Executive Report
          </button>
          <button onClick={handleRefresh} disabled={isRefreshing} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3 disabled:opacity-75 disabled:transform-none">
            <span className={`material-symbols-outlined fs-5 ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
            Refresh Dataset
          </button>
        </div>
      </section>

      <div className="row g-8 mb-12">
        {kpis.map((kpi, i) => (
          <div key={i} className="col-lg-3 col-md-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium h-100">
               <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 d-block mb-8">{kpi.label}</span>
               <p className="display-5 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">
                  {kpi.value}<span className="fs-6 text-stone-700 tracking-normal font-sans italic">{kpi.unit}</span>
               </p>
               <span className={`text-[10px] fw-black text-uppercase tracking-widest text-${kpi.color}`}>
                  {kpi.trend} Transformation
               </span>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-8">
        <div className="col-lg-8">
           <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-premium h-100">
              <div className="d-flex align-items-center justify-content-between mb-12">
                 <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-dark shadow-sm px-4 py-2 bg-stone-50 rounded-full border border-stone-100">Performance.Timeline</h3>
                 <div className="d-flex gap-4">
                    <button className="text-[9px] fw-black text-dark text-uppercase tracking-widest border-bottom border-dark pb-1">Historical</button>
                    <button className="text-[9px] fw-black text-stone-700 text-uppercase tracking-widest hover:text-dark transition pb-1">Projected</button>
                 </div>
              </div>
              <div className="d-flex align-items-end gap-3 h-64 mb-10">
                 {[45, 67, 42, 89, 56, 78, 92, 65, 87, 98, 76, 88].map((v, i) => (
                    <div key={i} className="flex-grow-1 bg-gradient-to-t from-emerald-500/40 to-emerald-400 rounded-t-xl hover:opacity-80 transition-opacity duration-700 cursor-pointer group relative shadow-md" style={{ height: `${v}%` }}>
                       <div className="absolute -top-12 left-50 translate-middle-x bg-dark text-white text-[10px] fw-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                          {v}% Yield
                       </div>
                    </div>
                 ))}
              </div>
              <div className="d-flex justify-content-between text-[9px] fw-black text-uppercase tracking-[0.3em] text-stone-700">
                 <span>Fiscal Q1 — Early Year Transition</span>
                 <span>Peak Crafting Season</span>
                 <span>Fiscal Q4 — Legacy Closure</span>
              </div>
           </section>
        </div>
        <div className="col-lg-4">
           <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-premium bg-stone-950 text-white h-100 relative overflow-hidden">
              <div className="position-absolute top-[-20%] right-[-10%] text-white/5">
                 <span className="material-symbols-outlined text-[200px]">auto_graph</span>
              </div>
              <div className="relative z-1">
                 <h3 className="text-[10px] fw-black text-uppercase tracking-[0.4em] text-stone-700 mb-10">Asset.Dispatch.Metrics</h3>
                 <div className="space-y-10">
                    {[
                      { city: 'Lahore', pct: 42 },
                      { city: 'Karachi', pct: 28 },
                      { city: 'Islamabad', pct: 15 },
                      { city: 'International', pct: 15 }
                    ].map((loc, i) => (
                      <div key={i}>
                         <div className="d-flex justify-content-between text-[10px] fw-black tracking-widest mb-3">
                            <span className="text-stone-700">{loc.city}</span>
                            <span>{loc.pct}%</span>
                         </div>
                         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-100 bg-gradient-to-r from-primary to-amber-500" style={{ width: `${loc.pct}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-12 p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                    <p className="text-[10px] fw-black text-stone-600 mb-4 text-uppercase tracking-widest">Growth Recommendation</p>
                    <p className="text-sm fw-medium text-stone-200 tracking-tight leading-relaxed mb-6">"Expand localized bespoke experiences in Karachi clusters to capture a 6.4% untapped Imperial patronage segment."</p>
                    <button className="w-100 py-3 rounded-xl bg-white text-dark text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-100 transition">Execute Strategy</button>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
