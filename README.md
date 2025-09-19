# Vehicle Rental Platform Backend

A comprehensive backend for a bike, scooter, and car booking platform built with Express.js, GraphQL Apollo Server, and MongoDB.

## Features

- **User Management**: Registration, authentication, and user profiles
- **Vehicle Management**: CRUD operations for vehicles (cars, bikes, scooters)
- **Booking System**: Create, update, and manage bookings
- **Payment Processing**: Payment creation and status management
- **Email Notifications**: Automated email notifications using SendGrid
- **Review System**: User reviews and ratings
- **GraphQL API**: Full GraphQL schema with queries and mutations
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **GraphQL**: Apollo Server
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email Service**: SendGrid (@sendgrid/mail)
- **Environment**: dotenv

## Project Structure

```
Backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   ├── User.js             # User model
│   ├── Vehicle.js          # Vehicle model
│   ├── Booking.js          # Booking model
│   ├── Payment.js          # Payment model
│   └── Review.js           # Review model
├── resolvers/
│   └── resolvers.js        # GraphQL resolvers
├── schemas/
│   └── schema.js           # GraphQL schema
├── middleware/
│   └── auth.js             # Authentication middleware
├── services/
│   └── emailService.js     # SendGrid email service
├── utils/
│   └── helpers.js          # Utility functions
├── server.js               # Main server file
├── test-email.js           # Email notification test script
├── package.json           # Dependencies and scripts
└── .env                   # Environment variables
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rental_app
   JWT_SECRET=your_jwt_secret_key_here
   PORT=4000
   NODE_ENV=development
   
   # SendGrid Email Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   SENDGRID_FROM_EMAIL=noreply@example.com
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update the MONGODB_URI in `.env`

5. **SendGrid Setup**
   - Sign up for a SendGrid account at [sendgrid.com](https://sendgrid.com)
   - Create an API key in your SendGrid dashboard
   - Add the API key to your `.env` file as `SENDGRID_API_KEY`
   - Verify your sender email address in SendGrid

6. **Run the server**
   ```bash
   # Development mode (with auto-restart)
   yarn dev
   
   # Production mode
   yarn start
   ```

7. **Test Email Notifications**
   ```bash
   # Test the email functionality
   node test-email.js
   ```

## API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Method**: POST
- **Content-Type**: application/json

### Health Check
- **URL**: `http://localhost:4000/`
- **Method**: GET

## GraphQL Schema Overview

### Main Types
- **User**: User accounts with authentication
- **Vehicle**: Cars, bikes, and scooters available for rent
- **Booking**: Rental reservations
- **Payment**: Payment transactions
- **Review**: User reviews and ratings
- **Location**: Geographic location data

### Key Queries
- `users`: Get all users
- `vehicles`: Get all vehicles
- `availableVehicles`: Get available vehicles
- `vehiclesByLocation`: Filter vehicles by city
- `vehiclesByType`: Filter vehicles by type
- `bookings`: Get all bookings
- `reviews`: Get all reviews

### Key Mutations
- `register`: User registration
- `login`: User authentication
- `createVehicle`: Add a new vehicle
- `createBooking`: Make a booking
- `createPayment`: Process payment
- `createReview`: Add a review
- `updateBookingStatus`: Update booking status

## Email Notifications

The platform automatically sends email notifications when a booking is completed and payment is successful:

### Features
- **Vehicle Owner Notification**: Sends detailed booking information to the vehicle owner
- **Customer Confirmation**: Sends booking confirmation to the customer
- **Professional Templates**: Beautiful HTML email templates with booking details
- **Error Handling**: Email failures don't affect payment processing

### Email Content
- Booking details (vehicle, dates, location, amount)
- Customer/owner contact information
- Professional styling and branding
- Next steps and instructions

### Configuration
- Uses SendGrid for reliable email delivery
- Configurable sender email address
- Environment-based API key management

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```


## Development

### Running in Development Mode
```bash
yarn dev
```

### Database Seeding
You can add sample data by creating a seed script or using GraphQL mutations.

### Testing
The API can be tested using GraphQL playground or tools like Postman.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong JWT_SECRET
3. Configure MongoDB Atlas or production MongoDB instance
4. Set up proper CORS configuration
5. Use environment variables for all sensitive data

## License

MIT License
