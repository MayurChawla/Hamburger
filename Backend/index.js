const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const schema = require('./graphql/schema');
const { authenticate } = require('./middleware/auth');
const { errorHandler } = require('./utils/errors');
const { apiLimiter } = require('./middleware/rateLimiter');
const { initializeDatabase } = require('./database/connection');
const { runMigrations } = require('./database/migrate');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Rate limiting
app.use('/graphql', apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Authentication middleware (adds user to request if token is present)
app.use(authenticate);

// GraphQL endpoint
app.post('/graphql', createHandler({
  schema,
  context: async (req) => {
    return {
      user: req.user || null,
      req,
    };
  },
  formatError: (error) => {
    logger.error('GraphQL Error:', {
      message: error.message,
      path: error.path,
      extensions: error.extensions,
    });

    // Don't expose internal errors in production
    if (config.env === 'production' && !error.extensions?.code) {
      return {
        message: 'Internal server error',
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      };
    }

    return {
      message: error.message,
      extensions: error.extensions,
      path: error.path,
    };
  },
}));

// GraphQL GET endpoint with simple query interface
app.get('/graphql', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>GraphQL Query Interface</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 { font-size: 2em; margin-bottom: 10px; }
        .content {
          padding: 30px;
        }
        .query-section {
          margin-bottom: 30px;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        textarea {
          width: 100%;
          min-height: 200px;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          resize: vertical;
        }
        textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        button {
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }
        .btn-secondary:hover {
          background: #e0e0e0;
        }
        .response-section {
          margin-top: 30px;
        }
        .response-box {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 20px;
          border-radius: 8px;
          min-height: 200px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .loading {
          color: #667eea;
          text-align: center;
          padding: 20px;
        }
        .error {
          color: #ff6b6b;
        }
        .success {
          color: #51cf66;
        }
        .examples {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .examples h3 {
          margin-bottom: 15px;
          color: #333;
        }
        .example-btn {
          display: inline-block;
          margin: 5px;
          padding: 8px 15px;
          background: white;
          border: 2px solid #667eea;
          color: #667eea;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }
        .example-btn:hover {
          background: #667eea;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 GraphQL Query Interface</h1>
          <p>Test your GraphQL queries directly in the browser</p>
        </div>
        <div class="content">
          <div class="query-section">
            <label for="query">Enter your GraphQL Query:</label>
            <textarea id="query" placeholder="query { employees { id name age class subjects } }">query {
  employees {
    id
    name
    age
    class
    subjects
    attendance {
      date
      present
    }
  }
}</textarea>
            <div class="button-group">
              <button class="btn-primary" onclick="executeQuery()">Execute Query</button>
              <button class="btn-secondary" onclick="clearResponse()">Clear</button>
            </div>
          </div>

          <div class="examples">
            <h3>📝 Quick Examples:</h3>
            <button class="example-btn" onclick="loadExample('employees')">Get All Employees</button>
            <button class="example-btn" onclick="loadExample('employee')">Get Employee by ID</button>
            <button class="example-btn" onclick="loadExample('create')">Create Employee</button>
            <button class="example-btn" onclick="loadExample('attendance')">Mark Attendance</button>
            <button class="example-btn" onclick="loadExample('update')">Update Employee</button>
          </div>

          <div class="response-section">
            <label>Response:</label>
            <div id="response" class="response-box">Response will appear here...</div>
          </div>
        </div>
      </div>

      <script>
        const examples = {
          employees: \`query {
  employees {
    id
    name
    age
    class
    subjects
    attendance {
      date
      present
    }
  }
}\`,
          employee: \`query {
  employee(id: "1") {
    id
    name
    age
    class
    subjects
    attendance {
      date
      present
    }
  }
}\`,
          create: \`mutation {
  createEmployee(
    input: {
      name: "Alice Johnson"
      email: "alice@example.com"
      department: "Engineering"
      position: "Developer"
      salary: 80000
      startDate: "2024-01-20"
      age: 28
      class: "C"
      subjects: ["Mathematics", "Science", "English"]
    }
  ) {
    id
    name
    age
    class
    subjects
  }
}\`,
          attendance: \`mutation {
  markAttendance(
    employeeId: "1"
    date: "2024-01-20"
    present: true
  ) {
    id
    name
    attendance {
      date
      present
    }
  }
}\`,
          update: \`mutation {
  updateEmployee(
    id: "1"
    input: {
      name: "John Updated"
      age: 31
      subjects: ["Math", "Physics"]
    }
  ) {
    id
    name
    age
    class
    subjects
  }
}\`
        };

        function loadExample(type) {
          document.getElementById('query').value = examples[type];
        }

        function clearResponse() {
          document.getElementById('response').textContent = 'Response will appear here...';
          document.getElementById('response').className = 'response-box';
        }

        async function executeQuery() {
          const query = document.getElementById('query').value.trim();
          const responseBox = document.getElementById('response');
          
          if (!query) {
            responseBox.textContent = 'Error: Please enter a query';
            responseBox.className = 'response-box error';
            return;
          }

          responseBox.textContent = 'Loading...';
          responseBox.className = 'response-box loading';

          try {
            const response = await fetch('/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query })
            });

            const data = await response.json();
            
            if (data.errors) {
              responseBox.textContent = JSON.stringify(data, null, 2);
              responseBox.className = 'response-box error';
            } else {
              responseBox.textContent = JSON.stringify(data, null, 2);
              responseBox.className = 'response-box success';
            }
          } catch (error) {
            responseBox.textContent = 'Error: ' + error.message;
            responseBox.className = 'response-box error';
          }
        }

        // Allow Ctrl+Enter to execute query
        document.getElementById('query').addEventListener('keydown', function(e) {
          if (e.ctrlKey && e.key === 'Enter') {
            executeQuery();
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GraphQL API is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>GraphQL API - Employee Management</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        .endpoint {
          background: #f0f0f0;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          font-family: monospace;
        }
        .example {
          background: #e8f4f8;
          padding: 15px;
          border-left: 4px solid #2196F3;
          margin: 15px 0;
        }
        code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
        }
        pre {
          background: #2d2d2d;
          color: #f8f8f2;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
        }
        a {
          color: #2196F3;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 GraphQL API - Employee Management</h1>
        <p>Your GraphQL server is running! Use one of the methods below to test your queries.</p>
        
        <h2>📡 GraphQL Endpoint</h2>
        <div class="endpoint">
          <strong>POST</strong> http://localhost:${config.port}/graphql
        </div>

        <h2>🧪 Testing Methods</h2>
        
        <h3>1. Using GraphiQL Online</h3>
        <p>Visit: <a href="https://lucasconstantino.github.io/graphiql-online/" target="_blank">GraphiQL Online</a></p>
        <p>Set the endpoint URL to: <code>http://localhost:${config.port}/graphql</code></p>

        <h3>2. Using Postman</h3>
        <ul>
          <li>Create a new POST request</li>
          <li>URL: <code>http://localhost:${config.port}/graphql</code></li>
          <li>Headers: <code>Content-Type: application/json</code></li>
          <li>Body (raw JSON): See examples below</li>
        </ul>

        <h3>3. Using cURL (Command Line)</h3>
        <p>See examples in the <code>TEST_QUERIES.md</code> file</p>

        <h2>📝 Example Queries</h2>
        
        <div class="example">
          <h4>Query: Get All Employees</h4>
          <pre>{
  "query": "query { employees { id name age class subjects attendance { date present } } }"
}</pre>
        </div>

        <div class="example">
          <h4>Query: Get Employee by ID</h4>
          <pre>{
  "query": "query { employee(id: \\"1\\") { id name age class subjects } }"
}</pre>
        </div>

        <div class="example">
          <h4>Mutation: Create Employee</h4>
          <pre>{
  "query": "mutation { createEmployee(input: { name: \\"Alice\\", email: \\"alice@example.com\\", department: \\"Engineering\\", position: \\"Developer\\", salary: 80000, startDate: \\"2024-01-20\\" }) { id name } }"
}</pre>
        </div>

        <h2>✅ Health Check</h2>
        <p>Visit: <a href="/health">http://localhost:${config.port}/health</a></p>
      </div>
    </body>
    </html>
  `);
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Run migrations
    await runMigrations();
    
    // Start server
    app.listen(config.port, () => {
      logger.info(`🚀 GraphQL server is running on http://localhost:${config.port}/graphql`);
      logger.info(`📊 Health check: http://localhost:${config.port}/health`);
      logger.info(`🌐 API Documentation: http://localhost:${config.port}/`);
      logger.info(`📝 Environment: ${config.env}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  const { closeDatabase } = require('./database/connection');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  const { closeDatabase } = require('./database/connection');
  await closeDatabase();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
