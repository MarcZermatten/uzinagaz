# Storage - ROMs et Sauvegardes

## Structure

```
storage/
├── roms/           # ROMs organisées par console
│   ├── nes/
│   ├── snes/
│   ├── gb/
│   ├── gbc/
│   ├── gba/
│   ├── genesis/
│   ├── n64/
│   └── psx/
└── saves/          # Sauvegardes utilisateurs
```

## Migration vers Disque Externe (1TB)

Quand ton disque externe sera monté à `/mnt/storage`, tu pourras migrer :

1. Copier tout le contenu :
```bash
cp -r storage/* /mnt/storage/Zerver/
```

2. Mettre à jour `backend/.env` :
```
ROM_STORAGE_PATH=/mnt/storage/Zerver/roms
SAVE_STORAGE_PATH=/mnt/storage/Zerver/saves
```

3. Redémarrer le backend

## Ajouter des ROMs

Place simplement tes fichiers ROM dans le dossier de la console correspondante :

```
storage/roms/nes/Super Mario Bros.nes
storage/roms/snes/Super Mario World.smc
storage/roms/gba/Pokemon Fire Red.gba
```

Le backend détectera automatiquement les nouveaux fichiers.

## Extensions Supportées

- **NES**: `.nes`, `.zip`
- **SNES**: `.smc`, `.sfc`, `.zip`
- **Game Boy**: `.gb`, `.zip`
- **Game Boy Color**: `.gbc`, `.zip`
- **Game Boy Advance**: `.gba`, `.zip`
- **Genesis/Mega Drive**: `.md`, `.bin`, `.zip`
- **Nintendo 64**: `.n64`, `.z64`, `.zip`
- **PlayStation 1**: `.bin`, `.cue`, `.iso`, `.zip`
