# PREMIUM - Collection Exclusive de Vestes Haut de Gamme

Un site e-commerce ultra-moderne inspiré de Nike, avec des animations GSAP et Three.js, une gestion de stock complète, et un système de commandes et de messages clients.

## 🚀 Fonctionnalités

### Frontend

- **Animations GSAP** : Animations fluides et professionnelles sur toutes les pages
- **Scènes Three.js** : Visualisation 3D interactive des produits
- **Design Ultra Premium** : Interface inspirée de Nike avec glassmorphism et effets visuels
- **Responsive Design** : Parfaitement adapté à tous les appareils
- **Panier Animé** : Panier slide-in avec animations GSAP
- **Pages Produits** : Fiches produits détaillées avec sélection de taille et quantité

### Backend

- **API REST Complète** : Routes pour produits, commandes et messages
- **Gestion de Stock** : Suivi en temps réel des stocks
- **Gestion des Commandes** : Création, suivi et mise à jour des statuts
- **Messages Clients** : Réception et gestion des messages de contact
- **Stockage JSON** : Base de données légère et facile à utiliser

### Admin Dashboard

- **Tableau de Bord** : Statistiques et vue d'ensemble
- **Gestion des Produits** : CRUD complet avec recherche
- **Gestion des Commandes** : Suivi et mise à jour des statuts
- **Gestion des Messages** : Lecture et marquage des messages

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd nike-annimation
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Lancer le serveur de développement**

```bash
npm run dev
```

4. **Ouvrir le navigateur**

```
http://localhost:3000
```

## 🗂️ Structure du Projet

```
nike-annimation/
├── app/
│   ├── api/
│   │   ├── products/route.ts      # API produits (CRUD)
│   │   ├── orders/route.ts        # API commandes (CRUD)
│   │   └── messages/route.ts      # API messages (CRUD)
│   ├── admin/
│   │   └── page.tsx               # Dashboard admin
│   ├── checkout/
│   │   └── page.tsx               # Page de paiement
│   ├── contact/
│   │   └── page.tsx               # Page de contact
│   ├── products/
│   │   └── [id]/page.tsx          # Page détail produit
│   ├── components/
│   │   ├── Navigation.tsx         # Navigation avec panier
│   │   ├── HeroSection.tsx        # Section héro avec 3D
│   │   ├── ProductSection.tsx     # Grille de produits
│   │   ├── Cart.tsx               # Panier animé
│   │   ├── Footer.tsx             # Pied de page
│   │   ├── GarageScene.tsx        # Scène Three.js
│   │   └── ThreeScene.tsx         # Scène 3D alternative
│   ├── context/
│   │   └── CartContext.tsx        # Contexte du panier
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Page d'accueil
│   └── globals.css                # Styles globaux
├── data/
│   ├── products.json              # Données produits
│   ├── orders.json                # Données commandes
│   └── messages.json              # Données messages
├── public/
│   └── products/                  # Images produits
└── package.json
```

## 🎯 Pages Disponibles

### Pages Publiques

- **/** - Page d'accueil avec animations et produits
- **/products/[id]** - Détail d'un produit
- **/checkout** - Page de paiement
- **/contact** - Formulaire de contact

### Pages Admin

- **/admin** - Dashboard administrateur

## 🔌 API Endpoints

### Produits

```
GET    /api/products          # Récupérer tous les produits
POST   /api/products          # Créer un nouveau produit
PUT    /api/products          # Mettre à jour un produit
DELETE /api/products?id=X     # Supprimer un produit
```

### Commandes

```
GET    /api/orders            # Récupérer toutes les commandes
POST   /api/orders            # Créer une nouvelle commande
PUT    /api/orders            # Mettre à jour le statut d'une commande
DELETE /api/orders?id=X       # Supprimer une commande
```

### Messages

```
GET    /api/messages          # Récupérer tous les messages
POST   /api/messages          # Créer un nouveau message
PUT    /api/messages          # Mettre à jour le statut d'un message
DELETE /api/messages?id=X     # Supprimer un message
```

## 🎨 Animations GSAP

Le site utilise GSAP pour des animations fluides :

- **Navigation** : Animation du logo et des liens au chargement
- **Hero Section** : Animation du titre, sous-titre et bouton CTA
- **Produits** : Animation des cartes au hover et au scroll
- **Panier** : Animation slide-in avec stagger des items
- **Formulaires** : Animation des inputs au focus
- **Boutons** : Effets de scale et de brillance

## 🎮 Three.js

Scènes 3D interactives :

- **GarageScene** : Visualisation 3D d'un garage avec éclairage dynamique
- **ThreeScene** : Scène alternative avec objets 3D

## 💾 Gestion des Données

Les données sont stockées dans des fichiers JSON dans le dossier `data/` :

- `products.json` : Catalogue de produits avec stock
- `orders.json` : Commandes des clients
- `messages.json` : Messages de contact

## 🛒 Fonctionnalités du Panier

- Ajout de produits au panier
- Modification des quantités
- Suppression de produits
- Persistance dans localStorage
- Calcul automatique du total
- Animation GSAP à chaque action

## 📊 Dashboard Admin

### Statistiques

- Nombre total de produits
- Nombre de commandes
- Messages non lus
- Revenus totaux

### Gestion des Produits

- Liste complète avec recherche
- Ajout de nouveaux produits
- Modification des produits existants
- Suppression de produits
- Affichage du stock en temps réel

### Gestion des Commandes

- Liste des commandes avec filtres
- Mise à jour des statuts
- Détails des commandes
- Historique complet

### Gestion des Messages

- Liste des messages
- Marquage comme lu/non lu
- Suppression de messages
- Détails complets

## 🎯 Utilisation

### Pour les Clients

1. Parcourir les produits sur la page d'accueil
2. Cliquer sur un produit pour voir les détails
3. Sélectionner une taille et une quantité
4. Ajouter au panier
5. Procéder au paiement
6. Remplir le formulaire de commande
7. Recevoir la confirmation

### Pour les Administrateurs

1. Accéder à `/admin`
2. Consulter le tableau de bord
3. Gérer les produits (ajouter, modifier, supprimer)
4. Suivre les commandes et mettre à jour les statuts
5. Lire et gérer les messages clients

## 🔧 Personnalisation

### Ajouter des Produits

Modifiez le fichier `data/products.json` ou utilisez le dashboard admin.

### Modifier les Animations

Les animations GSAP sont dans chaque composant. Modifiez les paramètres `duration`, `ease`, et `stagger` pour personnaliser.

### Changer le Design

Modifiez `app/globals.css` et les classes Tailwind dans les composants.

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
npm run build
vercel deploy
```

### Autres Plateformes

```bash
npm run build
npm start
```

## 📝 Notes Techniques

- **Performance** : Images en format WebP pour un chargement rapide
- **SEO** : Métadonnées complètes pour le référencement
- **Accessibilité** : Skip links et navigation au clavier
- **Sécurité** : Headers de sécurité configurés
- **PWA** : Manifest pour installation sur mobile

## 🐛 Dépannage

### Problème : Les animations ne fonctionnent pas

**Solution** : Assurez-vous que le composant est monté côté client avec `useEffect` et `isMounted`.

### Problème : Les données ne se chargent pas

**Solution** : Vérifiez que le dossier `data/` existe et contient les fichiers JSON.

### Problème : Le panier ne persiste pas

**Solution** : Vérifiez que localStorage est activé dans votre navigateur.

## 📄 Licence

Ce projet est open source et disponible sous la licence MIT.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Contact

Pour toute question ou suggestion, contactez-nous via le formulaire de contact sur le site.

---

**PREMIUM** - L'excellence automobile dans chaque veste.
