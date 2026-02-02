from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Task
from app import bcrypt

api = Blueprint('api', __name__)

# --- AUTHENTICATION ROUTES ---

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 400
        
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password_hash=hashed_password, role=data.get('role', 'user'))
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User created successfully"}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        # ID converted to string to prevent "Subject must be a string" error
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, role=user.role), 200
        
    return jsonify({"msg": "Invalid credentials"}), 401

# --- TASK ROUTES ---

@api.route('/tasks', methods=['GET', 'POST'])
@jwt_required()
def handle_tasks():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id)) # Safe convert to int

    if request.method == 'GET':
        if user.role == 'admin':
            tasks = Task.query.all()
        else:
            tasks = Task.query.filter_by(user_id=user.id).all()
        return jsonify([task.to_json() for task in tasks]), 200

    if request.method == 'POST':
        data = request.get_json()
        new_task = Task(
            title=data['title'],
            description=data.get('description', ''),
            user_id=user.id
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_json()), 201

# --- NEW: DELETE ROUTE ---
@api.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.get(task_id)
    user = User.query.get(int(current_user_id))

    if not task:
        return jsonify({"msg": "Task not found"}), 404

    # Security: Only allow delete if you own the task OR you are an Admin
    if task.user_id != user.id and user.role != 'admin':
        return jsonify({"msg": "Permission denied"}), 403

    db.session.delete(task)
    db.session.commit()
    return jsonify({"msg": "Task deleted successfully"}), 200