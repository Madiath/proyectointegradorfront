import { Outlet } from 'react-router'
import Header from './Header'

const Layout = () => {
  return (
    <>
      <Header />
      <main className="container-fluid p-4">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
