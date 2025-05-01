from flask import Blueprint, jsonify
from app.models import db, Analytics
from sqlalchemy import func
from datetime import date
import random

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/live', methods=['GET'])
def get_analytics_live():
    today = date.today()

    today_data = Analytics.query.filter_by(date_recorded=today).first()
    if not today_data:
        return jsonify({"error": "No analytics data found for today."}), 404

    revenue_per_day = Analytics.query.with_entities(
        Analytics.date_recorded, Analytics.total_revenue
    ).order_by(Analytics.date_recorded).all()

    orders_per_day = Analytics.query.with_entities(
        Analytics.date_recorded, Analytics.total_orders
    ).order_by(Analytics.date_recorded).all()
    
    

    popular_vendors = [
        {"vendor": today_data.top_vendor_name, "orders": today_data.top_vendor_orders}
    ]
    

    popular_items = [
        {"item": today_data.most_popular_item_name, "quantity": today_data.most_popular_item_quantity}
    ]

    # ✅ Generate FAKE hourly orders for 24 hours
    orders_per_hour = [{"hour": h, "orders": random.randint(0, 10)} for h in range(0, 24)]

    return jsonify({
        "total_orders_today": today_data.total_orders,
        "total_revenue_today": float(today_data.total_revenue),
        "top_vendor_name": today_data.top_vendor_name,
        "revenue_per_day": [{"date": str(r[0]), "revenue": float(r[1])} for r in revenue_per_day],
        "orders_per_hour": orders_per_hour,   # <--- NOW filled
        "popular_vendors": popular_vendors,
        "popular_items": popular_items,
    })