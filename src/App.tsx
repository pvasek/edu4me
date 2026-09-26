import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppHeader } from './ui/AppHeader'
import { Toasts } from './ui/Toasts'
import { Loading } from './ui/Loading'
import { useProgress } from './core/progress'
import { HomePage } from './pages/HomePage'
import { CoursePage } from './pages/CoursePage'
import { LevelPage } from './pages/LevelPage'
import { NotFound } from './pages/NotFound'

const LessonPage = lazy(() => import('./pages/LessonPage'))
const LevelTestPage = lazy(() => import('./pages/LevelTestPage'))
const GamesPage = lazy(() => import('./pages/GamesPage'))
const GamePage = lazy(() => import('./pages/GamePage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

function ThemeSync() {
  const { theme } = useProgress().settings
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])
  return null
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export function App() {
  return (
    <HashRouter>
      <ThemeSync />
      <ScrollTop />
      <AppHeader />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/c/:courseId" element={<CoursePage />} />
          <Route path="/c/:courseId/hry" element={<GamesPage />} />
          <Route path="/c/:courseId/hry/:gameId" element={<GamePage />} />
          <Route path="/c/:courseId/l/:levelId" element={<LevelPage />} />
          <Route path="/c/:courseId/l/:levelId/vyzva" element={<LevelTestPage />} />
          <Route path="/c/:courseId/l/:levelId/:lessonId" element={<LessonPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toasts />
    </HashRouter>
  )
}
