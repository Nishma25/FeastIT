from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.models import db, Customer  # Import your db and Customer model

customer_bp = Blueprint("customer", __name__)
CORS(customer_bp)

# Get all customers
@customer_bp.route('/customers', methods=['GET'])
def get_customers():
    try:
        customers = Customer.query.all()
        customer_list = [{
            "customer_id": customer.customer_id,
            "customer_name": customer.customer_name,
            "email": customer.email
        } for customer in customers]
        
        return jsonify(customer_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete a customer
@customer_bp.route('/customers/<id>', methods=['DELETE'])
def delete_customer(id):
    try:
        customer_to_delete = Customer.query.get(id)

        if customer_to_delete is None:
            return jsonify({"error": "Customer not found"}), 404

        db.session.delete(customer_to_delete)
        db.session.commit()

        return jsonify({"message": "Customer successfully removed"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Error handler for 404
@customer_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404


# Error handler for 400
@customer_bp.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request"}), 400


# General error handler
@customer_bp.errorhandler(Exception)
def handle_exception(error):
    return jsonify({"error": "An unexpected error occurred", "message": str(error)}), 500
