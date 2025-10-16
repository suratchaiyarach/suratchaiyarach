const metricConfig = [
  {
    key: 'totalProductionRows',
    label: 'Total Production Rows',
    formatter: (value) => value.toLocaleString()
  },
  {
    key: 'matchedRows',
    label: 'Matched Rows',
    formatter: (value) => value.toLocaleString()
  },
  {
    key: 'unmatchedRows',
    label: 'Unmatched Rows',
    formatter: (value) => value.toLocaleString()
  },
  {
    key: 'matchRate',
    label: 'Match Rate',
    formatter: (value) => `${value.toFixed(2)}%`
  },
  {
    key: 'uniqueStylesInMaster',
    label: 'Unique Master Styles',
    formatter: (value) => value.toLocaleString()
  },
  {
    key: 'numericColumn1Sum',
    label: 'Column1 Total',
    formatter: (value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  },
  {
    key: 'numericColumn1Average',
    label: 'Column1 Average',
    formatter: (value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  },
  {
    key: 'numericColumn1Count',
    label: 'Numeric Column1 Count',
    formatter: (value) => value.toLocaleString()
  }
];

const SummaryCards = ({ summary }) => {
  if (!summary) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metricConfig.map(({ key, label, formatter }) => {
        const rawValue = summary[key];
        const value = rawValue ?? 0;
        return (
          <article key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-800">
              {typeof formatter === 'function' ? formatter(Number(value) || 0) : value}
            </p>
          </article>
        );
      })}
    </div>
  );
};

export default SummaryCards;
