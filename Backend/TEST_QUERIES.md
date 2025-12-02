# GraphQL API Testing Guide

## 🚀 Starting the Server

```bash
cd Backend
npm run dev
```

The server will start at `http://localhost:4000`

## 📡 Endpoint

**GraphQL Endpoint:** `http://localhost:4000/graphql`

---

## 🧪 Testing Methods

### Method 1: Using GraphiQL Online (Recommended for Beginners)

1. Visit: https://lucasconstantino.github.io/graphiql-online/
2. In the "GraphQL Endpoint" field, enter: `http://localhost:4000/graphql`
3. Copy and paste any query from below into the query editor
4. Click "Execute Query" or press `Ctrl+Enter`

---

### Method 2: Using Postman

1. **Create a new POST request**
2. **URL:** `http://localhost:4000/graphql`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body:** Select "raw" and "JSON", then paste one of the query examples below

---

### Method 3: Using cURL (Command Line)

Open Git Bash or Terminal and run:

```bash
# Get all employees
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ employees { id name age class subjects attendance { date present } } }"}'

# Get employee by ID
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ employee(id: \"1\") { id name age class subjects } }"}'

# Create employee
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { createEmployee(name: \"Alice\", age: 28, class: \"C\", subjects: [\"Math\", \"Science\"]) { id name class } }"}'

# Mark attendance
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { markAttendance(id: \"1\", date: \"2024-01-20\", present: true) { id name attendance { date present } } }"}'
```

---

### Method 4: Using Browser Console (JavaScript)

Open browser console (F12) and run:

```javascript
// Get all employees
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `{
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
    }`
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📝 Example Queries

### 1. Get All Employees

**Query:**
```graphql
query {
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
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "{ employees { id name age class subjects attendance { date present } } }"
}
```

---

### 2. Get Employee by ID

**Query:**
```graphql
query {
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
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "{ employee(id: \"1\") { id name age class subjects attendance { date present } } }"
}
```

---

### 3. Get Employees by Class

**Query:**
```graphql
query {
  employeesByClass(class: "A") {
    id
    name
    age
    class
    subjects
  }
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "{ employeesByClass(class: \"A\") { id name age class subjects } }"
}
```

---

### 4. Create Employee

**Mutation:**
```graphql
mutation {
  createEmployee(
    name: "Alice Johnson"
    age: 28
    class: "C"
    subjects: ["Mathematics", "Science", "English"]
  ) {
    id
    name
    age
    class
    subjects
  }
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "mutation { createEmployee(name: \"Alice Johnson\", age: 28, class: \"C\", subjects: [\"Mathematics\", \"Science\", \"English\"]) { id name age class subjects } }"
}
```

---

### 5. Update Employee

**Mutation:**
```graphql
mutation {
  updateEmployee(
    id: "1"
    name: "John Updated"
    age: 31
    subjects: ["Math", "Physics", "Chemistry"]
  ) {
    id
    name
    age
    class
    subjects
  }
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "mutation { updateEmployee(id: \"1\", name: \"John Updated\", age: 31, subjects: [\"Math\", \"Physics\", \"Chemistry\"]) { id name age class subjects } }"
}
```

---

### 6. Mark Attendance

**Mutation:**
```graphql
mutation {
  markAttendance(
    id: "1"
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
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "mutation { markAttendance(id: \"1\", date: \"2024-01-20\", present: true) { id name attendance { date present } } }"
}
```

---

### 7. Delete Employee

**Mutation:**
```graphql
mutation {
  deleteEmployee(id: "1") {
    id
    name
  }
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "mutation { deleteEmployee(id: \"1\") { id name } }"
}
```

---

## 📄 Pagination & Sorting

### 8. Get Employees with Pagination

**Query:**
```graphql
query {
  employees(
    pagination: { page: 1, limit: 2 }
    sort: { field: "name", order: ASC }
  ) {
    id
    name
    age
    class
  }
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "query { employees(pagination: { page: 1, limit: 2 }, sort: { field: \"name\", order: ASC }) { id name age class } }"
}
```

---

### 9. Get Employees with Pagination (Connection Pattern)

**Query:**
```graphql
query {
  employeesConnection(
    pagination: { page: 1, limit: 2 }
    sort: { field: "age", order: DESC }
  ) {
    totalCount
    pageInfo {
      currentPage
      perPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
    nodes {
      id
      name
      age
      class
    }
    edges {
      node {
        id
        name
      }
      cursor
    }
  }
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "query { employeesConnection(pagination: { page: 1, limit: 2 }, sort: { field: \"age\", order: DESC }) { totalCount pageInfo { currentPage perPage totalPages hasNextPage hasPreviousPage } nodes { id name age class } edges { node { id name } cursor } } }"
}
```

---

### 10. Get Employees by Class with Pagination and Sorting

**Query:**
```graphql
query {
  employeesByClass(
    class: "A"
    pagination: { page: 1, limit: 10 }
    sort: { field: "name", order: ASC }
  ) {
    id
    name
    age
    class
  }
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "query { employeesByClass(class: \"A\", pagination: { page: 1, limit: 10 }, sort: { field: \"name\", order: ASC }) { id name age class } }"
}
```

---

### 11. Get Employees by Class with Connection Pattern

**Query:**
```graphql
query {
  employeesByClassConnection(
    class: "A"
    pagination: { page: 1, limit: 5 }
    sort: { field: "age", order: DESC }
  ) {
    totalCount
    pageInfo {
      currentPage
      perPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
    nodes {
      id
      name
      age
      class
    }
  }
}
```

**JSON for Postman/cURL:**
```json
{
  "query": "query { employeesByClassConnection(class: \"A\", pagination: { page: 1, limit: 5 }, sort: { field: \"age\", order: DESC }) { totalCount pageInfo { currentPage perPage totalPages hasNextPage hasPreviousPage } nodes { id name age class } } }"
}
```

---

### 📋 Pagination & Sorting Options

**Pagination Input:**
- `page` (Int, default: 1): Page number (1-indexed)
- `limit` (Int, default: 10): Number of items per page
- `offset` (Int): Number of items to skip (alternative to page)

**Sort Input:**
- `field` (String, required): Field to sort by - options: `id`, `name`, `age`, `class`
- `order` (SortOrder, default: ASC): Sort order - `ASC` or `DESC`

**Example with offset:**
```graphql
query {
  employees(
    pagination: { offset: 5, limit: 3 }
    sort: { field: "age", order: DESC }
  ) {
    id
    name
    age
  }
}
```

---

## ✅ Expected Response Format

### Standard Query Response

All queries return data in this format:

```json
{
  "data": {
    "employees": [
      {
        "id": "1",
        "name": "John Doe",
        "age": 30,
        "class": "A",
        "subjects": ["Mathematics", "Science", "English"],
        "attendance": [
          {
            "date": "2024-01-15",
            "present": true
          }
        ]
      }
    ]
  }
}
```

### Paginated Connection Response

When using `employeesConnection` or `employeesByClassConnection`, the response includes pagination metadata:

```json
{
  "data": {
    "employeesConnection": {
      "totalCount": 3,
      "pageInfo": {
        "currentPage": 1,
        "perPage": 2,
        "totalPages": 2,
        "hasNextPage": true,
        "hasPreviousPage": false
      },
      "nodes": [
        {
          "id": "1",
          "name": "John Doe",
          "age": 30,
          "class": "A"
        },
        {
          "id": "2",
          "name": "Jane Smith",
          "age": 25,
          "class": "B"
        }
      ],
      "edges": [
        {
          "node": {
            "id": "1",
            "name": "John Doe"
          },
          "cursor": "1"
        },
        {
          "node": {
            "id": "2",
            "name": "Jane Smith"
          },
          "cursor": "2"
        }
      ]
    }
  }
}
```

If there's an error:

```json
{
  "errors": [
    {
      "message": "Employee not found"
    }
  ]
}
```

---

## 🎯 Quick Test Checklist

- [ ] Server is running (`npm run dev`)
- [ ] Health check works: `http://localhost:4000/health`
- [ ] Can query all employees
- [ ] Can query employee by ID
- [ ] Can create a new employee
- [ ] Can update an employee
- [ ] Can mark attendance
- [ ] Can delete an employee
- [ ] Can query employees with pagination
- [ ] Can query employees with sorting
- [ ] Can use employeesConnection for paginated results
- [ ] Can query employeesByClass with pagination and sorting

---

## 💡 Tips

1. **GraphiQL Online** is the easiest way to test - it provides autocomplete and syntax highlighting
2. **Postman** is great for saving and organizing your queries
3. **cURL** is useful for scripting and automation
4. Always check the server console for any errors
5. Use the health endpoint to verify the server is running

