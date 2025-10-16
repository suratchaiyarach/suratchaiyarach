import express from 'express';
import cors from 'cors';
import multer from 'multer';
import XLSX from 'xlsx';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.originalname.toLowerCase().endsWith('.xlsx')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx files are supported.'));
    }
  }
});

const normalizeValue = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).trim().toUpperCase();
};

const normalizeKey = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).trim().toLowerCase();
};

const sanitizeRowKeys = (row) => {
  return Object.entries(row).reduce((acc, [key, value]) => {
    if (!key) return acc;
    acc[key.trim()] = value;
    return acc;
  }, {});
};

const findKey = (row, targetKey) => {
  const normalizedTarget = normalizeKey(targetKey);
  return Object.keys(row).find((key) => normalizeKey(key) === normalizedTarget);
};

const parseSheet = (workbook, sheetTargetName) => {
  const sheetName = workbook.SheetNames.find(
    (name) => normalizeKey(name) === normalizeKey(sheetTargetName)
  );

  if (!sheetName) {
    return null;
  }

  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: false
  });
};

const parseNumeric = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const cleaned = typeof value === 'string' ? value.replace(/,/g, '') : value;
  const parsed = Number(cleaned);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return null;
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });

    const productionRows = parseSheet(workbook, 'Production');
    const masterRows = parseSheet(workbook, 'Master Style');

    if (!productionRows || !masterRows) {
      return res.status(400).json({
        message: 'Unable to locate both "Production" and "Master Style" sheets in the workbook.'
      });
    }

    const masterLookup = new Map();

    masterRows.forEach((row) => {
      const sanitizedRow = sanitizeRowKeys(row);
      const styleKey = findKey(sanitizedRow, 'STYLE_CODE');
      const column1Key = findKey(sanitizedRow, 'Column1');

      if (!styleKey) {
        return;
      }

      const normalizedStyle = normalizeValue(sanitizedRow[styleKey]);

      if (!normalizedStyle) {
        return;
      }

      masterLookup.set(normalizedStyle, {
        column1: column1Key ? sanitizedRow[column1Key] : null
      });
    });

    let matchedCount = 0;
    let column1NumericSum = 0;
    let column1NumericCount = 0;

    const processedRows = productionRows.map((row) => {
      const sanitizedRow = sanitizeRowKeys(row);
      const styleKey = findKey(sanitizedRow, 'Style');
      const styleValue = styleKey ? sanitizedRow[styleKey] : null;
      const normalizedStyle = normalizeValue(styleValue);

      const masterEntry = normalizedStyle ? masterLookup.get(normalizedStyle) : null;
      const column1Value = masterEntry ? masterEntry.column1 ?? null : null;
      const matched = Boolean(masterEntry);

      if (matched) {
        matchedCount += 1;
      }

      const numericValue = parseNumeric(column1Value);
      if (numericValue !== null) {
        column1NumericSum += numericValue;
        column1NumericCount += 1;
      }

      return {
        ...sanitizedRow,
        Column1: column1Value,
        MatchStatus: matched ? 'Matched' : 'Missing'
      };
    });

    const totalProductionRows = processedRows.length;
    const unmatchedRows = totalProductionRows - matchedCount;
    const matchRate = totalProductionRows
      ? Number(((matchedCount / totalProductionRows) * 100).toFixed(2))
      : 0;

    const summary = {
      totalProductionRows,
      matchedRows: matchedCount,
      unmatchedRows,
      matchRate,
      uniqueStylesInMaster: masterLookup.size,
      numericColumn1Sum: Number(column1NumericSum.toFixed(2)),
      numericColumn1Average: column1NumericCount
        ? Number((column1NumericSum / column1NumericCount).toFixed(2))
        : 0,
      numericColumn1Count: column1NumericCount
    };

    return res.json({ rows: processedRows, summary });
  } catch (error) {
    console.error('Upload processing failed', error);
    return res.status(500).json({ message: 'Failed to process the uploaded file.' });
  }
});

app.use((err, req, res, next) => {
  if (err) {
    console.error('Unhandled error', err);
    return res.status(400).json({ message: err.message || 'Unexpected error occurred.' });
  }
  return next();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
