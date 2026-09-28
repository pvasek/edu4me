import { Suspense, useEffect } from 'react'
import { lazyWithReload } from './core/staleBuild'
import { RouteErrorBoundary } from './ui/RouteErrorBoundary'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AppHeader } from './ui/AppHeader'
import { Toasts } from './ui/Toasts'
import { Loading } from './ui/Loading'
import { useProgress } from './core/progress'
import { HomePage } from './pages/HomePage'
import { CoursePage } from './pages/CoursePage'
import { LevelPage } from './pages/LevelPage'
import { NotFound } from './pages/NotFound'

const LessonPage = lazyWithReload(() => import('./pages/LessonPage'))
const LevelTestPage = lazyWithReload(() => import('./pages/LevelTestPage'))
const GamesPage = lazyWithReload(() => import('./pages/GamesPage'))
const GamePage = lazyWithReload(() => import('./pages/GamePage'))
const ProfilePage = lazyWithReload(() => import('./pages/ProfilePage'))
const PrivacyPage = lazyWithReload(() => import('./pages/PrivacyPage'))

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
    <MotionConfig reducedMotion="user">
    <HashRouter>
      <ThemeSync />
      <ScrollTop />
      <AppHeader />
      <RouteErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/soukromi" element={<PrivacyPage />} />
          <Route path="/c/:courseId" element={<CoursePage />} />
          <Route path="/c/:courseId/hry" element={<GamesPage />} />
          <Route path="/c/:courseId/hry/:gameId" element={<GamePage />} />
          <Route path="/c/:courseId/l/:levelId" element={<LevelPage />} />
          <Route path="/c/:courseId/l/:levelId/vyzva" element={<LevelTestPage />} />
          <Route path="/c/:courseId/l/:levelId/:lessonId" element={<LessonPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </RouteErrorBoundary>
      <Toasts />
    </HashRouter>
    </MotionConfig>
  )
}
