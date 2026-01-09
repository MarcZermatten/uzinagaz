# Historique des Sessions - Zerver

## Session 1 - 9 janvier 2026
**Thème principal** : Configuration initiale de l'assistant

### Ce qu'on a fait
1. Mise en place de la structure de configuration Claude
2. Création des commandes personnalisées (/save, /recap, /memorise, /erreur)
3. Initialisation des fichiers mémoire

### Configuration établie
- Stack : React/TypeScript/Vite (frontend) + Rust/Actix (backend)
- Emulation : EmulatorJS multi-consoles
- Style : Interface Windows XP pixel art

### À faire
- Explorer le code existant
- Définir les prochaines fonctionnalités

---

## Session 2 - 9 janvier 2026
**Thème principal** : Déploiement en ligne de Zerver

### Ce qu'on a fait
1. Cloné et configuré le repo avec système de mémoire
2. Configuration des permissions Claude (autonomie totale)
3. Déploiement Docker du frontend avec EmulatorJS
4. Correction du backend Rust (problème sqlx offline)
5. Installation de Rust sur le serveur et compilation native
6. Mise en ligne sur https://zerver.zarante.duckdns.org

### Problèmes résolus
- **sqlx offline mode** : Le backend ne démarrait pas car les macros sqlx nécessitent soit une DB au build, soit les fichiers .sqlx de cache. Solution : compiler nativement sur le serveur avec DATABASE_URL disponible.
- **docker-compose bug** : Erreur 'ContainerConfig' avec docker-compose 1.29.2 et images Docker récentes. Solution : utiliser docker run directement.
- **EmulatorJS** : Fichiers data manquants. Solution : cloner depuis github.com/EmulatorJS/EmulatorJS

### Configuration serveur
- Frontend : port 3004 (nginx)
- Backend : port 3005 (Rust/Actix)
- URL : https://zerver.zarante.duckdns.org

### À faire
- Tester l'émulateur avec différentes ROMs
- Ajouter plus de ROMs si nécessaire
- Scanner les ROMs via l'API backend

---
*Nouvelle session = nouvelle entrée ci-dessus*
