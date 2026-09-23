const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include', // required to send/receive the httpOnly cookie cross-domain
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(message || 'Something went wrong');
  }

  return data;
}

export const api = {
  register: (body: { name: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  me: () => request('/auth/me'),

  getUsers: () => request('/users'),

  getUser: (id: string) => request(`/users/${id}`),

  updateMe: (body: { name?: string; email?: string }) =>
    request('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),

  deleteMe: () => request('/users/me', { method: 'DELETE' }),
};
