import { useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { SceneCanvas } from './components/SceneCanvas'
import { WaitlistSheet } from './components/WaitlistSheet'
import { useSiteAnimations } from './lib/useSiteAnimations'

function App() {
  useSiteAnimations()

  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

  const openWaitlist = () => setWaitlistOpen(true)
  const closeWaitlist = () => setWaitlistOpen(false)

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-canvas font-sans text-black-90 antialiased">
      <SceneCanvas />
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero onJoin={openWaitlist} />
      </main>
      <Footer />
      <WaitlistSheet open={waitlistOpen} onClose={closeWaitlist} inputRef={emailInputRef} />
    </div>
  )
}

export default App
