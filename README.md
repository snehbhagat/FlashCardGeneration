# 🧠 FlashCard Generator

**AI-Powered Flashcard Generation for Smarter Learning**

Transform any topic into personalized study cards in seconds using advanced AI technology. Built with React, TypeScript, and powered by Groq's LLaMA models.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎯 **AI-Powered Generation**
- **Smart Content Creation**: Generate educational flashcards using Groq's LLaMA 3.1 70B model
- **Difficulty Levels**: Choose from Easy, Medium, or Hard difficulty levels
- **Customizable Count**: Generate 5, 10, or 20 cards per topic
- **Educational Quality**: AI creates pedagogically sound questions with proper difficulty scaling

### 🎨 **Beautiful User Experience**
- **Modern UI**: Clean, student-friendly interface with smooth animations
- **Interactive Flashcards**: 3D flip animations with keyboard navigation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Study-Focused**: Distraction-free learning environment

### 📚 **Smart Study Features**
- **Progress Tracking**: Mark cards as known/unknown
- **Deck Management**: Organize flashcards into topics
- **Search & Filter**: Find specific decks quickly
- **Local Storage**: All data persists locally (no account required)
- **Spaced Repetition Ready**: Built-in support for future SRS implementation

### 🔧 **Production-Ready Architecture**
- **Rate Limiting**: Prevents API abuse (20 requests/minute)
- **Error Handling**: Graceful fallbacks and retry logic
- **Health Monitoring**: Built-in service health checks
- **Type Safety**: Full TypeScript coverage
- **Structured Output**: Consistent AI responses using Zod validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/snehbhagat/FlashCardGeneration.git
   cd FlashCardGeneration
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   GROQ_MODEL=llama-3.1-70b-versatile
   MAX_REQUESTS_PER_MINUTE=20
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### 🧪 Test the API

Run the included test script to verify everything works:
```bash
node test-api.js
```

## 📖 Usage

### Creating Flashcards
1. **Enter a topic** (e.g., "Photosynthesis", "World War II", "React Hooks")
2. **Select difficulty level**:
   - **Easy**: Basic definitions and facts
   - **Medium**: Application and understanding questions  
   - **Hard**: Analysis and complex problem-solving
3. **Choose card count** (5, 10, or 20 cards)
4. **Click "Create Flashcards"**

### Studying with Flashcards
- **Flip cards**: Click or press `Space`
- **Navigate**: Use arrow keys or `J`/`K`
- **Mark progress**: Click "Known" or "Unknown"
- **Track progress**: Visual progress bar shows completion

### Managing Decks
- **View all decks**: Navigate to `/decks`
- **Search decks**: Use the search bar to find specific topics
- **Rename decks**: Click "Rename" to customize deck titles
- **Delete decks**: Remove unwanted study materials

## 🏗️ Architecture

### Frontend (`src/`)
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Radix UI component library
│   ├── Flashcard.tsx   # 3D flip card component
│   └── Header.tsx      # Navigation header
├── pages/              # Route components
│   ├── index.tsx       # Homepage with form
│   ├── Decks.tsx       # Deck management
│   └── DeckDetail.tsx  # Study interface
├── lib/                # Utilities and logic
│   ├── ai.ts           # AI integration with retry logic
│   ├── store.tsx       # State management
│   ├── types.ts        # TypeScript interfaces
│   └── validation.ts   # Zod schemas
└── styles/             # CSS and animations
```

### Backend (`server/`)
```
server/
├── services/           # Business logic
│   └── flashcardGeneration.ts  # LLM service layer
├── routes/             # API endpoints
│   └── flashcards.ts   # Generation endpoints
├── schemas/            # Data validation
│   └── llm.ts          # LLM input/output schemas
├── middleware/         # Express middleware
│   └── rateLimiter.ts  # Rate limiting logic
└── index.ts           # Server configuration
```

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- React Router 6 (SPA routing)
- TailwindCSS (styling)
- Radix UI (components)
- Framer Motion (animations)
- Zod (validation)

**Backend:**
- Express.js
- LangChain (LLM orchestration)
- Groq SDK (AI provider)
- TypeScript
- Zod (schema validation)

**AI Integration:**
- Groq's LLaMA 3.1 70B model
- Structured output parsing
- Custom educational prompts
- Retry logic with exponential backoff

## 🔗 API Endpoints

### `POST /api/flashcards/generate`
Generate flashcards for a topic.

**Request:**
```json
{
  "topic": "Photosynthesis",
  "count": 10,
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topic": "Photosynthesis",
    "difficulty": "medium",
    "cards": [
      {
        "question": "What is the primary function of photosynthesis?",
        "answer": "To convert light energy into chemical energy (glucose)",
        "tags": ["biology", "plants"],
        "difficulty": "medium"
      }
    ],
    "metadata": {
      "generatedAt": "2025-01-01T12:00:00Z",
      "model": "llama-3.1-70b-versatile",
      "promptVersion": "1.0"
    }
  },
  "rateLimitInfo": {
    "remaining": 19,
    "resetTime": 1704110400000
  }
}
```

### `GET /api/flashcards/health`
Check service health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

## 🎯 Advanced Features

### Intelligent Prompt Engineering
The AI uses carefully crafted prompts that:
- Adapt question complexity to difficulty level
- Include diverse question types (definitions, applications, analysis)
- Follow educational best practices
- Generate pedagogically sound content

### Robust Error Handling
- **Automatic Fallback**: Falls back to template generation if AI fails
- **Retry Logic**: Exponential backoff for transient failures
- **Rate Limiting**: Prevents API abuse
- **Structured Errors**: Clear error messages with retry indicators

### Performance Optimizations
- **Lazy Loading**: Components load on demand
- **Local Storage**: Instant access to saved decks
- **Optimistic Updates**: UI updates immediately
- **Memory Management**: Automatic cleanup of rate limit data

## 🛠️ Development

### Project Structure
```
├── src/                 # Frontend React app
├── server/              # Express API server
├── shared/              # Shared types and utilities
├── public/              # Static assets
├── .env                 # Environment variables
└── test-api.js          # API testing script
```

### Available Scripts
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run typecheck        # TypeScript validation
```

### Environment Variables
```env
# Required
GROQ_API_KEY=your_groq_api_key

# Optional
GROQ_MODEL=llama-3.1-70b-versatile
MAX_REQUESTS_PER_MINUTE=20
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for fast AI inference
- [LangChain](https://langchain.com/) for LLM orchestration
- [Radix UI](https://radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have questions or need help:
- 🐛 [Report bugs](https://github.com/snehbhagat/FlashCardGeneration/issues)
- 💡 [Request features](https://github.com/snehbhagat/FlashCardGeneration/issues)
- 📖 [Read the docs](https://github.com/snehbhagat/FlashCardGeneration/wiki)

---

**Made with ❤️ for students everywhere**

*Transform your learning with AI-powered flashcards!*