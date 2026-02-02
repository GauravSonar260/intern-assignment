from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    # Storing hash, never plain text
    password_hash = db.Column(db.String(128), nullable=False)
    # Role: 'user' or 'admin'
    role = db.Column(db.String(20), default='user', nullable=False)
    
    # Relationship to tasks
    tasks = db.relationship('Task', backref='owner', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role
        }

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending') # pending, in-progress, completed
    
    # Foreign Key to User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "owner": self.owner.username
        }