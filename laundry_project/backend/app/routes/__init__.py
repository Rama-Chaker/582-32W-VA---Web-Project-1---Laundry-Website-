from flask import app, request, jsonify
from app import db
from app.models import *


def validate_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if len(password) > 20:
        return "Password must be at most 20 characters long."

    has_upper = False
    has_digit = False

    for char in password:
        if char.isupper():
            has_upper = True
        if char.isdigit():
            has_digit = True

    if not has_upper:
        return "Password must contain at least one uppercase letter."
    if not has_digit:
        return "Password must contain at least one number."

    return None


def init_routes(app):

    @app.route("/")
    def home():
        return jsonify({"message": "Violetta Laundry API is running!"})

    # Register
    @app.route("/api/register", methods=["POST"])
    def register():
        data = request.get_json() or {}

        username = data.get("username", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        role = data.get("role", "Client")

        if role not in ["Client", "Admin"]:
            role = "Client"

        errors = []

        if not username:
            errors.append("Username is required.")
        elif len(username) > 50:
            errors.append("Username cannot exceed 50 characters.")
        elif " " in username:
            errors.append("Username cannot contain spaces.")

        if not email:
            errors.append("Email is required.")

        # Check existing users
        if User.query.filter_by(username=username).first():
            errors.append("Username is already taken.")

        if User.query.filter_by(email=email).first():
            errors.append("Email is already registered.")

        # Check password rules
        password_error = validate_password(password)
        if password_error:
            errors.append(password_error)

        if len(errors) > 0:
            return jsonify({"errors": errors}), 400

        new_user = User(username=username, email=email, role=role)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return (
            jsonify(
                {"message": "Account created successfully!", "user": new_user.to_dict()}
            ),
            201,
        )

    # Login
    @app.route("/api/login", methods=["POST"])
    def login():
        data = request.get_json() or {}

        username = data.get("username", "").strip()
        password = data.get("password", "")

        user = User.query.filter_by(username=username).first()

        if user is None or not user.check_password(password):
            return jsonify({"error": "Invalid username or password"}), 401

        return (
            jsonify({"message": "Logged in successfully!", "user": user.to_dict()}),
            200,
        )

    # Get Choices
    @app.route("/api/choices", methods=["GET"])
    def get_choices():
        choices = Choice.query.all()
        result = []

        for choice in choices:
            result.append(
                {
                    "id": choice.id,
                    "name": choice.name,
                    "price": choice.price,
                    "category": choice.category,
                }
            )

        return jsonify(result), 200

    @app.route("/api/items", methods=["GET"])
    def get_catalog_items():
        items = CatalogItem.query.all()
        result = []
        for item in items:
            result.append(item.to_dict())
        return jsonify(result), 200

    # Create Order route
    @app.route("/api/orders", methods=["POST"])
    def create_order():
        data = request.get_json() or {}

        if not data.get("user_id"):
            return jsonify({"message": "Missing user ID or order details"}), 400

        new_order = Order(
            user_id=data.get("user_id"),
            pricing=data.get("total_price", 0.0),
            date=data.get("date", ""),
            time=data.get("time", ""),
            status="Pending",
        )

        db.session.add(new_order)
        db.session.flush()

        selected_items = data.get("items", {})  # e.g. {"1": 2, "3": 1}
        for item_id, quantity in selected_items.items():
            catalog_item = CatalogItem.query.get(int(item_id))
            if catalog_item and quantity > 0:
                order_item = OrderItem(
                    order_id=new_order.id,
                    catalog_item_id=catalog_item.id,
                    item_name=catalog_item.name,
                    quantity=quantity,
                    unit_price=catalog_item.price,
                )
                db.session.add(order_item)

        db.session.commit()

        return (
            jsonify(
                {"message": "Order created successfully", "order_id": new_order.id}
            ),
            201,
        )

    # Admin Dashboard Route
    @app.route("/api/admin/dashboard", methods=["GET"])
    def get_admin_dashboard():
        orders = Order.query.all()
        expenses = Expense.query.all()
        total_orders = len(orders)

        total_revenue = 0.0
        for order in orders:
            total_revenue += order.pricing or 0.0

        total_expenses = 0.0
        for expense in expenses:
            total_expenses += expense.amount or 0.0
        recent_orders_query = Order.query.order_by(Order.id.desc()).limit(5).all()
        recent_orders = [order.to_dict() for order in recent_orders_query]

        return (
            jsonify(
                {
                    "total_revenue": round(total_revenue, 2),
                    "total_expenses": round(total_expenses, 2),
                    "total_orders": total_orders,
                    "recent_orders": recent_orders,
                }
            ),
            200,
        )

    # Route to update order status
    @app.route("/api/orders/<int:order_id>/status", methods=["PUT"])
    def update_order_status(order_id):
        data = request.get_json() or {}
        new_status = data.get("status")

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"message": "Order not found"}), 404

        if new_status:
            order.status = new_status
            db.session.commit()

        return (
            jsonify(
                {"message": "Status updated successfully", "order": order.to_dict()}
            ),
            200,
        )

    # Get All Orders for Admin Orders Management Tab
    @app.route("/api/admin/orders", methods=["GET"])
    def get_admin_orders():
        all_orders = Order.query.order_by(Order.id.desc()).all()
        orders_list = []

        for order in all_orders:
            order_data = order.to_dict()

            # Get Customer Username
            if order.customer:
                order_data["customer_name"] = order.customer.username
            else:
                order_data["customer_name"] = "Customer"

            # Fulfillment Type
            order_data["fulfillment_type"] = "In-Store Drop-Off"

            # Get Detailed Item List for Modal
            item_details = []
            if order.items:
                for item in order.items:
                    item_details.append({
                        "name": item.item_name,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price
                    })
            order_data["items_detail"] = item_details

            # Service Summary string for table
            if len(item_details) > 0:
                first_item_name = item_details[0]["name"]
                if len(item_details) == 1:
                    order_data["service_summary"] = first_item_name
                else:
                    extra_count = len(item_details) - 1
                    order_data["service_summary"] = first_item_name + " (+" + str(extra_count) + " more)"
            else:
                order_data["service_summary"] = "General Wash"

            orders_list.append(order_data)

        return jsonify(orders_list), 200

    # Get All Expenses for Admin
    @app.route("/api/admin/expenses", methods=["GET"])
    def get_admin_expenses():
        try:
            all_expenses = Expense.query.all()
            expenses_list = []
            for expense in all_expenses:
                expenses_list.append(expense.to_dict())
            return jsonify(expenses_list), 200
        except Exception as e:
            print("Error in get_admin_expenses:", e)
            return jsonify({"error": str(e)}), 500

    # Add New Expense
    @app.route("/api/admin/expenses", methods=["POST"])
    def add_admin_expense():
        data = request.get_json()
        if not data:
            data = {}

        title = data.get("title", "").strip()
        category = data.get("category", "").strip()
        amount = data.get("amount", 0.0)
        date = data.get("date", "")
        user_id = data.get("user_id", 1)  # Default admin user ID

        if not title or not category or amount <= 0:
            return jsonify({"message": "Please fill in all expense details."}), 400

        new_expense = Expense(
            title=title,
            category=category,
            amount=float(amount),
            date=date,
            user_id=user_id
        )

        db.session.add(new_expense)
        db.session.commit()

        return jsonify({
            "message": "Expense logged successfully!",
            "expense": new_expense.to_dict()
        }), 201

    # Update Existing Expense (PUT)
    @app.route("/api/admin/expenses/<int:expense_id>", methods=["PUT"])
    def update_admin_expense(expense_id):
        try:
            target_expense = Expense.query.get(expense_id)
            if not target_expense:
                return jsonify({"message": "Expense not found"}), 404

            data = request.get_json()
            if not data:
                data = {}

            title = data.get("title", "").strip()
            category = data.get("category", "").strip()
            amount = data.get("amount", 0.0)
            date = data.get("date", "")

            if title:
                target_expense.title = title
            if category:
                target_expense.category = category
            if amount > 0:
                target_expense.amount = float(amount)
            if date:
                target_expense.date = date

            db.session.commit()

            return jsonify({
                "message": "Expense updated successfully!",
                "expense": target_expense.to_dict()
            }), 200

        except Exception as e:
            print("Error updating expense:", e)
            return jsonify({"error": str(e)}), 500

    # Get Customers Directory for Admin
    @app.route("/api/admin/customers", methods=["GET"])
    def get_admin_customers():
        try:
            clients = User.query.filter_by(role="Client").all()
            customers_list = []

            for client in clients:
                client_orders = Order.query.filter_by(user_id=client.id).all()
                total_orders_count = len(client_orders)

                total_spent = 0.0
                for order in client_orders:
                    if order.pricing:
                        total_spent += order.pricing

                phone_val = getattr(client, "phone", None) or getattr(client, "phone_number", "N/A")

                customers_list.append({
                    "id": client.id,
                    "username": client.username,
                    "email": client.email,
                    "phone": phone_val or "N/A",
                    "total_orders": total_orders_count,
                    "total_spent": round(total_spent, 2)
                })

            return jsonify(customers_list), 200

        except Exception as e:
            print("Error fetching customers directory:", e)
            return jsonify({"error": str(e)}), 500

    # Get Client Profile
    @app.route("/api/client/profile/<int:user_id>", methods=["GET"])
    def get_client_profile(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        phone_val = getattr(user, "phone", None) or getattr(user, "phone_number", "")

        return (
            jsonify(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "phone": phone_val,
                    "role": user.role
                }
            ),
            200,
        )

    # Update Client Profile
    @app.route("/api/client/profile/<int:user_id>", methods=["PUT"])
    def update_client_profile(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json() or {}
        username = data.get("username", "").strip()
        email = data.get("email", "").strip().lower()
        phone = data.get("phone", "").strip()

        if username:
            user.username = username
        if email:
            user.email = email
            
        if hasattr(user, "phone"):
            user.phone = phone
        elif hasattr(user, "phone_number"):
            user.phone_number = phone

        db.session.commit()
        return jsonify({"message": "Profile updated successfully!", "user": user.to_dict()}), 200

    # Get Client Orders History
    @app.route("/api/client/orders/<int:user_id>", methods=["GET"])
    def get_client_orders(user_id):
        user_orders = Order.query.filter_by(user_id=user_id).order_by(Order.id.desc()).all()

        return jsonify([
            {
                "id": order.id,
                "date": order.date,
                "pricing": order.pricing,
                "status": order.status
            }
            for order in user_orders
        ]), 200

    @app.route("/api/orders/<int:order_id>/items", methods=["GET"])
    def get_order_items(order_id):
        items = OrderItem.query.filter_by(order_id=order_id).all()

        return jsonify([
            {
                "id": item.id,
                "order_id": item.order_id,
                "catalog_item_id": item.catalog_item_id,
                "item_name": item.item_name,
                "quantity": item.quantity,
                "unit_price": item.unit_price
            }
            for item in items
        ]), 200