import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getAIResponse } from '../utils/aiService'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [moods, setMoods] = useState([])
  const [journals, setJournals] = useState([])
  const [copingActivities, setCopingActivities] = useState([])
  const [loading, setLoading] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedMoods = localStorage.getItem('bubble_moods')
        const savedJournals = localStorage.getItem('bubble_journals')
        const savedCoping = localStorage.getItem('bubble_coping')
        
        if (savedMoods) setMoods(JSON.parse(savedMoods))
        if (savedJournals) setJournals(JSON.parse(savedJournals))
        if (savedCoping) setCopingActivities(JSON.parse(savedCoping))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bubble_moods', JSON.stringify(moods))
  }, [moods])

  useEffect(() => {
    localStorage.setItem('bubble_journals', JSON.stringify(journals))
  }, [journals])

  useEffect(() => {
    localStorage.setItem('bubble_coping', JSON.stringify(copingActivities))
  }, [copingActivities])

  const addMood = async (mood) => {
    const newMood = {
      id: uuidv4(),
      ...mood,
      timestamp: new Date().toISOString()
    }
    
    // If text description provided, get AI summary
    if (mood.description) {
      setLoading(true)
      try {
        const summary = await getAIResponse(`Provide a brief, empathetic summary of this mood: "${mood.description}". Keep it under 20 words.`)
        newMood.aiSummary = summary
      } catch (error) {
        console.error('AI summary error:', error)
      }
      setLoading(false)
    }
    
    setMoods(prev => [newMood, ...prev])
    return newMood
  }

  const addJournal = async (journal) => {
    const newJournal = {
      id: uuidv4(),
      ...journal,
      timestamp: new Date().toISOString()
    }
    
    // Get AI reflection if content exists
    if (journal.content && journal.content.length > 50) {
      setLoading(true)
      try {
        const reflection = await getAIResponse(`Provide a brief, empathetic reflection on this journal entry. Be supportive and encouraging. Keep it under 50 words: "${journal.content}"`)
        newJournal.aiReflection = reflection
      } catch (error) {
        console.error('AI reflection error:', error)
      }
      setLoading(false)
    }
    
    setJournals(prev => [newJournal, ...prev])
    return newJournal
  }

  const getJournalingPrompt = async (type = 'general') => {
    setLoading(true)
    try {
      const prompts = {
        general: 'Generate a thoughtful journaling prompt for self-reflection and emotional wellness.',
        gratitude: 'Generate a gratitude-focused journaling prompt.',
        cbt: 'Generate a CBT-based journaling prompt for challenging negative thoughts.',
        mindfulness: 'Generate a mindfulness journaling prompt for present-moment awareness.'
      }
      
      const response = await getAIResponse(prompts[type] || prompts.general)
      setLoading(false)
      return response
    } catch (error) {
      console.error('Prompt generation error:', error)
      setLoading(false)
      return getDefaultPrompt(type)
    }
  }

  const getDefaultPrompt = (type) => {
    const defaults = {
      general: "What's one thing that made you smile today, even if it was small?",
      gratitude: "List three things you're grateful for today, no matter how simple.",
      cbt: "Describe a negative thought you had today. What evidence supports or contradicts it?",
      mindfulness: "Take a moment to notice five things you can see, four you can touch, three you can hear, two you can smell, and one you can taste."
    }
    return defaults[type] || defaults.general
  }

  const getCopingSuggestion = async (mood) => {
    setLoading(true)
    try {
      const prompt = `Based on feeling ${mood}, suggest 3 brief coping activities (each under 15 words). Format as a simple list.`
      const response = await getAIResponse(prompt)
      setLoading(false)
      return response.split('\n').filter(s => s.trim())
    } catch (error) {
      console.error('Coping suggestion error:', error)
      setLoading(false)
      return getDefaultCopingActivities(mood)
    }
  }

  const getDefaultCopingActivities = (mood) => {
    const activities = {
      anxious: ['Take 5 deep breaths', 'Go for a short walk', 'Listen to calming music'],
      sad: ['Call a friend', 'Watch something funny', 'Practice gratitude'],
      angry: ['Do physical exercise', 'Write down your feelings', 'Count to 10 slowly'],
      stressed: ['Practice meditation', 'Organize your space', 'Take a warm bath'],
      default: ['Practice deep breathing', 'Go outside for fresh air', 'Stretch your body']
    }
    return activities[mood.toLowerCase()] || activities.default
  }

  const recordCopingActivity = (activity) => {
    const newActivity = {
      id: uuidv4(),
      ...activity,
      timestamp: new Date().toISOString()
    }
    setCopingActivities(prev => [newActivity, ...prev])
    return newActivity
  }

  const getMoodTrends = () => {
    const last7Days = moods
      .filter(m => {
        const date = new Date(m.timestamp)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return date > weekAgo
      })
      .map(m => ({
        date: new Date(m.timestamp).toLocaleDateString(),
        mood: m.emotion,
        intensity: m.intensity || 5
      }))
    
    return last7Days.reverse()
  }

  const getStats = () => {
    const today = new Date()
    const todayMoods = moods.filter(m => {
      const moodDate = new Date(m.timestamp)
      return moodDate.toDateString() === today.toDateString()
    })
    
    const todayJournals = journals.filter(j => {
      const journalDate = new Date(j.timestamp)
      return journalDate.toDateString() === today.toDateString()
    })
    
    const weekMoods = moods.filter(m => {
      const moodDate = new Date(m.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return moodDate > weekAgo
    })
    
    return {
      todayMoodCheckins: todayMoods.length,
      todayJournalEntries: todayJournals.length,
      weeklyMoodCount: weekMoods.length,
      totalJournals: journals.length,
      streak: calculateStreak()
    }
  }

  const calculateStreak = () => {
    if (moods.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      
      const hasEntry = moods.some(m => {
        const moodDate = new Date(m.timestamp)
        moodDate.setHours(0, 0, 0, 0)
        return moodDate.getTime() === checkDate.getTime()
      })
      
      if (hasEntry) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    
    return streak
  }

  const value = {
    moods,
    journals,
    copingActivities,
    loading,
    addMood,
    addJournal,
    getJournalingPrompt,
    getCopingSuggestion,
    recordCopingActivity,
    getMoodTrends,
    getStats
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
