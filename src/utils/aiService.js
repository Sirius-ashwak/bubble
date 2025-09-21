// AI Service for handling Gemini API calls for Bubble Mental Wellness App
// Simplified to essential functions only

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || null
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

// Core Gemini API call function
const callGeminiAPI = async (prompt, temperature = 0.7) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text.trim()
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw error
  }
}

// 1. Daily Encouragement & Personalized Affirmations
export const generateDailyEncouragement = async (userStats, recentMoods = []) => {
  const statsContext = `User stats: ${userStats.streak} day streak, ${userStats.totalJournals} thought streams, ${userStats.todayMoodCheckins} bubble pop-ins today.`
  const moodContext = recentMoods.length > 0 ? `Recent moods: ${recentMoods.map(m => m.emotion).join(', ')}.` : ''
  
  const prompt = `You are an encouraging AI companion for the "Bubble" app.
${statsContext}
${moodContext}

Create a personalized affirmation that:
- Acknowledges their consistency and effort
- Uses "bubble" themed language naturally
- Feels genuine and specific to their journey
- Is 20-40 words

Focus on their strengths and progress. Be warm and supportive.

Examples:
"Even when emotions feel heavy, you keep showing up for yourself. That's the kind of strength that creates lasting change."
"Your willingness to explore your feelings is like watching bubbles rise - each one brings you closer to clarity."

Just return the affirmation text, no JSON needed.`

  try {
    return await callGeminiAPI(prompt, 0.8)
  } catch (error) {
    return getFallbackEncouragement(userStats)
  }
}

// 2. Bubble Insights: Weekly Pattern Analysis & Data Storytelling
export const generateBubbleInsights = async (weeklyData) => {
  const { moods, journals, mostCommonEmotion, averageIntensity, peakDays, lowDays } = weeklyData
  
  const prompt = `You are a data storytelling AI for the "Bubble" app.
Weekly data:
- Total bubble pop-ins: ${moods.length}
- Thought streams: ${journals.length}  
- Most common emotion: ${mostCommonEmotion}
- Average float level: ${averageIntensity}/10
- Peak energy days: ${peakDays.join(', ')}
- Gentler days: ${lowDays.join(', ')}

Create supportive insights in JSON format:
{
  "headline": "Your Bubble Patterns This Week",
  "mainInsight": "2-3 sentence observation about their emotional patterns",
  "positivePattern": "Something they did well or a positive trend",
  "gentleObservation": "Kind observation about challenges, if any", 
  "actionableInsight": "One small suggestion for the coming week",
  "celebration": "Recognition of their self-care efforts"
}

Use bubble/flow metaphors naturally. Be encouraging and focus on growth, not judgment.
Only respond with valid JSON.`

  try {
    const response = await callGeminiAPI(prompt, 0.5)
    return JSON.parse(response)
  } catch (error) {
    return getFallbackInsights(weeklyData)
  }
}

// Legacy support for backwards compatibility
export const getAIResponse = async (prompt, maxTokens = 100) => {
  try {
    const response = await callGeminiAPI(prompt, 0.7)
    return response
  } catch (error) {
    return getFallbackResponse(prompt)
  }
}

// Fallback responses when AI is not available
const getFallbackResponse = (prompt) => {
  const promptLower = prompt.toLowerCase()
  
  if (promptLower.includes('mood') || promptLower.includes('feeling')) {
    const moodResponses = [
      "Your feelings are valid and important.",
      "It's okay to feel this way. You're not alone.",
      "Thank you for sharing how you feel.",
      "Every emotion is temporary, even the difficult ones.",
      "You're taking a great step by acknowledging your feelings."
    ]
    return moodResponses[Math.floor(Math.random() * moodResponses.length)]
  }
  
  if (promptLower.includes('journal')) {
    const journalPrompts = [
      "What are three things that went well today?",
      "Describe a moment today when you felt at peace.",
      "What's one thing you're looking forward to?",
      "Write about someone who makes you smile.",
      "What's a small victory you had recently?",
      "Describe your ideal safe space.",
      "What would you tell your younger self?",
      "List five things you're grateful for.",
      "What emotions did you experience today?",
      "Write about a time you overcame a challenge."
    ]
    return journalPrompts[Math.floor(Math.random() * journalPrompts.length)]
  }
  
  if (promptLower.includes('coping') || promptLower.includes('activity')) {
    const copingActivities = [
      "Try the 4-7-8 breathing technique",
      "Go for a 5-minute walk",
      "Listen to your favorite calming song",
      "Write three things you're grateful for",
      "Do some gentle stretches",
      "Draw or doodle for a few minutes",
      "Call or text someone you trust",
      "Practice progressive muscle relaxation",
      "Watch something that makes you laugh",
      "Organize a small space around you"
    ]
    return copingActivities.slice(0, 3).join('\n')
  }
  
  // Default supportive responses
  const supportiveResponses = [
    "You're doing great by taking care of your mental health.",
    "Remember, it's okay to take things one step at a time.",
    "Your wellbeing matters, and you deserve support.",
    "Every small step counts towards feeling better.",
    "You're stronger than you know."
  ]
  
  return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)]
}

// Fallback encouragement
const getFallbackEncouragement = (userStats) => {
  const encouragements = [
    "Your consistency in checking in with yourself shows real self-awareness and care.",
    "Each time you visit your bubble sanctuary, you're building emotional resilience.",
    "The fact that you keep returning here shows your commitment to your wellbeing.",
    "Every thought stream and feeling bubble you explore helps you understand yourself better."
  ]
  
  return encouragements[Math.floor(Math.random() * encouragements.length)]
}

// Fallback insights
const getFallbackInsights = (weeklyData) => {
  return {
    headline: "Your Bubble Patterns This Week",
    mainInsight: "You've been actively engaging with your emotional wellbeing this week.",
    positivePattern: "Your willingness to check in with yourself consistently is a great strength.",
    gentleObservation: "Remember that all emotions are temporary and valid parts of your experience.",
    actionableInsight: "Continue being gentle with yourself as you explore your feelings.",
    celebration: "You're building important self-awareness skills by using this space regularly."
  }
}
