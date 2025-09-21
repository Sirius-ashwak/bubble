import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, RefreshCw, Sparkles, Heart, Brain, Sun, MessageCircle, Lightbulb } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateJournalCompanion } from '../utils/aiService'
import ReactMarkdown from 'react-markdown'

const JournalPage = () => {
  const { addJournal, getJournalingPrompt, loading, journals, moods } = useApp()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [promptType, setPromptType] = useState('general')
  const [showReflection, setShowReflection] = useState(false)
  const [reflection, setReflection] = useState('')
  const [aiCompanion, setAiCompanion] = useState(null)
  const [showCompanion, setShowCompanion] = useState(false)
  const [gettingCompanion, setGettingCompanion] = useState(false)

  const promptTypes = [
    { id: 'general', label: 'General', icon: Sparkles, color: 'purple' },
    { id: 'gratitude', label: 'Gratitude', icon: Heart, color: 'pink' },
    { id: 'cbt', label: 'CBT', icon: Brain, color: 'blue' },
    { id: 'mindfulness', label: 'Mindfulness', icon: Sun, color: 'yellow' }
  ]

  useEffect(() => {
    loadPrompt('general')
  }, [])

  const loadPrompt = async (type) => {
    setPromptType(type)
    const prompt = await getJournalingPrompt(type)
    setCurrentPrompt(prompt)
  }

  const getAICompanion = async () => {
    if (!content.trim()) return
    
    setGettingCompanion(true)
    try {
      // Get user's recent mood for context
      const recentMood = moods.length > 0 ? moods[0] : null
      const companion = await generateJournalCompanion(content, recentMood)
      setAiCompanion(companion)
      setShowCompanion(true)
    } catch (error) {
      console.error('Error getting AI companion:', error)
    } finally {
      setGettingCompanion(false)
    }
  }

  const handleSave = async () => {
    if (!content.trim()) return
    
    const journal = await addJournal({
      title: title || 'Untitled Entry',
      content,
      promptUsed: currentPrompt,
      type: promptType,
      aiCompanion // Save AI companion responses
    })
    
    if (journal.aiReflection) {
      setReflection(journal.aiReflection)
      setShowReflection(true)
    }
    
    // Reset after saving
    setTimeout(() => {
      setTitle('')
      setContent('')
      setShowReflection(false)
      setShowCompanion(false)
      setAiCompanion(null)
      loadPrompt('general')
    }, 3000)
  }

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="bubble-card bubble-shadow mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Thought Stream
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Let your thoughts flow like bubbles in a gentle stream
        </p>
      </div>

      {/* Prompt Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {promptTypes.map(type => {
          const Icon = type.icon
          const isActive = promptType === type.id
          
          return (
            <motion.button
              key={type.id}
              onClick={() => loadPrompt(type.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-r from-bubble-${type.color} to-bubble-purple/30 shadow-lg` 
                  : 'bg-white dark:bg-dark-card hover:shadow-md'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className={`text-sm font-medium ${isActive ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {type.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Current Prompt */}
      <AnimatePresence mode="wait">
        {currentPrompt && (
          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bubble-card bubble-shadow mb-6 bg-gradient-to-r from-bubble-purple/10 to-bubble-blue/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                  ✨ Today's Prompt
                </p>
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  {currentPrompt}
                </p>
              </div>
              <button
                onClick={() => loadPrompt(promptType)}
                disabled={loading}
                className="ml-4 p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-purple-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal Entry */}
      <div className="bubble-card bubble-shadow">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title (optional)"
          className="w-full text-xl font-semibold mb-4 p-2 bg-transparent border-b-2 border-bubble-purple/20 focus:border-purple-400 focus:outline-none transition-colors"
        />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing... Let your thoughts flow freely. This is your safe space."
          className="w-full h-96 p-4 rounded-2xl border-2 border-bubble-purple/20 focus:border-purple-400 focus:outline-none resize-none bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors font-serif text-lg leading-relaxed"
          style={{ minHeight: '400px' }}
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {wordCount} words • {Math.ceil(wordCount / 200)} min read
            </div>
            
            {content.length > 50 && (
              <button
                onClick={getAICompanion}
                disabled={gettingCompanion}
                className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center space-x-1"
              >
                <MessageCircle size={14} />
                <span>{gettingCompanion ? 'Listening...' : 'Get Companion'}</span>
              </button>
            )}
          </div>
          
          <button
            onClick={handleSave}
            disabled={!content.trim() || loading}
            className="bubble-btn bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:opacity-50"
          >
            <Save className="inline-block mr-2" size={18} />
            {loading ? 'Flowing to sanctuary...' : 'Save Stream'}
          </button>
        </div>
      </div>

      {/* AI Companion */}
      <AnimatePresence>
        {showCompanion && aiCompanion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bubble-card bubble-shadow bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Your Companion's Response</h3>
            </div>
            
            <div className="space-y-4">
              {/* Acknowledgment */}
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart size={16} className="text-pink-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Understanding</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{aiCompanion.acknowledgment}</p>
              </div>
              
              {/* CBT Reframe */}
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb size={16} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Gentle Perspective</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{aiCompanion.cbtReframe}</p>
              </div>
              
              {/* Follow-up Prompt */}
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles size={16} className="text-purple-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Reflection Question</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">{aiCompanion.followUpPrompt}</p>
              </div>
              
              {/* Encouragement */}
              <div className="p-3 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Sun size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Encouragement</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{aiCompanion.encouragement}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Reflection */}
      <AnimatePresence>
        {showReflection && reflection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bubble-card bubble-shadow bg-gradient-to-r from-bubble-mint/20 to-bubble-blue/20"
          >
            <h3 className="text-lg font-semibold mb-2 text-purple-600">💜 AI Reflection</h3>
            <ReactMarkdown className="text-gray-700 dark:text-gray-300">
              {reflection}
            </ReactMarkdown>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Entries Preview */}
      {journals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Thought Streams</h2>
          <div className="space-y-3">
            {journals.slice(0, 3).map(journal => (
              <motion.div
                key={journal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bubble-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {journal.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {journal.content}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(journal.timestamp).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default JournalPage
