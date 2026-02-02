# create-nestjs-api

CLI to scaffold a NestJS API starter with Prisma, JWT authentication, and Swagger.

## Usage
```bash
npx @kaungkhantdev/create-nestjs-api my-app
```

## What's Included

- NestJS 11
- Prisma ORM with PostgreSQL
- JWT Authentication
- Swagger API Documentation
- Class Validator & Transformer
- Jest Testing Setup
- ESLint + Prettier

## Quick Start
```bash
# Create new project
npx @kaungkhantdev/create-nestjs-api my-app

# Navigate to project
cd my-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run Prisma migrations
npm run prisma:migrate:deploy

# Generate Prisma client
npm run prisma:generate

# Start dev server
npm run start:dev
```

The API will be available at:
- Application: `http://localhost:3000`
- Swagger Documentation: `http://localhost:3000/api`

## Links

- [Template Repository](https://github.com/kaungkhantdev/nestjs-api-starter)
- [Report Issues](https://github.com/kaungkhantdev/create-nestjs-api/issues)

## License

MIT