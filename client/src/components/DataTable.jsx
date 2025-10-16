const getColumnOrder = (columns) => {
  const priority = {
    style: 0,
    style_code: 1,
    column1: 2,
    matchstatus: 3
  };

  return [...columns].sort((a, b) => {
    const normalizedA = a.replace(/\s+/g, '_').toLowerCase();
    const normalizedB = b.replace(/\s+/g, '_').toLowerCase();

    const hasPriorityA = Object.prototype.hasOwnProperty.call(priority, normalizedA);
    const hasPriorityB = Object.prototype.hasOwnProperty.call(priority, normalizedB);

    if (hasPriorityA && hasPriorityB) {
      return priority[normalizedA] - priority[normalizedB];
    }

    if (hasPriorityA) {
      return -1;
    }

    if (hasPriorityB) {
      return 1;
    }

    return a.localeCompare(b);
  });
};

const formatCell = (key, value) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (key.toLowerCase() === 'matchstatus') {
    return value;
  }

  return value;
};

const DataTable = ({ rows }) => {
  if (!rows || rows.length === 0) {
    return null;
  }

  const columnSet = new Set();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => columnSet.add(key));
  });
  const columns = getColumnOrder(columnSet);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[480px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className="px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="hover:bg-slate-50">
                {columns.map((column) => {
                  const value = row[column];
                  const normalizedColumn = column.replace(/\s+/g, '').toLowerCase();
                  const isMatchStatus = normalizedColumn === 'matchstatus';
                  const displayValue = formatCell(normalizedColumn, value);

                  return (
                    <td key={`${rowIndex}-${column}`} className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {isMatchStatus ? (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            String(displayValue).toLowerCase() === 'matched'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {displayValue}
                        </span>
                      ) : (
                        <span>{displayValue}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
