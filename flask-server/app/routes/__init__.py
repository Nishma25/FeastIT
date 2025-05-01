from .vendors import vendor_bp
from .customers import customer_bp
from .adminLogin import admin_bp
from .orders import order_bp
from .analytics import analytics_bp

def register_routes(app):
    app.register_blueprint(vendor_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(analytics_bp)
