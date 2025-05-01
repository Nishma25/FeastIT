from flask import Blueprint, request, jsonify, current_app
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import AdminUser
from app.extensions import db
import jwt
from datetime import datetime, timedelta
from functools import wraps

admin_bp = Blueprint("admin", __name__)
CORS(admin_bp, supports_credentials=True)

# JWT decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            token = token.replace("Bearer ", "")
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = AdminUser.query.get(data['admin_id'])
        except Exception as e:
            print("Token decode error:", str(e))
            return jsonify({"message": "Token is invalid!"}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@admin_bp.route("/adminLogin", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = AdminUser.query.filter_by(admin_email=email).first()

    if user and check_password_hash(user.admin_password, password):
        token = jwt.encode({
            'admin_id': user.admin_id,
            'exp': datetime.utcnow() + timedelta(hours=2)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({
            "message": "Login successful",
            "token": token,
            "admin_name": user.admin_name,
            "admin_email": user.admin_email,
            "admin_role": user.admin_role
        }), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401


@admin_bp.route("/adminSignup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required."}), 400

    existing_user = AdminUser.query.filter_by(admin_email=email).first()
    if existing_user:
        return jsonify({"message": "Email is already registered."}), 400

    hashed_password = generate_password_hash(password)
    new_admin = AdminUser(
        admin_name=name,
        admin_email=email,
        admin_password=hashed_password
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"message": "Admin account created successfully."}), 201


@admin_bp.route("/admin/analytics", methods=["GET"])
@token_required
def admin_dashboard(current_user):
    return jsonify({"message": f"Welcome to the admin dashboard, {current_user.admin_name}."}), 200


@admin_bp.route("/adminLogout", methods=["POST"])
def logout():
    # JWT logout is handled client-side by deleting the token
    return jsonify({"message": "Logged out successfully. Please clear your token client-side."}), 200
