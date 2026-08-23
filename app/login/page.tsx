"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Connexion échouée");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-white/60 text-sm mt-2">Connectez-vous à votre compte DripBazzarDZ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm" role="alert">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50"
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </motion.button>
        </form>

        <p className="text-center text-white/60 text-sm">
          Pas encore de compte ?{" "}
          <button onClick={() => router.push("/signup")} className="text-white hover:underline">
            S'inscrire
          </button>
        </p>

        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mx-auto">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      </motion.div>
    </div>
  );
}
