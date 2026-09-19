# BloodBridge AI

An intelligent blood donation management system that connects donors, hospitals, and blood banks through AI-powered matching and real-time coordination.

## Features

- **Smart Blood Matching**: AI-powered donor matching based on blood type, location, and urgency
- **Emergency Request System**: Real-time blood shortage alerts and donor notifications
- **Hospital Dashboard**: Inventory management and request tracking for hospitals
- **Donor Portal**: Profile management, availability status, and donation history
- **Targeted Outreach**: Campaign system for specific blood group shortages
- **Real-time Notifications**: Instant alerts for urgent blood needs

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Build Tools**: esbuild, tsx

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Configure your API keys in `.env.local`

3. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
npm start
```

## API Endpoints

- `GET /api/health` - Health check and system status
- `GET /api/donors` - List donors with filtering options
- `PATCH /api/donors/:id` - Update donor information
- `GET /api/hospitals` - List registered hospitals
- `GET /api/inventory` - View blood inventory status
- `PATCH /api/inventory/:id` - Update inventory levels
- `GET /api/requests` - List emergency blood requests
- `POST /api/requests` - Create new emergency request
- `POST /api/requests/:id/respond` - Accept/decline requests
- `POST /api/outreach` - Create donor outreach campaigns
- `GET /api/notifications` - Get user notifications
- `POST /api/demo/reset` - Reset demo data

## Project Structure

```
bloodbridge/
├── src/
│   ├── data/          # Seed data and mock data
│   ├── services/      # Business logic (blood matching, etc.)
│   └── types.ts       # TypeScript type definitions
├── server.ts          # Express server and API routes
├── index.html         # Main HTML entry point
└── package.json       # Dependencies and scripts
```
