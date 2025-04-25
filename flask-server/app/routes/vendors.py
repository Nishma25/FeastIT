from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.extensions import db
from app.models import Vendor

# Initialize Blueprint
vendor_bp = Blueprint("vendor", __name__)
CORS(vendor_bp)

# Endpoint to fetch all vendors by status
@vendor_bp.route('/vendors', methods=['GET'])
def get_vendors():
    status = request.args.get('status')

    if status not in ['approved', 'pending', 'rejected']:
        return jsonify({"error": "Invalid status"}), 400

    # Query the vendors from the database based on the status
    vendors = Vendor.query.filter_by(vendor_status=status).all()
    data = [vendor.to_dict() for vendor in vendors]  # Convert each vendor to dictionary for JSON serialization

    return jsonify(data), 200

# Endpoint to approve/reject a vendor (update status)
@vendor_bp.route('/vendor/update_status', methods=['POST'])
def update_vendor_status():
    data = request.json
    vendor_id = data.get('id')
    new_status = data.get('status')

    if new_status not in ['approved', 'rejected', 'pending']:
        return jsonify({"error": "Invalid status"}), 400

    # Find vendor by ID and update the status
    vendor = Vendor.query.get(vendor_id)
    if vendor:
        vendor.vendor_status = new_status
        db.session.commit()
        return jsonify({"message": "Vendor status updated", "vendor": vendor.to_dict()}), 200
    else:
        return jsonify({"message": "Vendor not found"}), 404
    

# Endpoint to fetch a vendor by vendor_id
@vendor_bp.route('/vendors/<int:vendor_id>', methods=['GET'])
def get_vendor_by_id(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if vendor:
        return jsonify(vendor.to_dict()), 200
    else:
        return jsonify({"error": "Vendor not found"}), 404
