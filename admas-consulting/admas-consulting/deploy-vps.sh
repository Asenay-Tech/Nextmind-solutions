#!/bin/bash
apt update && apt upgrade -y
apt install -y nginx ufw curl git docker.io docker-compose
systemctl enable docker
ufw allow 'OpenSSH'
ufw allow 'Nginx Full'
ufw --force enable
echo "✅ VPS is ready!"
