from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.extensions import db
from app.models import Order, OrderItem

# Initialize Blueprint
order_bp = Blueprint("order", __name__)
CORS(order_bp)

# Endpoint to fetch all orders
@order_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        return jsonify([order.to_dict() for order in orders]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to fetch a single order by order_id
@order_bp.route('/orders/<order_id>', methods=['GET'])
def get_order_by_id(order_id):
    order = Order.query.filter_by(order_id=order_id).first()
    if order:
        order_dict = order.to_dict()
        return jsonify(order_dict), 200
    else:
        return jsonify({"error": "Order not found"}), 404

# Endpoint to fetch all order items by order_id
@order_bp.route('/orders/<int:order_id>/items', methods=['GET'])
def get_order_items(order_id):
    try:
        items = OrderItem.query.filter_by(order_id=order_id).all()
        return jsonify([item.to_dict() for item in items]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
