'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-sm text-gray-500">Loading auth status...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        <p className="text-sm text-gray-700">
          Signed in as{' '}
          <span className="font-medium text-gray-900">
            {(session.user as any)?.name || session.user?.email}
          </span>
        </p>
        <button
          onClick={() => signOut()}
          className="py-1 px-3 text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign out
        </button>
        <Link
          href="/editor"
          className="py-1 px-3 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Go to Editor
        </Link>
      </div>
    );
  }
  return (
    <div className="flex items-center space-x-3">
      <p className="text-sm text-gray-700">Not signed in</p>
      <button
        onClick={() => signIn('github')}
        className="py-1 px-3 text-sm font-medium rounded-md bg-gray-700 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
