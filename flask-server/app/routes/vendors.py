from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.extensions import db
from app.models import Vendor
from flask import Response
from flask import send_file
import io

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
    rejection_message = data.get('rejectionMessage', '')

    if new_status not in ['approved', 'rejected', 'pending']:
        return jsonify({"error": "Invalid status"}), 400

    # Find vendor by ID
    vendor = Vendor.query.get(vendor_id)
    if vendor:
        vendor.vendor_status = new_status

        # ✅ Set rejection message if status is rejected
        if new_status == 'rejected':
            vendor.vendor_rejectedmessage = rejection_message
        else:
            vendor.vendor_rejectedmessage = None  # clear if not rejected

        db.session.commit()
        return jsonify({"message": "Vendor status updated", "vendor": vendor.to_dict()}), 200
    else:
        return jsonify({"message": "Vendor not found"}), 404

        return jsonify({"message": "Vendor not found"}), 404
    

# Endpoint to fetch a vendor by vendor_id
@vendor_bp.route('/vendors/<int:vendor_id>', methods=['GET'])
def get_vendor_by_id(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if vendor:
        return jsonify(vendor.to_dict()), 200
    else:
        return jsonify({"error": "Vendor not found"}), 404

@vendor_bp.route('/vendors/<int:vendor_id>/registration_cert_file', methods=['GET'])
def get_registration_cert_file(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if vendor and vendor.registration_cert_file:
        return Response(
            io.BytesIO(vendor.registration_cert_file),
            mimetype='application/pdf',
            headers={"Content-Disposition": "inline; filename=registration_certificate.pdf"}
        )
    else:
        return jsonify({"error": "PDF not found"}), 404

@vendor_bp.route('/vendors/<int:vendor_id>/supporting_docs_file', methods=['GET'])
def get_supporting_docs_file(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if vendor and vendor.supporting_docs_file:
        return Response(
            io.BytesIO(vendor.supporting_docs_file),
            mimetype='application/pdf',
            headers={"Content-Disposition": "inline; filename=supporting_document.pdf"}
        )
    else:
        return jsonify({"error": "Supporting document not found"}), 404
