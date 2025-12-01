const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { schema } = require('./schema');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// GraphQL endpoint
app.all('/graphql', createHandler({ schema }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'GraphQL API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GraphQL server is running on http://localhost:${PORT}/graphql`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

