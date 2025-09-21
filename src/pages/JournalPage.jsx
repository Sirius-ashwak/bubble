import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, RefreshCw, Sparkles, Heart, Brain, Sun } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'

const JournalPage = () => {
  const { addJournal, getJournalingPrompt, loading, journals, moods } = useApp()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [promptType, setPromptType] = useState('general')
  const [showReflection, setShowReflection] = useState(false)
  const [reflection, setReflection] = useState('')

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

  const handleSave = async () => {
    if (!content.trim()) return
    
    const journal = await addJournal({
      title: title || 'Untitled Entry',
      content,
      promptUsed: currentPrompt,
      type: promptType
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
      <div className="card mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Thought Stream
        </h1>
        <p className="text-muted-foreground">
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
                  ? `bg-gradient-to-r from-accent/10 to-accent/20 shadow-lg` 
                  : 'card-hover'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>
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
            className="card mb-6 bg-accent/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-accent font-medium mb-1">
                  ✨ Today's Prompt
                </p>
                <p className="text-lg text-foreground">
                  {currentPrompt}
                </p>
              </div>
              <button
                onClick={() => loadPrompt(promptType)}
                disabled={loading}
                className="ml-4 p-2 rounded-full hover:bg-accent/10 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-accent ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal Entry */}
      <div className="card">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title (optional)"
          className="w-full text-xl font-semibold mb-4 p-2 bg-transparent border-b-2 border-accent/20 focus:border-accent focus:outline-none transition-colors"
        />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing... Let your thoughts flow freely. This is your safe space."
          className="w-full h-96 p-4 rounded-2xl border-2 border-accent/20 focus:border-accent focus:outline-none resize-none bg-background text-foreground placeholder-muted-foreground transition-colors font-serif text-lg leading-relaxed"
          style={{ minHeight: '400px' }}
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {wordCount} words • {Math.ceil(wordCount / 200)} min read
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={!content.trim() || loading}
            className="btn-primary disabled:opacity-50"
          >
            <Save className="inline-block mr-2" size={18} />
            {loading ? 'Flowing to sanctuary...' : 'Save Stream'}
          </button>
        </div>
      </div>

      {/* AI Reflection */}
      <AnimatePresence>
        {showReflection && reflection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 card bg-accent/10"
          >
            <h3 className="text-lg font-semibold mb-2 text-accent">💜 AI Reflection</h3>
            <ReactMarkdown className="text-foreground">
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
                className="card-hover"
                whileHover={{ x: 5 }}
              >
                <h3 className="font-semibold text-foreground mb-1">
                  {journal.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {journal.content}
                </p>
                <p className="text-xs text-muted-foreground">
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
