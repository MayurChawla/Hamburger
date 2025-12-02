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

## ✅ Expected Response Format

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

---

## 💡 Tips

1. **GraphiQL Online** is the easiest way to test - it provides autocomplete and syntax highlighting
2. **Postman** is great for saving and organizing your queries
3. **cURL** is useful for scripting and automation
4. Always check the server console for any errors
5. Use the health endpoint to verify the server is running

