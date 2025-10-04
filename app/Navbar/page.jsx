"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex gap-6 items-center p-4 shadow-md bg-white">
      {/* Common links */}
      <Link href="/" className="text-gray-700 hover:text-blue-600">
        Home
      </Link>
      <Link href="/" className="text-gray-700 hover:text-blue-600">
        About
      </Link>
      <Link href="/" className="text-gray-700 hover:text-blue-600">
        Services
      </Link>
      <Link href="/" className="text-gray-700 hover:text-blue-600">
        Contact Us
      </Link>

      {/* Conditional Auth Section */}
      {session ? (
        <>
          {/* Normal Dashboard */}
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>

          {/* Only for Admins */}
          {["admin@askup.com", "vasux@admin.com"].includes(session.user?.email) && (
            <Link
              href="/admin/dashboard"
              className="text-gray-700 hover:text-blue-600"
            >
              Admin
            </Link>
          )}

          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        /* Show Login button if not logged in */
        <Link
          href="/auth"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>
      )}
    </div>
  );
}
