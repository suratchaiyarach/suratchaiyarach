import { useRef, useState } from 'react';

function FileUploader({ onFileSubmit, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile || !onFileSubmit) {
      return;
    }

    onFileSubmit(selectedFile);
  };

  const resetSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-dashed border-slate-300 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-700">Upload Production Workbook</h2>
          <p className="mt-1 text-sm text-slate-500">
            Accepted format: <span className="font-medium text-slate-600">.xlsx</span>. Ensure the workbook has
            <span className="font-medium"> Production </span> and
            <span className="font-medium"> Master Style</span> sheets.
          </p>
        </div>
        <div className="flex gap-3">
          {selectedFile && (
            <button
              type="button"
              onClick={resetSelection}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
            >
              Clear
            </button>
          )}
          <label
            htmlFor="file-upload"
            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
          >
            Browse
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p className="font-medium text-slate-700">Selected file</p>
          <p className="truncate text-slate-500">{selectedFile.name}</p>
          <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!selectedFile || isLoading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? 'Processing...' : 'Process Workbook'}
        </button>
        <p className="text-xs text-slate-400">
          We never store your data. All processing happens locally on this server.
        </p>
      </div>
    </form>
  );
}

export default FileUploader;
