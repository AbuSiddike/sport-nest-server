# SportNest Server

Backend API for **SportNest**, a sports facility booking management system. It powers facility discovery, owner-managed listings, and user bookings with JWT-protected routes verified against Better Auth JWKS.

## Purpose

Provide a secure REST API for browsing sports facilities, creating bookings, and letting facility owners manage their listings. Authentication is delegated to Better Auth; this server verifies session tokens from HTTP-only cookies using remote JWKS.

## Live URL

<https://sport-nest-server.vercel.app>

## Features

- Public facility listing with **search** (`$regex` on name) and **filter** (`$in` on facility type)
- Featured facilities endpoint (top 6 by booking count)
- Facility CRUD with **owner-only** update and delete
- Booking creation with automatic total price calculation
- My bookings with cancel support (status → `cancelled`)
- JWT verification via **jose** `createRemoteJWKSet` from `/api/auth/jwks`
- CORS configured for credentialed frontend requests
- MongoDB credentials via environment variables

## NPM Packages Used

| Package | Purpose |
|---------|---------|
| express | HTTP server and routing |
| mongodb | Database driver |
| dotenv | Environment configuration |
| cors | Cross-origin requests with credentials |
| cookie-parser | Read HTTP-only auth cookies |
| jose-cjs | JWT verification with remote JWKS |
| nodemon | Development auto-reload |