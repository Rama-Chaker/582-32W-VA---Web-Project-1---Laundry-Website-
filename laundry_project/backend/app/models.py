from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='Client', nullable=False)

    # Foreign Keys as per diagram
    choice_id = db.Column(db.Integer, db.ForeignKey("choices.id"), nullable=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=True)

    # Relationships linked to back_populates
    choice = db.relationship("Choice", back_populates="users")
    addresses = db.relationship("Address", back_populates="user", cascade="all, delete-orphan")
    orders = db.relationship("Order", foreign_keys="Order.user_id", back_populates="customer", cascade="all, delete-orphan")
    expenses = db.relationship("Expense", back_populates="logged_by")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "role": self.role,
            "choice_id": self.choice_id,
            "order_id": self.order_id
        }


class Choice(db.Model):
    __tablename__ = "choices"

    id = db.Column(db.Integer, primary_key=True)
    pickup = db.Column(db.Boolean, nullable=False, default=True)
    delivery = db.Column(db.Boolean, nullable=False, default=False)

    # Relationship back to Users
    users = db.relationship("User", back_populates="choice")


class Address(db.Model):
    __tablename__ = "addresses"

    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50), nullable=False)
    street_name = db.Column(db.String(100), nullable=False)
    building = db.Column(db.String(50), nullable=True)
    appartment = db.Column(db.String(20), nullable=True)
    floor = db.Column(db.String(20), nullable=True)

    # Foreign key link to User
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="addresses")


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    pricing = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(30), nullable=False, default="Pending")

    # Foreign key link to User
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    customer = db.relationship("User", foreign_keys=[user_id], back_populates="orders")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "customer_name": (
                f"{self.customer.first_name} {self.customer.last_name}"
                if self.customer and self.customer.first_name
                else (self.customer.username if self.customer else "Guest")
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

    # Foreign key link to User
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