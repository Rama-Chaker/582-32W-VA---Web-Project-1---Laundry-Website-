from flask_login import UserMixin
from laundry_project.backend.app.app import db
class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)

    # Role choices: 'customer' or 'admin'
    role = db.Column(db.String(20), nullable=False, default="customer")

    # Relationships
    orders = db.relationship("Order", back_populates="customer")
    addresses = db.relationship("Address", back_populates="user")
    expenses = db.relationship("Expense", back_populates="logged_by")

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "role": self.role,
        }


class Choice(db.Model):
    __tablename__ = "choices"

    id = db.Column(db.Integer, primary_key=True)
    pickup = db.Column(db.Boolean, nullable=False, default=True)
    delivery = db.Column(db.Boolean, nullable=False, default=False)


class Address(db.Model):
    __tablename__ = "addresses"

    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50), nullable=False)
    street_name = db.Column(db.String(100), nullable=False)
    building = db.Column(db.String(50), nullable=True)
    appartment = db.Column(db.String(20), nullable=True)
    floor = db.Column(db.String(20), nullable=True)

    # Foreign key link
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="addresses")


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    pricing = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(30), nullable=False, default="Pending")

    # Foreign key link
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    customer = db.relationship("User", back_populates="orders")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "customer_name": (
                f"{self.customer.first_name} {self.customer.last_name}"
                if self.customer
                else "Guest"
            ),
            "pricing": self.pricing,
            "date": self.date,
            "time": self.time,
            "status": self.status,
        }


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(20), nullable=False)

    # Foreign key link
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    logged_by = db.relationship("User", back_populates="expenses")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "category": self.category,
            "amount": self.amount,
            "date": self.date,
        }