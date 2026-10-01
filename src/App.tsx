import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { HiraganaPage } from '@/pages/HiraganaPage'
import { KatakanaPage } from '@/pages/KatakanaPage'
import { KanjiPage } from '@/pages/KanjiPage'
import { VocabulairePage } from '@/pages/VocabulairePage'
import { GrammairePage } from '@/pages/GrammairePage'
import { FlashcardsPage } from '@/pages/FlashcardsPage'
import { SessionDuJourPage } from '@/pages/SessionDuJourPage'
import { ParcoursPage } from '@/pages/ParcoursPage'
import { ParcoursLessonPage } from '@/pages/ParcoursLessonPage'
import { ProductionPage } from '@/pages/ProductionPage'
import { PrononciationPage } from '@/pages/PrononciationPage'
import { MesMotsPage } from '@/pages/MesMotsPage'
import { ProgressionPage } from '@/pages/ProgressionPage'
import { TelephonePage } from '@/pages/TelephonePage'
import { EcriturePage } from '@/pages/EcriturePage'
import { ChiffresPage } from '@/pages/ChiffresPage'
import { PhrasesPage } from '@/pages/PhrasesPage'
import { ConjugaisonPage } from '@/pages/ConjugaisonPage'
import { CompteursPage } from '@/pages/CompteursPage'
import { ParticulesPage } from '@/pages/ParticulesPage'
import { LecturePage } from '@/pages/LecturePage'
import { JLPTPage } from '@/pages/JLPTPage'
import { EcoutePage } from '@/pages/EcoutePage'
import { ExercicesPage } from '@/pages/ExercicesPage'
import { OnomatopeesPage } from '@/pages/OnomatopeesPage'
import { KeigoPage } from '@/pages/KeigoPage'
import { JeuxHubPage } from '@/pages/jeux/JeuxHubPage'
import { MemoirePage } from '@/pages/jeux/MemoirePage'
import { BlitzPage } from '@/pages/jeux/BlitzPage'
import { PluiePage } from '@/pages/jeux/PluiePage'
import { OrdrePage } from '@/pages/jeux/OrdrePage'
import { useProgress, ProgressContext } from '@/hooks/useProgress'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'session', element: <SessionDuJourPage /> },
      { path: 'parcours', element: <ParcoursPage /> },
      { path: 'parcours/:lessonId', element: <ParcoursLessonPage /> },
      { path: 'production', element: <ProductionPage /> },
      { path: 'prononciation', element: <PrononciationPage /> },
      { path: 'mots', element: <MesMotsPage /> },
      { path: 'hiragana', element: <HiraganaPage /> },
      { path: 'katakana', element: <KatakanaPage /> },
      { path: 'kanji', element: <KanjiPage /> },
      { path: 'vocabulaire', element: <VocabulairePage /> },
      { path: 'grammaire', element: <GrammairePage /> },
      { path: 'flashcards', element: <FlashcardsPage /> },
      { path: 'telephone', element: <TelephonePage /> },
      { path: 'ecriture', element: <EcriturePage /> },
      { path: 'chiffres', element: <ChiffresPage /> },
      { path: 'phrases', element: <PhrasesPage /> },
      { path: 'progression', element: <ProgressionPage /> },
      { path: 'conjugaison', element: <ConjugaisonPage /> },
      { path: 'compteurs', element: <CompteursPage /> },
      { path: 'particules', element: <ParticulesPage /> },
      { path: 'lecture', element: <LecturePage /> },
      { path: 'jlpt', element: <JLPTPage /> },
      { path: 'ecoute', element: <EcoutePage /> },
      { path: 'exercices', element: <ExercicesPage /> },
      { path: 'onomatopees', element: <OnomatopeesPage /> },
      { path: 'keigo', element: <KeigoPage /> },
      { path: 'jeux', element: <JeuxHubPage /> },
      { path: 'jeux/memoire', element: <MemoirePage /> },
      { path: 'jeux/blitz', element: <BlitzPage /> },
      { path: 'jeux/pluie', element: <PluiePage /> },
      { path: 'jeux/ordre', element: <OrdrePage /> },
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
