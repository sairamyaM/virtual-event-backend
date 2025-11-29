#  Virtual Event Management Backend

A complete backend system for managing **virtual events**, featuring secure **user authentication**, **event CRUD**, **participant registration**, and **email notifications**.  
Built with **Node.js, Express, MongoDB**, and fully tested using **Jest + Supertest + MongoDB Memory Server**.

## Features

### User Authentication
- Register as **Organizer** or **Attendee**
- Login using JWT authentication
- Passwords securely hashed using **bcryptjs**
- Role-based route protection

### Event Management
- Organizers can:
  - Create events
  - Update events
  - Delete events
  - View their events
- Stored in MongoDB

## Participant Registration
- Attendees can:
  - Register for events
  - Avoid duplicate registrations
- Organizer cannot register for their own event

### Email Notifications
- Email is sent to users on successful registration  
- Uses **Ethereal email** for testing  
- Automatically disabled during Jest tests

### Automated Testing
- 12 complete test suites using:
  - Jest  
  - Supertest  
  - MongoDB Memory Server  
- Includes authentication, CRUD, and registration tests
