# PDF Toolkit (Personal Use)

Original, local-first PDF toolkit inspired by common online PDF utility categories.

## Run

```bash
npm install
npm run dev
```

## Run with backend API

```bash
npm install
npm run dev:full
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:8787`

Use **System Check** from the homepage to verify API reachability and dependency readiness per backend-powered tool.

## Optional native binaries (recommended)

- `qpdf` for `Protect PDF`, `Unlock PDF`, `Repair PDF`
- `LibreOffice` (`soffice`) for `PowerPoint/Word/Excel/PDF` backend conversions

If binaries are not in PATH, set:

- `QPDF_PATH`
- `LIBREOFFICE_PATH`

## Deploy online

### 1) Deploy backend API (Docker host: Render/Railway/Fly/any VPS)

- Use [Dockerfile](Dockerfile) at project root.
- Expose port `8787` (or set `PORT` from your host).
- Optional env var: `FRONTEND_ORIGIN=https://ferdousbhuiya.github.io` (comma-separated for multiple origins).
- Health endpoint: `/api/health`.

### 2) Deploy frontend (Vercel/Netlify static)

- Build command: `npm run build`
- Output directory: `dist`
- Set env var at build time:

```bash
VITE_API_BASE_URL=http://<VM_PUBLIC_IP>:8787
```

- SPA rewrite is already configured for Vercel in [vercel.json](vercel.json).

### 3) Verify after deploy

- Open your frontend URL.
- Open **System Check** and click **Recheck**.
- Confirm API reachable and dependencies ready.

## GitHub Actions (one-click workflows)

Workflows are included in [.github/workflows/ci.yml](.github/workflows/ci.yml), [.github/workflows/deploy-frontend-vercel.yml](.github/workflows/deploy-frontend-vercel.yml), and [.github/workflows/deploy-backend.yml](.github/workflows/deploy-backend.yml).

If you want frontend deployment fully through GitHub, use [.github/workflows/deploy-frontend-pages.yml](.github/workflows/deploy-frontend-pages.yml).

### Required repository secrets


- Frontend deploy (Vercel):
	- `VERCEL_TOKEN`
	- `VERCEL_ORG_ID`
	- `VERCEL_PROJECT_ID`
	- `VITE_API_BASE_URL` (use `http://<VM_PUBLIC_IP>:8787` if no domain)

- Frontend deploy (GitHub Pages):
	- `VITE_API_BASE_URL` (use `http://<VM_PUBLIC_IP>:8787` if no domain)

- Backend deploy (container):
	- `BACKEND_IMAGE_NAME` (optional, defaults to `ghcr.io/ferdousbhuiya/Online-PDF-Converter-api`)
	- `BACKEND_DEPLOY_HOOK` (optional webhook URL for your host auto-redeploy)

### How to use

- Push to `main` to run CI automatically.
- Push frontend changes to `main` (or run manual dispatch) to deploy frontend.
- Push backend/Docker changes to `main` (or run manual dispatch) to publish backend image.

### GitHub Pages setup (frontend via GitHub only)

1. In your GitHub repo, go to **Settings → Pages** and set Source to **GitHub Actions**.
2. Add repository secret `VITE_API_BASE_URL` with your backend URL (`http://<VM_PUBLIC_IP>:8787` if no domain).
3. Run workflow **Deploy Frontend (GitHub Pages)** from the Actions tab (or push to `main`).
4. Your site will be available at `https://ferdousbhuiya.github.io/Online-PDF-Converter/`.

Note: Backend still needs a server host (container/VPS/cloud) because GitHub Pages is static-only.

## Oracle Cloud 24/7 checklist (laptop can stay off)

Use this when you want uninterrupted backend uptime without running your laptop.

### Quick Go-Live (no domain)

1. Create Oracle Always Free VM and open inbound port `8787`.
2. SSH into VM, install Docker (use commands below).
3. Run backend container:

```bash
docker login ghcr.io -u ferdousbhuiya
docker pull ghcr.io/ferdousbhuiya/Online-PDF-Converter-api:latest
docker run -d --name pdf-toolkit-api --restart unless-stopped -p 8787:8787 -e PORT=8787 -e FRONTEND_ORIGIN=https://ferdousbhuiya.github.io ghcr.io/ferdousbhuiya/Online-PDF-Converter-api:latest
```

4. In GitHub repo **Settings → Secrets and variables → Actions**, set:
	- `VITE_API_BASE_URL=http://<VM_PUBLIC_IP>:8787`
5. In GitHub repo **Settings → Pages**, set Source to **GitHub Actions**.
6. Run workflow **Deploy Frontend (GitHub Pages)** and open:
	- `https://ferdousbhuiya.github.io/Online-PDF-Converter/`

### Fill these values first

Replace only the VM public IP placeholder, then follow the commands below:

- Owner = `ferdousbhuiya`
- Repository = `Online-PDF-Converter`
- GitHub username = `ferdousbhuiya`
- `<VM_PUBLIC_IP>` = your Oracle VM public IP (for example `129.146.x.x`)

Resulting values should look like:

- Image: `ghcr.io/ferdousbhuiya/Online-PDF-Converter-api:latest`
- Frontend URL: `https://ferdousbhuiya.github.io/Online-PDF-Converter/`
- API URL: `http://<VM_PUBLIC_IP>:8787`

### 1) Create always-free VM

- Oracle Cloud → Create compute instance (Ubuntu 22.04/24.04)
- Shape: Always Free eligible
- Add inbound rules for ports `22`, `80`, `443`

### 2) SSH and install Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

### 3) Run backend container from GitHub Container Registry

```bash
docker login ghcr.io -u ferdousbhuiya
docker pull ghcr.io/ferdousbhuiya/Online-PDF-Converter-api:latest
docker run -d \
	--name pdf-toolkit-api \
	--restart unless-stopped \
	-p 8787:8787 \
	-e PORT=8787 \
	-e FRONTEND_ORIGIN=https://ferdousbhuiya.github.io \
	ghcr.io/ferdousbhuiya/Online-PDF-Converter-api:latest
```

### 4) Optional: add HTTPS reverse proxy later (Caddy + custom domain)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

Create `/etc/caddy/Caddyfile` (when you get a domain):

```caddy
api.yourdomain.com {
	reverse_proxy 127.0.0.1:8787
}
```

Then:

```bash
sudo systemctl restart caddy
sudo systemctl status caddy
```

### 5) Connect frontend

- In GitHub repo secrets, set `VITE_API_BASE_URL=http://<VM_PUBLIC_IP>:8787`
- Re-run GitHub Pages deploy workflow
- Open app → **System Check** → **Recheck**

When you later buy a domain, switch this secret to `https://api.yourdomain.com` and enable Caddy.

### 6) Keep backend auto-updated from GitHub

- Use workflow [.github/workflows/deploy-backend.yml](.github/workflows/deploy-backend.yml) to publish image on push
- Optionally set `BACKEND_DEPLOY_HOOK` secret if your host supports auto-redeploy webhooks

## Included tools

### Working client-side tools
- Merge PDF
- Split PDF (single pages / range)
- Compress PDF (object stream optimization)
- Organize PDF (reorder pages)
- Rotate PDF
- Extract Pages
- Remove Pages
- Add Page Numbers
- Add Watermark
- Edit PDF Metadata
- JPG to PDF
- HTML to PDF (text-based)
- PDF to JPG
- Compare PDF (basic file comparison)
- Sign PDF (text signature)
- Word to PDF (text-focused .docx conversion)
- Excel to PDF (table/text-focused conversion)

### Backend-powered routes now wired
- Protect PDF / Unlock PDF (via `qpdf`)
- Repair PDF (via `qpdf --linearize`)
- PDF to Text (server extraction)
- OCR PDF/Image to text (server OCR)
- PowerPoint to PDF (via LibreOffice)
- PDF to Word / PowerPoint / Excel (via LibreOffice where supported)

### Browser tools still local
- Scan to PDF (image upload to PDF assembly)
- All existing PDF manipulation tools remain client-side

## Notes

- This project avoids copying source code, branding, or assets from other websites.
- Backend conversion quality depends on installed local binaries and document complexity.
