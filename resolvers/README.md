# GraphQL Resolvers Documentation

This directory contains all the GraphQL resolvers for the Vehicle Rental API. The resolvers are organized by domain and provide the business logic for all GraphQL operations.

## File Structure

```
resolvers/
├── index.js              # Main resolver index that combines all resolvers
├── userResolvers.js      # User-related queries and mutations
├── vehicleResolvers.js   # Vehicle-related queries and mutations
├── bookingResolvers.js   # Booking-related queries and mutations
├── paymentResolvers.js   # Payment-related queries and mutations
├── reviewResolvers.js    # Review-related queries and mutations
└── authResolvers.js      # Authentication-related mutations
```

## Resolver Overview

### User Resolvers (`userResolvers.js`)

**Queries:**
- `users`: Fetch all users (admin only)
- `user(id)`: Fetch a specific user by ID

**Mutations:**
- `createUser(input)`: Create a new user account
- `updateUser(id, input)`: Update user information
- `deleteUser(id)`: Delete a user account

**Field Resolvers:**
- `User.bookings`: Fetch bookings for a user with optional filtering

### Vehicle Resolvers (`vehicleResolvers.js`)

**Queries:**
- `vehicles(filters)`: Fetch vehicles with optional filtering
- `vehicle(id)`: Fetch a specific vehicle by ID
- `vehiclesByLocation(city)`: Fetch available vehicles in a specific city
- `vehiclesByType(type)`: Fetch available vehicles of a specific type
- `availableVehicles`: Fetch all available vehicles
- `checkVehicleAvailability(vehicleId, startTime, endTime)`: Check if a vehicle is available for a time period

**Mutations:**
- `createVehicle(input)`: Create a new vehicle listing
- `updateVehicle(id, input)`: Update vehicle information
- `deleteVehicle(id)`: Delete a vehicle listing

**Field Resolvers:**
- `Vehicle.reviews`: Fetch reviews for a vehicle

### Booking Resolvers (`bookingResolvers.js`)

**Queries:**
- `bookings`: Fetch user's bookings (or all bookings for admin)
- `booking(id)`: Fetch a specific booking by ID

**Mutations:**
- `createBooking(input)`: Create a new booking
- `updateBooking(id, input)`: Update booking details
- `cancelBooking(id)`: Cancel a booking

**Field Resolvers:**
- `Booking.payment`: Fetch payment for a booking
- `Booking.review`: Fetch review for a booking

### Payment Resolvers (`paymentResolvers.js`)

**Queries:**
- `payments`: Fetch user's payments (or all payments for admin)
- `payment(id)`: Fetch a specific payment by ID

**Mutations:**
- `createPayment(input)`: Create a new payment
- `updatePayment(id, input)`: Update payment details

**Field Resolvers:**
- `Payment.booking`: Fetch booking for a payment

### Review Resolvers (`reviewResolvers.js`)

**Queries:**
- `reviews(first)`: Fetch reviews with optional limit
- `review(id)`: Fetch a specific review by ID

**Mutations:**
- `createReview(input)`: Create a new review
- `updateReview(id, input)`: Update review details
- `deleteReview(id)`: Delete a review

**Field Resolvers:**
- `Review.booking`: Fetch booking for a review
- `Review.user`: Fetch user who wrote the review

### Authentication Resolvers (`authResolvers.js`)

**Mutations:**
- `loginUser(email, password)`: Authenticate user and return JWT tokens

## Authentication & Authorization

Most resolvers implement authentication and authorization:

1. **Authentication**: Uses JWT tokens from the `Authorization` header
2. **Authorization**: Checks if the user owns the resource or has admin role
3. **Admin Access**: Users with `role: 'ADMIN'` can access all resources

## Error Handling

All resolvers include comprehensive error handling:
- Input validation
- Database operation errors
- Authorization errors
- Business logic validation

## Data Population

Resolvers use Mongoose's `populate()` to efficiently load related data:
- User data (excluding passwords)
- Vehicle information
- Booking details
- Payment information
- Review data

## Usage Examples

### Create a User
```graphql
mutation {
  createUser(input: {
    name: "John Doe"
    email: "john@example.com"
    password: "password123"
    phone: "+1234567890"
  }) {
    id
    name
    email
    phone
  }
}
```

### Login User
```graphql
mutation {
  loginUser(email: "john@example.com", password: "password123") {
    token
    refreshToken
    user {
      id
      name
      email
    }
  }
}
```

### Create a Booking
```graphql
mutation {
  createBooking(input: {
    vehicleId: "vehicle_id_here"
    startTime: "2024-01-15T10:00:00Z"
    endTime: "2024-01-15T18:00:00Z"
    locationDetail: {
      city: "New York"
      address: "123 Main St"
    }
  }) {
    id
    totalAmount
    status
    vehicle {
      brand
      model
    }
  }
}
```

### Query Available Vehicles
```graphql
query {
  availableVehicles {
    id
    type
    brand
    model
    pricing {
      perHour
      perDay
    }
    location {
      city
      address
    }
  }
}
```

## Environment Variables

Make sure these environment variables are set:
- `JWT_SECRET`: Secret key for JWT token generation
- `MONGODB_URI`: MongoDB connection string

## Dependencies

The resolvers depend on these packages:
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token generation
- `mongoose`: MongoDB ODM
- `graphql`: GraphQL implementation
