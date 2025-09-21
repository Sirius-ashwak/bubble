import { 
  Zap, Smile, PartyPopper, Sparkles, Battery,
  Heart, Award, Star, Compass, TrendingUp,
  Moon, Waves, Leaf, Check, Circle,
  Flame, Frown, AlertTriangle, Cloud, Dizzy,
  AlertCircle, Eye, Shuffle, HelpCircle, Minus,
  Droplets, CircleDot, Sleep, Square, Volume
} from 'lucide-react'

export const emotionCategories = {
  pleasant: {
    highEnergy: [
      { name: 'Ecstatic', color: '#FFD700', icon: Zap, gradient: 'from-yellow-400 to-yellow-600' },
      { name: 'Elated', color: '#FFA500', icon: Smile, gradient: 'from-orange-400 to-orange-600' },
      { name: 'Excited', color: '#FF8C00', icon: PartyPopper, gradient: 'from-orange-500 to-red-500' },
      { name: 'Enthusiastic', color: '#FF6347', icon: Sparkles, gradient: 'from-red-400 to-pink-500' },
      { name: 'Energized', color: '#FF7F50', icon: Battery, gradient: 'from-red-500 to-orange-500' }
    ],
    midEnergy: [
      { name: 'Happy', color: '#98D8C8', icon: Heart, gradient: 'from-teal-300 to-teal-500' },
      { name: 'Proud', color: '#7FD1B9', icon: Award, gradient: 'from-teal-400 to-green-500' },
      { name: 'Confident', color: '#6BCAAA', icon: Star, gradient: 'from-green-400 to-teal-500' },
      { name: 'Grateful', color: '#56C39B', icon: Compass, gradient: 'from-green-500 to-emerald-500' },
      { name: 'Optimistic', color: '#41BC8C', icon: TrendingUp, gradient: 'from-emerald-400 to-green-600' }
    ],
    lowEnergy: [
      { name: 'Calm', color: '#B8E6F5', icon: Moon, gradient: 'from-sky-300 to-blue-400' },
      { name: 'Peaceful', color: '#A1DDED', icon: Waves, gradient: 'from-blue-300 to-sky-500' },
      { name: 'Relaxed', color: '#8AD4E6', icon: Leaf, gradient: 'from-blue-400 to-cyan-500' },
      { name: 'Content', color: '#73CBDE', icon: Check, gradient: 'from-cyan-400 to-blue-500' },
      { name: 'Serene', color: '#5CC2D7', icon: Circle, gradient: 'from-cyan-500 to-teal-500' }
    ]
  },
  unpleasant: {
    highEnergy: [
      { name: 'Angry', color: '#FF4444', icon: Flame, gradient: 'from-red-500 to-red-700' },
      { name: 'Frustrated', color: '#FF6B6B', icon: Frown, gradient: 'from-red-400 to-red-600' },
      { name: 'Irritated', color: '#FF8888', icon: AlertTriangle, gradient: 'from-red-300 to-red-500' },
      { name: 'Stressed', color: '#FFA5A5', icon: Cloud, gradient: 'from-red-200 to-red-400' },
      { name: 'Overwhelmed', color: '#FFC2C2', icon: Dizzy, gradient: 'from-red-100 to-red-300' }
    ],
    midEnergy: [
      { name: 'Anxious', color: '#FFB366', icon: AlertCircle, gradient: 'from-orange-300 to-orange-500' },
      { name: 'Worried', color: '#FFC285', icon: Eye, gradient: 'from-orange-200 to-orange-400' },
      { name: 'Nervous', color: '#FFD1A3', icon: Shuffle, gradient: 'from-orange-100 to-orange-300' },
      { name: 'Confused', color: '#FFE0C2', icon: HelpCircle, gradient: 'from-orange-50 to-orange-200' },
      { name: 'Uncertain', color: '#FFEFE0', icon: Minus, gradient: 'from-orange-25 to-orange-100' }
    ],
    lowEnergy: [
      { name: 'Sad', color: '#9CA4D9', icon: Droplets, gradient: 'from-indigo-300 to-indigo-500' },
      { name: 'Lonely', color: '#B3B9E3', icon: CircleDot, gradient: 'from-indigo-200 to-indigo-400' },
      { name: 'Tired', color: '#CACEEC', icon: Sleep, gradient: 'from-indigo-100 to-indigo-300' },
      { name: 'Bored', color: '#E1E3F5', icon: Square, gradient: 'from-indigo-50 to-indigo-200' },
      { name: 'Numb', color: '#F8F9FF', icon: Volume, gradient: 'from-gray-50 to-indigo-100' }
    ]
  }
}

export const getAllEmotions = () => {
  const emotions = []
  Object.values(emotionCategories).forEach(category => {
    Object.values(category).forEach(energyLevel => {
      emotions.push(...energyLevel)
    })
  })
  return emotions
}

export const getEmotionColor = (emotionName) => {
  const emotion = getAllEmotions().find(e => e.name.toLowerCase() === emotionName.toLowerCase())
  return emotion?.color || '#D8E9FF'
}

export const getEmotionIcon = (emotionName) => {
  const emotion = getAllEmotions().find(e => e.name.toLowerCase() === emotionName.toLowerCase())
  return emotion?.icon || Circle
}

export const getEmotionGradient = (emotionName) => {
  const emotion = getAllEmotions().find(e => e.name.toLowerCase() === emotionName.toLowerCase())
  return emotion?.gradient || 'from-gray-200 to-gray-300'
}

export const getEmotionEmoji = (emotionName) => {
  const emotion = getAllEmotions().find(e => e.name.toLowerCase() === emotionName.toLowerCase())
  return emotion?.emoji || '💭'
}
