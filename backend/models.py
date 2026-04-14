import os
import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.dialects.mysql import LONGTEXT
db = SQLAlchemy()
bcrypt = Bcrypt()

def get_ist_now():
    ist = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
    return datetime.datetime.now(ist)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    height = db.Column(db.Float, nullable=True) # in cm
    weight = db.Column(db.Float, nullable=True) # in kg
    gender = db.Column(db.String(20), nullable=True) # Male/Female/Other
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=get_ist_now)

    analyses = db.relationship('AnalysisHistory', backref='user', lazy=True)

class AnalysisHistory(db.Model):
    __tablename__ = 'analysis_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    video_url = db.Column(db.String(500), nullable=False) # ImageKit stream URL
    advice = db.Column(db.Text().with_variant(LONGTEXT, "mysql"), nullable=False) 
    graph_data = db.Column(db.Text().with_variant(LONGTEXT, "mysql"), nullable=False) 
    created_at = db.Column(db.DateTime, default=get_ist_now)
