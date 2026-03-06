"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) router.push("/login");
    else {
      const data = await res.json();
      setError(data.error || "Erreur");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h1 className="text-xl font-bold text-center text-blue-700 mb-4">🏙️ CityMap — Inscription</h1>
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold text-sm">Créer un compte</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-3">
          Déjà inscrit ? <Link href="/login" className="text-blue-600 underline">Se connecter</Link>
        </p>
        <p className="text-center mt-2"><Link href="/" className="text-sm text-gray-400">← Retour à la carte</Link></p>
      </div>
    </div>
  );
}
