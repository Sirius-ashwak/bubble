export const emotionCategories = {
  pleasant: {
    highEnergy: [
      { name: 'Ecstatic', color: '#FFD700', emoji: '🤩' },
      { name: 'Elated', color: '#FFA500', emoji: '😄' },
      { name: 'Excited', color: '#FF8C00', emoji: '🎉' },
      { name: 'Enthusiastic', color: '#FF6347', emoji: '✨' },
      { name: 'Energized', color: '#FF7F50', emoji: '💪' }
    ],
    midEnergy: [
      { name: 'Happy', color: '#98D8C8', emoji: '😊' },
      { name: 'Proud', color: '#7FD1B9', emoji: '😌' },
      { name: 'Confident', color: '#6BCAAA', emoji: '💫' },
      { name: 'Grateful', color: '#56C39B', emoji: '🙏' },
      { name: 'Optimistic', color: '#41BC8C', emoji: '🌟' }
    ],
    lowEnergy: [
      { name: 'Calm', color: '#B8E6F5', emoji: '😌' },
      { name: 'Peaceful', color: '#A1DDED', emoji: '☮️' },
      { name: 'Relaxed', color: '#8AD4E6', emoji: '😎' },
      { name: 'Content', color: '#73CBDE', emoji: '🙂' },
      { name: 'Serene', color: '#5CC2D7', emoji: '🧘' }
    ]
  },
  unpleasant: {
    highEnergy: [
      { name: 'Angry', color: '#FF4444', emoji: '😠' },
      { name: 'Frustrated', color: '#FF6B6B', emoji: '😤' },
      { name: 'Irritated', color: '#FF8888', emoji: '😒' },
      { name: 'Stressed', color: '#FFA5A5', emoji: '😰' },
      { name: 'Overwhelmed', color: '#FFC2C2', emoji: '😵' }
    ],
    midEnergy: [
      { name: 'Anxious', color: '#FFB366', emoji: '😟' },
      { name: 'Worried', color: '#FFC285', emoji: '😧' },
      { name: 'Nervous', color: '#FFD1A3', emoji: '😬' },
      { name: 'Confused', color: '#FFE0C2', emoji: '🤔' },
      { name: 'Uncertain', color: '#FFEFE0', emoji: '😕' }
    ],
    lowEnergy: [
      { name: 'Sad', color: '#9CA4D9', emoji: '😢' },
      { name: 'Lonely', color: '#B3B9E3', emoji: '😔' },
      { name: 'Tired', color: '#CACEEC', emoji: '😴' },
      { name: 'Bored', color: '#E1E3F5', emoji: '😑' },
      { name: 'Numb', color: '#F8F9FF', emoji: '😶' }
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

export const getEmotionEmoji = (emotionName) => {
  const emotion = getAllEmotions().find(e => e.name.toLowerCase() === emotionName.toLowerCase())
  return emotion?.emoji || '💭'
}
