User Authentication & Organisation
## Overview
This project implements a user authentication system with organisation management. It includes
user registration, login, and managing user and organisation data.
## Acceptance Criteria
### Database and Models
- **Database**: Connect to a Postgres database server (use any ORM if preferred).
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
Tests should be in the tests/ folder (e.g., tests/auth.spec.ts for TypeScript).
