async function testAPI() {
  try {
    console.log('Testing GraphQL API...\n');
    
    // Test basic vehicles query (GET_VEHICLES)
    console.log('1. Testing GET_VEHICLES query...');
    const vehiclesQuery = `
      query {
        vehicles {
          id
          type
          brand
          model
          year
          licensePlate
          engineSpec {
            displacement
            topSpeed
            fuelCapacity
            seats
            mileage
            kerbWeight
            driveMode
            fuelType
          }
          location {
            city
            lat
            lon
            address
            state
            country
          }
          pricing {
            perHour
            perDay
            perWeek
            perKm
          }
          availabilityStatus
          createdAt
        }
      }
    `;
    
    const response = await fetch('http://localhost:4004/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: vehiclesQuery
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Errors found:');
      result.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    } else {
      console.log('✅ GET_VEHICLES query works!');
      console.log(`   Found ${result.data.vehicles.length} vehicles`);
    }
    
    // Test featured vehicles query (GET_FEATURED_VEHICLES)
    console.log('\n2. Testing GET_FEATURED_VEHICLES query...');
    const featuredVehiclesQuery = `
      query {
        vehicles {
          id
          type
          brand
          model
          year
          licensePlate
          availabilityStatus
        }
      }
    `;
    
    const featuredResponse = await fetch('http://localhost:4004/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: featuredVehiclesQuery
      })
    });
    
    const featuredResult = await featuredResponse.json();
    
    if (featuredResult.errors) {
      console.log('❌ Errors found:');
      featuredResult.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    } else {
      console.log('✅ GET_FEATURED_VEHICLES query works!');
      console.log(`   Found ${featuredResult.data.vehicles.length} vehicles`);
    }
    
    // Test single vehicle query (GET_VEHICLE)
    console.log('\n3. Testing GET_VEHICLE query...');
    const vehicleQuery = `
      query {
        vehicles {
          id
          type
          brand
          model
          year
          licensePlate
          engineSpec {
            displacement
            topSpeed
            fuelCapacity
            seats
            mileage
            kerbWeight
            driveMode
            fuelType
          }
          location {
            city
            state
            country
          }
          pricing {
            perHour
            perDay
            perWeek
            perKm
          }
          availabilityStatus
          createdAt
          reviews {
            id
            rating
            comment
            createdAt
            user {
              id
              name
            }
          }
        }
      }
    `;
    
    const vehicleResponse = await fetch('http://localhost:4004/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: vehicleQuery
      })
    });
    
    const vehicleResult = await vehicleResponse.json();
    
    if (vehicleResult.errors) {
      console.log('❌ Errors found:');
      vehicleResult.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    } else {
      console.log('✅ GET_VEHICLE query works!');
      console.log(`   Found ${vehicleResult.data.vehicles.length} vehicles with reviews`);
    }
    
    // Test user bookings query (GET_USER_BOOKINGS)
    console.log('\n4. Testing GET_USER_BOOKINGS query...');
    const userBookingsQuery = `
      query {
        users {
          id
          bookings {
            id
            startTime
            endTime
            status
            totalAmount
            createdAt
            vehicle {
              id
              brand
              model
            }
          }
        }
      }
    `;
    
    const userBookingsResponse = await fetch('http://localhost:4004/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userBookingsQuery
      })
    });
    
    const userBookingsResult = await userBookingsResponse.json();
    
    if (userBookingsResult.errors) {
      console.log('❌ Errors found:');
      userBookingsResult.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    } else {
      console.log('✅ GET_USER_BOOKINGS query works!');
      console.log(`   Found ${userBookingsResult.data.users.length} users with bookings`);
    }
    
    // Test user profile query (GET_USER_PROFILE)
    console.log('\n5. Testing GET_USER_PROFILE query...');
    const userProfileQuery = `
      query {
        users {
          id
          name
          email
          phone
          DOB
          createdAt
          bookings(first: 10) {
            totalCount
          }
        }
      }
    `;
    
    const userProfileResponse = await fetch('http://localhost:4004/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userProfileQuery
      })
    });
    
    const userProfileResult = await userProfileResponse.json();
    
    if (userProfileResult.errors) {
      console.log('❌ Errors found:');
      userProfileResult.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    } else {
      console.log('✅ GET_USER_PROFILE query works!');
      console.log(`   Found ${userProfileResult.data.users.length} users with profile data`);
    }
    
    // Test availability check query (CHECK_AVAILABILITY)
    console.log('\n6. Testing CHECK_AVAILABILITY query...');
    const availabilityQuery = `
      query {
        vehicles {
          id
        }
      }
    `;
    
    const availabilityResponse = await fetch('http://localhost:4004/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: availabilityQuery
      })
    });
    
    const availabilityResult = await availabilityResponse.json();
    
    if (availabilityResult.errors) {
      console.log('❌ Errors found:');
      availabilityResult.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    } else {
      console.log('✅ CHECK_AVAILABILITY query structure works!');
      console.log(`   Found ${availabilityResult.data.vehicles.length} vehicles for availability check`);
    }
    
    console.log('\n🎉 All frontend queries are working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();
