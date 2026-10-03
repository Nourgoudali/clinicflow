# 🏥 ClinicFlow — Gestion Patients & Rendez-vous

[![Stack](https://img.shields.io/badge/Stack-PERN-0d9488.svg)](#technology-stack)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.6-336791.svg?logo=postgresql&logoColor=white)](#database--postgresql)
[![Node.js](https://img.shields.io/badge/Node.js-20.19.0-339933.svg?logo=node.js&logoColor=white)](#backend)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](#frontend)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-shadcn%2Fui-38B2AC.svg?logo=tailwindcss&logoColor=white)](#frontend)
[![Tests](https://img.shields.io/badge/Tests-Jest%20%7C%20Supertest-C21325.svg?logo=jest&logoColor=white)](#testing)

**ClinicFlow** est une application web complète basée sur la stack **PERN** (PostgreSQL, Express.js, React, Node.js) conçue pour la gestion moderne, sécurisée et efficace des patients, des consultations et des rendez-vous au sein d'une clinique médicale.

---

## 📑 Sommaire

1. [Aperçu de l'Application](#aperçu-de-lapplication)
2. [Stack Technique](#stack-technique)
3. [Structure du Projet](#structure-du-projet)
4. [Conception & Schéma Base de Données (ERD)](#conception--schéma-base-de-données-erd)
5. [Règles Métier Critiques](#règles-métier-critiques)
6. [Authentification & Contrôle d'Accès (RBAC)](#authentification--contrôle-daccès-rbac)
7. [API REST & Documentation Swagger](#api-rest--documentation-swagger)
8. [Installation & Démarrage](#installation--démarrage)
9. [Comptes & Données de Test (Seed)](#comptes--données-de-test-seed)
10. [Exécution des Tests](#exécution-des-tests)
11. [Déploiement Docker](#déploiement-docker)

---

## 🎯 Aperçu de l'Application

ClinicFlow permet au personnel médical et aux administrateurs de :
- 📊 **Visualiser les statistiques clés en temps réel** (Total patients, rendez-vous du jour, consultations en attente et confirmées).
- 👥 **Gérer l'annuaire des patients** avec recherche instantanée multicritère (Nom complet, CIN) et pagination au niveau de la base de données.
- 📅 **Planifier et administrer les rendez-vous** avec filtrage dynamique par statut (`pending`, `confirmed`, `cancelled`) et par date.
- ⏱️ **Garantir le respect strict de la règle des 30 minutes** interdisant les conflits d'horaires pour un même patient.
- 🛡️ **Sécuriser les opérations critiques** (authentification JWT, mots de passe hashés avec bcrypt, suppression réservée aux administrateurs).

---

## 💻 Stack Technique

### Environnement Recommandé
- **Node.js :** `20.19.0`
- **PostgreSQL :** `18.6`
- **NVM :** `1.1.12`

### Backend
- **Runtime :** Node.js
- **Framework :** Express.js
- **Base de données :** PostgreSQL avec **Sequelize ORM**
- **Sécurité & Auth :** JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`
- **Validation :** Schémas `Zod` pour la validation stricte des entrées et requêtes
- **Documentation API :** Swagger UI & OpenAPI 3.0 (`swagger-ui-express`, `yamljs`)
- **Tests :** `Jest` et `Supertest`

### Frontend
- **Framework :** React 18 avec **Vite**
- **Composants UI :** **shadcn/ui** (Button, Input, Label, Card, Dialog, AlertDialog, Table, Badge, Select, Dropdown, Pagination, Tabs, Skeleton, Separator)
- **Styles & Thème :** Tailwind CSS avec palette santé professionnelle (Teal/Emerald/Slate)
- **Gestion des Formulaires :** React Hook Form avec résolveur Zod
- **Routage :** React Router DOM (v6)
- **Icônes :** Lucide React
- **Notifications :** Sonner (Toasts animés)
- **Client HTTP :** Axios configuré avec intercepteurs d'authentification Bearer

---

## 📂 Structure du Projet

Le projet respecte strictement l'arborescence requise avec deux dossiers distincts `frontend/` et `backend/`, et le fichier `.gitignore` situé à la racine :

```text
ClinicFlow/
│
├── frontend/                       # Application Client React (Vite)
│   ├── public/                     # Fichiers statiques et favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Composants shadcn/ui
│   │   │   ├── layout/             # Sidebar, Navbar, ProtectedRoute
│   │   │   ├── patients/           # Modales d'ajout, édition et suppression
│   │   │   ├── appointments/       # Modales de réservation et statut
│   │   │   └── dashboard/          # Cartes KPI et statistiques
│   │   ├── contexts/               # Contexte d'authentification (AuthContext)
│   │   ├── hooks/                  # useAuth custom hook
│   │   ├── layouts/                # MainLayout & responsive wrapper
│   │   ├── lib/                    # Utilitaires (cn, formateurs de date)
│   │   ├── pages/                  # Login, Dashboard, Patients, PatientDetails, Appointments
│   │   ├── services/               # Clients API Axios modulaires
│   │   ├── App.jsx                 # Configuration des routes
│   │   ├── index.css               # Styles Tailwind & variables CSS
│   │   └── main.jsx                # Point d'entrée React
│   ├── Dockerfile                  # Conteneurisation Nginx
│   ├── nginx.conf                  # Configuration reverse proxy SPA
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                        # API Serveur Express (Node.js)
│   ├── src/
│   │   ├── config/                 # Configuration DB Sequelize
│   │   ├── controllers/            # Logique des requêtes (Auth, Patients, Appointments, Dashboard)
│   │   ├── database/               # Scripts de migration DDL
│   │   ├── docs/                   # Spécification OpenAPI/Swagger 3.0
│   │   ├── middlewares/            # Auth JWT, RBAC, Validation Zod, Gestion d'erreurs
│   │   ├── models/                 # Modèles Sequelize (User, Patient, Appointment, AuditLog)
│   │   ├── routes/                 # Définition des routes Express
│   │   ├── seed/                   # Script de peuplement de la base de test
│   │   ├── services/               # Couche métier et requêtes SQL/ORM
│   │   ├── utils/                  # JWT, ConflictChecker, Logger
│   │   ├── validators/             # Schémas de validation Zod
│   │   ├── app.js                  # Initialisation de l'application Express
│   │   └── server.js               # Démarrage du serveur HTTP
│   ├── tests/                      # Suites de tests Jest & Supertest
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── .gitignore                      # Gitignore racine couvrant les 2 projets
├── docker-compose.yml              # Orchestration multi-conteneurs
├── package.json                    # Scripts racines (concurrently, migrations, dev)
└── README.md                       # Documentation complète du projet
```

---

## 🗄️ Conception & Schéma Base de Données (ERD)

### Diagramme Entité-Relation (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ APPOINTMENTS : "creates (1:N)"
    USERS ||--o{ AUDIT_LOGS : "triggers (1:N)"
    PATIENTS ||--o{ APPOINTMENTS : "has (1:N)"

    USERS {
        uuid id PK "gen_random_uuid()"
        varchar email UK "Unique lowercase"
        varchar password "Bcrypt hashed"
        enum role "admin | staff"
        timestamp created_at
        timestamp updated_at
    }

    PATIENTS {
        uuid id PK "gen_random_uuid()"
        varchar full_name "Indexed"
        varchar cin UK "Unique Indexed"
        varchar phone
        date birth_date
        text address "Optional"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "Soft delete (Paranoid)"
    }

    APPOINTMENTS {
        uuid id PK "gen_random_uuid()"
        uuid patient_id FK "REFERENCES patients(id) ON DELETE CASCADE"
        timestamp appointment_date "Indexed (Date & Heure)"
        enum status "pending | confirmed | cancelled (Indexed)"
        text reason "Motif de consultation"
        text notes "Optional"
        uuid created_by FK "REFERENCES users(id) ON DELETE RESTRICT"
        timestamp created_at
        timestamp updated_at
    }

    AUDIT_LOGS {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "REFERENCES users(id) ON DELETE SET NULL"
        varchar action "CREATE | UPDATE | DELETE"
        varchar entity "Patient | Appointment | User"
        varchar entity_id
        jsonb details "Contextual metadata"
        timestamp created_at
    }
```

### Justification des Relations & Contraintes

1. **Clés Primaires UUID (`UUIDV4`) :**
   - Évite l'énumération prédictive des identifiants par rapport aux entiers auto-incrémentés.
   - Idéal pour la scalabilité horizontale et la sécurité des données médicales.
2. **Patient $\rightarrow$ Rendez-vous ($1:N$) avec `ON DELETE CASCADE` :**
   - Un patient possède plusieurs rendez-vous.
   - Si un dossier patient est définitivement purgé, ses rendez-vous associés sont nettoyés pour maintenir l'intégrité référentielle.
3. **Utilisateur $\rightarrow$ Rendez-vous ($1:N$) avec `ON DELETE RESTRICT` :**
   - Un utilisateur (médecin ou réceptionniste) enregistre des rendez-vous.
   - La suppression d'un compte utilisateur est bloquée s'il a créé des consultations médicales, préservant ainsi la traçabilité médico-légale.
4. **Unicité & Index de Performance :**
   - `patients.cin` : Contrainte `UNIQUE` et index B-Tree pour une recherche instantanée par carte d'identité.
   - `patients.full_name` : Index B-Tree pour la recherche textuelle paginée.
   - `appointments.appointment_date` et `appointments.status` : Index pour accélérer le calcul des statistiques journalières et les filtres.
5. **Soft Delete (`deleted_at`) :**
   - Mise en œuvre du mode `paranoid` sur les patients pour prévenir toute perte accidentelle d'historique médical.
6. **Table de Journalisation (`audit_logs`) :**
   - Enregistre toutes les actions sensibles (créations, modifications de statut, suppressions, connexions).

---

## ⚖️ Règles Métier Critiques

### La Règle des 30 Minutes

> **Règle :** *Un patient ne peut pas avoir 2 rendez-vous confirmés (`confirmed`) dans une fenêtre de 30 minutes.*

- **Implémentation Backend :** L'utilitaire [`conflictChecker.js`](file:///c:/Users/KL/Desktop/ClinicFlow/backend/src/utils/conflictChecker.js) vérifie si un rendez-vous confirmé existe pour le même patient dans l'intervalle $]T - 30\text{ min},\, T + 30\text{ min}[$.
- **Contrôle Authoritatif :** Enforcé strictement sur :
  1. La création d'un rendez-vous (`POST /api/appointments`) avec statut `confirmed`.
  2. La mise à jour du statut (`PATCH /api/appointments/:id/status`) vers `confirmed`.
  3. La modification de date/heure (`PUT /api/appointments/:id`) d'un rendez-vous confirmé.
- **Réponse HTTP :** Retourne **`409 Conflict`** avec un message explicite mentionnant l'heure du créneau conflicting.

---

## 🔐 Authentification & Contrôle d'Accès (RBAC)

L'application intègre deux niveaux de rôles :

| Rôle | Description | Droits & Permissions |
| :--- | :--- | :--- |
| **`admin`** | Administrateur clinique | Accès complet : création, modification, consultation, et **suppression définitive des patients** (`DELETE /api/patients/:id`). |
| **`staff`** | Personnel / Réception | Consultation, création et modification des patients et rendez-vous. **Interdiction de supprimer des patients (retourne `403 Forbidden`).** |

---

## 📡 API REST & Documentation Swagger

### Documentation Interactive Swagger UI
Accessible localement à l'adresse : **`http://localhost:5000/api/docs`**

### Synthèse des Endpoints

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Connexion utilisateur (Email + Mot de passe) | Public |
| `GET` | `/api/auth/me` | Informations de l'utilisateur connecté | Authentifié |
| `GET` | `/api/patients` | Liste paginée avec recherche (`?search=&page=&limit=`) | Staff / Admin |
| `POST` | `/api/patients` | Création d'un nouveau patient | Staff / Admin |
| `GET` | `/api/patients/:id` | Détails d'un patient et liste de ses rendez-vous | Staff / Admin |
| `PUT` | `/api/patients/:id` | Mise à jour des informations patient | Staff / Admin |
| `DELETE`| `/api/patients/:id` | Suppression d'un patient | **Admin Uniquement (403 si Staff)** |
| `GET` | `/api/appointments` | Liste et filtres (`?date=&status=&patientId=`) | Staff / Admin |
| `POST` | `/api/appointments` | Création de rendez-vous (Validation 30 min) | Staff / Admin |
| `GET` | `/api/appointments/:id` | Détails d'un rendez-vous | Staff / Admin |
| `PATCH`| `/api/appointments/:id/status` | Modification du statut (Validation 30 min si confirmé) | Staff / Admin |
| `PUT` | `/api/appointments/:id` | Modification date/motif/notes | Staff / Admin |
| `DELETE`| `/api/appointments/:id` | Suppression d'un rendez-vous | Staff / Admin |
| `GET` | `/api/dashboard/stats` | KPI : Total patients, du jour, pending, confirmed | Staff / Admin |
| `GET` | `/api/health` | Diagnostic de santé de l'API | Public |

---

## 🚀 Installation & Démarrage

### 1. Cloner le Projet

```bash
git clone <url-du-depot>
cd ClinicFlow
```

### 2. Configuration des Variables d'Environnement

Dans `backend/` :
Créez un fichier `.env` basé sur `.env.example` :
```ini
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:12345@localhost:5432/clinicflow
JWT_SECRET=supersecret_jwt_key_clinicflow_2026_secure
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

Dans `frontend/` :
Créez un fichier `.env` basé sur `.env.example` :
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Installer les Dépendances

À la racine (installe automatiquement la racine, le backend et le frontend) :
```bash
npm run install:all
```
*Ou manuellement dans chaque sous-dossier :*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Base de Données : Migrations & Seed

Assurez-vous que PostgreSQL est démarré et que la base de données `clinicflow` existe.

Exécutez les migrations pour créer la structure et les index :
```bash
npm run db:migrate
```

Peuplez la base avec les données de démonstration initiales :
```bash
npm run db:seed
```

### 5. Démarrer l'Application

Vous pouvez lancer simultanément les deux applications depuis la racine :
```bash
npm run dev
```

Ou les exécuter indépendamment :
- **Backend :**
  ```bash
  cd backend
  npm run dev
  # Serveur disponible sur http://localhost:5000
  # Swagger Docs : http://localhost:5000/api/docs
  ```
- **Frontend :**
  ```bash
  cd frontend
  npm run dev
  # Application disponible sur http://localhost:5173
  ```

---

## 🔑 Comptes & Données de Test (Seed)

Le script de seed (`backend/src/seed/seed.js`) initialise automatiquement la base avec :
- **1 Administrateur** et **2 Membres du Personnel**
- **5 Patients réels** avec CINs uniques
- **10 Rendez-vous** avec une répartition équilibrée de statuts (`pending`, `confirmed`, `cancelled`), respectant rigoureusement la règle des 30 minutes.

### Identifiants de Connexion

| Rôle | Email | Mot de passe | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clinicflow.com` | `Admin123!` | Accès total + Suppression patients |
| **Staff 1** | `staff1@clinicflow.com` | `Staff123!` | Gestion patients & RDV |
| **Staff 2** | `staff2@clinicflow.com` | `Staff123!` | Gestion patients & RDV |

> 💡 *Sur l'écran de connexion (`/login`), des boutons d'accès rapide permettent de pré-remplir ces identifiants en un clic.*

---

## 🧪 Exécution des Tests

Le backend dispose d'une suite de tests automatisés complète avec **Jest** et **Supertest** couvrant l'authentification, les autorisations RBAC, le CRUD patient, la pagination, la recherche, et la validation de la règle des 30 minutes.

Pour exécuter les tests :
```bash
npm test
# ou depuis backend/ :
cd backend && npm test
```

Résultat attendu :
```text
PASS tests/appointments.test.js
PASS tests/patients.test.js
PASS tests/auth.test.js

Test Suites: 3 passed, 3 total
Tests:       21 passed, 21 total
```

---

## 🐳 Déploiement Docker (Optionnel)

Un fichier `docker-compose.yml` complet est fourni à la racine du projet pour démarrer l'ensemble de la pile (PostgreSQL, Backend API, Frontend Nginx) en une seule commande :

```bash
docker-compose up --build
```

- **Frontend :** `http://localhost:3000`
- **Backend API :** `http://localhost:5000`
- **PostgreSQL :** `localhost:5432`

---

## 📜 Licence & Auteur

Développé pour la clinique **ClinicFlow**. Tous droits réservés.
