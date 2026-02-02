# Oren's 60th Birthday Party Web App

A beautiful, interactive web application for celebrating Oren Glanz's 60th birthday party. Features include RSVP management and a collaborative music playlist with YouTube integration.

## Features

- **RSVP System**: Guests can register their attendance with party size and notes
- **Musical Playlist**: Collaborative playlist where guests can dedicate songs via YouTube search
- **Private Dedications**: Hidden messages visible only to admin
- **Admin Panel**: Password-protected panel to view private messages and manage content
- **Vintage Design**: Retro cassette tape-inspired aesthetic

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   - `VITE_YOUTUBE_API_KEY`: Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - `VITE_ADMIN_PASSWORD`: Set a secure password for admin access

### YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Restrict the API key to YouTube Data API v3
6. Copy the API key to your `.env` file

### Running Locally

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

Build the app:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── common/      # Reusable UI components
│   ├── rsvp/        # RSVP related components
│   ├── playlist/    # Playlist and song components
│   └── admin/       # Admin panel components
├── pages/           # Page components
├── services/        # API services and data layer
│   └── storage/     # Storage abstraction (localStorage/Supabase)
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── styles/          # Global styles
```

## Data Storage

Currently uses **localStorage** for data persistence. The storage layer is abstracted, making it easy to switch to **Supabase** in the future by simply updating the import in `src/services/storage/index.ts`.

## Admin Access

1. Click "Admin Login" on the home page
2. Enter the password configured in `.env`
3. View private dedication messages and manage content

## Deployment

### Cloudflare Pages

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Cloudflare Pages
3. Set environment variables in Cloudflare Pages settings:
   - `VITE_YOUTUBE_API_KEY`
   - `VITE_ADMIN_PASSWORD`

### Other Platforms

The app is a static SPA and can be deployed to any static hosting service (Vercel, Netlify, etc.)

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Headless UI
- YouTube Data API v3
- Zustand (state management)
- Framer Motion (animations)

## Future Enhancements

- [ ] Migrate to Supabase for real-time data
- [ ] Email notifications for RSVPs
- [ ] Photo sharing feature
- [ ] Export playlist to Spotify
- [ ] Guest messages board

## License

Private project for personal use.
