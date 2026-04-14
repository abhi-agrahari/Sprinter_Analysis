import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from models import db, bcrypt

# Import Blueprints
from routes.auth import auth_bp
from routes.analysis import analysis_bp
from routes.password import password_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
MYSQL_USER = os.getenv('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
MYSQL_DB = os.getenv('MYSQL_DB', 'sprinter_analysis')

# Support for SSL (required by most cloud providers like Aiven/DigitalOcean)
ssl_ca = os.getenv('MYSQL_SSL_CA')
connection_url = f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
if ssl_ca:
    connection_url += f"?ssl_ca={ssl_ca}"

app.config['SQLALCHEMY_DATABASE_URI'] = connection_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-key-123')

# Initialize Extensions
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(password_bp)

with app.app_context():
    try:
        db.create_all()
        print("Database checked/initialized.")
    except Exception as e:
        print(f"Db init error: {e}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv("PORT", 5000)))