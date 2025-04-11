from flask import Blueprint, request, jsonify
from app.models import AdminUser 

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/adminLogin", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = AdminUser.query.filter_by(email=email).first()

    if user and user.password == password:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid login ID or password"}), 401
