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
   Configure your OpenAI API key in `.env.local`

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

## Deployment

### Render (Recommended)

1. **Push your code to GitHub** (already done)

2. **Create a Render account** at [render.com](https://render.com)

3. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select "BloodBridge AI" repository
   - Render will automatically detect the `render.yaml` configuration

4. **Configure Environment Variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production` (auto-set)
   - `PORT`: `3000` (auto-set)

5. **Deploy** - Render will automatically:
   - Install dependencies
   - Build the application
   - Start the server
   - Provide a HTTPS URL

The `render.yaml` file in the repository handles the build and deployment configuration automatically.

### Manual Deployment Steps

If you prefer manual deployment:

1. **Build the project**:
   ```bash
   npm install
   npm run build
   ```

2. **Set environment variables**:
   ```bash
   export OPENAI_API_KEY="your_key_here"
   export NODE_ENV="production"
   export PORT="3000"
   ```

3. **Start the server**:
   ```bash
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
