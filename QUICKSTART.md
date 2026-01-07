# Zerver - Quick Start Guide

Guide de démarrage rapide pour lancer Zerver en local.

## Étape 1 : Installer PostgreSQL

### Option A : Docker (Recommandé)

1. Installer Docker Desktop : https://www.docker.com/products/docker-desktop/
2. Lancer PostgreSQL :
```bash
docker compose up -d
```

### Option B : PostgreSQL Local

1. Télécharger PostgreSQL 16 : https://www.postgresql.org/download/
2. Installer et configurer avec :
   - User: `zerver`
   - Password: `password`
   - Database: `zerver`

Ou via CLI :
```bash
# Créer utilisateur
createuser -P zerver  # password: password

# Créer database
createdb -O zerver zerver
```

## Étape 2 : Lancer le Backend

```bash
cd backend
cargo run
```

Le serveur démarre sur `http://localhost:8080`

Vous devriez voir :
```
[INFO] Configuration loaded successfully
[INFO] Database connection pool created
[INFO] Running database migrations...
[INFO] Migrations completed successfully
[INFO] Starting server on 127.0.0.1:8080
```

## Étape 3 : Lancer le Frontend

Dans un nouveau terminal :

```bash
cd frontend
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

## Étape 4 : Tester

1. Ouvrir http://localhost:5173 dans le navigateur
2. Cliquer sur "Register" pour créer un compte :
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Vous devriez voir le desktop Windows XP avec :
   - Icons (Settings, Achievements, Recycle Bin)
   - Taskbar en bas avec Start button
   - Effet CRT scanlines
4. Cliquer sur Start button pour ouvrir le menu
5. Se déconnecter avec "Log Out"

## Troubleshooting

### Erreur "failed to connect to database"

- Vérifier que PostgreSQL est démarré
- Vérifier les credentials dans `backend/.env`
- Tester la connexion :
```bash
psql -U zerver -d zerver -h localhost
```

### Erreur "Address already in use"

Un processus utilise déjà le port :
- Backend (8080) : `lsof -ti:8080 | xargs kill -9`
- Frontend (5173) : `lsof -ti:5173 | xargs kill -9`

### Erreur de compilation Rust

```bash
cd backend
cargo clean
cargo build
```

### Erreur npm

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Prochaines Étapes

Voir `PROGRESS.md` pour la liste des fonctionnalités à implémenter dans les phases suivantes.

La Phase 1 (Foundation) est terminée. Prochaine étape : Phase 2 (Windows XP UI avec fenêtres draggables).
