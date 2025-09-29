# Hospital Inventory Management System - Backend API

A comprehensive backend API for managing hospital inventory, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Inventory Management** - Complete CRUD operations for medical items
- **Supplier Management** - Vendor tracking and relationship management
- **Transaction Tracking** - Detailed logs of all inventory movements
- **Reports & Analytics** - Comprehensive reporting system
- **Real-time Alerts** - Low stock and expiry notifications
- **Data Validation** - Robust input validation and error handling
- **Security** - Rate limiting, CORS, and security headers

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## ⚡ Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Seed the database with sample data
   node utils/seedData.js
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 🔧 Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hospital_inventory

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### Inventory Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/inventory` | Get all inventory items | Private |
| GET | `/api/inventory/:id` | Get single item | Private |
| POST | `/api/inventory` | Create new item | Admin/Pharmacist |
| PUT | `/api/inventory/:id` | Update item | Admin/Pharmacist |
| DELETE | `/api/inventory/:id` | Delete item | Admin |
| GET | `/api/inventory/alerts/low-stock` | Get low stock items | Private |
| GET | `/api/inventory/alerts/expired` | Get expired items | Private |
| GET | `/api/inventory/alerts/expiring-soon` | Get expiring items | Private |

### Supplier Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/suppliers` | Get all suppliers | Private |
| GET | `/api/suppliers/:id` | Get single supplier | Private |
| POST | `/api/suppliers` | Create supplier | Admin |
| PUT | `/api/suppliers/:id` | Update supplier | Admin |
| DELETE | `/api/suppliers/:id` | Delete supplier | Admin |
| GET | `/api/suppliers/top/rating` | Get top suppliers | Private |
| PUT | `/api/suppliers/:id/rating` | Update rating | Admin |

### Dashboard Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Private |
| GET | `/api/dashboard/activities` | Get recent activities | Private |
| GET | `/api/dashboard/alerts` | Get alerts | Private |
| GET | `/api/dashboard/trends` | Get usage trends | Private |

### Reports Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/reports/inventory` | Inventory report | Private |
| GET | `/api/reports/usage` | Usage report | Private |
| GET | `/api/reports/suppliers` | Supplier report | Private |
| GET | `/api/reports/expiry` | Expiry report | Private |
| GET | `/api/reports/financial` | Financial report | Admin |

### User Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get single user | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| PUT | `/api/users/:id/toggle-status` | Toggle user status | Admin |
| GET | `/api/users/stats` | Get user statistics | Admin |

## 🔐 User Roles & Permissions

### Admin
- Full access to all features
- User management
- System configuration
- Financial reports

### Pharmacist
- Inventory management (add, update)
- Medicine-specific operations
- Expiry tracking
- Stock adjustments

### Staff
- View inventory
- Request items
- Log usage
- Basic reporting

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'staff', 'pharmacist'],
  department: String,
  phone: String,
  employeeId: String,
  isActive: Boolean,
  lastLogin: Date
}
```

### Inventory Item Model
```javascript
{
  name: String,
  category: ['medicine', 'equipment', 'supplies'],
  currentStock: Number,
  minStock: Number,
  maxStock: Number,
  unit: String,
  expiryDate: Date,
  supplier: ObjectId (ref: Supplier),
  batchNumber: String,
  location: String,
  price: Number,
  status: ['available', 'low', 'out-of-stock', 'expired']
}
```

### Supplier Model
```javascript
{
  name: String,
  contact: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  category: String,
  rating: Number (1-5),
  totalOrders: Number,
  status: ['active', 'inactive', 'suspended']
}
```

### Transaction Model
```javascript
{
  type: ['in', 'out', 'adjustment', 'expired', 'damaged'],
  item: ObjectId (ref: InventoryItem),
  quantity: Number,
  previousStock: Number,
  newStock: Number,
  reason: String,
  supplier: ObjectId (ref: Supplier),
  performedBy: ObjectId (ref: User),
  totalValue: Number
}
```

## 🔍 Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Search & Filters
- `search`: Text search across relevant fields
- `category`: Filter by category
- `status`: Filter by status
- `startDate` & `endDate`: Date range filtering

### Example Requests

```bash
# Get inventory with pagination and search
GET /api/inventory?page=1&limit=20&search=paracetamol&category=medicine

# Get low stock items
GET /api/inventory/alerts/low-stock

# Get usage report for last 30 days
GET /api/reports/usage?startDate=2024-01-01&endDate=2024-01-31

# Get suppliers by rating
GET /api/suppliers?minRating=4.5&status=active
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **Helmet**: Security headers

## 📈 Performance Features

- **Database Indexing**: Optimized queries
- **Pagination**: Efficient data loading
- **Aggregation Pipelines**: Complex reporting queries
- **Connection Pooling**: MongoDB connection optimization

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_inventory
   JWT_SECRET=your_production_secret_key
   ```

2. **Build & Start**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added reporting system
- **v1.2.0** - Enhanced security and validation

---

**Happy Coding! 🏥💊**