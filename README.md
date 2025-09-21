# 🫧 Bubble - Your Safe Space to Feel, Reflect, and Grow

![Bubble Logo](public/bubble-icon.svg)

## 🌟 Overview

Bubble is an AI-powered youth mental wellness companion that combines emotion check-ins, guided journaling, and personalized coping strategies. Designed specifically for youth (15-25), Bubble provides a safe, private space to express emotions and develop emotional intelligence.

## ✨ Features

### 🎯 Core Features

#### 1. **Mood Bubble Check-In**
- Interactive emotion wheel with 30+ emotions
- Color-coded emotions by energy level
- Free-text mood entry with AI emotion recognition
- Intensity tracking (1-10 scale)
- Beautiful floating bubble animations

#### 2. **Journaling Bubble**
- AI-powered journaling prompts (CBT, gratitude, mindfulness, general)
- Free journaling with autosave
- AI-generated empathetic reflections
- Word count and reading time tracking
- Beautiful, distraction-free writing interface

#### 3. **Coping Bubble (AI Toolkit)**
- Personalized coping strategies based on current mood
- 6 categories: Breathing, Mindfulness, Movement, Creative, Comfort
- Step-by-step guided activities
- Quick relief bubbles for instant support
- Activity completion tracking

#### 4. **Bubble Timeline (Dashboard)**
- Mood trends visualization with interactive charts
- Journaling frequency insights
- Daily, weekly statistics
- Streak tracking for motivation
- Recent entries overview

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bubble.git
cd bubble
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` and add your OpenAI API key (optional):
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎨 Design Philosophy

Bubble's design is inspired by:
- **Stoic**: Clean, minimalistic journaling interface
- **How We Feel**: Colorful emotion wheel and mood tracking
- **Bubble Metaphor**: Safe, private spaces that can grow and float

### Design Elements
- Soft, rounded edges (bubble-inspired)
- Pastel color palette for calming effect
- Floating animations for playful interaction
- Dark/light mode for user preference
- Mobile-first responsive design

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom bubble theme
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI Integration**: OpenAI GPT-3.5/4
- **State Management**: React Context API
- **Storage**: LocalStorage (Firebase/Supabase ready)
- **Icons**: Lucide React

## 📱 Features in Detail

### Emotion Wheel
- 30+ emotions organized by:
  - Pleasantness (Pleasant/Unpleasant)
  - Energy Level (High/Mid/Low)
- Each emotion has:
  - Unique color
  - Emoji representation
  - Intensity tracking

### AI Features (with API key)
- Emotion recognition from text
- Personalized journaling prompts
- Empathetic journal reflections
- Mood-based coping suggestions

### Fallback Features (without API key)
- Pre-written journaling prompts
- Standard coping activities
- Basic emotion tracking
- All core functionality remains available

## 🔐 Privacy & Security

- All data stored locally in browser
- No data sent to servers (except OpenAI API calls if configured)
- Optional encryption for sensitive data
- No tracking or analytics
- Complete user control over data

## 📈 Success Metrics

- Daily mood check-ins
- Journal entry frequency
- Coping activity completion
- Mood improvement trends
- User retention and streaks

## 🚧 Roadmap

### Current (MVP)
- ✅ Mood check-ins
- ✅ Guided journaling
- ✅ Coping toolkit
- ✅ Dashboard with trends
- ✅ Dark/light mode

### Future Features
- [ ] AI Companion Chat
- [ ] Peer Support Bubbles (anonymous)
- [ ] Gamification (badges, achievements)
- [ ] Export data functionality
- [ ] Mobile app (React Native)
- [ ] Therapist dashboard
- [ ] Crisis resources integration
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Stoic and How We Feel apps
- Built with love for youth mental wellness
- Special thanks to the mental health community

## 💬 Support

For support, email support@bubble-app.com or open an issue in the GitHub repository.

## 🌈 Remember

"Your feelings are valid. Your story matters. You deserve support."

---

**Bubble** - Your safe space to feel, reflect, and grow 🫧
