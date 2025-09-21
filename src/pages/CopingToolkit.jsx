import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wind, 
  Heart, 
  Music, 
  Palette, 
  Coffee,
  Book,
  Smile,
  Sun,
  Moon,
  Cloud,
  Star,
  Zap,
  Shield,
  Feather,
  Flower2
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const CopingToolkit = () => {
  const { getCopingSuggestion, recordCopingActivity, moods, loading } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [customSuggestions, setCustomSuggestions] = useState([])
  const [completedActivities, setCompletedActivities] = useState([])

  const categories = [
    { id: 'all', label: 'All', icon: Star, color: 'purple' },
    { id: 'breathe', label: 'Breathing', icon: Wind, color: 'blue' },
    { id: 'mindful', label: 'Mindfulness', icon: Sun, color: 'yellow' },
    { id: 'move', label: 'Movement', icon: Zap, color: 'green' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'pink' },
    { id: 'comfort', label: 'Comfort', icon: Heart, color: 'red' }
  ]

  const copingActivities = {
    breathe: [
      {
        id: 'box-breathing',
        title: 'Box Breathing',
        description: 'Breathe in 4, hold 4, out 4, hold 4',
        duration: '2 min',
        icon: Wind,
        color: 'blue',
        steps: [
          'Breathe in for 4 counts',
          'Hold for 4 counts',
          'Breathe out for 4 counts',
          'Hold for 4 counts',
          'Repeat 4 times'
        ]
      },
      {
        id: '478-breathing',
        title: '4-7-8 Breathing',
        description: 'Calming breath technique',
        duration: '1 min',
        icon: Cloud,
        color: 'cyan',
        steps: [
          'Breathe in for 4 counts',
          'Hold for 7 counts',
          'Breathe out for 8 counts',
          'Repeat 3 times'
        ]
      }
    ],
    mindful: [
      {
        id: '5-senses',
        title: '5 Senses Grounding',
        description: 'Ground yourself in the present',
        duration: '3 min',
        icon: Sun,
        color: 'yellow',
        steps: [
          'Name 5 things you can see',
          'Name 4 things you can touch',
          'Name 3 things you can hear',
          'Name 2 things you can smell',
          'Name 1 thing you can taste'
        ]
      },
      {
        id: 'body-scan',
        title: 'Body Scan',
        description: 'Release tension from head to toe',
        duration: '5 min',
        icon: Shield,
        color: 'purple',
        steps: [
          'Start at the top of your head',
          'Notice any tension',
          'Breathe and release',
          'Move down to your shoulders',
          'Continue to your toes'
        ]
      }
    ],
    move: [
      {
        id: 'stretch',
        title: 'Gentle Stretches',
        description: 'Release physical tension',
        duration: '5 min',
        icon: Zap,
        color: 'green',
        steps: [
          'Roll your shoulders back',
          'Stretch your neck side to side',
          'Reach arms overhead',
          'Twist gently left and right',
          'Touch your toes'
        ]
      },
      {
        id: 'walk',
        title: 'Mindful Walk',
        description: 'Take a short walk outside',
        duration: '10 min',
        icon: Feather,
        color: 'teal',
        steps: [
          'Step outside',
          'Walk at a comfortable pace',
          'Notice your surroundings',
          'Feel your feet on the ground',
          'Breathe fresh air'
        ]
      }
    ],
    creative: [
      {
        id: 'doodle',
        title: 'Free Doodling',
        description: 'Let your creativity flow',
        duration: '5 min',
        icon: Palette,
        color: 'pink',
        steps: [
          'Get paper and pen',
          'Start with random shapes',
          'Don\'t think, just draw',
          'Add patterns or colors',
          'Enjoy the process'
        ]
      },
      {
        id: 'music',
        title: 'Music Therapy',
        description: 'Listen to calming music',
        duration: '10 min',
        icon: Music,
        color: 'indigo',
        steps: [
          'Choose calming music',
          'Find a comfortable spot',
          'Close your eyes',
          'Focus on the melody',
          'Let the music wash over you'
        ]
      }
    ],
    comfort: [
      {
        id: 'tea',
        title: 'Warm Drink Ritual',
        description: 'Make a comforting beverage',
        duration: '5 min',
        icon: Coffee,
        color: 'orange',
        steps: [
          'Boil water mindfully',
          'Choose your favorite tea',
          'Pour slowly and carefully',
          'Hold the warm cup',
          'Sip slowly and savor'
        ]
      },
      {
        id: 'gratitude',
        title: 'Gratitude List',
        description: 'Focus on the positive',
        duration: '3 min',
        icon: Heart,
        color: 'red',
        steps: [
          'Get a piece of paper',
          'Write 3 things you\'re grateful for',
          'Be specific',
          'Feel the gratitude',
          'Keep it somewhere visible'
        ]
      }
    ]
  }

  useEffect(() => {
    // Get AI suggestions based on recent mood
    if (moods.length > 0) {
      const latestMood = moods[0]
      loadSuggestions(latestMood.emotion)
    }
  }, [moods])

  const loadSuggestions = async (mood) => {
    const suggestions = await getCopingSuggestion(mood)
    if (Array.isArray(suggestions)) {
      setCustomSuggestions(suggestions)
    }
  }

  const getFilteredActivities = () => {
    if (selectedCategory === 'all') {
      return Object.values(copingActivities).flat()
    }
    return copingActivities[selectedCategory] || []
  }

  const handleActivityComplete = (activity) => {
    recordCopingActivity({
      activityId: activity.id,
      title: activity.title,
      category: selectedCategory
    })
    
    setCompletedActivities(prev => [...prev, activity.id])
    
    // Remove from completed after animation
    setTimeout(() => {
      setCompletedActivities(prev => prev.filter(id => id !== activity.id))
    }, 2000)
  }

  const [expandedActivity, setExpandedActivity] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="card mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Calm Currents Toolkit
        </h1>
        <p className="text-muted-foreground">
          Ride the waves of tranquility with personalized bubble relief activities
        </p>
      </div>

      {/* AI Suggestions */}
      {customSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 bg-accent/10"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2 text-accent" />
            Personalized Relief Activities
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {customSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 card-hover rounded-2xl cursor-pointer"
              >
                <p className="text-sm font-medium">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map(cat => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          
          return (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r from-accent/10 to-accent/20 shadow-lg`
                  : 'card-hover'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-accent' : 'text-muted-foreground'} />
              <span className={`font-medium ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>
                {cat.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Activity Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence>
          {getFilteredActivities().map((activity, index) => {
            const Icon = activity.icon
            const isExpanded = expandedActivity === activity.id
            const isCompleted = completedActivities.includes(activity.id)
            
            return (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: isCompleted ? 1.05 : 1,
                  rotate: isCompleted ? [0, 5, -5, 0] : 0
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className={`card hover:shadow-xl transition-all duration-300 ${
                  isCompleted ? 'bg-accent/10' : ''
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-full bg-accent/20">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                      {activity.duration}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 border-t border-accent/20">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Steps:
                        </p>
                        <ol className="space-y-2 mb-4">
                          {activity.steps.map((step, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-accent font-medium mr-2">{idx + 1}.</span>
                              <span className="text-sm text-muted-foreground">{step}</span>
                            </li>
                          ))}
                        </ol>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleActivityComplete(activity)
                          }}
                          className="w-full btn-primary text-sm"
                        >
                          {isCompleted ? '✓ Completed!' : 'Mark as Complete'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>


    </motion.div>
  )
}

export default CopingToolkit
