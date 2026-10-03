# 🏥 ClinicFlow — Gestion Patients & Rendez-vous

Application web **PERN** pour la gestion des patients et des rendez-vous d'une clinique.

## Prérequis

Versions utilisées pour le projet :

* **Node.js:** `20.19.0`
* **PostgreSQL:** `18.6`
* **NVM:** `1.1.12`

PostgreSQL doit être installé et démarré avant de lancer l'application.

---

## 📦 Installation

### 1. Cloner le projet

```bash
git clone <URL_DU_DEPOT>
cd ClinicFlow
```

### 2. Installer les dépendances

Depuis la racine du projet :

```bash
npm run install:all
```

Ou manuellement :

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## ⚙️ Variables d'environnement

### Backend

Créer le fichier :

```text
backend/.env
```

À partir de :

```text
backend/.env.example
```

Exemple :

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://postgres:<PASSWORD>@localhost:5432/clinicflow

JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:5173
```

Remplacer `<PASSWORD>` par le mot de passe de votre utilisateur PostgreSQL et `<YOUR_JWT_SECRET>` par une clé secrète JWT.

### Frontend

Créer le fichier :

```text
frontend/.env
```

À partir de :

```text
frontend/.env.example
```

Exemple :

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🗄️ Base de données

Créer une base PostgreSQL nommée :

```text
clinicflow
```

Puis exécuter les migrations :

```bash
npm run db:migrate
```

Pour charger les données de test :

```bash
npm run db:seed
```

Le seed fournit les données nécessaires à la démonstration de l'application.

---

## 🚀 Lancer l'application

Depuis la racine du projet :

```bash
npm run dev
```

Cette commande lance le frontend et le backend.

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

---

## 🛠️ Lancer séparément

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

---

## 🧪 Tests

Pour exécuter les tests :

```bash
npm test
```

Ou depuis le backend :

```bash
cd backend
npm test
```

---

## 🗃️ Commandes utiles

### Migrations

```bash
npm run db:migrate
```

### Seed

```bash
npm run db:seed
```

### Développement

```bash
npm run dev
```

### Tests

```bash
npm test
```
