import React from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import Navbar from 'components/navbar/RTL'
import Sidebar from 'components/sidebar/RTL'
import Footer from 'components/footer/Footer'
import { adminSidebarItems, getActiveRouteName } from 'layouts/sidebarItems'

interface RTLProps {
  [key: string]: unknown
}

export default function RTL(props: RTLProps) {
  const { ...rest } = props
  const location = useLocation()
  const [open, setOpen] = React.useState(true)
  const [currentRoute, setCurrentRoute] = React.useState('Main Dashboard')

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setOpen(false)
      } else {
        setOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    const activeRoute = getActiveRouteName(
      adminSidebarItems,
      location.pathname,
      'Main Dashboard'
    )
    setCurrentRoute(activeRoute)
  }, [location.pathname])

  const getActiveNavbar = (): boolean => {
    for (const item of adminSidebarItems) {
      const fullPath = `${item.layout}/${item.path}`
      if (location.pathname.includes(fullPath)) {
        return item.secondary ?? false
      }
    }
    return false
  }

  document.documentElement.dir = 'rtl'
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pe-2 xl:mr-[313px]`}
        >
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={'Horizon UI Tailwind React'}
              brandText={currentRoute}
              secondary={getActiveNavbar()}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Outlet />
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
