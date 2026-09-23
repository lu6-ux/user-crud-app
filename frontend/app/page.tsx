import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">User CRUD App</h1>
      <div className="flex gap-4">
        <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Login
        </Link>
        <Link href="/register" className="rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
          Register
        </Link>
      </div>
    </main>
  );
}
