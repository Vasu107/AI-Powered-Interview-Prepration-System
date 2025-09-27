"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-gray-200 shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo / Brand */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        AskUp
      </Link>

      {/* Links */}
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link href="/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>
        <Link href="/services" className="text-gray-700 hover:text-blue-600">
          Services
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-600">
          Contact Us
        </Link>
        {session ? (
          <>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
