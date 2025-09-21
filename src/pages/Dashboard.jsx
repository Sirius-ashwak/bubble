import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Heart, BookOpen, Sparkles, TrendingUp, Calendar, Clock, Star, RefreshCw, Brain } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateDailyEncouragement, generateBubbleInsights } from '../utils/aiService'
import { getEmotionIcon, getEmotionGradient } from '../utils/emotionData'
import { format } from 'date-fns'

const Dashboard = () => {
  const { moods, journals, getStats, getMoodTrends } = useApp()
  const stats = getStats()
  const moodTrends = getMoodTrends()
  
  const recentMoods = moods.slice(0, 5)
  const recentJournals = journals.slice(0, 3)

  // Daily encouragement state
  const [dailyEncouragement, setDailyEncouragement] = useState('')
  const [loadingEncouragement, setLoadingEncouragement] = useState(false)
  
  // Weekly insights state
  const [weeklyInsights, setWeeklyInsights] = useState(null)
  const [loadingInsights, setLoadingInsights] = useState(false)

  // Calculate average mood
  const avgMood = moods.length > 0 
    ? (moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length).toFixed(1)
    : 0

  useEffect(() => {
    loadDailyEncouragement()
    if (moods.length >= 3) { // Only generate insights if user has some data
      loadWeeklyInsights()
    }
  }, [stats, moods])

  const loadDailyEncouragement = async () => {
    if (stats.totalJournals === 0 && stats.todayMoodCheckins === 0) return
    
    setLoadingEncouragement(true)
    try {
      const recentMoodData = moods.slice(0, 3)
      const encouragement = await generateDailyEncouragement(stats, recentMoodData)
      setDailyEncouragement(encouragement)
    } catch (error) {
      console.error('Error loading daily encouragement:', error)
    } finally {
      setLoadingEncouragement(false)
    }
  }

  const loadWeeklyInsights = async () => {
    setLoadingInsights(true)
    try {
      // Prepare weekly data for analysis
      const weekData = {
        moods: moods.slice(0, 10), // Last 10 mood entries
        journals: journals.slice(0, 5), // Last 5 journal entries
        mostCommonEmotion: getMostCommonEmotion(),
        averageIntensity: avgMood,
        peakDays: getPeakDays(),
        lowDays: getLowDays()
      }
      
      const insights = await generateBubbleInsights(weekData)
      setWeeklyInsights(insights)
    } catch (error) {
      console.error('Error loading weekly insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }

  const getMostCommonEmotion = () => {
    if (moods.length === 0) return 'peaceful'
    const emotionCounts = {}
    moods.forEach(mood => {
      emotionCounts[mood.emotion] = (emotionCounts[mood.emotion] || 0) + 1
    })
    return Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0][0]
  }

  const getPeakDays = () => {
    return moods
      .filter(m => m.intensity >= 7)
      .slice(0, 3)
      .map(m => format(new Date(m.timestamp), 'EEE'))
  }

  const getLowDays = () => {
    return moods
      .filter(m => m.intensity <= 4)
      .slice(0, 3)
      .map(m => format(new Date(m.timestamp), 'EEE'))
  }

  return (
    <div className="section space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="py-8">
        <h1 className="text-3xl font-semibold text-primary mb-2">
          Welcome to your sanctuary
        </h1>
        <p className="text-secondary">
          How are your bubbles floating today?
        </p>
      </div>

      {/* Daily Encouragement */}
      {dailyEncouragement && (
        <div className="mb-8 card bg-accent/10 border border-accent/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-accent">Daily Bubble Affirmation</h2>
              </div>
              <p className="text-foreground leading-relaxed italic">
                "{dailyEncouragement}"
              </p>
            </div>
            <button
              onClick={loadDailyEncouragement}
              disabled={loadingEncouragement}
              className="ml-4 p-2 rounded-full hover:bg-accent/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-accent ${loadingEncouragement ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Feature Showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Your Wellness Sanctuary</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card bg-accent/10 border border-accent/20">
            <div className="flex items-center space-x-3 mb-3">
              <Heart className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-primary">Feeling Bubbles</h3>
            </div>
            <p className="text-sm text-secondary">
              Pop open your emotions and watch patterns float to the surface of your awareness.
            </p>
          </div>
          
          <div className="card bg-accent/10 border border-accent/20">
            <div className="flex items-center space-x-3 mb-3">
              <BookOpen className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-primary">Thought Streams</h3>
            </div>
            <p className="text-sm text-secondary">
              Let your thoughts flow like bubbles in a gentle stream with AI-guided prompts.
            </p>
          </div>
          
          <div className="card bg-accent/10 border border-accent/20">
            <div className="flex items-center space-x-3 mb-3">
              <Sparkles className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-primary">Calm Currents</h3>
            </div>
            <p className="text-sm text-secondary">
              Ride the waves of tranquility with breathing bubbles and mindful moments.
            </p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/mood" className="card-hover">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <Heart className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">Feel & Float</h3>
              <p className="text-sm text-secondary">Let your emotions bubble up</p>
            </div>
          </div>
        </Link>
        
        <Link to="/journal" className="card-hover">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">Stream Thoughts</h3>
              <p className="text-sm text-secondary">Flow your thoughts freely</p>
            </div>
          </div>
        </Link>
        
        <Link to="/coping" className="card-hover">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">Find Calm</h3>
              <p className="text-sm text-secondary">Breathe in tranquil currents</p>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-muted">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-accent" />
            <span className="text-xs text-secondary">Bubble</span>
          </div>
          <p className="text-2xl font-semibold text-primary">{stats.todayMoodCheckins}</p>
          <p className="text-sm text-secondary">Pop-ins</p>
        </div>
        
        <div className="card-muted">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <span className="text-xs text-secondary">Total</span>
          </div>
          <p className="text-2xl font-semibold text-primary">{stats.totalJournals}</p>
          <p className="text-sm text-secondary">Streams</p>
        </div>
        
        <div className="card-muted">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-xs text-secondary">Average</span>
          </div>
          <p className="text-2xl font-semibold text-primary">{avgMood}</p>
          <p className="text-sm text-secondary">Float Level</p>
        </div>
        
        <div className="card-muted">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-accent" />
            <span className="text-xs text-secondary">Streak</span>
          </div>
          <p className="text-2xl font-semibold text-primary">{stats.streak}</p>
          <p className="text-sm text-secondary">Days</p>
        </div>
      </div>
      
      {/* Bubble Flow Trends with AI Insights */}
      {moodTrends.length > 0 && (
        <div className="space-y-6">
          {/* Weekly AI Insights */}
          {weeklyInsights && (
            <div className="card bg-accent/10 border border-accent/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-accent">{weeklyInsights.headline}</h2>
                </div>
                <button
                  onClick={loadWeeklyInsights}
                  disabled={loadingInsights}
                  className="p-2 rounded-full hover:bg-accent/10 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 text-accent ${loadingInsights ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-xl">
                  <h4 className="font-medium text-foreground mb-1">Pattern Recognition</h4>
                  <p className="text-sm text-muted-foreground">{weeklyInsights.mainInsight}</p>
                </div>
                
                {weeklyInsights.positivePattern && (
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <h4 className="font-medium text-accent mb-1">Positive Flow</h4>
                    <p className="text-sm text-accent">{weeklyInsights.positivePattern}</p>
                  </div>
                )}
                
                {weeklyInsights.gentleObservation && (
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <h4 className="font-medium text-accent mb-1">Gentle Observation</h4>
                    <p className="text-sm text-accent">{weeklyInsights.gentleObservation}</p>
                  </div>
                )}
                
                {weeklyInsights.actionableInsight && (
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <h4 className="font-medium text-accent mb-1">Gentle Suggestion</h4>
                    <p className="text-sm text-accent">{weeklyInsights.actionableInsight}</p>
                  </div>
                )}
                
                <div className="p-3 bg-accent/10 rounded-xl">
                  <h4 className="font-medium text-accent mb-1">Celebration</h4>
                  <p className="text-sm text-accent">{weeklyInsights.celebration}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary">Bubble Flow Trends</h2>
              <span className="text-sm text-secondary">Last 7 days</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgb(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    stroke="rgb(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgb(var(--background))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="rgb(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'rgb(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Moods */}
        <div className="card">
          <h2 className="text-lg font-semibold text-primary mb-4">Recent Bubble Pop-ins</h2>
          <div className="space-y-3">
            {recentMoods.length > 0 ? (
              recentMoods.map(mood => (
                <div
                  key={mood.id}
                  className="group flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-muted to-muted/70 hover:from-accent/10 hover:to-accent/5 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {(() => {
                    const EmotionIcon = getEmotionIcon(mood.emotion)
                    const gradient = getEmotionGradient(mood.emotion)
                    return (
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-105 transition-transform`}>
                        <EmotionIcon className="w-5 h-5 text-white" />
                      </div>
                    )
                  })()}
                  <div className="flex-1">
                    <p className="font-semibold text-primary group-hover:text-accent transition-colors">{mood.emotion}</p>
                    <p className="text-sm text-secondary">
                      {format(new Date(mood.timestamp), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                      {mood.intensity}/10
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-secondary mb-3">
                  No bubble pop-ins yet
                </p>
                <Link to="/mood" className="text-accent hover:underline text-sm">
                  Pop your first feeling bubble →
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Journals */}
        <div className="card">
          <h2 className="text-lg font-semibold text-primary mb-4">Recent Thought Streams</h2>
          <div className="space-y-3">
            {recentJournals.length > 0 ? (
              recentJournals.map(journal => (
                <div
                  key={journal.id}
                  className="p-3 rounded-xl bg-muted"
                >
                  <p className="font-medium text-primary mb-1">
                    {journal.title || 'Untitled Entry'}
                  </p>
                  <p className="text-sm text-secondary line-clamp-2 mb-2">
                    {journal.content}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-secondary" />
                    <p className="text-xs text-secondary">
                      {format(new Date(journal.timestamp), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-secondary mb-3">
                  No thought streams yet
                </p>
                <Link to="/journal" className="text-accent hover:underline text-sm">
                  Start your first stream →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
