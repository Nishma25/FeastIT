from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.extensions import db

class Customer(db.Model):
    __tablename__ = 'customers'
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False, unique=True)
    customer_password = db.Column(db.String(255), nullable=False)
    customer_phone = db.Column(db.String(15))
    customer_address = db.Column(db.Text)
    registration_date = db.Column(db.Date, default=datetime.utcnow)

    def __repr__(self):
        return f"<Customer {self.customer_email}>"
    
    def to_dict(self):
        return {
        "customer_id": self.customer_id,
        "customer_name": self.customer_name,
        "customer_email": self.customer_email,
        "customer_phone": self.customer_phone,
        "customer_address": self.customer_address,
        "registration_date": self.registration_date.isoformat() if self.registration_date else None
    }


class AdminUser(db.Model):
    __tablename__ = 'admin_user'
    admin_id = db.Column(db.Integer, primary_key=True)
    admin_name = db.Column(db.String(100), nullable=False)
    admin_email = db.Column(db.String(100), nullable=False, unique=True)
    admin_password = db.Column(db.String(255), nullable=False)
    admin_role = db.Column(db.String(50), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<AdminUser {self.admin_email}>"


class Vendor(db.Model):
    __tablename__ = 'vendors'

    vendor_id = db.Column(db.Integer, primary_key=True)
    business_name = db.Column(db.String(255), nullable=False)
    vendor_name = db.Column(db.String(255), nullable=False)
    vendor_email = db.Column(db.String(255), nullable=False, unique=True)
    vendor_phone = db.Column(db.String(15))
    vendor_password = db.Column(db.String(255), nullable=False)
    vendor_description = db.Column(db.Text)
    vendor_taxId = db.Column(db.String(50))
    vendor_address = db.Column(db.Text)
    vendor_status = db.Column(db.String(20), default='pending')
    vendor_rejectedmessage = db.Column(db.Text)
    business_hours = db.Column(db.String(100))
    
    registration_cert = db.Column(db.String(255))  # filename or display name
    supporting_docs = db.Column(db.String(255))    # filename or display name
    registration_cert_file = db.Column(db.LargeBinary)  # actual PDF BLOB
    supporting_docs_file = db.Column(db.LargeBinary)     # actual PDF BLOB

    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Vendor {self.vendor_email}>"
    
    def to_dict(self):
        return {
            'vendor_id': self.vendor_id,
            'business_name': self.business_name,
            'vendor_name': self.vendor_name,
            'vendor_email': self.vendor_email,
            'vendor_phone': self.vendor_phone,
            'vendor_description': self.vendor_description,
            'vendor_taxId': self.vendor_taxId,
            'vendor_address': self.vendor_address,
            'vendor_status': self.vendor_status,
            'vendor_rejectedmessage': self.vendor_rejectedmessage,
            'business_hours': self.business_hours,
            'registration_cert': self.registration_cert,
            'supporting_docs': self.supporting_docs,
            'registration_date': self.registration_date.strftime('%Y-%m-%d') if self.registration_date else None
        }


class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    item_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id', ondelete="CASCADE"))
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    price = db.Column(db.Numeric(10, 2))
    availability = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f"<MenuItem {self.item_name}>"


class Order(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id', ondelete="CASCADE"))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id', ondelete="CASCADE"))
    total_amount = db.Column(db.Numeric(10, 2))
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    order_status = db.Column(db.Enum('pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'))
    delivery_address = db.Column(db.Text)

    def __repr__(self):
        return f"<Order {self.order_id}>"
    
    def to_dict(self):
        return {
            "order_id": self.order_id,
            "vendor_id": self.vendor_id,
            "customer_id": self.customer_id,
            "total_amount": float(self.total_amount),  # convert Decimal to float
            "order_date": self.order_date.isoformat() if self.order_date else None,
            "order_status": self.order_status,
            "delivery_address": self.delivery_address
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    order_item_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id', ondelete="CASCADE"))
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.item_id', ondelete="SET NULL"))
    quantity = db.Column(db.Integer, nullable=False)
    item_price = db.Column(db.Numeric(10, 2))
    has_offer = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<OrderItem {self.order_item_id}>"
    
    def to_dict(self):
        return {
            "order_item_id": self.order_item_id,
            "order_id": self.order_id,
            "item_id": self.item_id,
            "quantity": self.quantity,
            "item_price": float(self.item_price) if self.item_price else 0.0,
            "has_offer": self.has_offer
        }


class CustomerReview(db.Model):
    __tablename__ = 'customer_reviews'
    review_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id', ondelete="CASCADE"))
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id', ondelete="CASCADE"))
    rating = db.Column(db.Numeric(2, 1))
    comments = db.Column(db.Text)
    review_date = db.Column(db.Date, default=datetime.utcnow)

    def __repr__(self):
        return f"<CustomerReview {self.review_id}>"


class OrderStatusHistory(db.Model):
    __tablename__ = 'order_status_history'
    status_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
    status = db.Column(db.Enum('pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'))
    status_time = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<OrderStatusHistory {self.status_id}>"


class VendorReviewQueue(db.Model):
    __tablename__ = 'vendor_review_queue'
    review_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    reviewed_by = db.Column(db.Integer, db.ForeignKey('admin_user.admin_id'))
    status = db.Column(db.Enum('approved', 'rejected', 'pending'), default='pending')
    reason = db.Column(db.Text)
    reviewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<VendorReviewQueue {self.review_id}>"
    
    def to_dict(self):
        return {
            "review_id": self.review_id,
            "vendor_id": self.vendor_id,
            "reviewed_by": self.reviewed_by,
            "status": self.status,
            "reason": self.reason,
            "reviewed_at": self.reviewed_at.strftime('%Y-%m-%d %H:%M:%S') if self.reviewed_at else None
        }


class CustomerFeedbackReport(db.Model):
    __tablename__ = 'customer_feedback_reports'
    report_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    message = db.Column(db.Text)
    status = db.Column(db.Enum('open', 'in_progress', 'resolved'), default='open')
    admin_id = db.Column(db.Integer, db.ForeignKey('admin_user.admin_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<CustomerFeedbackReport {self.report_id}>"


class VendorFeedbackReport(db.Model):
    __tablename__ = 'vendor_feedback_reports'
    report_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'))
    message = db.Column(db.Text)
    status = db.Column(db.Enum('open', 'in_progress', 'resolved'), default='open')
    admin_id = db.Column(db.Integer, db.ForeignKey('admin_user.admin_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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
    

class Analytics(db.Model):
    __tablename__ = 'analytics'

    id = db.Column(db.Integer, primary_key=True)
    date_recorded = db.Column(db.Date, nullable=False)
    total_orders = db.Column(db.Integer, default=0)
    total_revenue = db.Column(db.Numeric(10, 2), default=0.00)
    total_customers = db.Column(db.Integer, default=0)
    total_vendors = db.Column(db.Integer, default=0)
    top_vendor_name = db.Column(db.String(255))
    top_vendor_orders = db.Column(db.Integer, default=0)
    most_popular_item_name = db.Column(db.String(255))
    most_popular_item_quantity = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

