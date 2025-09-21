// AI Service for handling Gemini API calls for Bubble Mental Wellness App
// Note: In production, the API key should be handled server-side for security

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

// 1. Mood Check-In: Emotion Understanding & Bubble Classification
export const analyzeMoodBubble = async (userInput) => {
  const prompt = `You are an empathetic mental wellness AI for the "Bubble" app. 
User said: "${userInput}"

Analyze their emotional state and respond with a JSON object containing:
- mood: primary emotion (e.g., "anxious", "sad", "hopeful", "mixed")
- intensity: "low", "medium", or "high"
- bubbleEmoji: appropriate emoji for their mood bubble
- supportiveMessage: brief, warm message (20-30 words)
- secondaryEmotions: array of 1-2 additional emotions if present

Example format:
{
  "mood": "anxious",
  "intensity": "medium", 
  "bubbleEmoji": "😰",
  "supportiveMessage": "It's completely normal to feel anxious. You're brave for sharing this.",
  "secondaryEmotions": ["hopeful"]
}

Only respond with valid JSON.`

  try {
    const response = await callGeminiAPI(prompt, 0.3)
    return JSON.parse(response)
  } catch (error) {
    return getFallbackMoodAnalysis(userInput)
  }
}

// 2. Journaling Companion: Reflection + CBT Techniques
export const generateJournalCompanion = async (journalEntry, userMood = null) => {
  const moodContext = userMood ? `Their current mood bubble is: ${userMood.mood} (${userMood.intensity} intensity).` : ''
  
  const prompt = `You are a supportive journaling companion for the "Bubble" app.
${moodContext}
User journal entry: "${journalEntry}"

Provide a JSON response with:
- acknowledgment: empathetic validation of their feelings (20-30 words)
- cbtReframe: gentle positive reframe using CBT techniques (30-40 words)
- followUpPrompt: thoughtful question to continue reflection (15-25 words)
- encouragement: warm, hopeful message (15-20 words)

Example format:
{
  "acknowledgment": "I hear how overwhelmed you're feeling right now. That pressure is really weighing on you.",
  "cbtReframe": "Remember that one challenging moment doesn't define your abilities. You've overcome difficulties before and grown stronger.",
  "followUpPrompt": "What's one small thing you could do today that might help you feel more prepared?",
  "encouragement": "You're already taking positive steps by writing about this. That takes courage."
}

Keep responses youth-appropriate, gentle, and hopeful. Only respond with valid JSON.`

  try {
    const response = await callGeminiAPI(prompt, 0.4)
    return JSON.parse(response)
  } catch (error) {
    return getFallbackJournalResponse(journalEntry)
  }
}

// 3. Coping Toolkit: Mood-Based Micro-Actions
export const generateCopingBubbles = async (mood, intensity, context = '') => {
  const prompt = `You are a wellness coach for the "Bubble" app.
User's current state: ${mood} (${intensity} intensity)
Context: ${context}

Suggest 3 "bubble relief" micro-actions (2-5 minutes each) that are:
- Age-appropriate for youth
- Specific and actionable
- Mood-appropriate for ${mood} feelings

Return JSON format:
{
  "activities": [
    {
      "name": "Breathing Bubble",
      "description": "Try the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8",
      "duration": "2 minutes",
      "type": "breathing"
    },
    {
      "name": "Movement Bubble", 
      "description": "Take 10 deep breaths while doing gentle arm circles",
      "duration": "3 minutes",
      "type": "movement"
    },
    {
      "name": "Mindful Bubble",
      "description": "Name 5 things you can see, 4 you can touch, 3 you can hear",
      "duration": "5 minutes", 
      "type": "grounding"
    }
  ],
  "encouragingNote": "Small actions can create big shifts in how you feel. You've got this!"
}

Only respond with valid JSON.`

  try {
    const response = await callGeminiAPI(prompt, 0.6)
    return JSON.parse(response)
  } catch (error) {
    return getFallbackCopingActivities(mood, intensity)
  }
}

// 4. Daily Encouragement & Personalized Affirmations
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

// 5. Bubble Insights: Weekly Pattern Analysis & Data Storytelling
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

// Legacy OpenAI support for backwards compatibility
export const getAIResponse = async (prompt, maxTokens = 100) => {
  try {
    // Try Gemini first, fallback to simple response
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

// Fallback mood analysis when AI is unavailable
const getFallbackMoodAnalysis = (userInput) => {
  const emotions = {
    'sad': { emoji: '😢', intensity: 'medium' },
    'happy': { emoji: '😊', intensity: 'medium' },
    'anxious': { emoji: '😰', intensity: 'medium' },
    'angry': { emoji: '😤', intensity: 'medium' },
    'tired': { emoji: '😴', intensity: 'low' },
    'excited': { emoji: '🤗', intensity: 'high' },
    'worried': { emoji: '😟', intensity: 'medium' },
    'hopeful': { emoji: '🌟', intensity: 'medium' },
    'empty': { emoji: '😶', intensity: 'low' },
    'overwhelmed': { emoji: '😵', intensity: 'high' }
  }

  const inputLower = userInput.toLowerCase()
  let detectedMood = 'mixed'
  let detectedEmoji = '💭'
  let intensity = 'medium'

  for (const [emotion, data] of Object.entries(emotions)) {
    if (inputLower.includes(emotion)) {
      detectedMood = emotion
      detectedEmoji = data.emoji
      intensity = data.intensity
      break
    }
  }

  return {
    mood: detectedMood,
    intensity: intensity,
    bubbleEmoji: detectedEmoji,
    supportiveMessage: "Your feelings are completely valid. Thank you for sharing with me.",
    secondaryEmotions: []
  }
}

// Fallback journal response
const getFallbackJournalResponse = (entry) => {
  return {
    acknowledgment: "I can hear the emotions in your words. Thank you for trusting me with your thoughts.",
    cbtReframe: "Sometimes our minds focus on challenges, but you have strengths that have helped you before.",
    followUpPrompt: "What's one thing that usually helps you feel a bit better?",
    encouragement: "Writing about your feelings takes courage. You're taking care of yourself."
  }
}

// Fallback coping activities
const getFallbackCopingActivities = (mood, intensity) => {
  const baseActivities = {
    breathing: {
      name: "Breathing Bubble",
      description: "Try the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8",
      duration: "2 minutes",
      type: "breathing"
    },
    movement: {
      name: "Gentle Movement",
      description: "Do some light stretching or walk around your space slowly",
      duration: "3 minutes", 
      type: "movement"
    },
    grounding: {
      name: "5-4-3-2-1 Grounding",
      description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
      duration: "5 minutes",
      type: "grounding"
    }
  }

  return {
    activities: Object.values(baseActivities),
    encouragingNote: "Small actions can create big shifts. You're taking good care of yourself."
  }
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
