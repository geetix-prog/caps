# Guide de déploiement — CAPS

## Architecture

```
VPS
├── Nginx (port 80/443)
│   ├── caps.mathis-guellati.fr      → fichiers statiques Vue (dist/)
│   └── pb.mathis-guellati.fr        → reverse proxy vers PocketBase (:8090)
└── PocketBase (port 8090, service systemd)
    └── /opt/caps-pb/
        ├── pocketbase            (binaire)
        └── pb_data/             (base de données, migrations, fichiers)
```

---

## 1. Préparation du VPS (une seule fois)

### Installer les dépendances

```bash
sudo apt update && sudo apt install -y nginx unzip curl
```

### Créer les dossiers

```bash
sudo mkdir -p /opt/caps-pb
sudo mkdir -p /var/www/caps
sudo chown -R $USER:$USER /opt/caps-pb /var/www/caps
```

### Télécharger PocketBase

Récupère la dernière version sur https://github.com/pocketbase/pocketbase/releases

```bash
cd /opt/caps-pb
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_linux_amd64.zip -o pb.zip
unzip pb.zip && rm pb.zip
chmod +x pocketbase
```

---

## 2. Service systemd pour PocketBase

Crée le fichier de service :

```bash
sudo nano /etc/systemd/system/caps-pb.service
```

Contenu :

```ini
[Unit]
Description=CAPS PocketBase
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/caps-pb
ExecStart=/opt/caps-pb/pocketbase serve --http=127.0.0.1:8090 --dir=/opt/caps-pb/pb_data
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Activer et démarrer :

```bash
sudo chown -R www-data:www-data /opt/caps-pb
sudo systemctl daemon-reload
sudo systemctl enable caps-pb
sudo systemctl start caps-pb
sudo systemctl status caps-pb   # doit afficher "active (running)"
```

---

## 3. Configuration Nginx

### Frontend Vue

```bash
sudo nano /etc/nginx/sites-available/caps-front
```

```nginx
server {
    listen 8080;
    server_name caps.mathis-guellati.fr;
    root /var/www/caps;
    index index.html;

    # SPA fallback (toutes les routes → index.html)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets buildés
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### PocketBase

```bash
sudo nano /etc/nginx/sites-available/caps-pb
```

```nginx
server {
    listen 8080;
    server_name pb.mathis-guellati.fr;

    location / {
        proxy_pass         http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;

        # Augmente la limite pour l'upload de fichiers
        client_max_body_size 20M;
    }
}
```

### Activer les configs

```bash
sudo ln -s /etc/nginx/sites-available/caps-front /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/caps-pb    /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### HTTPS avec Certbot (recommandé)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo # Certbot ne fonctionne pas sur un port non-standard.\n# Utilise Cloudflare (mode proxy orange) pour le HTTPS.\n# certbot --nginx -d caps.mathis-guellati.fr -d pb.mathis-guellati.fr
```

---

## 4. Premier déploiement

### Sur ta machine locale

Crée un fichier `.env.production` à la racine du projet :

```env
VITE_POCKETBASE_URL=https://pb.mathis-guellati.fr
```

Build et envoie :

```bash
bun run build
rsync -avz --delete dist/ user@ton-vps:/var/www/caps/
```

### Copier les migrations PocketBase

```bash
rsync -avz pb/pb_migrations/ user@ton-vps:/opt/caps-pb/pb_data/migrations/
```

### Redémarrer PocketBase pour appliquer les migrations

```bash
ssh user@ton-vps "sudo systemctl restart caps-pb"
```

### Accéder à l'admin PocketBase

Ouvre `https://pb.mathis-guellati.fr/_/` dans ton navigateur pour créer le compte admin.

---

## 5. Script de mise à jour (usage quotidien)

Crée un fichier `deploy.sh` à la racine du projet :

```bash
#!/bin/bash
set -e

VPS="user@ton-vps"
FRONT_DIR="/var/www/caps"
PB_MIGRATIONS_DIR="/opt/caps-pb/pb_data/migrations"

echo "🔨 Build..."
bun run build

echo "📦 Envoi du frontend..."
rsync -avz --delete dist/ $VPS:$FRONT_DIR/

echo "📋 Envoi des migrations..."
rsync -avz pb/pb_migrations/ $VPS:$PB_MIGRATIONS_DIR/

echo "🔄 Redémarrage PocketBase..."
ssh $VPS "sudo systemctl restart caps-pb"

echo "✅ Déploiement terminé !"
```

Rends-le exécutable :

```bash
chmod +x deploy.sh
```

### Utilisation

```bash
./deploy.sh
```

C'est tout. Le script build, envoie les fichiers et applique les nouvelles migrations en une commande.

---

## 6. Commandes utiles sur le VPS

```bash
# Voir les logs PocketBase en temps réel
sudo journalctl -u caps-pb -f

# Redémarrer PocketBase
sudo systemctl restart caps-pb

# Statut du service
sudo systemctl status caps-pb

# Recharger Nginx après modif de config
sudo nginx -t && sudo systemctl reload nginx
```

---

## 7. Mettre à jour PocketBase (nouvelle version)

```bash
ssh user@ton-vps
cd /opt/caps-pb
sudo systemctl stop caps-pb
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_linux_amd64.zip -o pb.zip
unzip -o pb.zip && rm pb.zip
chmod +x pocketbase
sudo chown www-data:www-data pocketbase
sudo systemctl start caps-pb
```

> **Les données (`pb_data/`) ne sont jamais touchées lors d'une mise à jour du binaire.**
