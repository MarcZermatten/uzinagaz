# Configuration du Disque de Stockage (1TB)

Ce guide explique comment configurer le disque externe 1TB pour stocker les ROMs et sauvegardes.

## Chemin Configuré

Zerver est configuré pour utiliser : `/mnt/storage/Zerver/`

## Structure des Dossiers Requise

```
/mnt/storage/Zerver/
├── roms/
│   ├── nes/          # Nintendo Entertainment System (.nes, .zip)
│   ├── snes/         # Super Nintendo (.smc, .sfc, .zip)
│   ├── gb/           # Game Boy (.gb, .zip)
│   ├── gbc/          # Game Boy Color (.gbc, .zip)
│   ├── gba/          # Game Boy Advance (.gba, .zip)
│   ├── genesis/      # Sega Genesis/Mega Drive (.md, .bin, .zip)
│   ├── n64/          # Nintendo 64 (.n64, .z64, .zip)
│   └── psx/          # PlayStation 1 (.bin, .cue, .iso, .zip)
└── saves/
    └── [user_id]/    # Sauvegardes par utilisateur (auto-créé)
```

## Option A : Windows (Recommandé pour WSL)

Si ton disque est monté en tant que lettre de lecteur Windows (ex: D:, E:, F:)

### 1. Créer la structure dans Windows

Ouvre PowerShell ou l'Explorateur de fichiers et crée :
```
D:\Zerver\roms\nes\
D:\Zerver\roms\snes\
D:\Zerver\roms\gb\
D:\Zerver\roms\gbc\
D:\Zerver\roms\gba\
D:\Zerver\roms\genesis\
D:\Zerver\roms\n64\
D:\Zerver\roms\psx\
D:\Zerver\saves\
```

PowerShell :
```powershell
# Remplace D: par la lettre de ton disque
mkdir D:\Zerver\roms\nes, D:\Zerver\roms\snes, D:\Zerver\roms\gb, D:\Zerver\roms\gbc, D:\Zerver\roms\gba, D:\Zerver\roms\genesis, D:\Zerver\roms\n64, D:\Zerver\roms\psx, D:\Zerver\saves
```

### 2. Monter dans WSL (si tu utilises WSL)

Dans WSL, les disques Windows sont auto-montés dans `/mnt/` :
- `D:` → `/mnt/d/`
- `E:` → `/mnt/e/`
- etc.

**Mise à jour du .env** :
```bash
cd backend
nano .env
```

Change :
```
ROM_STORAGE_PATH=/mnt/d/Zerver/roms    # ou /mnt/e/, /mnt/f/ selon ton disque
SAVE_STORAGE_PATH=/mnt/d/Zerver/saves
```

## Option B : Monter Manuellement dans WSL

### 1. Identifier le disque

Dans PowerShell (admin) :
```powershell
Get-Disk
```

Note le numéro du disque (ex: `\\.\PhysicalDrive1`)

### 2. Créer le point de montage

Dans WSL :
```bash
sudo mkdir -p /mnt/storage
```

### 3. Monter le disque

Dans WSL (`/etc/wsl.conf`) :
```ini
[automount]
enabled = true
options = "metadata,umask=22,fmask=11"
mountFsTab = true
```

Créer `/etc/fstab` dans WSL :
```
# Remplace /dev/sdX par ton disque (trouve avec `lsblk`)
/dev/sdb1 /mnt/storage ntfs-3g defaults 0 0
```

Redémarrer WSL :
```powershell
# Dans PowerShell
wsl --shutdown
```

### 4. Créer la structure

```bash
mkdir -p /mnt/storage/Zerver/roms/{nes,snes,gb,gbc,gba,genesis,n64,psx}
mkdir -p /mnt/storage/Zerver/saves
```

## Vérification

Après configuration, vérifier :

```bash
# Vérifier que les dossiers existent
ls -la /mnt/storage/Zerver/roms/

# Devrait afficher : nes, snes, gb, gbc, gba, genesis, n64, psx
```

## Organiser les ROMs

### Exemple de Structure

```
/mnt/storage/Zerver/roms/
├── nes/
│   ├── Super Mario Bros.nes
│   ├── The Legend of Zelda.nes
│   └── Metroid.nes
├── snes/
│   ├── Super Mario World.smc
│   ├── The Legend of Zelda - A Link to the Past.smc
│   └── Super Metroid.smc
├── gba/
│   ├── Pokemon Fire Red.gba
│   └── Metroid Fusion.gba
└── psx/
    ├── Final Fantasy VII/
    │   ├── FF7 Disc 1.bin
    │   ├── FF7 Disc 1.cue
    │   ├── FF7 Disc 2.bin
    │   └── FF7 Disc 2.cue
    └── Crash Bandicoot.bin
```

### Conventions de Nommage (Optionnel mais Recommandé)

- **Nom clair** : `Super Mario Bros.nes` plutôt que `smb1.nes`
- **Pas de caractères spéciaux** : Éviter `é`, `à`, `/`, etc.
- **Extensions correctes** : `.nes`, `.smc`, `.gba`, `.bin`, `.cue`, `.iso`

## Estimation de Capacité

Voici l'espace moyen par console sur 1TB :

| Console | Taille Moyenne ROM | Jeux pour 100GB | Total Estimé |
|---------|-------------------|-----------------|--------------|
| NES | 40 KB - 512 KB | ~200,000 | Toute la bibliothèque |
| SNES | 512 KB - 6 MB | ~50,000 | Toute la bibliothèque |
| Game Boy | 32 KB - 512 KB | ~100,000 | Toute la bibliothèque |
| GBA | 4 MB - 32 MB | ~5,000 | Toute la bibliothèque |
| Genesis | 512 KB - 4 MB | ~50,000 | Toute la bibliothèque |
| N64 | 8 MB - 64 MB | ~2,000 | ~100-200 jeux réalistes |
| PS1 | 200 MB - 700 MB | ~150 | ~1,000 jeux max |

**Total réaliste sur 1TB** : Plusieurs milliers de jeux toutes consoles confondues.

## Permissions (Linux/WSL)

Si tu rencontres des erreurs de permission :

```bash
# Donner les droits à l'utilisateur courant
sudo chown -R $USER:$USER /mnt/storage/Zerver
chmod -R 755 /mnt/storage/Zerver
```

## Sauvegarde des ROMs

**Important** : Garde toujours une copie de secours de tes ROMs !

Options :
1. **Backup externe** : Disque dur USB séparé
2. **Cloud** : Google Drive, OneDrive (attention à la légalité)
3. **NAS** : Synology, QNAP

## Légalité

**Rappel** : Il est légal de posséder des ROMs de jeux que tu possèdes physiquement. Le téléchargement de ROMs que tu ne possèdes pas est généralement illégal.

Sources légales :
- Dumper tes propres cartouches avec un dumper comme Retrode
- Acheter des collections officielles (ex: Evercade, Analogue Pocket)

## Troubleshooting

### "Permission denied" au lancement du backend

```bash
# Vérifier les permissions
ls -la /mnt/storage/Zerver/

# Si nécessaire
chmod -R 755 /mnt/storage/Zerver/
```

### Le disque n'est pas monté au démarrage

Vérifier `/etc/fstab` et `wsl --shutdown` pour redémarrer WSL.

### Espace disque plein

```bash
# Vérifier l'espace utilisé
du -sh /mnt/storage/Zerver/*

# Vérifier les plus gros fichiers
du -ah /mnt/storage/Zerver/roms/ | sort -rh | head -20
```

## Prochaines Étapes

Une fois la structure créée :

1. Copier tes ROMs dans les dossiers appropriés
2. Lancer le backend Zerver : `cd backend && cargo run`
3. Les ROMs apparaîtront automatiquement dans l'interface (Phase 3)

Pour upload via l'interface web : **Phase 3 - Game Library** (à implémenter).
