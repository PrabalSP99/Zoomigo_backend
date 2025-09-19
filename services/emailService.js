const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key from environment variables
console.log("API Key present?", !!process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send booking confirmation email to vehicle owner
 * @param {Object} bookingData - Complete booking data with populated fields
 * @param {Object} vehicleOwner - Vehicle owner details
 * @param {Object} customer - Customer details
 */
const sendBookingConfirmationEmail = async (bookingData, vehicleOwner, customer) => {
  try {
    const { vehicle, startTime, endTime, totalAmount, locationDetail } = bookingData;
    
    // Format dates for display
    const startDate = new Date(startTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endDate = new Date(endTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Calculate duration
    const durationMs = new Date(endTime) - new Date(startTime);
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    let durationText;
    if (durationHours <= 24) {
      durationText = `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
    } else {
      durationText = `${durationDays} day${durationDays > 1 ? 's' : ''}`;
    }

    console.log('📧 Sending email to vehicle owner:', vehicleOwner.email);
    console.log('📧 From address:', process.env.SENDGRID_FROM_EMAIL || 'praby.code@gmail.com');
    console.log('📧 Subject:', `New Booking Confirmation - ${vehicle.brand} ${vehicle.model}`);

    const msg = {
      to: vehicleOwner.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'praby.code@gmail.com',
        name: 'BadhoSa Vehicle Rental'
      },
      subject: `New Booking Confirmation - ${vehicle.brand} ${vehicle.model}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
            }
            .booking-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              padding: 5px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #555;
            }
            .detail-value {
              color: #333;
            }
            .amount {
              font-size: 18px;
              font-weight: bold;
              color: #28a745;
            }
            .customer-info {
              background-color: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
            .highlight {
              background-color: #fff3cd;
              padding: 10px;
              border-radius: 5px;
              border-left: 4px solid #ffc107;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚗 BadhoSa</div>
              <h1>New Vehicle Booking Confirmation</h1>
            </div>
            
            <div class="highlight">
              <strong>🎉 Congratulations!</strong> Your vehicle has been booked and payment has been completed successfully.
            </div>

            <h2>Booking Details</h2>
            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Vehicle:</span>
                <span class="detail-value">${vehicle.brand} ${vehicle.model} (${vehicle.year})</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">License Plate:</span>
                <span class="detail-value">${vehicle.licensePlate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pickup Location:</span>
                <span class="detail-value">${locationDetail.address || locationDetail.city}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Start Time:</span>
                <span class="detail-value">${startDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">End Time:</span>
                <span class="detail-value">${endDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${durationText}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value amount">₹${totalAmount}</span>
              </div>
            </div>

            <h2>Customer Information</h2>
            <div class="customer-info">
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${customer.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${customer.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${customer.phone || 'Not provided'}</span>
              </div>
            </div>

            <div class="highlight">
              <strong>📞 Contact Customer:</strong> You can reach out to the customer using the contact information provided above if needed.
            </div>

            <div class="footer">
              <p>Thank you for using BadhoSa Vehicle Rental Platform!</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
              <p>For support, contact us at support@badhosa.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Vehicle Booking Confirmation - ${vehicle.brand} ${vehicle.model}
        
        Congratulations! Your vehicle has been booked and payment has been completed successfully.
        
        Booking Details:
        - Vehicle: ${vehicle.brand} ${vehicle.model} (${vehicle.year})
        - License Plate: ${vehicle.licensePlate}
        - Pickup Location: ${locationDetail.address || locationDetail.city}
        - Start Time: ${startDate}
        - End Time: ${endDate}
        - Duration: ${durationText}
        - Total Amount: ₹${totalAmount}
        
        Customer Information:
        - Name: ${customer.name}
        - Email: ${customer.email}
        - Phone: ${customer.phone || 'Not provided'}
        
        Thank you for using BadhoSa Vehicle Rental Platform!
        
        This is an automated notification. For support, contact us at support@badhosa.com
      `
    };

    await sgMail.send(msg);
    console.log(`✅ Booking confirmation email sent to vehicle owner: ${vehicleOwner.email}`);
    return { success: true, message: 'Email sent successfully' };
    
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send booking confirmation email to customer
 * @param {Object} bookingData - Complete booking data with populated fields
 * @param {Object} customer - Customer details
 */
const sendCustomerBookingConfirmationEmail = async (bookingData, customer) => {
  try {
    const { vehicle, startTime, endTime, totalAmount, locationDetail } = bookingData;
    
    // Format dates for display
    const startDate = new Date(startTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endDate = new Date(endTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Calculate duration
    const durationMs = new Date(endTime) - new Date(startTime);
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    let durationText;
    if (durationHours <= 24) {
      durationText = `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
    } else {
      durationText = `${durationDays} day${durationDays > 1 ? 's' : ''}`;
    }

    console.log('📧 Sending email to customer:', customer.email);
    console.log('📧 From address:', process.env.SENDGRID_FROM_EMAIL || 'praby.code@gmail.com');
    console.log('📧 Subject:', `Booking Confirmed - ${vehicle.brand} ${vehicle.model}`);

    const msg = {
      to: customer.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'praby.code@gmail.com',
        name: 'BadhoSa Vehicle Rental'
      },
      subject: `Booking Confirmed - ${vehicle.brand} ${vehicle.model}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
            }
            .booking-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              padding: 5px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #555;
            }
            .detail-value {
              color: #333;
            }
            .amount {
              font-size: 18px;
              font-weight: bold;
              color: #28a745;
            }
            .success {
              background-color: #d4edda;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #28a745;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚗 BadhoSa</div>
              <h1>Booking Confirmed!</h1>
            </div>
            
            <div class="success">
              <strong>✅ Payment Successful!</strong> Your vehicle booking has been confirmed and payment has been processed.
            </div>

            <h2>Your Booking Details</h2>
            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Vehicle:</span>
                <span class="detail-value">${vehicle.brand} ${vehicle.model} (${vehicle.year})</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">License Plate:</span>
                <span class="detail-value">${vehicle.licensePlate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pickup Location:</span>
                <span class="detail-value">${locationDetail.address || locationDetail.city}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Start Time:</span>
                <span class="detail-value">${startDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">End Time:</span>
                <span class="detail-value">${endDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${durationText}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value amount">₹${totalAmount}</span>
              </div>
            </div>

            <div class="success">
              <strong>📱 Next Steps:</strong> 
              <ul>
                <li>Arrive at the pickup location on time</li>
                <li>Bring a valid driving license</li>
                <li>Contact the vehicle owner if you have any questions</li>
              </ul>
            </div>

            <div class="footer">
              <p>Thank you for choosing BadhoSa Vehicle Rental!</p>
              <p>Have a safe and enjoyable ride!</p>
              <p>For support, contact us at support@badhosa.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Booking Confirmed - ${vehicle.brand} ${vehicle.model}
        
        Payment Successful! Your vehicle booking has been confirmed and payment has been processed.
        
        Your Booking Details:
        - Vehicle: ${vehicle.brand} ${vehicle.model} (${vehicle.year})
        - License Plate: ${vehicle.licensePlate}
        - Pickup Location: ${locationDetail.address || locationDetail.city}
        - Start Time: ${startDate}
        - End Time: ${endDate}
        - Duration: ${durationText}
        - Total Amount: ₹${totalAmount}
        
        Next Steps:
        - Arrive at the pickup location on time
        - Bring a valid driving license
        - Contact the vehicle owner if you have any questions
        
        Thank you for choosing BadhoSa Vehicle Rental!
        Have a safe and enjoyable ride!
        
        For support, contact us at support@badhosa.com
      `
    };

    await sgMail.send(msg);
    console.log(`✅ Booking confirmation email sent to customer: ${customer.email}`);
    return { success: true, message: 'Email sent successfully' };
    
  } catch (error) {
    console.error('❌ Error sending customer booking confirmation email:', error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendCustomerBookingConfirmationEmail
};
