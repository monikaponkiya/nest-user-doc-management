# User Document Management

User Doc Management is a NestJS-based backend application that provides authentication, role-based access control, user management and document management features. It integrates mock service for document ingestion and retrieval.

## Purpose

The goal of this project is to develop a backend system that manages user authentication, document storage, and ingestion tracking using NestJS. It includes key APIs for handling user roles, document uploads, and communication with a mock-based ingestion service.

### Features

- User Authentication: Register, login, logout with JWT-based authentication.

- Role-Based Access Control: Supports Admin, Editor, and Viewer roles.

- User Management APIs: Admin functionalities for managing users, roles, and permissions.

- Document Management APIs: CRUD operations for document storage and retrieval.

- Ingestion Trigger API: Triggers document ingestion in the mock service.

- Ingestion Management API: Tracks ingestion status and manages ongoing processes.

- API Documentation: Auto-generated using Swagger.

### Tools & Technologies

- NestJS - Node.js framework for scalable backend development

- TypeScript - Ensures strong type safety

- PostgreSQL - Relational database for document and user storage

- TypeORM - ORM for database interactions

- JWT - Secure authentication and authorization handling

- Swagger - API documentation generation

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>=16.0.0)

- PostgreSQL

### Creating the Project with NestJS CLI

1. Clone the project Repository:

```js
git clone https://github.com/monikaponkiya/nest-user-doc-management
```

2. Navigate to the project directory:

```js
cd nest-user-doc-management
```

3. Install dependencies:

```js
npm install
```

### Environment Variable Configuration

Create a `.env` file in the root directory and configure the following:

```js
APP_ENV=development
APP_VERSION=1.0
APP_NAME=User_Doc_Management
APP_PORT=3000
APP_ENABLE_CORS=true
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=user_doc_management
DATABASE_USER=postgres
DATABASE_PASS=root
JWT_TOKEN_SECRET=SECRET_KEY
JWT_TONE_EXPIRY_TIME=10d
APP_THROTTLER_TTL_TIME=60
APP_THROTTLER_REQUEST_COUNT=10
ADMIN_USER=admin@gmail.com
ADMIN_PASSWORD=Admin@123
```

### Database Setup

If using local PostgreSQL, ensure your database is running and configured in .env.

```js
- Ensure PostgreSQL is installed and running.

- Create a database named user_doc_management.

- Update the .env file with the correct database credentials.
```

### Running the Application

To start the development server:

```js
npm run start
```

### API Documentation

Swagger documentation is available at:

```js
The application will be available at http://localhost:3000
```

### Project Structure

```js
nest-user-doc-management/
│── src/
│   ├── common/            # Shared utilities, constants, and decorators
│   ├── config/            # Application configuration
│   ├── migration/         # Database migration files
│   ├── module/
│   │   ├── users/         # User management
│   │   ├── documents/     # Document management
│   │   ├── mock/          # Mocking service for ingestion
│   ├── provider/          # Database providers
│   ├── security/
│   │   ├── auth/          # Authentication & JWT handling
│   │   ├── throttle/      # Rate limiting
│   ├── main.ts            # Application entry point
│── test/                  # Unit & e2e tests
│── .env.example           # Sample environment variables
│── package.json           # Project dependencies
│── README.md              # Documentation
```

### Testing

```js
npm run test
```

### Contributing

1. Fork the repository

2. Create a branch (git checkout -b feature-name)

3. Commit changes (git commit -m 'Add new feature')

4. Push to branch (git push origin feature-name)

5. Open a pull request

6. Merge pull request to Master branch

### Contact

For support or inquiries, contact monikaponkiya3@gmail.com
