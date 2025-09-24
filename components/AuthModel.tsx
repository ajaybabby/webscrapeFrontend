'use client';

import { useState } from 'react';
import { useAuth } from '../app/context/AuthContext';
import { useMutation } from '@tanstack/react-query';

export default function AuthModal() {
  const { user, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const toggleModal = () => setIsOpen(!isOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    onSuccess: (data) => {
      alert('Registration successful! Please login.');
      setIsRegister(false);
    },
    onError: (err: any) => setError(err.message),
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    onSuccess: (data) => {
      login(data.access_token, { email: form.email, name: form.name || form.email });
      setIsOpen(false);
      setForm({ name: '', email: '', password: '' });
    },
    onError: (err: any) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    isRegister ? registerMutation.mutate() : loginMutation.mutate();
  };

  return (
    <div className="ml-4">
      {user ? (
        <div className="flex items-center gap-2">
          <span>Hi, {user.name || user.email}</span>
          <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
        </div>
      ) : (
        <button onClick={toggleModal} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Login / Register
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={toggleModal}>
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
              >
                {isRegister ? 'Register' : 'Login'}
              </button>
            </form>
            <p className="mt-2 text-sm text-gray-600 text-center">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-600 hover:underline"
              >
                {isRegister ? 'Login' : 'Register'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
