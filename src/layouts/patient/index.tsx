import React from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import PatientNavbar from 'components/navbar/PatientNavbar'
import PatientSidebar from 'components/sidebar/PatientSidebar'
import Footer from 'components/footer/Footer'
import { patientSidebarItems, getActiveRouteName } from 'layouts/sidebarItems'

interface PatientLayoutProps {
  [key: string]: unknown
}

export default function PatientLayout(props: PatientLayoutProps) {
  const { ...rest } = props
  const location = useLocation()
  const [open, setOpen] = React.useState(true)
  const [currentRoute, setCurrentRoute] = React.useState('Dashboard')

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
      patientSidebarItems,
      location.pathname,
      'Dashboard'
    )
    setCurrentRoute(activeRoute)
  }, [location.pathname])

  return (
    <div className="flex h-full w-full">
      <PatientSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex h-full w-full flex-col bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] flex h-full flex-col transition-all md:pr-2 xl:ml-[313px]`}
        >
          <div className="flex h-full flex-col">
            <PatientNavbar
              onOpenSidenav={() => setOpen(true)}
              logoText={'Healthcare Access Connector'}
              brandText={currentRoute}
              {...rest}
            />
            <div className="flex-1 overflow-y-auto p-2 md:pr-2">
              <Outlet />
            </div>
            <div className="shrink-0 p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
