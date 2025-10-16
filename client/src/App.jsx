import { useState } from 'react';
import axios from 'axios';
import FileUploader from './components/FileUploader.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import DataTable from './components/DataTable.jsx';
import DownloadButtons from './components/DownloadButtons.jsx';

const initialSummary = null;

function App() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSubmit = async (file) => {
    if (!file) return;
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setRows(data?.rows ?? []);
      setSummary(data?.summary ?? initialSummary);
    } catch (err) {
      console.error('Failed to upload file', err);
      const message = err.response?.data?.message || 'Failed to process the file. Please try again.';
      setError(message);
      setRows([]);
      setSummary(initialSummary);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Style Matcher Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Upload production styles to enrich them with master data and track KPIs in seconds.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section>
          <FileUploader onFileSubmit={handleFileSubmit} isLoading={isLoading} />
          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>

        {summary && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700">Summary</h2>
            <SummaryCards summary={summary} />
          </section>
        )}

        {rows.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-lg font-semibold text-slate-700">Enriched Production Data</h2>
              <DownloadButtons rows={rows} />
            </div>
            <DataTable rows={rows} />
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-slate-500">
          Built with React, Express, and Tailwind CSS.
        </div>
      </footer>
    </div>
  );
}

export default App;
