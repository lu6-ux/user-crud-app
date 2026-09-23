'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type User = {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [meData, usersData] = await Promise.all([api.me(), api.getUsers()]);
        setMe(meData);
        setName(meData.name);
        setEmail(meData.email);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleLogout() {
    await api.logout();
    router.push('/login');
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    setSaveMessage('');
    setSaving(true);
    try {
      const updated = await api.updateMe({ name, email });
      setMe(updated);
      setSaveMessage('Profile updated.');
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    } catch (err: any) {
      setSaveMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete your account? This cannot be undone.')) return;
    try {
      await api.deleteMe();
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center">Loading...</main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          Log out
        </button>
      </div>

      {error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {/* Profile section */}
      <section className="mb-10 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-medium">My profile</h2>
        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {saveMessage && <p className="text-sm text-gray-600">{saveMessage}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete account
            </button>
          </div>
        </form>
      </section>

      {/* User list section */}
      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-medium">All users</h2>
        <ul className="divide-y divide-gray-100">
          {users.map((u) => (
            <li
              key={u._id}
              className="cursor-pointer py-3 hover:bg-gray-50"
              onClick={() => setSelectedUser(u)}
            >
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Simple single-user view */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-medium">{selectedUser.name}</h3>
            <p className="text-sm text-gray-600">{selectedUser.email}</p>
            <button
              className="mt-4 rounded bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
