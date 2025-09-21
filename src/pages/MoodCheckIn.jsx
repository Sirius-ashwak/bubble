import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, MessageCircle, Palette, Sparkles, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { emotionCategories, getEmotionColor, getEmotionEmoji } from '../utils/emotionData'
import { analyzeMoodBubble } from '../utils/aiService'
import { useNavigate } from 'react-router-dom'

const MoodCheckIn = () => {
  const { addMood, loading } = useApp()
  const navigate = useNavigate()
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [intensity, setIntensity] = useState(5)
  const [description, setDescription] = useState('')
  const [view, setView] = useState('wheel') // 'wheel' or 'text'
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analyzingText, setAnalyzingText] = useState(false)

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion)
    setAiAnalysis(null) // Clear any previous AI analysis
  }

  const handleTextAnalysis = async () => {
    if (!description.trim()) return
    
    setAnalyzingText(true)
    try {
      const analysis = await analyzeMoodBubble(description)
      setAiAnalysis(analysis)
      
      // Auto-select the AI-detected emotion if available
      if (analysis.mood && analysis.mood !== 'mixed') {
        const foundEmotion = findEmotionByName(analysis.mood)
        if (foundEmotion) {
          setSelectedEmotion(foundEmotion)
        }
      }
      
      // Set intensity based on AI analysis
      const intensityMap = { low: 3, medium: 6, high: 9 }
      setIntensity(intensityMap[analysis.intensity] || 5)
      
    } catch (error) {
      console.error('Error analyzing mood:', error)
    } finally {
      setAnalyzingText(false)
    }
  }

  const findEmotionByName = (emotionName) => {
    for (const category of Object.values(emotionCategories)) {
      for (const energyLevel of Object.values(category)) {
        const found = energyLevel.find(e => e.name.toLowerCase() === emotionName.toLowerCase())
        if (found) return found
      }
    }
    return null
  }

  const handleSubmit = async () => {
    if (!selectedEmotion && !description) return
    
    const moodData = {
      emotion: selectedEmotion?.name || aiAnalysis?.mood || 'Undefined',
      emoji: selectedEmotion?.emoji || aiAnalysis?.bubbleEmoji || '💭',
      color: selectedEmotion?.color || '#D8E9FF',
      intensity,
      description,
      aiAnalysis // Store AI analysis for future insights
    }
    
    await addMood(moodData)
    
    // Reset and show success
    setSelectedEmotion(null)
    setIntensity(5)
    setDescription('')
    setAiAnalysis(null)
    
    // Navigate to dashboard after a moment
    setTimeout(() => {
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bubble-card bubble-shadow mb-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Pop Your Feeling Bubble
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Let your emotions float to the surface and be acknowledged
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white dark:bg-dark-card rounded-full p-1 shadow-lg">
          <button
            onClick={() => setView('wheel')}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
              view === 'wheel' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Palette size={18} />
            <span>Emotion Wheel</span>
          </button>
          <button
            onClick={() => setView('text')}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
              view === 'text' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <MessageCircle size={18} />
            <span>Free Text</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'wheel' ? (
          <motion.div
            key="wheel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            {/* Emotion Categories */}
            {Object.entries(emotionCategories).map(([category, energyLevels]) => (
              <div key={category} className="bubble-card bubble-shadow">
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {category === 'pleasant' ? '✨ Pleasant Feelings' : '🌧️ Difficult Feelings'}
                </h3>
                
                {Object.entries(energyLevels).map(([energy, emotions]) => (
                  <div key={energy} className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 capitalize">
                      {energy.replace(/([A-Z])/g, ' $1').trim()} Energy
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {emotions.map((emotion) => (
                        <motion.button
                          key={emotion.name}
                          onClick={() => handleEmotionSelect(emotion)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`emotion-bubble px-4 py-2 ${
                            selectedEmotion?.name === emotion.name
                              ? 'ring-4 ring-purple-400 shadow-lg'
                              : ''
                          }`}
                          style={{
                            backgroundColor: emotion.color + '30',
                            borderColor: emotion.color,
                            borderWidth: '2px'
                          }}
                        >
                          <span className="text-2xl mr-2">{emotion.emoji}</span>
                          <span className="font-medium">{emotion.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Intensity Slider */}
            {selectedEmotion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bubble-card bubble-shadow"
              >
                <h3 className="text-lg font-semibold mb-4">How intense is this feeling?</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Intense</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-400 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center">
                    <span className="text-3xl font-bold text-purple-600">{intensity}</span>
                    <span className="text-gray-500 dark:text-gray-400">/10</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bubble-card bubble-shadow"
          >
            <h3 className="text-lg font-semibold mb-4">Express your feelings freely</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I feel empty, tired, but also a little hopeful... What emotions are bubbling up for you? What's happening in your world right now?"
              className="w-full h-40 p-4 rounded-2xl border-2 border-bubble-purple/20 focus:border-purple-400 focus:outline-none resize-none bg-white dark:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100"
            />
            
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI will help identify and understand your emotions
              </p>
              
              <button
                onClick={handleTextAnalysis}
                disabled={!description.trim() || analyzingText}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  description.trim() 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transform hover:scale-105' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <Sparkles size={16} />
                <span>{analyzingText ? 'Analyzing...' : 'Analyze Emotions'}</span>
              </button>
            </div>

            {/* AI Analysis Result */}
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200/50"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{aiAnalysis.bubbleEmoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                        AI detected: {aiAnalysis.mood} ({aiAnalysis.intensity} intensity)
                      </h4>
                      <Heart size={16} className="text-pink-500" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {aiAnalysis.supportiveMessage}
                    </p>
                    {aiAnalysis.secondaryEmotions && aiAnalysis.secondaryEmotions.length > 0 && (
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        Also sensing: {aiAnalysis.secondaryEmotions.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {(selectedEmotion || description || aiAnalysis) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bubble-btn bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 text-lg font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Floating bubble...' : 'Pop Into Sanctuary'}
            <ChevronRight className="inline-block ml-2" size={20} />
          </button>
        </motion.div>
      )}

      {/* Selected Emotion Display */}
      {selectedEmotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 p-4 bg-white dark:bg-dark-card rounded-full shadow-2xl"
        >
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{selectedEmotion.emoji}</span>
            <div>
              <p className="font-semibold">{selectedEmotion.name}</p>
              <p className="text-sm text-gray-500">Intensity: {intensity}/10</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default MoodCheckIn
