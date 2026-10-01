import { useState, useEffect } from 'react'
import { ArrowRight, BookOpen, Gamepad2, Zap } from 'lucide-react'

const STORAGE_KEY = 'nihongo_welcomed'

const FEATURES = [
  {
    icon: <span className="font-jp-serif text-2xl font-bold leading-none text-rose-500">あ</span>,
    title: 'Kana & Kanji',
    desc: 'Hiragana, katakana et 103 kanji N5 avec quiz et écriture.',
  },
  {
    icon: <BookOpen size={22} className="text-amber-500" />,
    title: 'Vocabulaire & Grammaire',
    desc: 'Thèmes du quotidien, particules, conjugaison, phrases utiles.',
  },
  {
    icon: <Gamepad2 size={22} className="text-teal-500" />,
    title: 'Jeux',
    desc: 'Mémoire, blitz chrono, pluie de kana, ordre des mots.',
  },
  {
    icon: <Zap size={22} className="text-primary" />,
    title: 'Répétition espacée',
    desc: 'Flashcards SRS pour ancrer ce que tu apprends dans la durée.',
  },
]

export function WelcomeScreen() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    setLeaving(true)
    localStorage.setItem(STORAGE_KEY, '1')
    setTimeout(() => setVisible(false), 400)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-400 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className={`w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-400 ${
          leaving ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Header avec image */}
        <div className="relative h-36 overflow-hidden bg-black">
          <img
            src="/images/hero-tokyo.jpg"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          <div className="absolute bottom-4 left-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                <span className="font-jp-serif text-white text-lg font-bold leading-none">日</span>
              </div>
              <div>
                <p className="font-bold text-white text-base leading-tight">Nihongo</p>
                <p className="text-white/55 text-xs tracking-wider">日本語学習</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              Apprends le japonais depuis le français
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Des hiragana jusqu'au niveau N5, tout ce qu'il faut pour lire, comprendre et parler japonais.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={dismiss}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Commencer l'aventure
            <ArrowRight size={16} />
          </button>

          <p className="text-center text-[10px] text-muted-foreground">
            Gratuit · Sans inscription · Tout en français
          </p>
        </div>
      </div>
    </div>
  )
}
