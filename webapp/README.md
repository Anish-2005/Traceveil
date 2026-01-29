# Traceveil Web Application

A modern Next.js web interface for the Traceveil fraud detection system.

## Features

- **Event Ingestion**: Submit new events for real-time fraud analysis
- **User Risk Assessment**: Check individual user risk profiles
- **Analytics Dashboard**: View system performance and statistics
- **Model Monitoring**: Track model versions and status
- **Feedback System**: Submit feedback to improve model accuracy

## Prerequisites

- Node.js 18+ and npm
- Running Traceveil FastAPI backend (default: http://localhost:8000)

## Setup

1. **Install dependencies:**
   ```bash
   cd webapp
   npm install
   ```

2. **Configure API endpoint:**
   Create a `.env.local` file in the webapp directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Dashboard
- Overview of system status and key metrics
- Quick access to main features
- Recent activity feed

### Event Ingestion
- Submit new events with user ID, event type, and metadata
- Real-time risk assessment with detailed explanations
- JSON metadata support for flexible event data

### User Risk Assessment
- Search for users by ID
- View comprehensive risk profiles
- Access risk explanations and recommendations

### Analytics
- System performance metrics
- Risk distribution charts
- Model accuracy tracking
- Feedback statistics

## API Integration

The webapp communicates with the Traceveil FastAPI backend through the following endpoints:

- `POST /ingest` - Ingest new events
- `GET /user/{user_id}/risk` - Get user risk assessment
- `POST /feedback` - Submit feedback
- `GET /feedback/stats` - Get feedback statistics
- `GET /models/status` - Get model status

## Development

### Project Structure
```
webapp/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── events/          # Event management
│   │   ├── users/           # User risk assessment
│   │   └── layout.tsx       # Root layout
│   ├── lib/
│   │   └── api.ts           # API client and types
│   └── components/          # Reusable components
├── public/                  # Static assets
└── package.json
```

### Adding New Features

1. Create new pages in `src/app/`
2. Add API functions to `src/lib/api.ts`
3. Update navigation in the layout
4. Use Tailwind CSS for styling

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
- `NEXT_PUBLIC_API_URL`: URL of the Traceveil API backend

## Technologies Used

- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **Lucide React**: Icon library

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new API responses
3. Test API integration thoroughly
4. Update this README for new features
