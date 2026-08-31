"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiUrl } from "@/lib/api-client";
import { useAuth } from "@/app/context/AuthContext";

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Address = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export default function AccountProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [addressForm, setAddressForm] = useState<Address>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [profileRes, addressRes] = await Promise.all([
          fetch(apiUrl("/api/account/profile"), { credentials: "include" }),
          fetch(apiUrl("/api/account/address"), { credentials: "include" }),
        ]);

        const profileData = await profileRes.json();
        const addressData = await addressRes.json();

        if (!cancelled && profileData.success && profileData.user) {
          setProfile(profileData.user);
          setForm({
            firstName: profileData.user.firstName || "",
            lastName: profileData.user.lastName || "",
            email: profileData.user.email || "",
            phone: profileData.user.phone || "",
          });
        }
        if (!cancelled && addressData.success) {
          setAddress(addressData.address);
          setAddressForm(addressData.address);
        }
      } catch {
        if (!cancelled) setError("Impossible de charger le profil.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(apiUrl("/api/account/profile"), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Échec de la mise à jour du profil.");
      } else {
        setProfile(data.user);
        setSuccess("Profil mis à jour.");
        setIsEditing(false);
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(apiUrl("/api/account/address"), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Échec de la mise à jour de l'adresse.");
      } else {
        setAddress(addressForm);
        setSuccess("Adresse mise à jour.");
        setIsEditingAddress(false);
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Vous devez être connecté.</p>
          <button onClick={() => router.push("/login")} className="px-6 py-3 bg-white text-black rounded-full">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const hasAddress = address && (address.address || address.city);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Profil</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {success && <p className="text-green-400 mb-4">{success}</p>}

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {!isEditing ? (
              <div className="space-y-3">
                <div>
                  <p className="text-white/60 text-sm">E-mail</p>
                  <p className="text-white">{profile.email}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Nom</p>
                  <p className="text-white">{[profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Téléphone</p>
                  <p className="text-white">{profile.phone || "—"}</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm">
                  Modifier
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Prénom</label>
                    <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Nom</label>
                    <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">E-mail</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Téléphone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                </div>
                <div className="flex gap-3">
                  <button disabled={saving} type="submit" className="px-6 py-3 bg-white text-black rounded-xl font-bold disabled:opacity-50">
                    Enregistrer
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 bg-white/10 rounded-xl">
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Adresse</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {!hasAddress && !isEditingAddress ? (
              <div className="space-y-4">
                <p className="text-white/60">Aucune adresse ajoutée.</p>
                <button onClick={() => setIsEditingAddress(true)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm">
                  Ajouter une adresse
                </button>
              </div>
            ) : !isEditingAddress ? (
              <div className="space-y-3">
                <p className="text-white font-medium">{[address?.firstName, address?.lastName].filter(Boolean).join(" ") || "Adresse principale"}</p>
                <p className="text-white/80">{address?.address}</p>
                <p className="text-white/80">{[address?.city, address?.postalCode, address?.country].filter(Boolean).join(", ")}</p>
                <p className="text-white/80">{address?.phone}</p>
                <button onClick={() => setIsEditingAddress(true)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm">
                  Modifier
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Prénom</label>
                    <input value={addressForm.firstName} onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Nom</label>
                    <input value={addressForm.lastName} onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Adresse</label>
                  <input value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Ville / Wilaya</label>
                    <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Code postal</label>
                    <input value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Pays</label>
                    <input value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Téléphone</label>
                  <input value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                </div>
                <div className="flex gap-3">
                  <button disabled={saving} type="submit" className="px-6 py-3 bg-white text-black rounded-xl font-bold disabled:opacity-50">
                    Enregistrer
                  </button>
                  <button type="button" onClick={() => setIsEditingAddress(false)} className="px-6 py-3 bg-white/10 rounded-xl">
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Compte</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
            <button onClick={() => router.push("/account/orders")} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl">
              Mes commandes
            </button>
            <button onClick={handleLogout} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl">
              Se déconnecter
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
