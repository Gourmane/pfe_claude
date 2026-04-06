import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-navy-900 font-sans antialiased sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <Outlet />
      </div>
    </main>
  )
}

export default AuthLayout
