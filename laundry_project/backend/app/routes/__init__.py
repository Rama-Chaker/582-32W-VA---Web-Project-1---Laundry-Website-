from flask import request, jsonify
from app import db
from app.models import User

#Password Validation
def validate_password(password):
    if len(password) < 8:
        return "Password must contain at least 8 characters."
    if len(password) > 20:
        return "Password must contain at most 20 characters."
    if not any(char.isupper() for char in password):
        return "Password must contain at least an uppercase letter."
    if not any(char.isdigit() for char in password):
        return "Password must contain a digit."
    return None


def init_routes(app):

    #  Test Route 
    @app.route('/')
    def home():
        return jsonify({"message": "Violetta Laundry API is running!"})

    #  1. Registration Route 
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json() or {}

        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Grab role, defaulting to "Client" if not provided
        role = data.get('role', 'Client').strip().capitalize()
        if role not in ['Client', 'Admin']:
            role = 'Client'

        errors = []

        if not username:
            errors.append("Username is required.")
        elif len(username) > 50:
            errors.append("Username may contain at most 50 characters.")
        elif any(char.isspace() for char in username):
            errors.append("Username may not contain whitespace.")

        if not email:
            errors.append("Email is required.")

        if User.query.filter_by(username=username).first():
            errors.append("That username is already in use!")

        if User.query.filter_by(email=email).first():
            errors.append("That email is already registered.")

        pwd_err = validate_password(password)
        if pwd_err:
            errors.append(pwd_err)

        if errors:
            return jsonify({"errors": errors}), 400

        # Create user with role
        new_user = User(username=username, email=email, role=role)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "Account created successfully!",
            "user": new_user.to_dict()
        }), 201

    #  2. Login Route 
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json() or {}

        username = data.get('username', '').strip()
        password = data.get('password', '')

        user = User.query.filter_by(username=username).first()

        if user is None or not user.check_password(password):
            return jsonify({"error": "Invalid username or password"}), 401

        return jsonify({
            "message": "Logged in successfully!",
            "user": user.to_dict()  # to_dict() returns id, username, email, and role!
        }), 200