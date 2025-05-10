import Link from 'next/link';

export function SignOutButton() {
  return (
    <Link
      href="/signout"
      className="text-wcn-accent1 hover:underline font-medium px-4 py-2 rounded transition-colors block text-center md:inline"
    >
      Sign Out
    </Link>
  );
} 