import React, { useState, useEffect } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import _ from 'classnames'
import _debounce from 'lodash.debounce'
import { openSider, closeSider } from '@/redux/app/app-actions'

import { useTypedDispatch, useTypedSelector } from '@/redux'
import AppSider from './components/AppSider'
import AppHeader from './components/AppHeader'
import AppContent from './components/AppContent'
import AppFooter from './components/AppFooter'

export default function MainLayout() {
  const dispatch = useTypedDispatch()
  const routes = useTypedSelector(({ app }) => app.routes)
  const isSiderOpened = useTypedSelector(({ app }) => app.isSiderOpened)
  const handle = useFullScreenHandle()
  const [screen, setScreen] = useState(handle.active)

  useEffect(() => {
    const handleSider = _debounce(() => {
      if (window.innerWidth < 1300) {
        dispatch(closeSider())
      } else {
        dispatch(openSider())
      }
    }, 400)
    window.addEventListener('resize', handleSider)

    return () => {
      window.removeEventListener('resize', handleSider)
    }
  }, [dispatch])

  function switchFullscreen() {
    if (!handle.active) {
      handle.enter()
    } else {
      handle.exit()
    }
  }

  return (
    <FullScreen handle={handle} onChange={setScreen}>
      <aside className={_('app-aside', { 'menu-close': !isSiderOpened })}>
        <AppSider isSiderOpened={isSiderOpened} routes={routes} />
      </aside>

      <main className={_('app-main', { 'menu-close': !isSiderOpened })}>
        <header className={_('app-header', { 'menu-close': !isSiderOpened })}>
          <AppHeader
            isSiderOpened={isSiderOpened}
            isFullScreen={screen}
            switchFullscreen={switchFullscreen}
          />
        </header>

        <section className="app-section">
          <AppContent routes={routes} />
        </section>

        <footer className="app-footer">
          <AppFooter />
        </footer>
      </main>
    </FullScreen>
  )
}
