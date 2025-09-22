import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcards } from "@/lib/ai";
import { createDeckFromCards, useDecks } from "@/lib/store.tsx";
import { BookOpen, Brain, Target, Trophy, Users, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TopicFormValues {
  topic: string;
  count: 5 | 10 | 20;
  difficulty: "easy" | "medium" | "hard";
}

export default function HomePage() {
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState<TopicFormValues>({ 
    topic: "", 
    count: 10, 
    difficulty: "medium" 
  });
  const { addDeck } = useDecks();
  const nav = useNavigate();
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.topic.trim()) return;
    
    setBusy(true);
    try {
      const cards = await generateFlashcards({ 
        topic: values.topic, 
        count: values.count, 
        difficulty: values.difficulty 
      });
      const deck = createDeckFromCards(values.topic, values.difficulty, cards);
      addDeck(deck);
      nav(`/decks/${deck.id}`);
    } catch (e: any) {
      toast({ 
        title: "Generation failed", 
        description: e?.message ?? "Please try again.", 
        variant: "destructive" as any 
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Books */}
        <div className="floating-books">
          <BookOpen className="floating-icon text-indigo-200" style={{ left: '10%', top: '20%', animationDelay: '0s' }} />
          <Brain className="floating-icon text-purple-200" style={{ left: '80%', top: '15%', animationDelay: '2s' }} />
          <Target className="floating-icon text-cyan-200" style={{ left: '15%', top: '70%', animationDelay: '4s' }} />
          <Trophy className="floating-icon text-amber-200" style={{ left: '85%', top: '75%', animationDelay: '6s' }} />
          <Zap className="floating-icon text-indigo-300" style={{ left: '70%', top: '40%', animationDelay: '8s' }} />
          <Users className="floating-icon text-purple-300" style={{ left: '25%', top: '45%', animationDelay: '10s' }} />
        </div>
        
        {/* Study Particles */}
        <div className="study-particles"></div>
        
        {/* Geometric Shapes */}
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="container-page">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading with Animation */}
            <div className="mb-8 space-y-4">
              <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4 animate-bounce-subtle">
                <Zap className="w-4 h-4" />
                AI-Powered Learning
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                Master Any Subject
                <br />
                <span className="text-4xl md:text-5xl">with Smart Flashcards</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Transform any topic into personalized study cards in seconds. 
                Learn smarter, retain longer, and ace your exams with confidence.
              </p>
            </div>

            {/* Enhanced Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={onSubmit} className="student-form">
                <div className="form-header">
                  <Brain className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Create Your Study Deck</h3>
                  <p className="text-sm text-gray-600">Enter a topic and we'll generate flashcards instantly</p>
                </div>

                <div className="form-content">
                  {/* Topic Input */}
                  <div className="form-group">
                    <label htmlFor="topic" className="form-label">
                      <BookOpen className="w-4 h-4" />
                      What do you want to learn?
                    </label>
                    <input
                      id="topic"
                      type="text"
                      value={values.topic}
                      onChange={(e) => setValues({ ...values, topic: e.target.value })}
                      className="form-input"
                      placeholder="e.g., Photosynthesis, World War II, React Hooks, Spanish Verbs..."
                      required
                    />
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card Count */}
                    <div className="form-group">
                      <label htmlFor="count" className="form-label">
                        <Target className="w-4 h-4" />
                        Number of Cards
                      </label>
                      <div className="radio-group">
                        {[5, 10, 20].map((count) => (
                          <label key={count} className={`radio-option ${values.count === count ? 'selected' : ''}`}>
                            <input
                              type="radio"
                              name="count"
                              value={count}
                              checked={values.count === count}
                              onChange={() => setValues({ ...values, count: count as 5 | 10 | 20 })}
                              className="sr-only"
                            />
                            <span className="radio-text">{count} cards</span>
                            <span className="radio-subtitle">
                              {count === 5 ? 'Quick review' : count === 10 ? 'Perfect balance' : 'Deep dive'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="form-group">
                      <label className="form-label">
                        <Trophy className="w-4 h-4" />
                        Difficulty Level
                      </label>
                      <div className="radio-group">
                        {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                          <label key={difficulty} className={`radio-option ${values.difficulty === difficulty ? 'selected' : ''}`}>
                            <input
                              type="radio"
                              name="difficulty"
                              value={difficulty}
                              checked={values.difficulty === difficulty}
                              onChange={() => setValues({ ...values, difficulty })}
                              className="sr-only"
                            />
                            <span className="radio-text capitalize">{difficulty}</span>
                            <span className="radio-subtitle">
                              {difficulty === 'easy' ? 'Beginner friendly' : 
                               difficulty === 'medium' ? 'Balanced depth' : 'Challenge mode'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={busy || !values.topic.trim()}
                    className="submit-button"
                    size="lg"
                  >
                    {busy ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Generating your deck...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Create Flashcards
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 bg-white/50 backdrop-blur-sm">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="feature-card">
              <div className="feature-icon bg-indigo-100 text-indigo-600">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Smart Generation</h3>
              <p className="text-gray-600 text-sm">AI creates personalized questions tailored to your learning level</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon bg-purple-100 text-purple-600">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Adaptive Learning</h3>
              <p className="text-gray-600 text-sm">Focus on what you don't know with intelligent progress tracking</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon bg-cyan-100 text-cyan-600">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">Visual feedback and statistics to keep you motivated</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
