# Zerver - Plateforme de Rétrogaming

Plateforme de rétrogaming avec une interface Windows XP en pixel art. Jouez à vos jeux rétro favoris (NES, SNES, Game Boy, GBA, Genesis, PS1, N64) directement dans votre navigateur.

## Fonctionnalités

- **Interface Windows XP Unique** : Desktop en pixel art avec écran d'ordinateur servant d'interface dynamique
- **Multi-consoles** : Support de NES, SNES, Game Boy, GBA, Genesis, PlayStation 1, Nintendo 64
- **Système d'authentification** : Comptes utilisateurs avec login/register
- **Effets CRT** : Scanlines et effets old-school configurables
- **Sauvegarde cloud** : Save states synchronisés
- **Achievements** : Système de succès et progression
- **Personnalisation** : Thèmes, contrôles, shaders

## Stack Technique

### Backend
- **Rust** + Actix-web : Serveur HTTP haute performance
- **PostgreSQL** + SQLx : Base de données avec migrations
- **JWT** : Authentification sécurisée
- **Bcrypt** : Hachage de mots de passe

### Frontend
- **React** + TypeScript + Vite : Application moderne
- **Zustand** : Gestion d'état légère
- **Axios** : Client HTTP
- **EmulatorJS** : Émulation multi-consoles
- **Framer Motion** : Animations fluides

## Installation

### Prérequis

- **Rust** (1.70+) : https://rustup.rs/
- **Node.js** (18+) : https://nodejs.org/
- **PostgreSQL** (16+) : https://www.postgresql.org/
- **Docker** (optionnel) : https://www.docker.com/

### Setup Backend

```bash
# 1. Naviguer vers le backend
cd backend

# 2. Copier le fichier .env
cp .env.example .env

# 3. Démarrer PostgreSQL (Docker)
# Retour à la racine du projet
cd ..
docker compose up -d postgres

# Ou installer PostgreSQL localement et créer la DB
createdb zerver

# 4. Compiler et lancer le backend
cd backend
cargo run
```

Le serveur démarre sur `http://localhost:8080`

### Setup Frontend

```bash
# 1. Naviguer vers le frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Copier le fichier .env
cp .env.example .env

# 4. Lancer le dev server
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

## Configuration

### Backend (.env)

```env
DATABASE_URL=postgresql://zerver:password@localhost:5432/zerver
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=86400
SERVER_PORT=8080
CORS_ORIGIN=http://localhost:5173
ROM_STORAGE_PATH=../storage/roms
SAVE_STORAGE_PATH=../storage/saves
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_EMULATOR_DATA_PATH=/data
VITE_ENABLE_CRT=true
```

## Structure du Projet

```
Zerver/
├── backend/               # Serveur Rust Actix-web
│   ├── src/
│   │   ├── main.rs       # Point d'entrée
│   │   ├── config.rs     # Configuration
│   │   ├── models/       # Modèles de données
│   │   ├── handlers/     # Handlers HTTP
│   │   ├── services/     # Logique métier
│   │   ├── middleware/   # Middleware (auth, rate limit)
│   │   └── db/           # Connexion DB, migrations
│   └── Cargo.toml
│
├── frontend/             # Application React
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── stores/       # Zustand stores
│   │   ├── services/     # API clients
│   │   ├── types/        # Types TypeScript
│   │   └── App.tsx       # Composant racine
│   └── package.json
│
├── storage/              # Stockage fichiers
│   ├── roms/            # ROMs par console
│   └── saves/           # Save states
│
└── docker-compose.yml   # PostgreSQL
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/logout` - Déconnexion
- `GET /api/v1/auth/me` - Infos utilisateur (protégé)

### Games (À implémenter)
- `GET /api/v1/games` - Liste des jeux
- `GET /api/v1/games/:id` - Détails d'un jeu
- `GET /api/v1/games/:id/rom` - Télécharger ROM
- `POST /api/v1/games/upload` - Upload ROM

### Achievements (À implémenter)
- `GET /api/v1/achievements` - Tous les achievements
- `GET /api/v1/achievements/user` - Progression utilisateur
- `POST /api/v1/achievements/unlock` - Débloquer achievement

## Phase 1: Foundation ✅

### Accompli

**Backend :**
- ✅ Projet Rust initialisé avec Actix-web
- ✅ Configuration avec .env
- ✅ Modèles de données (User, Game, Achievement, SaveState)
- ✅ Migrations PostgreSQL (users, consoles, games, achievements, saves, stats)
- ✅ Service d'authentification (JWT, bcrypt)
- ✅ Endpoints auth (register, login, logout, me)
- ✅ Middleware d'authentification JWT
- ✅ Gestion d'erreurs personnalisée
- ✅ CORS configuré

**Frontend :**
- ✅ Projet React + TypeScript + Vite
- ✅ Types TypeScript complets
- ✅ Stores Zustand (auth, desktop, window, game, settings)
- ✅ Services API (axios, auth)
- ✅ Composant LoginDialog + RegisterDialog
- ✅ Composant Desktop avec style Windows XP
- ✅ Composant DesktopIcon
- ✅ Composant Taskbar avec Start Menu
- ✅ Effet CRT Scanlines
- ✅ Build fonctionnel

## Prochaines Étapes (Phase 2)

### Windows XP UI
- [ ] Window component (draggable avec react-rnd)
- [ ] WindowManager hook
- [ ] Créer/sourcer assets pixel art (desk, monitor, icons)
- [ ] Intégrer react-windows-xp pour window chrome
- [ ] Améliorer animations

## Développement

### Backend

```bash
# Compiler
cd backend && cargo build

# Lancer en mode dev
cargo run

# Tests
cargo test

# Vérifier le code
cargo check
```

### Frontend

```bash
# Dev server avec HMR
cd frontend && npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## License

MIT

## Auteur

Projet créé avec Claude Code pour Leon.
