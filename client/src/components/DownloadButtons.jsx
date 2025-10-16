import { downloadCsv, downloadXlsx } from '../utils/download.js';

const DownloadButtons = ({ rows }) => {
  const disabled = !rows || rows.length === 0;

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => downloadCsv(rows)}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
      >
        Download CSV
      </button>
      <button
        type="button"
        onClick={() => downloadXlsx(rows)}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-200"
      >
        Download Excel
      </button>
    </div>
  );
};

export default DownloadButtons;
