import os
import datetime
import secrets
import smtplib
from email.message import EmailMessage
from flask import Blueprint, request, jsonify, render_template_string
from models import db, User, bcrypt

password_bp = Blueprint('password', __name__)

@password_bp.route('/api/forgot_password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Email not found'}), 404
    
    reset_token = secrets.token_hex(16)
    
    sender_email = os.getenv('EMAIL_USER')
    sender_password = os.getenv('EMAIL_PASS')
    
    if not sender_email or not sender_password:
        return jsonify({'message': 'Mail failed: You MUST add EMAIL_USER and EMAIL_PASS to backend/.env file!'}), 400

    try:
        user.reset_token = reset_token
        user.reset_token_expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        db.session.commit()
        
        reset_url = f"{request.host_url}api/reset_password?token={reset_token}"
        
        msg = EmailMessage()
        msg.set_content(f"Hello,\n\nTo reset your Sprinter Analysis password, click the link below:\n\n{reset_url}\n\nValid for 1 hour.")
        msg['Subject'] = 'Password Reset Link'
        msg['From'] = sender_email
        msg['To'] = email

        clean_email = sender_email.replace('"', '').replace("'", "").strip()
        clean_password = sender_password.replace(' ', '').replace('"', '').replace("'", "").strip()
        
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login(clean_email, clean_password)
        server.send_message(msg)
        server.quit()
        return jsonify({'message': 'A reset link has been sent to your email address.'})
    except Exception as e:
        print(f"SMTP Error: {e}")
        return jsonify({'message': f"Mail Provider Error: {str(e)}"}), 500

@password_bp.route('/api/reset_password', methods=['GET', 'POST'])
def reset_password():
    token = request.args.get('token')
    if not token:
        return "Invalid token.", 400
        
    user = User.query.filter_by(reset_token=token).first()
    if not user or (user.reset_token_expiry < datetime.datetime.utcnow()):
        return "Reset link expired or invalid.", 400

    if request.method == 'POST':
        new_password = request.form.get('password')
        if not new_password:
             return "Password is required.", 400
        
        hashed = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.password = hashed
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()
        return "Password updated successfully. You can now log back in to the app."

    html = """
    <html>
        <head><title>Reset Password</title></head>
        <body style="font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
            <div style="padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); width: 300px;">
                <h2 style="color: #007AFF;">Sprinter Analysis</h2>
                <p>Enter your new password:</p>
                <form method="POST">
                    <input type="password" name="password" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;" placeholder="New Password" required minlength="6">
                    <button type="submit" style="width: 100%; background: #007AFF; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Update Password</button>
                </form>
            </div>
        </body>
    </html>
    """
    return render_template_string(html)
