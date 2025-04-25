from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.models import db, Customer  # Import your db and Customer model

customer_bp = Blueprint("customer", __name__)
CORS(customer_bp)

# Get all customers
@customer_bp.route('/customers', methods=['GET'])
@customer_bp.route('/customers', methods=['GET'])
def get_customers():
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)

        pagination = Customer.query.paginate(page=page, per_page=limit, error_out=False)
        customers = [customer.to_dict() for customer in pagination.items]

        return jsonify({
            "customers": customers,
            "page": page,
            "total_pages": pagination.pages,
            "total_customers": pagination.total
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get customer by ID
@customer_bp.route('/customers/<int:id>', methods=['GET'])
def get_customer_by_id(id):
    try:
        customer = Customer.query.get(id)
        if not customer:
            return jsonify({"error": "Customer not found"}), 404

        return jsonify(customer.to_dict()), 200
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
