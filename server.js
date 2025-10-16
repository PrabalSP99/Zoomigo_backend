const express = require('express');
const { ApolloServer } = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const cors = require('cors');
require('dotenv').config();

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-here-make-it-long-and-random-for-development-only';
  console.log('Warning: Using default JWT_SECRET. Please set JWT_SECRET in your environment variables for production.');
}

const connectDB = require('./config/database');
const typeDefs = require('./schemas/schema');
const resolvers = require('./resolvers');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4004;

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['https://www.badhosa.com'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add explicit CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['https://www.badhosa.com'];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    try {
      const user = await auth(req);
      return { user };
    } catch (error) {
      return { user: null };
    }
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      path: error.path
    };
  }
});

// Start server
async function startServer() {
  await server.start();
  
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      try {
        const user = await auth(req);
        return { user };
      } catch (error) {
        return { user: null };
      }
    }
  }));

  app.get('/', (req, res) => {
    res.json({
      message: 'Vehicle Rental API',
      graphqlEndpoint: '/graphql',
      status: 'Running'
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
