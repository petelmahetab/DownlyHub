import React from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react'


const Header: React.FC = () => {
  return (
    <nav className="border-b border-primary/10 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <img
              src="/logo-192.png"
              alt="DownlyHub Logo"
              className="
      w-10 h-10
      object-contain
      transition-all duration-300 ease-out
      group-hover:scale-110
      group-hover:rotate-3
      group-hover:drop-shadow-[0_8px_20px_rgba(19,91,236,0.4)]
    "
            />

            <span
              className={`
      text-2xl md:text-3xl
      font-extrabold tracking-tight
      bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500
      bg-clip-text text-transparent
      transition-all duration-300 ease-out
      group-hover:scale-105
      group-hover:text-indigo-950          
      group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]
      dark:group-hover:text-gray-200      
    `}
            >
              DownlyHub
            </span>
          </div>


          {/* Auth area */}
          <div className="flex items-center gap-4">
            <SignedOut>
              {/* Login button opens sign-in modal */}
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Login
                </button>
              </SignInButton>

              {/* Sign Up button opens sign-up modal */}
              <SignUpButton mode="modal">
                <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-primary/20">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>

              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9",
                    userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full",
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header