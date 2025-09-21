import React from 'react'
import { ArrowRight, Heart, Brain, Sparkles, BookOpen, Shield, Compass } from 'lucide-react'

const LandingPage = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30"></div>
      
      {/* Content */}
      <div className="relative min-h-screen">
        {/* Hero Section - Typography Focused */}
        <div className="container mx-auto px-8 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Brand Identity */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-light text-foreground tracking-tight">
                Bubble
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Your Mental Wellness Sanctuary
              </p>
            </div>

            {/* Philosophical Quote - Typography Hero */}
            <div className="space-y-8 py-16">
              <blockquote className="text-2xl md:text-3xl text-foreground font-light italic leading-relaxed">
                "A fragile bubble, born at the world's depths,<br className="hidden md:block" />
                floating gently into light"
              </blockquote>
              <div className="space-y-4">
                <p className="text-lg text-foreground leading-relaxed max-w-2xl mx-auto">
                  Step into your safe space where emotions flow freely and thoughts find clarity.
                </p>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  Track your feelings, capture insights, and discover inner peace through mindful reflection.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-6">
              <button
                onClick={onEnter}
                className="btn-primary px-12 py-4 text-lg font-medium transition-all duration-200 hover:opacity-90 inline-flex items-center space-x-3"
              >
                <span>Enter Your Bubble</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-muted-foreground">
                A sanctuary for mental wellness and emotional growth
              </p>
            </div>
          </div>
        </div>

        {/* Features Section - Clean Cards */}
        <div className="border-t border-border/50">
          <div className="container mx-auto px-8 py-24">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center space-y-4 mb-20">
                <h2 className="text-2xl font-light text-foreground">Mindful Tools for Inner Peace</h2>
                <p className="text-base text-muted-foreground max-w-lg mx-auto">
                  Simple, powerful features designed to support your mental wellness journey
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="group">
                  <div className="card text-center space-y-4 h-full transition-all duration-200 hover:border-accent/30">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-200">
                      <Heart className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Feeling Bubbles</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Track your emotions with gentle awareness. Watch patterns emerge and insights unfold over time.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="group">
                  <div className="card text-center space-y-4 h-full transition-all duration-200 hover:border-accent/30">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-200">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Thought Streams</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Journal your thoughts with AI-powered insights. Transform reflection into wisdom and growth.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="group">
                  <div className="card text-center space-y-4 h-full transition-all duration-200 hover:border-accent/30">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-200">
                      <Compass className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Calm Currents</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Find peace with personalized coping tools and techniques guided by mindfulness principles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/30">
          <div className="container mx-auto px-8 py-12">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                A mindful approach to mental wellness
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage