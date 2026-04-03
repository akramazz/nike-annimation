# Nike Animation - E-Commerce Premium

Site e-commerce ultra-moderne avec animations GSAP et Three.js, backend MongoDB Atlas.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, Tailwind CSS, GSAP, Three.js
- **Backend**: Next.js API Routes, MongoDB Atlas, Mongoose
- **Déploiement**: Render (backend), Vercel (optionnel)

## 🚀 Installation Locale

### 1. Prérequis
- Node.js 18+
- MongoDB Atlas (compte gratuit)

### 2. Cloner le projet
```bash
git clone <repository-url>
cd nike-annimation
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
ADMIN_API_SECRET=vcp_6fQ78pNTljzYR7UtyHNfmByYfXgHGoMCdjmTjbzDH5xVeX3gwL25bcAj
```

### 4. Lancer le projet
```bash
npm run dev
```

### 5. (Optionnel) Seed la base de données
```bash
npm run seed
```

---

## 🌐 Déploiement sur Render

### Étape 1: Créer un compte Render
1. Aller sur https://render.com
2. Créer un compte gratuit

### Étape 2: Créer la base de données MongoDB
1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un nouveau projet
3. Créer un cluster gratuit (M0)
4. Configurer l'accès:
   - Créer un utilisateur database avec mot de passe
   - Network Access: Ajouter IP 0.0.0.0/0 (pour Render)
5. Récupérer la connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

### Étape 3: Déployer sur Render
1. Connecter votre repo GitHub à Render
2. Créer un nouveau Web Service:
   - Repository: votre repo
   - Branch: main
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. Ajouter les variables d'environnement:
   - `MONGODB_URI`: votre connection string MongoDB
   - `ADMIN_API_SECRET`: votre secret admin
   - `NEXT_PUBLIC_APP_URL`: https://votre-app.onrender.com
   - `NODE_ENV`: production
4. Déployer!

### Étape 4: Seed la base (une fois)
```bash
# Via curl après déploiement
curl -X POST https://votre-app.onrender.com/api/products -H "Content-Type: application/json" -d '{"name":"Test","price":99,"color":"Rouge","category":"Classic"}'
```
Ou utiliser l'admin dashboard pour ajouter des produits.

---

## 🔌 API Endpoints

### Produits
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/products` | Liste tous les produits | Non |
| POST | `/api/products` | Crée un produit | Admin |
| PUT | `/api/products` | Met à jour un produit | Admin |
| DELETE | `/api/products?id=X` | Supprime un produit | Admin |

### Commandes
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/orders` | Liste toutes les commandes | Admin |
| POST | `/api/orders` | Crée une commande | Non |
| PUT | `/api/orders` | Met à jour le statut | Admin |
| DELETE | `/api/orders?id=X` | Supprime une commande | Admin |

### Messages
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/messages` | Liste tous les messages | Admin |
| POST | `/api/messages` | Crée un message | Non |
| PUT | `/api/messages` | Met à jour le statut | Admin |
| DELETE | `/api/messages?id=X` | Supprime un message | Admin |

---

## 🔐 Accès Admin

1. Aller sur `/admin`
2. Entrer le secret: `vcp_6fQ78pNTljzYR7UtyHNfmByYfXgHGoMCdjmTjbzDH5xVeX3gwL25bcAj`

---

## 📁 Structure du Projet

```
nike-annimation/
├── app/
│   ├── api/
│   │   ├── products/route.ts    # API produits
│   │   ├── orders/route.ts      # API commandes
│   │   └── messages/route.ts    # API messages
│   ├── admin/page.tsx           # Dashboard admin
│   └── ...                      # Pages frontend
├── models/
│   ├── Product.ts               # Modèle MongoDB
│   ├── Order.ts                 # Modèle MongoDB
│   └── Message.ts               # Modèle MongoDB
├── utils/
│   └── mongodb.ts               # Connexion Mongoose
├── seed.ts                      # Script de seed
├── .env.local                   # Variables locales
├── render.yaml                  # Config Render
└── package.json
```

---

## ⚠️ Résolution de problèmes

### Erreur de connexion MongoDB
- Vérifier que l'IP 0.0.0.0/0 est ajoutée dans Network Access
- Vérifier le username/password dans MONGODB_URI

### Erreur 500 sur les API
- Vérifier les logs dans le dashboard Render
- Vérifier que MONGODB_URI est bien défini

---

**Développé avec ❤️ pour Nike Animation**