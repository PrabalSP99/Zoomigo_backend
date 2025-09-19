// Load environment variables first
require('dotenv').config();

const { sendBookingConfirmationEmail, sendCustomerBookingConfirmationEmail } = require('./services/emailService');

// Test data for email functionality
const testBookingData = {
  vehicle: {
    brand: 'Honda',
    model: 'City',
    year: 2023,
    licensePlate: 'MH01AB1234'
  },
  startTime: new Date('2024-01-15T10:00:00Z'),
  endTime: new Date('2024-01-15T18:00:00Z'),
  totalAmount: 2500,
  locationDetail: {
    city: 'Mumbai',
    address: '123 MG Road, Mumbai, Maharashtra'
  }
};

const testVehicleOwner = {
  name: 'Rajesh Kumar',
  email: 'aprabal257730@gmail.com',
  mobile: '+91-9876543210'
};

const testCustomer = {
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91-9876543211'
};

async function testEmailNotifications() {
  console.log('🧪 Testing SendGrid Email Notifications...\n');
  
  // Check if SendGrid API key is configured
  console.log('📋 Environment Check:');
  console.log('  - SENDGRID_API_KEY present:', !!process.env.SENDGRID_API_KEY);
  console.log('  - SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
  console.log('  - API Key starts with SG:', process.env.SENDGRID_API_KEY?.startsWith('SG.'));
  console.log('');
  
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not configured in environment variables');
    console.log('Please add SENDGRID_API_KEY to your .env file');
    return;
  }
  
  try {
    console.log('📧 Testing vehicle owner notification email...');
    const ownerResult = await sendBookingConfirmationEmail(
      testBookingData,
      testVehicleOwner,
      testCustomer
    );
    
    if (ownerResult.success) {
      console.log('✅ Vehicle owner email sent successfully!');
    } else {
      console.log('❌ Vehicle owner email failed:', ownerResult.message);
    }
    
    console.log('\n📧 Testing customer notification email...');
    const customerResult = await sendCustomerBookingConfirmationEmail(
      testBookingData,
      testCustomer
    );
    
    if (customerResult.success) {
      console.log('✅ Customer email sent successfully!');
    } else {
      console.log('❌ Customer email failed:', customerResult.message);
    }
    
    console.log('\n🎉 Email notification test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testEmailNotifications();
}

module.exports = { testEmailNotifications };
