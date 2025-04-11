from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.extensions import db

class Customer(db.Model):
    __tablename__ = 'customers'
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(15), unique=True)
    address = db.Column(db.Text)
    registration_date = db.Column(db.DateTime)

    def __repr__(self):
        return f"<Customer {self.email}>"


class Vendor(db.Model):
    __tablename__ = 'vendors'
    vendor_id = db.Column(db.Integer, primary_key=True)
    vendor_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(15), unique=True)
    address = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    rejected_reason = db.Column(db.Text)
    applied_date = db.Column(db.DateTime)
    is_deleted = db.Column(db.Boolean, default=False)
    document = db.Column(db.Text)

    def __repr__(self):
        return f"<Vendor {self.email}>"
    
    def to_dict(self):
        return {
            'vendor_id': self.vendor_id,
            'vendor_name': self.vendor_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'address': self.address,
            'status': self.status,
            'applied_date': self.applied_date.strftime('%Y-%m-%d %H:%M:%S'),
            'is_deleted': self.is_deleted,
            'document': self.document
        }


class CustomerReview(db.Model):
    __tablename__ = 'customer_reviews'
    review_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    rating = db.Column(db.Numeric(2, 1))
    comments = db.Column(db.Text)
    review_date = db.Column(db.DateTime)

    def __repr__(self):
        return f"<CustomerReview {self.review_id}>"


class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    item_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    item_price = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(50))
    availability = db.Column(db.Boolean, default=True)
    diet_type = db.Column(db.Enum('veg', 'non-veg', 'vegan', 'gluten-free'))
    has_offer = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

    def __repr__(self):
        return f"<MenuItem {self.item_name}>"


class VendorReview(db.Model):
    __tablename__ = 'vendor_reviews'
    review_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    rating = db.Column(db.Numeric(2, 1))
    comments = db.Column(db.Text)
    review_date = db.Column(db.DateTime)

    def __repr__(self):
        return f"<VendorReview {self.review_id}>"


class SpecialOffer(db.Model):
    __tablename__ = 'special_offers'
    offer_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.item_id'))
    offer_type = db.Column(db.String(50))
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    discount_percentage = db.Column(db.Numeric(5, 2))
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f"<SpecialOffer {self.offer_id}>"


class Order(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    total_amount = db.Column(db.Numeric(10, 2))
    order_date = db.Column(db.DateTime)
    order_status = db.Column(db.Enum('pending', 'confirmed', 'preparing', 'delivered', 'cancelled'))

    def __repr__(self):
        return f"<Order {self.order_id}>"


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    order_item_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.item_id'))
    quantity = db.Column(db.Integer, nullable=False)
    item_price = db.Column(db.Numeric(10, 2))
    has_offer = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<OrderItem {self.order_item_id}>"


class OrderStatusHistory(db.Model):
    __tablename__ = 'order_status_history'
    status_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
    status = db.Column(db.Enum('pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'))
    status_time = db.Column(db.DateTime)

    def __repr__(self):
        return f"<OrderStatusHistory {self.status_id}>"


class AdminUser(db.Model):
    __tablename__ = 'admin_user'
    admin_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='admin')
    created_at = db.Column(db.DateTime)

    def __repr__(self):
        return f"<AdminUser {self.email}>"


class VendorReviewQueue(db.Model):
    __tablename__ = 'vendor_review_queue'
    review_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    reviewed_by = db.Column(db.Integer, db.ForeignKey('admin_user.admin_id'))
    status = db.Column(db.Enum('approved', 'rejected', 'pending'), default='pending')
    reason = db.Column(db.Text)
    reviewed_at = db.Column(db.DateTime)

    def __repr__(self):
        return f"<VendorReviewQueue {self.review_id}>"


class CustomerFeedbackReport(db.Model):
    __tablename__ = 'customer_feedback_reports'
    report_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    message = db.Column(db.Text)
    status = db.Column(db.Enum('open', 'in_progress', 'resolved'), default='open')
    admin_id = db.Column(db.Integer, db.ForeignKey('admin_user.admin_id'))
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

    def __repr__(self):
        return f"<CustomerFeedbackReport {self.report_id}>"


class VendorFeedbackReport(db.Model):
    __tablename__ = 'vendor_feedback_reports'
    report_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    message = db.Column(db.Text)
    status = db.Column(db.Enum('open', 'in_progress', 'resolved'), default='open')
    admin_id = db.Column(db.Integer, db.ForeignKey('admin_user.admin_id'))
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

    def __repr__(self):
        return f"<VendorFeedbackReport {self.report_id}>"


class AnalyticsSummary(db.Model):
    __tablename__ = 'analytics_summary'
    date = db.Column(db.Date, primary_key=True)
    total_orders = db.Column(db.Integer, default=0)
    total_customers = db.Column(db.Integer, default=0)
    total_vendors = db.Column(db.Integer, default=0)
    active_offers = db.Column(db.Integer, default=0)
    revenue_generated = db.Column(db.Numeric(10, 2), default=0.00)

    def __repr__(self):
        return f"<AnalyticsSummary {self.date}>"


class VendorAnalytics(db.Model):
    __tablename__ = 'vendor_analytics'
    vendor_id = db.Column(db.Integer, primary_key=True)
    total_orders = db.Column(db.Integer, default=0)
    total_revenue = db.Column(db.Numeric(10, 2), default=0.00)
    average_order_value = db.Column(db.Numeric(10, 2))
    last_updated = db.Column(db.DateTime)

    def __repr__(self):
        return f"<VendorAnalytics {self.vendor_id}>"

