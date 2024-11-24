# Courier Service Application

A full-stack courier service application built with the PERN stack (PostgreSQL, Express, React, Node.js) using TypeScript. This application enables users to register, create shipments, and track their deliveries.

## Features

- User Registration and Authentication
- Shipment Creation and Tracking
- User Dashboard
- Admin Dashboard
- Real-time Shipment Status Updates

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20.17.0 )
- PostgreSQL (17.0 )
- npm (10.8.2) 

## Installation

1. Clone the repository:
git clone 
BackEnd : https://github.com/Courier-Service-System/BackEnd.git

2. Install backend dependencies:
cd backend
npm install



## Environment Setup

### Backend (.env)
•	Create a `.env` file in the backend directory with the following variables:
NODE_ENV = development
PORT=8000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=JOE909son
DATABASE_NAME=my_database
COOKIE_EXPIRES_TIME= 7
JWT_SECRET=b62de7a6c73751a056d5caebdfc451d859f6cc7b125dc5ce5005cb3b81362036
JWT_EXPIRES_TIME=7d

## Database Schema
### Users Table
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

### Shipments Table

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
## Running the Application

1. Start the backend server:
	cd backend
	npm start
	The server will start on http://localhost:8000


## API Documentation
### Authentication Endpoints

#### POST /api/auth/register
Register a new user
Request body: 
{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    address: string;
    telephone_number: string;
    role: string;
    nic: string;
}```
#### POST /api/auth/login
Login user
Request body: {
    email: string
    password: string
}

### Shipment Endpoints

#### POST /api/shipments
Create a new shipment
Request body: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    postal_code: string;
    description: string;
    weight: number;
}

#### GET /api/shipments/:trackingNumber
Get shipment details
Response: {
    id: number
    trackingNumber: string
    status: string }

#### GET /api/shipments
Get all user shipments (requires authentication)

## Error Handling

The application includes comprehensive error handling:
- Frontend: Toast notifications for user feedback
- Backend: Standardized error responses

## Testing
For Backend Testing, I used postman to check the end points.

## Project Structure
**backend**
- config  
  - .env  
  - database.ts  
- controllers  
  - authController.ts  
  - shippingCreationController.ts  
- middlewares  
  - authMiddleware.ts  
  - catchAsyncError.ts  
  - checkRole.ts  
  - validationSchema.ts  
- models  
  - shippingCreationModel.ts  
  - userModel.ts  
- routes  
  - authRoutes.ts  
  - shippingCreationRoutes.ts  
- utils  
  - errorHandler.ts  
  - jwt.ts  
- app.ts  
- server.ts  


## Available Scripts

1.  Backend:
-npm start : Start the development sever


## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
