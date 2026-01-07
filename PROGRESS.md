# Zerver - Progression du Projet

Statut : **Phase 1 Terminée ✅**

Dernière mise à jour : 7 janvier 2026

---

## Phase 1: Foundation ✅ (100%)

### Backend (Rust + Actix-web) ✅

**Configuration & Structure**
- [x] Projet Cargo initialisé
- [x] Dépendances ajoutées (actix-web, sqlx, jwt, bcrypt, etc.)
- [x] Configuration .env avec variables d'environnement
- [x] Structure de dossiers modulaire

**Base de Données**
- [x] Docker Compose pour PostgreSQL
- [x] 4 migrations SQL créées :
  - `001_users.sql` : Users & Sessions
  - `002_consoles_games.sql` : Consoles & Games (+ seed data)
  - `003_achievements.sql` : Achievements & UserAchievements (+ seed data)
  - `004_saves_stats.sql` : SaveStates, Stats, PlaySessions, UserSettings
- [x] Connexion pool SQLx avec migrations automatiques

**Modèles de Données**
- [x] `user.rs` : User, RegisterRequest, LoginRequest, AuthResponse, Claims, UserSettings
- [x] `game.rs` : Console, Game, UserGameStats, PlaySession
- [x] `achievement.rs` : Achievement, UserAchievement, AchievementWithStatus
- [x] `save_state.rs` : SaveState, SaveStateUploadRequest

**Services & Logique Métier**
- [x] `auth_service.rs` :
  - Hachage mot de passe (bcrypt)
  - Génération/vérification JWT
  - CRUD utilisateurs
  - Création settings par défaut

**Handlers HTTP**
- [x] `auth.rs` :
  - POST `/api/v1/auth/register` ✅
  - POST `/api/v1/auth/login` ✅
  - POST `/api/v1/auth/logout` ✅
  - GET `/api/v1/auth/me` ✅ (protégé)

**Middleware**
- [x] `auth.rs` : Middleware JWT extraction + validation
- [x] CORS configuré pour frontend

**Utilitaires**
- [x] `errors.rs` : Gestion d'erreurs personnalisée (ApiError)

**Point d'Entrée**
- [x] `main.rs` : Serveur Actix-web complet avec routes

**Tests**
- [x] Compilation sans erreurs (`cargo check` ✅)

---

### Frontend (React + TypeScript + Vite) ✅

**Configuration & Structure**
- [x] Projet Vite initialisé avec template React-TS
- [x] Dépendances installées :
  - `zustand` (state management)
  - `axios` (HTTP client)
  - `react-windows-xp` (Windows XP components)
  - `framer-motion` (animations)
  - `react-rnd` (draggable/resizable)
- [x] Configuration .env avec API URL
- [x] Structure de dossiers modulaire

**Types TypeScript**
- [x] `user.ts` : User, RegisterRequest, LoginRequest, AuthResponse, UserSettings
- [x] `game.ts` : Console, Game, GameListResponse, UserGameStats
- [x] `achievement.ts` : Achievement, UserAchievement, AchievementWithStatus
- [x] `desktop.ts` : DesktopIcon, WindowData, WindowType
- [x] `emulator.ts` : SaveState, EmulatorConfig, GameControls

**Stores Zustand**
- [x] `authStore.ts` : Authentification (user, token, setAuth, clearAuth) + persistance
- [x] `desktopStore.ts` : Bureau (icons, wallpaper, CRT, scanlines)
- [x] `windowStore.ts` : Fenêtres (open, close, minimize, maximize, z-index)
- [x] `gameStore.ts` : Jeux (games, consoles, currentGame, launch/exit)
- [x] `settingsStore.ts` : Paramètres (theme, CRT, volume, key mappings) + persistance

**Services API**
- [x] `api.ts` : Client Axios configuré avec intercepteurs (auth token, error handling)
- [x] `authService.ts` : register, login, logout, getMe
- [x] `gameService.ts` : getGames, getGame, getConsoles, getRomUrl

**Composants**

**Auth**
- [x] `LoginDialog.tsx` : Formulaire de connexion avec validation
- [x] `RegisterDialog.tsx` : Formulaire d'inscription avec validation
- [x] `AuthDialog.css` : Style Windows XP

**Desktop**
- [x] `Desktop.tsx` : Conteneur principal avec desk background + monitor frame
- [x] `Desktop.css` : Style du bureau avec dégradés
- [x] `Taskbar.tsx` : Barre des tâches avec Start button + Start menu + System tray
- [x] `Taskbar.css` : Style Windows XP blue taskbar

**Icons**
- [x] `DesktopIcon.tsx` : Icône de bureau (single/double-click, selection)
- [x] `DesktopIcon.css` : Style avec ombres et sélection

**Effects**
- [x] `CRTScanlines.tsx` : Effet scanlines CRT avec intensité configurable
- [x] `CRTScanlines.css` : Animation scanlines + vignette radiale

**App Principal**
- [x] `App.tsx` : Gestion auth state, affichage Desktop ou Login/Register
- [x] `App.css` : Reset styles pour #root
- [x] `index.css` : Reset global + fonts

**Tests**
- [x] Build production sans erreurs (`npm run build` ✅)

---

## Fichiers Créés (Total: 50+)

### Backend (25 fichiers)
```
backend/
├── Cargo.toml                              ✅
├── .env.example                            ✅
├── .env                                    ✅
└── src/
    ├── main.rs                             ✅
    ├── config.rs                           ✅
    ├── models/
    │   ├── mod.rs                          ✅
    │   ├── user.rs                         ✅
    │   ├── game.rs                         ✅
    │   ├── achievement.rs                  ✅
    │   └── save_state.rs                   ✅
    ├── handlers/
    │   ├── mod.rs                          ✅
    │   └── auth.rs                         ✅
    ├── services/
    │   ├── mod.rs                          ✅
    │   └── auth_service.rs                 ✅
    ├── middleware/
    │   ├── mod.rs                          ✅
    │   └── auth.rs                         ✅
    ├── db/
    │   ├── mod.rs                          ✅
    │   ├── connection.rs                   ✅
    │   └── migrations/
    │       ├── 001_users.sql               ✅
    │       ├── 002_consoles_games.sql      ✅
    │       ├── 003_achievements.sql        ✅
    │       └── 004_saves_stats.sql         ✅
    └── utils/
        ├── mod.rs                          ✅
        └── errors.rs                       ✅
```

### Frontend (25+ fichiers)
```
frontend/
├── package.json                            ✅
├── .env.example                            ✅
├── .env                                    ✅
└── src/
    ├── App.tsx                             ✅
    ├── App.css                             ✅
    ├── index.css                           ✅
    ├── types/
    │   ├── index.ts                        ✅
    │   ├── user.ts                         ✅
    │   ├── game.ts                         ✅
    │   ├── achievement.ts                  ✅
    │   ├── desktop.ts                      ✅
    │   └── emulator.ts                     ✅
    ├── stores/
    │   ├── authStore.ts                    ✅
    │   ├── desktopStore.ts                 ✅
    │   ├── windowStore.ts                  ✅
    │   ├── gameStore.ts                    ✅
    │   └── settingsStore.ts                ✅
    ├── services/
    │   ├── api.ts                          ✅
    │   ├── authService.ts                  ✅
    │   └── gameService.ts                  ✅
    └── components/
        ├── Auth/
        │   ├── LoginDialog.tsx             ✅
        │   ├── RegisterDialog.tsx          ✅
        │   └── AuthDialog.css              ✅
        ├── Desktop/
        │   ├── Desktop.tsx                 ✅
        │   ├── Desktop.css                 ✅
        │   ├── Taskbar.tsx                 ✅
        │   └── Taskbar.css                 ✅
        ├── Icons/
        │   ├── DesktopIcon.tsx             ✅
        │   └── DesktopIcon.css             ✅
        └── Effects/
            ├── CRTScanlines.tsx            ✅
            └── CRTScanlines.css            ✅
```

### Racine
```
├── docker-compose.yml                      ✅
├── README.md                               ✅
├── PROGRESS.md                             ✅ (ce fichier)
└── CLAUDE.md                               ✅
```

---

## Phase 2: Windows XP UI ✅ (100%)

### Accompli

**Frontend**
- [x] Window component (draggable/resizable avec react-rnd) ✅
- [x] WindowManager pour gérer toutes les fenêtres ✅
- [x] SettingsWindow avec 3 tabs (Video, Audio, Controls) ✅
- [x] AchievementsWindow avec mock data ✅
- [x] Animations Framer Motion (window open/close) ✅
- [x] Style Windows XP complet (titlebar, buttons, scrollbars) ✅
- [x] Integration Desktop <-> Windows ✅

**Nouveaux Fichiers Créés (Phase 2)**
```
frontend/src/components/Windows/
├── Window.tsx                     ✅
├── Window.css                     ✅
├── WindowManager.tsx              ✅
├── SettingsWindow.tsx             ✅
├── SettingsWindow.css             ✅
├── AchievementsWindow.tsx         ✅
└── AchievementsWindow.css         ✅

storage/
├── roms/                          ✅ (structure créée)
│   ├── nes/
│   ├── snes/
│   ├── gb/
│   ├── gbc/
│   ├── gba/
│   ├── genesis/
│   ├── n64/
│   └── psx/
├── saves/                         ✅
└── README.md                      ✅

Documentation/
├── STORAGE_SETUP.md               ✅
```

**Fonctionnalités**
- ✅ Fenêtres draggables (drag par titlebar)
- ✅ Fenêtres resizables (resize par bordures)
- ✅ Boutons minimize, maximize, close fonctionnels
- ✅ Z-index management (click to bring to front)
- ✅ Settings: CRT toggle, scanline intensity, volume, key mappings
- ✅ Achievements: liste avec rarity, progress bar, stats
- ✅ Scrollbars style Windows XP
- ✅ Animations smooth (Framer Motion)

**Backend**
- [ ] Handlers games (list, get, upload, rom streaming) - Phase 3
- [ ] Service de gestion des fichiers ROM - Phase 3
- [ ] Endpoints consoles - Phase 3

**Assets**
- [ ] Pixel art desk scene (bureau + moniteur) - En attente
- [ ] Icons consoles (32x32 ou 48x48)
- [ ] Windows XP UI sprites
- [ ] Curseurs custom
- [ ] Sons (startup, clicks, errors)

---

## Phase 3: Game Library (0%)

### À Faire

**Backend**
- [ ] Migration seed pour quelques jeux de test
- [ ] Upload ROM endpoint (multipart)
- [ ] ROM streaming optimisé (byte-range)
- [ ] Validation fichiers (extensions, MIME types)

**Frontend**
- [ ] GameIcon component amélioré (cover images)
- [ ] FolderWindow avec grille de jeux
- [ ] Upload ROM dialog
- [ ] Hooks useGames pour charger la bibliothèque
- [ ] Filtrage par console/genre

---

## Phase 4: Emulation (0%)

### À Faire

**Frontend**
- [ ] Télécharger EmulatorJS data folder
- [ ] Installer react-emulatorjs ou @emulatorjs/emulatorjs
- [ ] GamePlayer component fullscreen
- [ ] Game launch transition animation
- [ ] Exit game button (retour desktop)
- [ ] Fullscreen toggle
- [ ] Volume control

**Backend**
- [ ] Track play_sessions
- [ ] POST /stats/track endpoint

---

## Phase 5: Save States (0%)

### À Faire

**Backend**
- [ ] Upload/download save endpoints
- [ ] Stockage local (MVP) ou S3
- [ ] Screenshot upload avec save

**Frontend**
- [ ] SaveStateManager component
- [ ] Quick save/load (F5/F9)
- [ ] Save state list avec screenshots
- [ ] Cloud sync UI

---

## Phase 6: Achievements (0%)

### À Faire

**Backend**
- [ ] Unlock achievement endpoint
- [ ] Achievement tracking service (check criteria)
- [ ] Agrégation stats pour achievements automatiques

**Frontend**
- [ ] AchievementsWindow avec grille
- [ ] Achievement unlock notification (toast/modal)
- [ ] Progress bars
- [ ] Badges UI
- [ ] Sound effect on unlock

---

## Phase 7-10: Voir le Plan Complet

Consulter `C:\Users\Marc\.claude\plans\ethereal-painting-floyd.md` pour les phases suivantes :
- Phase 7: Customization
- Phase 8: Statistics & Polish
- Phase 9: Testing & Optimization
- Phase 10: Deployment

---

## Commandes Utiles

### Backend
```bash
cd backend
cargo run              # Lancer serveur
cargo check            # Vérifier compilation
cargo test             # Tests
```

### Frontend
```bash
cd frontend
npm run dev            # Dev server
npm run build          # Build production
npm run preview        # Preview build
```

### Database
```bash
# Avec Docker
docker compose up -d postgres

# Ou PostgreSQL local
createdb zerver
psql -U zerver -d zerver
```

---

## Notes Importantes

1. **Docker** : Pas installé sur le système actuel. PostgreSQL devra être installé localement ou Docker Desktop ajouté.

2. **EmulatorJS Data** : À télécharger depuis https://github.com/EmulatorJS/EmulatorJS/releases et placer dans `frontend/public/data/`

3. **Assets Pixel Art** : À créer ou commander (desk scene, icons, sprites)

4. **ROMs** : L'utilisateur devra fournir ses propres ROMs légales. Ne pas inclure de ROMs dans le repo.

5. **BIOS Files** : Certains émulateurs (PS1, N64) nécessitent des BIOS. À placer dans `frontend/public/data/bios/`

---

## Statut Global

| Phase | Statut | Progression |
|-------|--------|-------------|
| Phase 1: Foundation | ✅ Terminée | 100% |
| Phase 2: Windows XP UI | ✅ Terminée | 100% |
| Phase 3: Game Library | 🔄 En attente | 0% |
| Phase 4: Emulation | 🔄 En attente | 0% |
| Phase 5: Save States | 🔄 En attente | 0% |
| Phase 6: Achievements | 🔄 En attente | 0% |
| Phase 7: Customization | 🔄 En attente | 0% |
| Phase 8: Polish | 🔄 En attente | 0% |
| Phase 9: Testing | 🔄 En attente | 0% |
| Phase 10: Deployment | 🔄 En attente | 0% |

**Progression Totale : 20%** (2/10 phases terminées)
