const { gql } = require('graphql-tag');



const typeDefs= gql`
scalar Date
scalar DateTime
scalar JSON

# ---------------------------
# ENUMS
# ---------------------------
enum DriveMode {
  MANUAL
  AUTOMATIC
}

enum AvailabilityStatus {
  AVAILABLE
  UNAVAILABLE
  MAINTENANCE
}

enum VehicleType {
  CAR
  BIKE
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  UPI
  NET_BANKING
  CASH
}

# ---------------------------
# TYPES
# ---------------------------
type User {
  id: ID!
  name: String!
  DOB: Date
  email: String!
  phone: String
  createdAt: DateTime!
  bookings(first: Int, filters: BookingFilters): [Booking!]!
}

type Vehicle {
  id: ID!
  type: VehicleType!
  owner: VehicleOwner!   # Reference owner
  brand: String!
  model: String!
  engineSpec: Engine!
  year: Int!
  licensePlate: String!
  location: Location!
  pricing: Pricing!
  availabilityStatus: AvailabilityStatus!
  images: [Image!]!
  createdAt: DateTime!
  reviews(first: Int): [Review!]!
  featured: Boolean
}

type Engine {
  displacement: String!
  topSpeed: String!
  fuelCapacity: String!
  seats: Int!
  mileage: String!
  kerbWeight: String
  driveMode: DriveMode!
  fuelType: String!
}

type Pricing {
  perHour: Float
  perDay: Float
  perWeek: Float
  perKm: Float
}

type Location {
  city: String!
  lat: Float
  lon: Float
  address: String
  state: String
  country: String
  raw: JSON
}

type Booking {
  id: ID!
  vehicle: Vehicle!
  user: User!
  locationDetail: Location!
  startTime: DateTime!
  endTime: DateTime!
  status: BookingStatus!
  totalAmount: Float!
  createdAt: DateTime!
  payment: Payment
  review: Review
}

type Payment {
  id: ID!
  booking: Booking!
  transactionId: String
  amount: Float!
  status: PaymentStatus!
  method: PaymentMethod
  createdAt: DateTime!
  metadata: JSON
}

type Review {
  id: ID!
  booking: Booking!
  user: User!
  rating: Float!
  comment: String
  createdAt: DateTime!
}

type Image {
  url: String!
  altText: String
  isPrimary: Boolean
}

type VehicleOwner {
  id: ID!
  name: String!
  email: String!
  mobile: String!
  address: String!
  vehicles: [Vehicle!]!   # reverse relation
  createdAt: DateTime!
}

# ---------------------------
# QUERIES
# ---------------------------
type Query {
  users: [User!]!
  user(id: ID!): User
  vehicles(filters: VehicleFilters): [Vehicle!]!
  vehicle(id: ID!): Vehicle
  vehicleOwners: [VehicleOwner!]!
  vehicleOwner(id: ID!): VehicleOwner
  bookings: [Booking!]!
  booking(id: ID!): Booking
  payments: [Payment!]!
  payment(id: ID!): Payment
  reviews: [Review!]!
  review(id: ID!): Review
  vehiclesByLocation(city: String!): [Vehicle!]!
  vehiclesByType(type: VehicleType!): [Vehicle!]!
  availableVehicles: [Vehicle!]!
  checkVehicleAvailability(vehicleId: ID!, startTime: DateTime!, endTime: DateTime!): AvailabilityCheck!
}

# ---------------------------
# MUTATIONS
# ---------------------------
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!

  createVehicle(input: CreateVehicleInput!): Vehicle!
  updateVehicle(id: ID!, input: UpdateVehicleInput!): Vehicle!
  deleteVehicle(id: ID!): Boolean!

  createBooking(input: CreateBookingInput!): Booking!
  updateBooking(id: ID!, input: UpdateBookingInput!): Booking!   # renamed
  cancelBooking(id: ID!): Booking!

  createPayment(input: CreatePaymentInput!): Payment!
  updatePayment(id: ID!, input: UpdatePaymentInput!): Payment!   # renamed

  createReview(input: CreateReviewInput!): Review!
  updateReview(id: ID!, input: UpdateReviewInput!): Review!
  deleteReview(id: ID!): Boolean!

  loginUser(email: String!, password: String!): AuthPayload!      # renamed
}

# ---------------------------
# AUTH
# ---------------------------
type AuthPayload {
  token: String!
  refreshToken: String
  user: User!
}

# ---------------------------
# INPUTS
# ---------------------------
input CreateUserInput {
  name: String!
  DOB: Date
  email: String!
  phone: String
  password: String!
}


input UpdateUserInput {
  name: String
  DOB: Date
  email: String
  phone: String
}

input CreateVehicleInput {
  type: VehicleType!
  brand: String
  model: String
  engineSpec: EngineInput!
  year: Int
  licensePlate: String
  location: LocationInput!
  pricing: PricingInput!
  images: [ImageInput!]!
}

input UpdateVehicleInput {
  type: VehicleType
  brand: String
  model: String
  engineSpec: EngineInput
  year: Int
  licensePlate: String
  location: LocationInput
  pricing: PricingInput
  availabilityStatus: AvailabilityStatus
  images: [ImageInput!]
}

input EngineInput {
  displacement: String!
  topSpeed: String!
  fuelCapacity: String!
  seats: Int!
  mileage: String!
  kerbWeight: String
  driveMode: DriveMode!
  fuelType: String!
}

input PricingInput {
  perHour: Float
  perDay: Float
  perWeek: Float
  perKm: Float
}

input LocationInput {
  city: String!
  lat: Float
  lon: Float
  address: String
  state: String
  country: String
  raw: JSON
}

input ImageInput {
  url: String!
  altText: String
  isPrimary: Boolean
}

input CreateBookingInput {
  vehicleId: ID!
  locationDetail: LocationInput!
  startTime: DateTime!
  endTime: DateTime!
}

input UpdateBookingInput {
  startTime: DateTime
  endTime: DateTime
  status: BookingStatus
}

input CreatePaymentInput {
  bookingId: ID!
  amount: Float!
  method: PaymentMethod!
  transactionId: String
  metadata: JSON
}

input UpdatePaymentInput {
  status: PaymentStatus
  metadata: JSON
}

input CreateReviewInput {
  bookingId: ID!
  rating: Float!
  comment: String
}

input UpdateReviewInput {
  rating: Float
  comment: String
}

input VehicleFilters {
  type: VehicleType
  brand: String
  model: String
  city: String
  availabilityStatus: AvailabilityStatus
  featured: Boolean
  minPrice: Float
  maxPrice: Float
  fuelType: String
  driveMode: DriveMode
  seats: Int
  availability: AvailabilityInput
  first: Int
  sortBy: String
}

input AvailabilityInput {
  startTime: DateTime
  endTime: DateTime
}

input BookingFilters {
  status: BookingStatus
  startDate: DateTime
  endDate: DateTime
}

# ---------------------------
# Availability
# ---------------------------
type AvailabilityCheck {
  available: Boolean!
  conflictingBookings: [Booking!]!
}

`;


module.exports = typeDefs;
