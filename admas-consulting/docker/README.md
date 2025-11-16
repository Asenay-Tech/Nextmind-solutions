# Docker Production Setup for Ubuntu 24.04

This directory contains scripts and configuration files for setting up Docker and Docker Compose on Ubuntu 24.04 VPS.

## Files

- `daemon.json` - Docker daemon configuration for production
- `setup-docker-production.sh` - Automated setup script
- `verify-docker-setup.sh` - Verification and health check script

## Quick Start

### 1. Run Production Setup (as root or with sudo)

```bash
sudo bash docker/setup-docker-production.sh
```

This script will:
- Configure Docker daemon with production settings
- Add your user to the docker group
- Enable Docker service to start on boot
- Configure log rotation
- Set up firewall rules (if UFW is installed)
- Verify the installation

### 2. Verify Setup

```bash
# Make script executable
chmod +x docker/verify-docker-setup.sh

# Run verification
./docker/verify-docker-setup.sh
```

### 3. Test Docker Without Sudo

After setup, log out and back in, or run:

```bash
newgrp docker
```

Then test:

```bash
docker ps
docker compose version
```

## Manual Setup

If you prefer to set up manually:

### 1. Configure Docker Daemon

```bash
sudo mkdir -p /etc/docker
sudo cp docker/daemon.json /etc/docker/daemon.json
sudo systemctl restart docker
```

### 2. Add User to Docker Group

```bash
sudo usermod -aG docker $USER
newgrp docker  # Or log out and back in
```

### 3. Enable Docker Service

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

## Configuration Details

### daemon.json

The `daemon.json` file includes:

- **Logging**: JSON file driver with rotation (10MB max, 3 files, compressed)
- **Storage**: overlay2 driver (recommended for production)
- **Live Restore**: Allows containers to keep running during daemon restarts
- **Userland Proxy**: Disabled for better performance
- **Metrics**: Exposed on localhost:9323 (for monitoring)
- **IP Pools**: Default address pool configuration

### Security Considerations

1. **User Permissions**: Users in the docker group have root-equivalent access. Only add trusted users.

2. **Firewall**: Ensure UFW or your firewall allows necessary ports:
   - 22 (SSH)
   - 80 (HTTP)
   - 443 (HTTPS)
   - Docker manages its own iptables rules

3. **Log Rotation**: Configured to prevent disk space issues

4. **Metrics**: Only exposed on localhost (127.0.0.1) for security

## Verification Checklist

After setup, verify:

- [ ] Docker service is running: `systemctl status docker`
- [ ] Docker service is enabled: `systemctl is-enabled docker`
- [ ] Docker commands work without sudo: `docker ps`
- [ ] Docker Compose works without sudo: `docker compose version`
- [ ] User is in docker group: `groups`
- [ ] Daemon config is loaded: `docker info | grep -A 10 "Server Version"`
- [ ] Storage driver is overlay2: `docker info | grep "Storage Driver"`
- [ ] Log rotation is configured: `ls -la /etc/logrotate.d/docker-containers`

## Troubleshooting

### Docker Commands Require Sudo

If you still need sudo after being added to the docker group:

1. Log out and log back in
2. Or run: `newgrp docker`
3. Verify: `groups` should show `docker`

### Docker Service Won't Start

Check logs:

```bash
sudo journalctl -u docker.service -n 50
```

Common issues:
- Invalid `daemon.json` syntax
- Storage driver issues
- Disk space problems

### Permission Denied Errors

Ensure:
1. User is in docker group: `groups $USER`
2. Docker socket has correct permissions: `ls -la /var/run/docker.sock`
3. User has logged out and back in after being added to group

## Production Best Practices

1. **Regular Updates**: Keep Docker updated
   ```bash
   sudo apt update
   sudo apt upgrade docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

2. **Monitor Disk Usage**: Docker can use significant disk space
   ```bash
   docker system df
   ```

3. **Clean Up Regularly**:
   ```bash
   docker system prune -a  # Remove unused images, containers, networks
   ```

4. **Backup Important Data**: Use volumes for persistent data and back them up regularly

5. **Security Updates**: Keep the host system updated
   ```bash
   sudo apt update && sudo apt upgrade
   ```

## Files to Commit

The following files should be committed to version control:

- `docker/daemon.json` - Docker daemon configuration
- `docker/setup-docker-production.sh` - Setup script
- `docker/verify-docker-setup.sh` - Verification script
- `docker/README.md` - This file

**Do NOT commit:**
- `/etc/docker/daemon.json` (server-specific, may differ)
- Any files with sensitive information

## Support

For issues or questions:
1. Run the verification script: `./docker/verify-docker-setup.sh`
2. Check Docker logs: `sudo journalctl -u docker.service`
3. Review Docker info: `docker info`

