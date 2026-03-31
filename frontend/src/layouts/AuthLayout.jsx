import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-10 text-[#111827]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <Outlet />
      </div>
    </main>
  )
}

export default AuthLayout
