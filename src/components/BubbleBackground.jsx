import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState([])
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    // Generate premium floating orbs
    const generateBubbles = () => {
      const newBubbles = []
      for (let i = 0; i < 8; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 150 + 50,
          left: Math.random() * 100,
          delay: Math.random() * 10,
          duration: Math.random() * 20 + 30,
          colorVariant: Math.floor(Math.random() * 4)
        })
      }
      setBubbles(newBubbles)
    }
    
    // Generate small particles
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          size: Math.random() * 4 + 2,
          left: Math.random() * 100,
          delay: Math.random() * 15,
          duration: Math.random() * 15 + 10
        })
      }
      setParticles(newParticles)
    }
    
    generateBubbles()
    generateParticles()
  }, [])
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large floating orbs with gradient */}
      {bubbles.map(bubble => (
        <motion.div
          key={`bubble-${bubble.id}`}
          className="absolute rounded-full opacity-10"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            background: bubble.colorVariant === 0 ? 
              'radial-gradient(circle at 30% 30%, rgb(var(--accent) / 0.25), transparent 70%)' :
              bubble.colorVariant === 1 ?
              'radial-gradient(circle at 30% 30%, rgb(var(--foreground) / 0.15), transparent 70%)' :
              bubble.colorVariant === 2 ?
              'radial-gradient(circle at 30% 30%, rgb(var(--accent) / 0.35), transparent 70%)' :
              'radial-gradient(circle at 30% 30%, rgb(var(--foreground) / 0.2), transparent 70%)',
            filter: 'blur(40px)',
          }}
          initial={{ y: '110vh', x: 0, scale: 0 }}
          animate={{ 
            y: '-110vh',
            x: [0, 50, -30, 0],
            scale: [0, 1, 1, 0.5],
            opacity: [0, 0.15, 0.15, 0]
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Small glowing particles */}
      {particles.map(particle => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full bg-background"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            boxShadow: `0 0 ${particle.size * 2}px rgb(var(--foreground) / 0.8)`,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ 
            y: '-100vh',
            opacity: [0, 1, 1, 0],
            x: [0, Math.random() * 100 - 50]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
      
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(to top, rgb(var(--background) / 0.5), transparent, transparent)'
        }}
      />
    </div>
  )
}

export default BubbleBackground
