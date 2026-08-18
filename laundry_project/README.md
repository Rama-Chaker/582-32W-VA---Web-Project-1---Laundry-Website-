# Violetta Laundry Project

## Overview

**Violetta Laundry** is a full-stack web application designed for a local laundry and dry-cleaning service based in Jdeideh, Lebanon. The platform serves both **individual customers** and **commercial clients (hotels, businesses)**, providing a seamless interface to browse services, claim special offers, arrange pickup/delivery orders, and manage account workflows.

---

## Out Of Scope Feature:

- The Pickup/delivery option is out of scope for this project: The Drop off option is only the available feature for this project

- Adding new Item (e.g winter coat...)

- WhatsApp Texting

## Design System & Palette

- **Primary Color:** `#4A2E7A` / `#3B2874` (Deep Royal Purple)
- **Accent Color:** `#DFD4FF` (Soft Lavender Accent)
- **Background Light:** `#EBF3FE` / `#F3F7FF` (Ice Blue)
- **Slate/Muted Text:** `#64748B` (Cool Gray)
- **Neutral Colors:** `#FFFFFF` (White) & `#000000` (Black)
- **Typography:**
    - **Headings:** `Poppins` (Sans-Serif, 500/600/700)
    - **Body Text:** `Inter` (Sans-Serif, 400/500/600)

![Color Palette Image](colorPalette.png)

---

## Tech Stack

- **Frontend:** React, Vite, CSS3 (Custom Variables & Flexbox/Grid Layouts)
- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-CORS
- **Database:** SQLite
- **Design & Wireframing:** Figma
- **Database Modeling:** Draw.io
- **Version Control & Project Management:** Git, GitHub, Trello

---

## Features

- **Responsive Landing Page:** Fully aligned with custom Figma wireframes, including Hero banner, feature highlights, special offers, step-by-step process, and a dynamic store location section with direct Google Maps integration.
- **Interactive Top Navigation & Smooth Scroll:** Jump directly between Home, Services, About Us, Pricings, and Contact sections.
- **Authentication System:** Integrated modal switch for Sign In / Registration with custom role tracking (`customer`, `admin`).
- **Our Services & Offers:** Showcases Wash & Fold, Dry Cleaning, Ironing, Comforters & Blankets, Curtains, and Commercial Laundry.
- **Order Management (Pickup & Delivery):** Dedicated workflows for scheduling laundry pickups and home delivery requests.
- **User Dashboard:** Page reserved for customers to track active order progress, inspect status updates, and review order history. And also to edit its profile.
- **Admin Management Dashboard:** Overview panel for administrators to manage service choices, track expenses, update order statuses, and oversee laundry operations.

---

## Database Architecture & Models

The SQLite relational database (powered by Flask-SQLAlchemy) uses the following model structure:

- **`User`** (`users`): User accounts, contact info, role (`Client`, `Admin`), and relationships to orders, addresses, and expenses.
- **`CatalogItem`** (`items`): Catalog of available laundry services with fixed unit pricing and category classifications.
- **`Order`** (`orders`): Customer orders containing pricing total, drop-off date, time, and order status (`Pending`, `In Wash`, `Completed`, `Cancelled`).
- **`OrderItem`** (`order_items`): Junction line items linking specific catalog items and quantities to an order.
- **`Address`** (`addresses`): Physical street and building addresses linked to user accounts.
- **`Expense`** (`expenses`): Store operational expenses logged for admin financial tracking.
- **`Choice`** (`choices`): Fulfillment options (Pickup / Delivery).

![DB Models using Draw.io](DBimage.png)  
[View Diagram on Draw.io](https://app.diagrams.net/#G1q-r-sBsWdqj5x6SQ1kHEJGP8ZUOEzxxD#%7B%22pageId%22%3A%22wHHchIQuiM4AkLc_jLid%22%7D)

[Figma Wireframes](https://www.figma.com/design/I2z3Jqvykpli8NEFXYC5tI/Violetta-Laundry-Website?node-id=0-1&p=f&t=GieSWpAsivh0VMRC-0)
---

## API Endpoints (Flask Backend)

### Core & Health Check
- `GET /` : Health check route returning backend status message.

### Authentication & Client Profile
- `POST /api/register` : Registers a new user account with validation rules for username (max 50 chars, no spaces) and password (8–20 chars, 1 uppercase letter, 1 number). Defaults role to `Client`.
- `POST /api/login` : Authenticates user credentials (`username`, `password`) and returns user profile details upon successful login.
- `GET /api/client/profile/<int:user_id>` : Fetches account profile data (`id`, `username`, `email`, `phone`, `role`) for a given client ID.
- `PUT /api/client/profile/<int:user_id>` : Updates profile information (`username`, `email`, `phone`) for a customer account.

### Catalog & Choices
- `GET /api/items` : Fetches all catalog items (`id`, `name`, `price`, `category`) available for booking orders.
- `GET /api/choices` : Retrieves predefined service choices and categories (`id`, `name`, `price`, `category`).

### Orders
- `POST /api/orders` : Creates a new order with `user_id`, `total_price`, drop-off `date`, `time`, and selected items dictionary (mapping catalog item IDs to quantities).
- `GET /api/client/orders/<int:user_id>` : Retrieves order history (`id`, `date`, `pricing`, `status`) for a specific customer sorted by newest first.
- `GET /api/orders/<int:order_id>/items` : Fetches individual line items (`id`, `order_id`, `catalog_item_id`, `item_name`, `quantity`, `unit_price`) linked to an order.
- `PUT /api/orders/<int:order_id>/status` : Updates the processing status (`Pending`, `In Wash`, `Completed`, `Cancelled`) of a specific order.

### Admin Dashboard & Management
- `GET /api/admin/dashboard` : Returns store financial summary metrics (`total_revenue`, `total_expenses`, `total_orders`) alongside a list of the 5 most recent orders.
- `GET /api/admin/orders` : Retrieves all store orders formatted for administrative tracking, complete with customer names, service summaries, fulfillment types, and line item breakdowns.
- `GET /api/admin/customers` : Returns directory of registered `Client` users with their phone number, total order count, and total lifetime amount spent.
- `GET /api/admin/expenses` : Fetches all recorded operational expenses for store financial tracking.
- `POST /api/admin/expenses` : Logs a new store expense with `title`, `category`, `amount`, `date`, and associated admin `user_id`.
- `PUT /api/admin/expenses/<int:expense_id>` : Updates an existing expense entry (`title`, `category`, `amount`, `date`).

---
## Getting Started

### 1. Backend Setup (Flask)

```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment (optional but recommended)
python -m venv venv

# Install dependencies
pip install flask flask-sqlalchemy flask-cors

# Seed the database catalog (Run once)
python -c "
from app import create_app, db
from app.models import CatalogItem, User, Address, Choice, Order, OrderItem, Expense

app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()
    items = [
        CatalogItem(name='T-Shirt / Long Sleeves / Polo', price=2.99, category='Everyday Wash'),
        CatalogItem(name='Blouse', price=4.99, category='Everyday Wash'),
        CatalogItem(name='Suit / Dress', price=7.99, category='Dry Cleaning'),
        CatalogItem(name='Jeans', price=3.99, category='Everyday Wash'),
        CatalogItem(name='Jacket / Skirt', price=4.99, category='Dry Cleaning'),
        CatalogItem(name='Coat', price=4.99, category='Dry Cleaning'),
        CatalogItem(name='Carpets (/m²)', price=4.99, category='Dry Cleaning'),
        CatalogItem(name='Duvet / Blanket / Bed Sheet', price=4.99, category='Everyday Wash'),
        CatalogItem(name='Towel / Pillow Case', price=0.99, category='Everyday Wash')
    ]
    db.session.add_all(items)
    db.session.commit()
    print('Database initialized and catalog seeded successfully!')
"

# Start Flask server
python app.py

#Backend runs on http://localhost:5000

# Open a new terminal tab & navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev

#Frontend runs on http://localhost:5173
```
