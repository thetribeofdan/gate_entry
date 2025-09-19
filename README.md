# Real Estate Visitor/Gate Entry Management System

A Real Estate Application that manages Visitor/Gate entries using QR CODE scans and AI camera automations. Built with [NestJS](https://nestjs.com/) and TypeScript, this backend system streamlines visitor registration, approval, and entry tracking for residential estates.

---

## Project Overview

This application enables estate managers, occupants, and gatemen to securely manage visitor access:

- **Visitor Registration:** Occupants and gatemen can register visitors. Each visitor entry generates a unique QR code.
- **Approval Workflow:** Occupants can approve or reject visitor entries. Gatemen can register unexpected visitors for approval.
- **QR Code Scanning:** Gatemen scan QR codes at the gate to validate and allow entry.
- **Automated Cleanup:** Expired or unused visitor entries are automatically cleaned up daily.
- **Role-Based Access:** Actions are restricted based on user roles (admin, occupant, gateman).
- **Notifications:** Email notifications are sent for onboarding and visitor approvals (future integration with AI camera automations and push notifications).

---

## Main Workflows

### 1. Occupant Visitor Registration

- Occupant registers a visitor via the app.
- Visitor entry is automatically approved.
- QR code is generated and sent to the visitor.

### 2. Gateman Visitor Registration

- Gateman registers an unexpected visitor at the gate.
- Entry is marked as pending.
- Occupant receives a notification to approve or reject the entry.

### 3. Approval & Rejection

- Occupant reviews pending visitor entries.
- Approves or rejects via the app.
- Status is updated and reflected at the gate.

### 4. Gate Entry via QR Code

- Visitor presents QR code at the gate.
- Gateman scans QR code.
- System validates entry, checks approval and expiry.
- If valid, visitor is allowed in; otherwise, entry is denied.

### 5. Automated Cleanup

- Every midnight, expired or unused entries are marked as expired and cleaned up.

---

## Project Setup

```bash
$ npm install
```

## Compile and Run

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

## Technologies Used

- **NestJS** (Node.js framework)
- **TypeORM** (MySQL database)
- **JWT Authentication**
- **Role-based Access Control**
- **Email Notifications**
- **Scheduled Cron Jobs**

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord Channel](https://discord.gg/G7Qnnhy)
- [NestJS Devtools](https://devtools.nestjs.com)

---

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE)
