# 5S Audit App

This is a simple Flask application for managing 5S audits in a factory. It allows you to:

- Create audits with checklist items and scores
- Attach photos before corrective actions with due dates
- Upload photos after corrective actions
- Track area zone and status of each audit
- View a dashboard of all audits

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the application:
   ```bash
   python app.py
   ```
3. Open your browser to `http://localhost:5000`.

The database is automatically created on first run, and uploaded files are stored
in the `static/uploads/` folder.
The SQLite file `audits.db` will appear in the app directory.
