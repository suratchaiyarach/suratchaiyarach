import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCsv = (rows, filename = 'enriched-production.csv') => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
};

export const downloadXlsx = (rows, filename = 'enriched-production.xlsx') => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Production');

  const workbookOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([workbookOut], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  triggerDownload(blob, filename);
};
