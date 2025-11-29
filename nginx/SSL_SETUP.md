# Cloudflare Origin Certificate Setup Guide

This guide will help you set up Cloudflare Origin Certificate for your nginx server.

## Step 1: Generate Cloudflare Origin Certificate

1. Log in to your Cloudflare Dashboard
2. Select your domain (`ankitsh.cc`)
3. Go to **SSL/TLS** → **Origin Server**
4. Click **Create Certificate**
5. Configure the certificate:
   - **Private key type**: RSA (2048)
   - **Hostnames**: Add `shortly.ankitsh.cc` (and optionally `*.ankitsh.cc` for wildcard)
   - **Certificate Validity**: Choose duration (15 years recommended)
6. Click **Create**
7. You'll see two text boxes:
   - **Origin Certificate** (the certificate)
   - **Private Key** (the private key)

## Step 2: Save the Certificate Files

1. Create the SSL directory (if it doesn't exist):
   ```bash
   mkdir -p nginx/ssl
   ```

2. Save the **Origin Certificate** to `nginx/ssl/origin.pem`:
   ```bash
   # Copy the certificate content (including BEGIN and END lines)
   # Save it to nginx/ssl/origin.pem
   ```

3. Save the **Private Key** to `nginx/ssl/origin.key`:
   ```bash
   # Copy the private key content (including BEGIN and END lines)
   # Save it to nginx/ssl/origin.key
   ```

4. Set proper permissions:
   ```bash
   chmod 600 nginx/ssl/origin.key
   chmod 644 nginx/ssl/origin.pem
   ```

## Step 3: Verify File Structure

Your `nginx/ssl/` directory should contain:
```
nginx/ssl/
├── origin.pem    (Cloudflare Origin Certificate)
└── origin.key    (Private Key)
```

## Step 4: Restart Docker Containers

After placing the certificate files:

```bash
docker-compose down
docker-compose up -d
```

## Step 5: Verify SSL Configuration

1. Test nginx configuration:
   ```bash
   docker exec nginx nginx -t
   ```

2. Check if nginx is listening on port 443:
   ```bash
   docker exec nginx netstat -tlnp | grep 443
   ```

3. Test SSL connection:
   ```bash
   openssl s_client -connect shortly.ankitsh.cc:443 -servername shortly.ankitsh.cc
   ```

## Important Notes

- **Cloudflare Origin Certificates are only valid for connections from Cloudflare IPs**
- They are NOT valid for direct browser connections (bypassing Cloudflare)
- The certificate files are mounted as read-only (`:ro`) in docker-compose.yml for security
- Keep your private key secure and never commit it to version control
- Add `nginx/ssl/` to your `.gitignore` file

## Troubleshooting

### Error: "SSL certificate not found"
- Verify the certificate files exist in `nginx/ssl/`
- Check file permissions (key should be 600, cert should be 644)
- Ensure file paths in nginx.conf match the mounted volume

### Error: "Connection refused on port 443"
- Verify port 443 is exposed in docker-compose.yml
- Check firewall rules allow port 443
- Ensure Cloudflare SSL/TLS mode is set to "Full (strict)"

### Error 521 from Cloudflare
- Verify the origin server is accessible on port 443
- Check nginx logs: `docker logs nginx`
- Ensure SSL certificate is valid and not expired
- Verify Cloudflare can reach your server's IP on port 443
