const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const VehicleOwner = require('./models/VehicleOwner');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const { hashPassword } = require('./utils/helpers');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await VehicleOwner.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create sample users
    const hashedPassword = await hashPassword('password123');
    
    const users = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+919876543210',
        DOB: new Date('1990-05-15'),
        password: hashedPassword
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+919876543211',
        DOB: new Date('1988-12-03'),
        password: hashedPassword
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '+919876543212',
        DOB: new Date('1992-08-22'),
        password: hashedPassword
      },
      {
        name: 'Sneha Singh',
        email: 'sneha@example.com',
        phone: '+919876543213',
        DOB: new Date('1995-03-10'),
        password: hashedPassword
      },
      {
        name: 'Vikram Reddy',
        email: 'vikram@example.com',
        phone: '+919876543214',
        DOB: new Date('1985-11-28'),
        password: hashedPassword
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('✅ Users created');

    // Create Prabal Parihar as vehicle owner
    const vehicleOwner = new VehicleOwner({
      name: 'Prabal Parihar',
      email: 'prabalsingh02@hotmail.com',
      mobile: '9770116038',
      address: 'Badra Mumbai'
    });
    
    const createdVehicleOwner = await vehicleOwner.save();
    console.log('✅ Vehicle owner created');

    // Create sample vehicles
    const vehicles = [
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Hyundai',
        model: 'Creta',
        engineSpec: {
          displacement: '1.5L',
          topSpeed: '180 km/h',
          fuelCapacity: '50L',
          seats: 5,
          mileage: '17 km/l',
          kerbWeight: '1280 kg',
          driveMode: 'AUTOMATIC',
          fuelType: 'Petrol'
        },
        year: 2023,
        licensePlate: 'MH01CR001',
        location: {
          city: 'Mumbai',
          lat: 19.0760,
          lon: 72.8777,
          address: 'Bandra Kurla Complex',
          state: 'Maharashtra',
          country: 'India'
        },
        pricing: {
          perHour: 800,
          perDay: 3500,
          perWeek: 20000
        },
        availabilityStatus: 'AVAILABLE',
        featured: true,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Hyundai Creta',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Kia',
        model: 'Seltos',
        engineSpec: {
          displacement: '1.5L',
          topSpeed: '185 km/h',
          fuelCapacity: '50L',
          seats: 5,
          mileage: '16 km/l',
          kerbWeight: '1300 kg',
          driveMode: 'AUTOMATIC',
          fuelType: 'Petrol'
        },
        year: 2022,
        licensePlate: 'DL01SL002',
        location: {
          city: 'Delhi',
          lat: 28.6139,
          lon: 77.2090,
          address: 'Connaught Place',
          state: 'Delhi',
          country: 'India'
        },
        pricing: {
          perHour: 750,
          perDay: 3200,
          perWeek: 18000
        },
        availabilityStatus: 'AVAILABLE',
        featured: true,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Kia Seltos',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Tata',
        model: 'Nexon EV',
        engineSpec: {
          displacement: 'Electric',
          topSpeed: '160 km/h',
          fuelCapacity: '30.2 kWh',
          seats: 5,
          mileage: '312 km/charge',
          kerbWeight: '1400 kg',
          driveMode: 'AUTOMATIC',
          fuelType: 'Electric'
        },
        year: 2023,
        licensePlate: 'KA01NE003',
        location: {
          city: 'Bangalore',
          lat: 12.9716,
          lon: 77.5946,
          address: 'MG Road',
          state: 'Karnataka',
          country: 'India'
        },
        pricing: {
          perHour: 900,
          perDay: 4000,
          perWeek: 22000
        },
        availabilityStatus: 'AVAILABLE',
        featured: true,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Tata Nexon EV',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Maruti Suzuki',
        model: 'Brezza',
        engineSpec: {
          displacement: '1.5L',
          topSpeed: '170 km/h',
          fuelCapacity: '48L',
          seats: 5,
          mileage: '19 km/l',
          kerbWeight: '1150 kg',
          driveMode: 'MANUAL',
          fuelType: 'Petrol'
        },
        year: 2022,
        licensePlate: 'TN01BR004',
        location: {
          city: 'Chennai',
          lat: 13.0827,
          lon: 80.2707,
          address: 'Anna Salai',
          state: 'Tamil Nadu',
          country: 'India'
        },
        pricing: {
          perHour: 600,
          perDay: 2500,
          perWeek: 14000
        },
        availabilityStatus: 'AVAILABLE',
        featured: false,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Maruti Suzuki Brezza',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Mahindra',
        model: 'XUV300',
        engineSpec: {
          displacement: '1.5L',
          topSpeed: '175 km/h',
          fuelCapacity: '42L',
          seats: 5,
          mileage: '18 km/l',
          kerbWeight: '1200 kg',
          driveMode: 'MANUAL',
          fuelType: 'Diesel'
        },
        year: 2021,
        licensePlate: 'TS01XU005',
        location: {
          city: 'Hyderabad',
          lat: 17.3850,
          lon: 78.4867,
          address: 'HITEC City',
          state: 'Telangana',
          country: 'India'
        },
        pricing: {
          perHour: 700,
          perDay: 3000,
          perWeek: 17000
        },
        availabilityStatus: 'AVAILABLE',
        featured: true,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Mahindra XUV300',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Toyota',
        model: 'Fortuner',
        engineSpec: {
          displacement: '2.8L',
          topSpeed: '200 km/h',
          fuelCapacity: '80L',
          seats: 7,
          mileage: '12 km/l',
          kerbWeight: '2100 kg',
          driveMode: 'AUTOMATIC',
          fuelType: 'Diesel'
        },
        year: 2022,
        licensePlate: 'MH02FO006',
        location: {
          city: 'Pune',
          lat: 18.5204,
          lon: 73.8567,
          address: 'Koregaon Park',
          state: 'Maharashtra',
          country: 'India'
        },
        pricing: {
          perHour: 1200,
          perDay: 5500,
          perWeek: 30000
        },
        availabilityStatus: 'UNAVAILABLE',
        featured: true,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Toyota Fortuner',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Hyundai',
        model: 'Venue',
        engineSpec: {
          displacement: '1.0L',
          topSpeed: '165 km/h',
          fuelCapacity: '45L',
          seats: 5,
          mileage: '20 km/l',
          kerbWeight: '1100 kg',
          driveMode: 'MANUAL',
          fuelType: 'Petrol'
        },
        year: 2023,
        licensePlate: 'WB01VE007',
        location: {
          city: 'Kolkata',
          lat: 22.5726,
          lon: 88.3639,
          address: 'Park Street',
          state: 'West Bengal',
          country: 'India'
        },
        pricing: {
          perHour: 650,
          perDay: 2800,
          perWeek: 16000
        },
        availabilityStatus: 'AVAILABLE',
        featured: false,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Hyundai Venue',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Kia',
        model: 'Sonet',
        engineSpec: {
          displacement: '1.0L',
          topSpeed: '160 km/h',
          fuelCapacity: '45L',
          seats: 5,
          mileage: '19 km/l',
          kerbWeight: '1150 kg',
          driveMode: 'MANUAL',
          fuelType: 'Petrol'
        },
        year: 2022,
        licensePlate: 'GJ01SO008',
        location: {
          city: 'Ahmedabad',
          lat: 23.0225,
          lon: 72.5714,
          address: 'SG Highway',
          state: 'Gujarat',
          country: 'India'
        },
        pricing: {
          perHour: 600,
          perDay: 2600,
          perWeek: 15000
        },
        availabilityStatus: 'MAINTENANCE',
        featured: false,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Kia Sonet',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'MG',
        model: 'Hector',
        engineSpec: {
          displacement: '1.5L',
          topSpeed: '180 km/h',
          fuelCapacity: '60L',
          seats: 7,
          mileage: '15 km/l',
          kerbWeight: '1650 kg',
          driveMode: 'AUTOMATIC',
          fuelType: 'Petrol'
        },
        year: 2023,
        licensePlate: 'MH03HE009',
        location: {
          city: 'Mumbai',
          lat: 19.0176,
          lon: 72.8562,
          address: 'Powai',
          state: 'Maharashtra',
          country: 'India'
        },
        pricing: {
          perHour: 850,
          perDay: 3800,
          perWeek: 21000
        },
        availabilityStatus: 'AVAILABLE',
        featured: true,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'MG Hector',
            isPrimary: true
          }
        ]
      },
      {
        type: 'CAR',
        owner: createdVehicleOwner._id,
        brand: 'Mahindra',
        model: 'Thar',
        engineSpec: {
          displacement: '2.0L',
          topSpeed: '155 km/h',
          fuelCapacity: '57L',
          seats: 4,
          mileage: '14 km/l',
          kerbWeight: '1500 kg',
          driveMode: 'MANUAL',
          fuelType: 'Diesel'
        },
        year: 2023,
        licensePlate: 'DL02TH010',
        location: {
          city: 'Delhi',
          lat: 28.5355,
          lon: 77.3910,
          address: 'Gurgaon',
          state: 'Haryana',
          country: 'India'
        },
        pricing: {
          perHour: 1000,
          perDay: 4500,
          perWeek: 25000
        },
        availabilityStatus: 'AVAILABLE',
        featured: true,
        images: [
          {
            url: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Mahindra Thar',
            isPrimary: true
          }
        ]
      }
    ];

    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log('✅ Vehicles created');

    // Create sample bookings
    const bookings = [
      {
        vehicle: createdVehicles[0]._id, // Hyundai Creta
        user: createdUsers[0]._id, // Rajesh Kumar
        locationDetail: {
          city: 'Mumbai',
          lat: 19.0760,
          lon: 72.8777,
          address: 'Bandra Kurla Complex',
          state: 'Maharashtra',
          country: 'India'
        },
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T18:00:00Z'),
        status: 'COMPLETED',
        totalAmount: 6400 // 8 hours * ₹800
      },
      {
        vehicle: createdVehicles[1]._id, // Kia Seltos
        user: createdUsers[1]._id, // Priya Sharma
        locationDetail: {
          city: 'Delhi',
          lat: 28.6139,
          lon: 77.2090,
          address: 'Connaught Place',
          state: 'Delhi',
          country: 'India'
        },
        startTime: new Date('2024-01-20T09:00:00Z'),
        endTime: new Date('2024-01-22T17:00:00Z'),
        status: 'CONFIRMED',
        totalAmount: 6400 // 2 days * ₹3200
      },
      {
        vehicle: createdVehicles[2]._id, // Tata Nexon EV
        user: createdUsers[2]._id, // Amit Patel
        locationDetail: {
          city: 'Bangalore',
          lat: 12.9716,
          lon: 77.5946,
          address: 'MG Road',
          state: 'Karnataka',
          country: 'India'
        },
        startTime: new Date('2024-01-25T14:00:00Z'),
        endTime: new Date('2024-01-25T20:00:00Z'),
        status: 'PENDING',
        totalAmount: 5400 // 6 hours * ₹900
      },
      {
        vehicle: createdVehicles[0]._id, // Hyundai Creta
        user: createdUsers[3]._id, // Sneha Singh
        locationDetail: {
          city: 'Mumbai',
          lat: 19.0760,
          lon: 72.8777,
          address: 'Bandra Kurla Complex',
          state: 'Maharashtra',
          country: 'India'
        },
        startTime: new Date('2024-02-01T08:00:00Z'),
        endTime: new Date('2024-02-03T18:00:00Z'),
        status: 'CONFIRMED',
        totalAmount: 8750 // 2.5 days * ₹3500
      },
      {
        vehicle: createdVehicles[3]._id, // Maruti Suzuki Brezza
        user: createdUsers[4]._id, // Vikram Reddy
        locationDetail: {
          city: 'Chennai',
          lat: 13.0827,
          lon: 80.2707,
          address: 'Anna Salai',
          state: 'Tamil Nadu',
          country: 'India'
        },
        startTime: new Date('2024-01-30T12:00:00Z'),
        endTime: new Date('2024-01-30T16:00:00Z'),
        status: 'CANCELLED',
        totalAmount: 2400 // 4 hours * ₹600
      }
    ];

    const createdBookings = await Booking.insertMany(bookings);
    console.log('✅ Bookings created');

    // Create sample payments
    const payments = [
      {
        booking: createdBookings[0]._id, // Hyundai Creta booking
        transactionId: 'TXN_CRETA_001',
        amount: 6400,
        status: 'SUCCESS',
        method: 'UPI',
        metadata: {
          upiId: 'rajesh@paytm',
          upiApp: 'Paytm'
        }
      },
      {
        booking: createdBookings[1]._id, // Kia Seltos booking
        transactionId: 'TXN_SELTOS_001',
        amount: 6400,
        status: 'SUCCESS',
        method: 'NET_BANKING',
        metadata: {
          bankName: 'HDFC Bank',
          accountLast4: '1234'
        }
      },
      {
        booking: createdBookings[2]._id, // Tata Nexon EV booking
        transactionId: 'TXN_NEXON_001',
        amount: 5400,
        status: 'PENDING',
        method: 'UPI',
        metadata: {
          upiId: 'amit@phonepe',
          upiApp: 'PhonePe'
        }
      },
      {
        booking: createdBookings[3]._id, // Hyundai Creta booking 2
        transactionId: 'TXN_CRETA_002',
        amount: 8750,
        status: 'SUCCESS',
        method: 'CREDIT_CARD',
        metadata: {
          cardLast4: '5678',
          cardBrand: 'Visa'
        }
      },
      {
        booking: createdBookings[4]._id, // Maruti Brezza booking
        transactionId: 'TXN_BREZZA_001',
        amount: 2400,
        status: 'REFUNDED',
        method: 'UPI',
        metadata: {
          upiId: 'vikram@googlepay',
          upiApp: 'Google Pay',
          refundReason: 'Customer cancellation'
        }
      }
    ];

    const createdPayments = await Payment.insertMany(payments);
    console.log('✅ Payments created');

    // Create sample reviews
    const reviews = [
      {
        booking: createdBookings[0]._id, // Hyundai Creta booking
        user: createdUsers[0]._id, // Rajesh Kumar
        rating: 5.0,
        comment: 'Excellent car! Very comfortable and fuel efficient. Perfect for Mumbai city driving. Highly recommend!'
      },
      {
        booking: createdBookings[1]._id, // Kia Seltos booking
        user: createdUsers[1]._id, // Priya Sharma
        rating: 4.5,
        comment: 'Great car with modern features. Smooth ride and good performance. Perfect for Delhi roads.'
      },
      {
        booking: createdBookings[3]._id, // Hyundai Creta booking 2
        user: createdUsers[3]._id, // Sneha Singh
        rating: 4.8,
        comment: 'Amazing experience! The car was clean and well maintained. Will definitely rent again!'
      }
    ];

    const createdReviews = await Review.insertMany(reviews);
    console.log('✅ Reviews created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log('- 5 Users (rajesh@example.com, priya@example.com, amit@example.com, sneha@example.com, vikram@example.com)');
    console.log('- 1 Vehicle Owner (Prabal Parihar - prabalsingh02@hotmail.com)');
    console.log('- 10 Vehicles (Popular Indian cars: Hyundai Creta, Kia Seltos, Tata Nexon EV, Maruti Brezza, Mahindra XUV300, Toyota Fortuner, Hyundai Venue, Kia Sonet, MG Hector, Mahindra Thar)');
    console.log('- 5 Bookings (various statuses)');
    console.log('- 5 Payments (UPI, Net Banking, Credit Card)');
    console.log('- 3 Reviews (with ratings and comments)');
    console.log('- Password for all users: password123');
    console.log('\n🏙️ Cities Covered: Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad');
    console.log('\n🚀 You can now start the server with: yarn dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('📦 Connected to MongoDB');
    return seedData();
  }).then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = seedData;
