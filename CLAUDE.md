# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a NestJS application for a Real Estate Visitor/Gate Entry Management System. The system manages visitor access through QR codes with role-based permissions for estate managers, occupants, and gatemen.

### Core Modules
- **Auth Module**: JWT-based authentication with role-based access control
- **User Module**: User and role management (admin, occupant, gateman roles)
- **House Module**: Property/house management with public view IDs
- **Gate Module**: Visitor entry management, QR code generation, approval workflows

### Database
- Uses TypeORM with MySQL
- Entities are located in `src/**/entities/` directories
- Migrations are in `src/**/migrations/` directories
- Database configuration in `src/datasource.ts` and `src/app.module.ts`

### Key Features
- Role-based access control using decorators and guards
- Automated daily cleanup of expired visitor entries via scheduled jobs
- QR code generation for visitor validation
- Email notifications for onboarding and approvals
- Swagger API documentation available at `/api/docs`

## Development Commands

### Project Setup
```bash
npm install
```

### Development
```bash
npm run start:dev    # Development with watch mode
npm run start        # Standard development
npm run start:debug  # Debug mode with watch
```

### Production
```bash
npm run build        # Build the project
npm run start:prod   # Run production build
```

### Code Quality
```bash
npm run lint         # ESLint with auto-fix
npm run format       # Prettier formatting
```

### Testing
```bash
npm run test         # Unit tests
npm run test:watch   # Unit tests in watch mode
npm run test:cov     # Test coverage
npm run test:e2e     # End-to-end tests
npm run test:debug   # Debug tests
```

### Database Operations
```bash
npm run migration:generate  # Generate new migration (requires build first)
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run seed:roles         # Seed user roles (development)
npm run seed:roles:prod    # Seed user roles (production)
```

## Code Organization

### Module Structure
Each feature module follows NestJS conventions:
- `*.controller.ts` - API endpoints and route handlers
- `*.service.ts` - Business logic and database operations
- `*.module.ts` - Module definition and dependency injection
- `dto/` - Data Transfer Objects for request/response validation
- `entities/` - TypeORM database entities
- `migrations/` - Database schema migrations

### Common Utilities
- `src/common/utils/response.util.ts` - Standardized API response formatting
- `src/common/utils/email.ts` - Email service integration
- `src/common/utils/encryption.util.ts` - Encryption helpers

### Authentication & Authorization
- JWT strategy in `src/auth/strategies/jwt.strategy.ts`
- Role-based guards in `src/auth/guards/`
- Role decorator for endpoint protection: `@Roles('admin', 'occupant')`

## Environment Configuration
The application uses environment variables for configuration. Key variables include:
- Database connection settings (DB_HOST, DB_PORT, DB_USERNAME, etc.)
- JWT configuration
- Email service settings
- Application port (defaults to 8700)

## API Documentation
Swagger documentation is automatically generated and available at `/api/docs` when the application is running.