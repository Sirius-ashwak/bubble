import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, MessageCircle, Palette, Sparkles, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { emotionCategories, getEmotionColor, getEmotionIcon, getEmotionGradient } from '../utils/emotionData'
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
      icon: selectedEmotion?.icon || null,
      gradient: selectedEmotion?.gradient || 'from-gray-200 to-gray-300',
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
      <div className="card mb-6">
        <h1 className="text-3xl font-bold text-center text-foreground mb-2">
          Pop Your Feeling Bubble
        </h1>
        <p className="text-center text-muted-foreground">
          Let your emotions float to the surface and be acknowledged
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-background border border-border rounded-full p-1 shadow-lg">
          <button
            onClick={() => setView('wheel')}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
              view === 'wheel' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
          >
            <Palette size={18} />
            <span>Emotion Wheel</span>
          </button>
          <button
            onClick={() => setView('text')}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
              view === 'text' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
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
              <div key={category} className="card">
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {category === 'pleasant' ? '✨ Pleasant Feelings' : '🌧️ Difficult Feelings'}
                </h3>
                
                {Object.entries(energyLevels).map(([energy, emotions]) => (
                  <div key={energy} className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2 capitalize">
                      {energy.replace(/([A-Z])/g, ' $1').trim()} Energy
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {emotions.map((emotion) => (
                        <motion.button
                          key={emotion.name}
                          onClick={() => handleEmotionSelect(emotion)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`group relative overflow-hidden rounded-2xl px-6 py-4 transition-all duration-300 shadow-lg hover:shadow-xl ${
                            selectedEmotion?.name === emotion.name
                              ? 'ring-3 ring-accent ring-offset-2 shadow-2xl'
                              : 'hover:shadow-xl'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${emotion.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                          <div className="relative flex items-center space-x-3">
                            {(() => {
                              const IconComponent = emotion.icon
                              return (
                                <div className={`p-2 rounded-xl bg-gradient-to-br ${emotion.gradient} shadow-sm`}>
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                              )
                            })()}
                            <span className="font-semibold text-foreground group-hover:text-accent transition-colors">{emotion.name}</span>
                          </div>
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
                className="card"
              >
                <h3 className="text-lg font-semibold mb-4">How intense is this feeling?</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
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
                    className="w-full h-2 bg-accent/30 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center">
                    <span className="text-3xl font-bold text-accent">{intensity}</span>
                    <span className="text-muted-foreground">/10</span>
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
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">Express your feelings freely</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I feel empty, tired, but also a little hopeful... What emotions are bubbling up for you? What's happening in your world right now?"
              className="w-full h-40 p-4 rounded-2xl border-2 border-accent/20 focus:border-accent focus:outline-none resize-none bg-background text-foreground transition-colors"
            />
            
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                AI will help identify and understand your emotions
              </p>
              
              <button
                onClick={handleTextAnalysis}
                disabled={!description.trim() || analyzingText}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  description.trim() 
                    ? 'btn-primary hover:shadow-lg transform hover:scale-105' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
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
                className="mt-6 p-4 bg-accent/10 rounded-2xl border border-accent/20"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{aiAnalysis.bubbleEmoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-accent">
                        AI detected: {aiAnalysis.mood} ({aiAnalysis.intensity} intensity)
                      </h4>
                      <Heart size={16} className="text-accent" />
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      {aiAnalysis.supportiveMessage}
                    </p>
                    {aiAnalysis.secondaryEmotions && aiAnalysis.secondaryEmotions.length > 0 && (
                      <p className="text-xs text-accent">
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
            className="btn-primary px-8 py-3 text-lg font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Floating bubble...' : 'Pop Into Sanctuary'}
            <ChevronRight className="inline-block ml-2" size={20} />
          </button>
        </motion.div>
      )}

      {/* Selected Emotion Display */}
      {selectedEmotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-8 right-8 p-6 bg-background border border-border rounded-3xl shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center space-x-4">
            {(() => {
              const SelectedIcon = selectedEmotion.icon
              return (
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${selectedEmotion.gradient} shadow-lg`}>
                  <SelectedIcon className="w-6 h-6 text-white" />
                </div>
              )
            })()}
            <div>
              <p className="font-bold text-lg text-foreground">{selectedEmotion.name}</p>
              <p className="text-sm text-accent font-medium">Intensity: {intensity}/10</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default MoodCheckIn
