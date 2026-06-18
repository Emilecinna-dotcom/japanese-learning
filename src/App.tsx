import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { HiraganaPage } from '@/pages/HiraganaPage'
import { KatakanaPage } from '@/pages/KatakanaPage'
import { KanjiPage } from '@/pages/KanjiPage'
import { VocabulairePage } from '@/pages/VocabulairePage'
import { GrammairePage } from '@/pages/GrammairePage'
import { FlashcardsPage } from '@/pages/FlashcardsPage'
import { ProgressionPage } from '@/pages/ProgressionPage'
import { TelephonePage } from '@/pages/TelephonePage'
import { useProgress, ProgressContext } from '@/hooks/useProgress'

// Router is created once at module level; pages read progress via context
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'hiragana', element: <HiraganaPage /> },
      { path: 'katakana', element: <KatakanaPage /> },
      { path: 'kanji', element: <KanjiPage /> },
      { path: 'vocabulaire', element: <VocabulairePage /> },
      { path: 'grammaire', element: <GrammairePage /> },
      { path: 'flashcards', element: <FlashcardsPage /> },
      { path: 'telephone', element: <TelephonePage /> },
      { path: 'progression', element: <ProgressionPage /> },
    ],
  },
])

export default function App() {
  const progressCtx = useProgress()
  return (
    <ProgressContext.Provider value={progressCtx}>
      <RouterProvider router={router} />
    </ProgressContext.Provider>
  )
}
