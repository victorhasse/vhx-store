import { useEffect, useRef, useState } from 'react'

export function useFadeIn(delay = 0) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return { ref, visible }
}

export function useScrollFadeIn() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}