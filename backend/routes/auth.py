from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'All fields are required!'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        height=float(data.get('height', 170.0)),
        weight=float(data.get('weight', 70.0)),
        gender=data.get('gender', 'Male')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Account created successfully!'}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'height': user.height,
                'weight': user.weight,
                'gender': user.gender
            }
        }), 200
    return jsonify({'message': 'Invalid credentials!'}), 401

@auth_bp.route('/api/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if request.method == 'GET':
        return jsonify({
            'name': user.name,
            'height': user.height,
            'weight': user.weight,
            'gender': user.gender
        })
    else:
        data = request.json
        user.name = data.get('name', user.name)
        user.height = float(data.get('height', user.height))
        user.weight = float(data.get('weight', user.weight))
        user.gender = data.get('gender', user.gender)
        db.session.commit()
        return jsonify({'message': 'Profile updated!'})
