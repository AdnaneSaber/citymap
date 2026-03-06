"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) setError("Email ou mot de passe incorrect");
    else router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h1 className="text-xl font-bold text-center text-blue-700 mb-4">🏙️ CityMap — Connexion</h1>
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold text-sm">Se connecter</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-3">
          Pas de compte ? <Link href="/signup" className="text-blue-600 underline">S&apos;inscrire</Link>
        </p>
        <p className="text-center mt-2"><Link href="/" className="text-sm text-gray-400">← Retour à la carte</Link></p>
      </div>
    </div>
  );
}
