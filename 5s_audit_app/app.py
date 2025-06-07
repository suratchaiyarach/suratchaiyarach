from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///audits.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')

db = SQLAlchemy(app)


class Audit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    area_zone = db.Column(db.String(100))
    checklist = db.Column(db.Text)
    score = db.Column(db.Integer)
    corrective_required = db.Column(db.Boolean, default=False)
    photo_before = db.Column(db.String(200))
    due_date = db.Column(db.Date)
    photo_after = db.Column(db.String(200))
    status = db.Column(db.String(20), default='Open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


def create_tables():
    """Create database tables if they don't exist."""
    with app.app_context():
        db.create_all()


@app.route('/')
def index():
    audits = Audit.query.order_by(Audit.created_at.desc()).all()
    return render_template('index.html', audits=audits)


@app.route('/audit/new', methods=['GET', 'POST'])
def new_audit():
    if request.method == 'POST':
        area_zone = request.form['area_zone']
        checklist = request.form['checklist']
        score = request.form.get('score', type=int)
        corrective_required = 'corrective_required' in request.form
        due_date = request.form.get('due_date')
        status = request.form.get('status', 'Open')
        photo_before_file = request.files.get('photo_before')
        photo_before_filename = None
        if photo_before_file and photo_before_file.filename:
            photo_before_filename = datetime.utcnow().strftime('%Y%m%d%H%M%S_') + photo_before_file.filename
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], photo_before_filename)
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            photo_before_file.save(save_path)
        audit = Audit(
            area_zone=area_zone,
            checklist=checklist,
            score=score,
            corrective_required=corrective_required,
            due_date=datetime.strptime(due_date, '%Y-%m-%d').date() if due_date else None,
            photo_before=photo_before_filename,
            status=status,
        )
        db.session.add(audit)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('new_audit.html')


@app.route('/audit/<int:audit_id>', methods=['GET', 'POST'])
def audit_detail(audit_id):
    audit = Audit.query.get_or_404(audit_id)
    if request.method == 'POST':
        status = request.form.get('status')
        audit.status = status
        if 'photo_after' in request.files:
            photo_after_file = request.files['photo_after']
            if photo_after_file and photo_after_file.filename:
                photo_after_filename = datetime.utcnow().strftime('%Y%m%d%H%M%S_') + photo_after_file.filename
                save_path = os.path.join(app.config['UPLOAD_FOLDER'], photo_after_filename)
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                photo_after_file.save(save_path)
                audit.photo_after = photo_after_filename
        db.session.commit()
        return redirect(url_for('audit_detail', audit_id=audit.id))
    return render_template('audit_detail.html', audit=audit)


if __name__ == '__main__':
    create_tables()
    app.run(debug=True, host='0.0.0.0')
