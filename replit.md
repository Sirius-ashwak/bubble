# Bubble Mental Wellness App - Replit Configuration

## Project Overview
- **Name**: Bubble - Your Safe Space to Feel, Reflect, and Grow
- **Type**: React-based mental wellness application
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom bubble theme
- **AI Integration**: Google Gemini API (optional, with fallbacks)

## Current Setup
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows proxy access)
- **Development Server**: Vite with HMR enabled
- **Build System**: Vite build system
- **Package Manager**: npm

## Core Features
1. **Mood Bubble Check-In** - Interactive emotion wheel with 30+ emotions
2. **Journaling Bubble** - AI-powered journaling prompts with CBT techniques
3. **Coping Bubble (AI Toolkit)** - Personalized coping strategies
4. **Bubble Timeline (Dashboard)** - Mood trends visualization

## Key Configuration Files
- `vite.config.js` - Configured for Replit proxy (host: 0.0.0.0, port: 5000)
- `tailwind.config.js` - Custom bubble theme with pastel colors
- `package.json` - All dependencies installed and working

## Environment Variables
The app uses these environment variables (optional):
- `VITE_GEMINI_API_KEY` - Google Gemini API key for AI features
- `VITE_OPENAI_API_KEY` - OpenAI API key (legacy support)
- App works with fallback responses when no API keys are provided

## Deployment
- **Target**: Autoscale (stateless web application)
- **Build**: `npm run build`
- **Run**: `npm run preview`

## Data Storage
- Uses localStorage for data persistence
- No external database required
- Privacy-focused - all data stays local

## Recent Changes (Sept 21, 2025)
- Configured Vite server for Replit environment (port 5000, host 0.0.0.0)
- Set up development workflow
- Configured deployment settings for autoscale
- All dependencies installed and working
- App runs successfully without API keys using fallback responses

## User Preferences
- Default theme: Dark mode
- Bubble-inspired design with soft, rounded edges
- Mobile-first responsive design
- Calming pastel color palette

## Project Architecture
- **Frontend**: React SPA with React Router
- **State Management**: React Context API (AppContext, ThemeContext)
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for data visualization
- **Storage**: Browser localStorage
- **AI Service**: Modular service with fallback responses