# Let's Encrypt SSL Certificate Setup Guide

This guide will help you set up Let's Encrypt SSL certificates for your nginx server using Certbot.

## Prerequisites

1. Your domain `shortly.ankitsh.cc` must be pointing to your server's IP address
2. Ports 80 and 443 must be open and accessible from the internet
3. Docker and Docker Compose must be installed

## Step 1: Configure Cloudflare Settings

Before setting up Let's Encrypt, you need to configure Cloudflare:

### Option A: Full (Strict) Mode (Recommended)
1. Log in to your Cloudflare Dashboard
2. Select your domain (`ankitsh.cc`)
3. Go to **SSL/TLS** → **Overview**
4. Set SSL/TLS encryption mode to **Full (strict)**
   - This ensures Cloudflare validates your Let's Encrypt certificate
   - Your origin server must have a valid SSL certificate (which Let's Encrypt provides)

### Option B: Flexible Mode (Not Recommended)
- If you use Flexible mode, Cloudflare will accept HTTP from your origin
- This is less secure and not recommended for production

### Additional Cloudflare Settings:
1. **SSL/TLS** → **Edge Certificates**:
   - Enable "Always Use HTTPS" (redirects HTTP to HTTPS)
   - Enable "Automatic HTTPS Rewrites"
   - Enable "Minimum TLS Version" (set to TLS 1.2 or higher)

2. **SSL/TLS** → **Origin Server**:
   - **Remove or disable** any Cloudflare Origin Certificates (not needed with Let's Encrypt)
   - Let's Encrypt certificates are publicly trusted and work with Full (strict) mode

3. **Network**:
   - Ensure "Proxy status" is enabled (orange cloud) for your domain
   - This ensures traffic goes through Cloudflare

## Step 2: Update Docker Compose Configuration

The `docker-compose.yml` has been updated to include:
- Certbot container for certificate management
- Volumes for Let's Encrypt certificates and ACME challenges

No manual changes needed - the configuration is already set up.

## Step 3: Initial Certificate Setup

**Note**: Nginx needs certificate files to start. We'll temporarily comment out the HTTPS block, get certificates, then restore it.

1. **Temporarily disable HTTPS in nginx.conf**:
   - Open `nginx/nginx.conf`
   - Comment out the entire HTTPS server block (lines starting with `# HTTPS server block` through its closing `}`)
   - Save the file

2. **Start nginx** (HTTP only for now):
   ```bash
   docker-compose up -d nginx
   ```

3. **Get Let's Encrypt certificate** (staging first, recommended):
   ```bash
   docker-compose run --rm --entrypoint certbot certbot certonly --webroot \
     -w /var/www/certbot \
     -d shortly.ankitsh.cc \
     --email your-email@example.com \
     --agree-tos \
     --no-eff-email \
     --staging
   ```
   
   **Important**: Use `--entrypoint ""` to override the default renewal entrypoint.
   
   Replace `your-email@example.com` with your actual email address.

4. **Restore HTTPS block in nginx.conf**:
   - Uncomment the HTTPS server block you commented out earlier
   - Save the file

5. **Restart nginx**:
   ```bash
   docker-compose restart nginx
   ```

6. **Get production certificate** (after staging works):
   ```bash
   docker-compose run --rm --entrypoint certbot certbot certonly --webroot \
     -w /var/www/certbot \
     -d shortly.ankitsh.cc \
     --email your-email@example.com \
     --agree-tos \
     --no-eff-email
   ```
   
   **Important**: Use `--entrypoint ""` to override the default renewal entrypoint.
   
   **Note**: Only use `--force-renewal` if you already have a certificate and want to replace it. For first-time setup, omit this flag.

7. **Reload nginx**:
   ```bash
   docker-compose exec nginx nginx -s reload
   ```

## Step 4: Verify Certificate Installation

1. **Check certificate files exist**:
   ```bash
   docker exec certbot ls -la /etc/letsencrypt/live/shortly.ankitsh.cc/
   ```
   You should see:
   - `cert.pem` - Certificate
   - `chain.pem` - Certificate chain
   - `fullchain.pem` - Full certificate chain (used by nginx)
   - `privkey.pem` - Private key

2. **Test nginx configuration**:
   ```bash
   docker exec nginx nginx -t
   ```

3. **Check SSL certificate**:
   ```bash
   openssl s_client -connect shortly.ankitsh.cc:443 -servername shortly.ankitsh.cc
   ```
   Or visit: https://www.ssllabs.com/ssltest/analyze.html?d=shortly.ankitsh.cc

4. **Verify in browser**:
   - Visit `https://shortly.ankitsh.cc`
   - Check that the padlock icon shows a valid certificate

## Step 5: Automatic Certificate Renewal

The `certbot` container in `docker-compose.yml` is configured to automatically renew certificates:
- It runs in the background
- Checks for renewal every 12 hours
- Certificates are renewed automatically when they're within 30 days of expiration

### Manual Renewal (if needed):
```bash
docker-compose run --rm certbot renew
docker-compose exec nginx nginx -s reload
```

### Test Renewal (dry run):
```bash
docker-compose run --rm certbot renew --dry-run
```

## Step 6: Update Nginx Configuration (if needed)

The nginx configuration has been updated to:
- Use Let's Encrypt certificates at `/etc/letsencrypt/live/shortly.ankitsh.cc/`
- Handle ACME challenges at `/.well-known/acme-challenge/`
- Redirect HTTP to HTTPS

No manual changes needed unless you want to customize SSL settings.

## Cloudflare Configuration Summary

### Required Changes:
1. **SSL/TLS Mode**: Set to **Full (strict)**
2. **Origin Certificates**: Remove/disable Cloudflare Origin Certificates (not needed)
3. **Always Use HTTPS**: Enable
4. **Automatic HTTPS Rewrites**: Enable

### Why Full (strict) Mode?
- Let's Encrypt certificates are publicly trusted
- Cloudflare will validate the certificate from your origin server
- Provides end-to-end encryption
- More secure than Flexible mode

### DNS Settings:
- Ensure your domain's A/AAAA records point to your server's IP
- Proxy status should be enabled (orange cloud) for Cloudflare protection

## Troubleshooting

### Error: "Failed to obtain certificate"
- **Check DNS**: Ensure `shortly.ankitsh.cc` points to your server's IP
- **Check ports**: Ensure ports 80 and 443 are open and accessible
- **Check firewall**: Allow incoming connections on ports 80 and 443
- **Check Cloudflare**: If using Cloudflare proxy, ensure it's not blocking Let's Encrypt validation

### Error: "Too many requests"
- You've hit Let's Encrypt rate limits (50 certificates per domain per week)
- Use staging mode (`staging=1`) for testing
- Wait a few days before trying again

### Error: "Connection refused on port 80/443"
- Verify ports are exposed in `docker-compose.yml`
- Check firewall rules: `sudo ufw status` or `sudo iptables -L`
- Ensure nginx container is running: `docker ps`

### Error 521 from Cloudflare
- Verify your origin server is accessible on port 443
- Check nginx logs: `docker logs nginx`
- Ensure SSL certificate is valid: `docker exec certbot certbot certificates`
- Verify Cloudflare SSL mode is set to "Full (strict)"

### Certificate not renewing automatically
- Check certbot container logs: `docker logs certbot`
- Verify certbot container is running: `docker ps | grep certbot`
- Manually trigger renewal: `docker-compose run --rm certbot renew`

### ACME challenge failing
- Ensure nginx is running and accessible on port 80
- Check that `/.well-known/acme-challenge/` location is configured in nginx
- Verify certbot-www volume is mounted correctly
- Test ACME challenge endpoint: `curl http://shortly.ankitsh.cc/.well-known/acme-challenge/test`

## Security Notes

- Let's Encrypt certificates are valid for 90 days and auto-renew
- Private keys are stored in Docker volumes (certbot-conf)
- Never commit certificate files or private keys to version control
- The `nginx/ssl/` directory is no longer needed for Let's Encrypt (but kept for compatibility)
- Certificates are stored in Docker volumes, not in the filesystem

## Migration from Cloudflare Origin Certificates

If you were previously using Cloudflare Origin Certificates:

1. **Backup old certificates** (optional):
   ```bash
   cp -r nginx/ssl nginx/ssl.backup
   ```

2. **Follow Steps 1-4 above** to set up Let's Encrypt

3. **Update Cloudflare SSL mode** to "Full (strict)"

4. **Remove Cloudflare Origin Certificates** from Cloudflare dashboard (optional cleanup)

5. **Test the site** to ensure everything works

6. **Delete old certificates** (after confirming Let's Encrypt works):
   ```bash
   rm -rf nginx/ssl/origin.pem nginx/ssl/origin.key
   ```

## Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Documentation](https://eff-certbot.readthedocs.io/)
- [Cloudflare SSL/TLS Guide](https://developers.cloudflare.com/ssl/)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
