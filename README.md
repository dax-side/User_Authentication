User Authentication & Organisation
## Overview
This project implements a user authentication system with organisation management. It includes
user registration, login, and managing user and organisation data.
## Technologies Used
- **Node.js**: JavaScript runtime to build the backend.
- **Express**: Web framework for building the RESTful API.
- **MySQL**: Relational database used to store user and organisation data.
- **JWT (JSON Web Tokens)**: For secure user authentication and authorization.
- **Bcrypt.js**: For password hashing.
- **Jest & Supertest**: For unit and integration testing.
- **Sequelize (optional)**: ORM for managing the MySQL database (if used).
## API Endpoints

### 1. **Login to the Database**
**POST** `/auth/login`  
Content-Type: `application/json`

#### Request Body:
```json
{
    "email":"jane.smith@example.com",
    "password": "PASSword@456"
}
```

```json
{
  "status": "success",
  "message": "login successful",
  "user": {
    "userId": 1,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "$2a$12$ACEOiSzGpYGF3vIEzrHLZOwjlb0rCuuvBKudX9zfX1ZxbjGkIdzDi",
    "phone": "9876543210"
  },
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqYW5lLnNtaXRoQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM3MDcwNDE4LCJleHAiOjE3MzcwNzQwMTh9.PAgzMK0awh8MQmrvx3xVeK5hfVicRSOqLVv_LHrC2ok"
  }
}
```


### 2. **Get User**
**GET** `/auth/user/{userId}`  
Content-Type: `application/json`  
Authorization: Bearer `<JWT_TOKEN>`

```json
{
  "status": "success",
  "message": "User record retrieved",
  "data": {
    "userId": 2,
    "firstName": "Samuel",
    "lastName": "Adams",
    "email": "sam.adams@example.com",
    "phone": "5647382910"
  }
}
```

### 3. **Get All Organisations**
**GET** `/api/organisations`  
Content-Type: `application/json`  
Authorization: Bearer `<JWT_TOKEN>`

```json
{
  "status": "success",
  "message": "Organisations retrieved successfully",
  "data": {
    "organisations": [
      {
        "orgId": 2,
        "name": "Samuel's organisation",
        "description": "Samuel's personal organisation",
        "auth_users": [
          {
            "userId": 2,
            "firstName": "Samuel",
            "email": "sam.adams@example.com"
          }
        ]
      },
      {
        "orgId": 4,
        "name": "New Organisation",
        "description": "This is my new organisation",
        "auth_users": [
          {
            "userId": 2,
            "firstName": "Samuel",
            "email": "sam.adams@example.com"
          }
        ]
      }
    ]
  }
}
```

### 4. **Create Organisation**
**POST** `/api/organisations`  
Content-Type: `application/json`  
Authorization: Bearer `<JWT_TOKEN>`

#### Request Body:
```json
{
    "name": "My Organisation",
    "description": "This is my new organisation"
}
```

```json
{
  "status": "success",
  "message": "Organisation created successfully",
  "data": {
    "orgId": 4,
    "name": "New Organisation",
    "description": "This is my new organisation"
  }
}
```

### 5. **Add User to Organisation**
**POST** `/api/organisations/{orgId}/users`  
Content-Type: `application/json`  
Authorization: Bearer `<JWT_TOKEN>`

#### Request Body:
```json
{
    "userId": "3"
}
```

```json
{
  "status": "success",
  "message": "User added to Organisation successfully"
}
```

### 6. **Get Single Organisation**
**GET** `/api/organisations/{orgId}`  
Content-Type: `application/json`  
Authorization: Bearer `<JWT_TOKEN>`

```json
{
  "status": "success",
  "message": "Organisation retrieved successfully",
  "data": {
    "orgId": 1,
    "name": "Jane's organisation",
    "description": "Jane's personal organisation"
  }
}
```

### 7. **Register User**
**POST** `/auth/register`  
Content-Type: `application/json`

#### Request Body:
```json
{
    "firstName": "nJohn",
    "lastName": "nDoe",
    "email": "njohn.doe@example.com",
    "password": "NSecurePassword123",
    "phone": "21234567890"
}
```

Additional User Examples:

```json
{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "password@456",
    "phone": "9876543210"
}
```

```json
{
    "firstName": "Samuel",
    "lastName": "Adams",
    "email": "sam.adams@example.com",
    "password": "SamStrog789",
    "phone": "5647382910"
}
```


## Acceptance Criteria
### Database and Models
- **Database**: Connect to a Postgres or MySQL database server (use any ORM if preferred).
- **User Model**: Include properties:
 - `userId` (unique)
 - `firstName` (required)
 - `lastName` (required)
 - `email` (unique, required)
 - `password` (required)
 - `phone` (optional)
- **Validation**: Return a `422` status code with error details when validation fails:
```json
{
 "errors": [
 {
 "field": "string",
 "message": "string"
 }
 ]
}
```
### User Authentication
- **Registration**: Hash the password before storing it. On success, return a 201 status code with
user details and an accessToken.
- **Login**: Log in with email and password. Return a 200 status code with user details and
accessToken on success.
### Organisation Model
- **Organisation**: Each user is assigned to an organisation upon registration. The organisation
name is based on the user's first name (e.g., "John's Organisation").
#### Organisation Endpoints:
- GET /api/organisations: Get organisations the user belongs to.
- GET /api/organisations/:orgId: Get a specific organisation.
- POST /api/organisations: Create a new organisation.
- POST /api/organisations/:orgId/users: Add a user to an organisation.
### Protected Routes
The following endpoints are protected and require JWT tokens:
- GET /api/users/:id: User details.
- GET /api/organisations: All organisations the user belongs to.
- GET /api/organisations/:orgId: A single organisation's details.
- POST /api/organisations: Create an organisation.
- POST /api/organisations/:orgId/users: Add a user to an organisation.
### Unit Testing
Test for:
- Token expiration and user details.
- Organisation access control.
- Registration and validation errors.
- Duplicate emails/user IDs.
### End-to-End Test Requirements
- **Successful Registration**: Ensure the /auth/register endpoint works as expected.
- **Login Success**: Ensure valid credentials return the correct response.
- **Missing Fields**: Test missing required fields.
- **Duplicate Email/UserID**: Test duplicate registration.
### Directory Structure
Tests should be in the tests/ folder (e.g., tests/auth.spec.ts for TypeScript ).
