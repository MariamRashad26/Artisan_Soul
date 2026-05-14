const palette = {
  // Green — good/active/done
  Active:           'bg-emerald-50 text-emerald-700 border-emerald-200',
  Running:          'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  Present:          'bg-emerald-50 text-emerald-700 border-emerald-200',
  Paid:             'bg-emerald-50 text-emerald-700 border-emerald-200',
  Passed:           'bg-emerald-50 text-emerald-700 border-emerald-200',
  Received:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  Confirmed:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  Delivered:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  Approved:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  Dispatched:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  Resolved:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  Closed:           'bg-emerald-50 text-emerald-700 border-emerald-200',
  Exceeded:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  // Amber — warning/pending/upcoming
  Pending:          'bg-amber-50 text-amber-700 border-amber-200',
  Ordered:          'bg-amber-50 text-amber-700 border-amber-200',
  Upcoming:         'bg-amber-50 text-amber-700 border-amber-200',
  Planned:          'bg-amber-50 text-amber-700 border-amber-200',
  Draft:            'bg-amber-50 text-amber-700 border-amber-200',
  Partial:          'bg-amber-50 text-amber-700 border-amber-200',
  Processing:       'bg-amber-50 text-amber-700 border-amber-200',
  Prospect:         'bg-amber-50 text-amber-700 border-amber-200',
  Scheduled:        'bg-amber-50 text-amber-700 border-amber-200',
  'On Track':       'bg-amber-50 text-amber-700 border-amber-200',
  'Below Target':   'bg-amber-50 text-amber-700 border-amber-200',
  // Blue — in progress/active process
  'In Progress':    'bg-blue-50 text-blue-700 border-blue-200',
  'In Production':  'bg-blue-50 text-blue-700 border-blue-200',
  'In Review':      'bg-blue-50 text-blue-700 border-blue-200',
  Sent:             'bg-blue-50 text-blue-700 border-blue-200',
  Packed:           'bg-blue-50 text-blue-700 border-blue-200',
  'Half-Day':       'bg-blue-50 text-blue-700 border-blue-200',
  Leave:            'bg-blue-50 text-blue-700 border-blue-200',
  'On Leave':       'bg-blue-50 text-blue-700 border-blue-200',
  // Rose/Red — errors/maintenance/critical
  Failed:           'bg-rose-50 text-rose-700 border-rose-200',
  Maintenance:      'bg-rose-50 text-rose-700 border-rose-200',
  Overdue:          'bg-rose-50 text-rose-700 border-rose-200',
  Breakdown:        'bg-rose-50 text-rose-700 border-rose-200',
  Critical:         'bg-rose-50 text-rose-700 border-rose-200',
  Major:            'bg-rose-50 text-rose-700 border-rose-200',
  Open:             'bg-rose-50 text-rose-700 border-rose-200',
  'Conditional Pass':'bg-orange-50 text-orange-700 border-orange-200',
  // Stone — neutral/inactive
  Inactive:         'bg-stone-100 text-stone-500 border-stone-200',
  Idle:             'bg-stone-100 text-stone-500 border-stone-200',
  Cancelled:        'bg-stone-100 text-stone-500 border-stone-200',
  Terminated:       'bg-stone-100 text-stone-500 border-stone-200',
  Absent:           'bg-stone-100 text-stone-500 border-stone-200',
  Late:             'bg-orange-50 text-orange-700 border-orange-200',
  Paused:           'bg-stone-100 text-stone-500 border-stone-200',
  Development:      'bg-purple-50 text-purple-700 border-purple-200',
  // Priority
  Urgent:           'bg-red-50 text-red-700 border-red-200',
  High:             'bg-orange-50 text-orange-700 border-orange-200',
  Normal:           'bg-sky-50 text-sky-700 border-sky-200',
  Low:              'bg-stone-100 text-stone-500 border-stone-200',
  Minor:            'bg-sky-50 text-sky-700 border-sky-200',
  // Finance
  Income:           'bg-emerald-50 text-emerald-700 border-emerald-200',
  Expense:          'bg-rose-50 text-rose-700 border-rose-200',
  // Yes / No
  Yes:              'bg-rose-50 text-rose-700 border-rose-200',
  No:               'bg-stone-100 text-stone-500 border-stone-200',
  // Premium / Standard / Basic
  Premium:          'bg-purple-50 text-purple-700 border-purple-200',
  Standard:         'bg-sky-50 text-sky-700 border-sky-200',
  Basic:            'bg-stone-100 text-stone-500 border-stone-200',
};

const StatusBadge = ({ status, size = 'sm' }) => {
  const cls = palette[status] || 'bg-stone-100 text-stone-500 border-stone-200';
  const textSize = size === 'xs' ? 'text-[9px]' : 'text-[10px]';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border fw-black text-uppercase tracking-widest ${textSize} ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'currentColor', opacity: 0.7 }} />
      {status}
    </span>
  );
};

export default StatusBadge;
