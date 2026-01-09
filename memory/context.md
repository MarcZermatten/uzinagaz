# Contexte - Projet Zerver

## Dernière mise à jour
2026-01-09

## Propriétaire
- **Nom** : Marc Zermatten
- **Projet** : Zerver - Plateforme de Rétrogaming

## Stack technique

### Backend (Rust)
- **Framework** : Actix-web
- **Base de données** : PostgreSQL
- **Auth** : JWT + bcrypt

### Frontend (TypeScript)
- **Framework** : React + Vite
- **State** : Zustand
- **HTTP** : Axios
- **Emulation** : EmulatorJS

### Consoles supportées
- NES, SNES, Game Boy, GBA, Genesis, PS1, N64

## Architecture
- **Frontend** : React SPA servie par nginx (conteneur Docker)
- **Backend** : API Rust/Actix (conteneur Docker)
- **Database** : PostgreSQL partagé avec autres services

## Fonctionnalités implémentées
- Interface desktop style Windows XP (pixel art)
- Authentification utilisateur
- Support multi-consoles via EmulatorJS

## Fonctionnalités en cours
- Fenêtres draggables
- Assets pixel art additionnels
- Animations raffinées

---

## Serveur de production (zerver)

### Hardware
- **Modèle** : HP EliteDesk 800 Mini
- **RAM** : 16 Go DDR4
- **SSD système** : Samsung 860 (232 Go)
- **HDD stockage** : Toshiba 1 To → `/mnt/storage` (870 Go dispo, ext4)
- **OS** : Ubuntu Server 24.04 LTS
- **IP locale** : 192.168.1.21
- **Hostname** : zerver
- **User** : zarante

### Accès externe
- **DuckDNS** : `zarante.duckdns.org`
- **Token DuckDNS** : b3f1fd22-822f-4933-bbb7-44251e46fbe2
- **Port forwarding** : 80, 443, 51820/UDP sur routeur Salt Box

### Services Docker existants
| Service | Port | Usage |
|---------|------|-------|
| nginx-proxy-manager | 80, 81, 8443 | Reverse proxy SSL |
| pihole | 53, 8080 | DNS + blocage pubs |
| postgres | 5432 | Base de données |
| smash-tracker | 3001 | Smash Tournament Tracker |
| geomind-frontend | 3002 | GeoMind Frontend |
| geomind-backend | 3003 | GeoMind API |

### Sites web hébergés
| Site | URL | Port conteneur |
|------|-----|----------------|
| Smash Tracker | https://smash.zarante.duckdns.org | 3001 |
| GeoMind | https://geomind.zarante.duckdns.org | 3002/3003 |
| **Zerver** | https://zerver.zarante.duckdns.org | 3004/3005 |

### Identifiants
| Service | User | Password |
|---------|------|----------|
| SSH/Samba | zarante | M0nsieurk |
| Pi-hole | - | M0nsieurk |
| PostgreSQL | marc | postgres123 |
| Nginx PM | admin@example.com | M0nsieurk |

### SSLH (Multiplexeur port 443)
- Écoute sur 443, redirige SSH (→22) ou HTTPS (→8443)
- Permet SSH via port 443 (contourne firewalls entreprise)

### Stockage
- `/mnt/storage/roms` - ROMs légales
- `/mnt/storage/saves` - Sauvegardes jeux
- `/mnt/storage/bios` - BIOS émulateurs

### Commandes utiles
```bash
# Connexion SSH
ssh zarante@192.168.1.21

# Docker
docker ps
docker logs <container>
docker restart <container>

# Nginx Proxy Manager
http://192.168.1.21:81
```
