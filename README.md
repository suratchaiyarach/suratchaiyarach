# Style Matcher Dashboard

A minimal, production-ready full-stack web application that enriches production styles with master data from Excel workbooks. Users can upload a `.xlsx` file that contains a **Production** sheet and a **Master Style** sheet. The backend joins the datasets on style code, returns enriched rows, and exposes key KPIs. The frontend renders an interactive dashboard with download options for CSV and Excel.

## Features

- **Excel ingestion** – Upload `.xlsx` workbooks (no file storage) with Production and Master Style sheets.
- **Intelligent matching** – Case-insensitive, trimmed joins on style codes with graceful handling of missing values.
- **Summary KPIs** – Total rows, match rates, unique styles, and numeric Column1 aggregates.
- **Rich UI** – Responsive React dashboard styled with Tailwind CSS.
- **Data export** – Download enriched results as CSV or Excel with a single click.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Multer, xlsx
- **Tooling:** Concurrent dev servers, Axios, PapaParse

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
npm run install:all
```

### Development

```bash
npm run dev
```

The command runs both servers concurrently:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production Build

```bash
npm run build --prefix client
npm run start --prefix server
```

## Excel Requirements

- **Production sheet:** Must contain a `Style` column.
- **Master Style sheet:** Must contain `STYLE_CODE` and `Column1` columns.
- Column joins are case-insensitive and trimmed of surrounding whitespace.

## API

`POST /api/upload`

- Accepts `multipart/form-data` with a single `file` field.
- Returns enriched rows and KPI summary data.

Example response:

```json
{
  "rows": [
    {
      "Style": "A100",
      "Quantity": 1200,
      "Column1": 45,
      "MatchStatus": "Matched"
    }
  ],
  "summary": {
    "totalProductionRows": 1,
    "matchedRows": 1,
    "unmatchedRows": 0,
    "matchRate": 100,
    "uniqueStylesInMaster": 50,
    "numericColumn1Sum": 45,
    "numericColumn1Average": 45,
    "numericColumn1Count": 1
  }
}
```

## Project Structure

```
.
├── client/           # React + Vite + Tailwind frontend
├── server/           # Express API for Excel processing
├── package.json      # Root scripts (dev, install)
└── README.md
```

## License

This project is provided as-is for demonstration purposes.
