import { Outlet } from 'react-router'
import Header from './Header'
import BottomNav from './BottomNav'

const Layout = () => {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1600px', margin: '0 5%', padding: '4rem 2rem', paddingBottom: 'calc(1.5rem + 64px)' }}>
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

export default Layout
