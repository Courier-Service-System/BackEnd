# Courier Service Application Backend

A backend service for the courier service application built with Node.js, Express, PostgreSQL, and TypeScript.

## Features

- User Registration and Authentication
- Shipment Creation and Tracking
- User Dashboard
- Admin Dashboard
- Real-time Shipment Status Updates

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20.17.0)
- PostgreSQL (17.0)
- npm (10.8.2)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Courier-Service-System/BackEnd.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

## Configuration Files

### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node",
    "baseUrl": "./backend",
    "outDir": "./backend/dist",
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["backend/*/.ts"],
  "exclude": ["node_modules", "backend/dist"]
}
```

### Package Configuration (package.json)
```json
{
  "name": "courierapp",
  "version": "1.0.0",
  "description": "this is the courier service application",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon"
  },
  "author": "Joeson Clerve",
  "license": "MIT",
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/dotenv": "^6.1.1",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/nodemailer": "^6.4.17",
    "@types/pg": "^8.11.10",
    "@types/sequelize": "^4.28.20",
    "nodemon": "^3.1.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  },
  "dependencies": {
    "@types/express": "^5.0.0",
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.16",
    "pg": "^8.13.1",
    "pg-hstore": "^2.3.4",
    "pg-pool": "^3.7.0",
    "sequelize": "^6.37.5",
    "yup": "^1.4.0"
  }
}
```

## Environment Setup

### Backend (.env)
Create a `.env` file in the backend directory with the following variables:
```env
NODE_ENV=development
PORT=8000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=JOE909son
DATABASE_NAME=my_database
COOKIE_EXPIRES_TIME=7
JWT_SECRET=b62de7a6c73751a056d5caebdfc451d859f6cc7b125dc5ce5005cb3b81362036
JWT_EXPIRES_TIME=7d
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    telephone_number VARCHAR(20),
    role VARCHAR(50),
    nic VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Shipments Table
```sql
CREATE TABLE shipping_creation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    description TEXT,
    weight DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Project Structure

```
backend/
├── config/
│   ├── .env
│   └── database.ts
├── controllers/
│   ├── authController.ts
│   └── shippingCreationController.ts
├── middlewares/
│   ├── authMiddleware.ts
│   ├── catchAsyncError.ts
│   ├── checkRole.ts
│   └── validationSchema.ts
├── models/
│   ├── shippingCreationModel.ts
│   └── userModel.ts
├── routes/
│   ├── authRoutes.ts
│   └── shippingCreationRoutes.ts
├── utils/
│   ├── errorHandler.ts
│   └── jwt.ts
├── app.ts
├── server.ts
├── tsconfig.json
└── package.json
```

## Dependencies

### Main Dependencies
- express: Web framework for Node.js
- pg & sequelize: PostgreSQL database integration
- bcrypt & bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cookie-parser: Cookie parsing middleware
- cors: Cross-origin resource sharing
- dotenv: Environment variable management
- nodemailer: Email functionality
- yup: Schema validation

### Development Dependencies
- typescript: TypeScript support
- ts-node: TypeScript execution
- nodemon: Development server with hot reload
- Various type definitions (@types/*)

## Running the Application

1. Start the backend server:
```bash
npm start
```
The server will start on http://localhost:8000

## API Documentation

[Previous API documentation sections remain the same...]

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related Projects

- [Frontend Repository](https://github.com/Courier-Service-System/FrontEnd)
