# Aegean Envisions Website

Official website for Aegean Envisions AG, featuring a modern, cinematic design with Microsoft 365 authentication integration.

## 🚀 Features

- **Cinematic Landing Page** with particle effects and animations
- **Microsoft 365 Authentication** via Azure AD/Entra ID
- **Secure Portal Access** for organization members
- **Responsive Design** optimized for all devices
- **Azure Container Apps** deployment ready
- **TypeScript & React** modern tech stack

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Authentication**: Microsoft Authentication Library (MSAL)
- **Deployment**: Azure Container Apps, Azure Container Registry
- **Infrastructure**: Azure (West Europe region)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/AegeanEnvisions/aegean-website.git
cd aegean-website
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Azure configuration
```

4. Start development server:
```bash
npm run dev
```

## 🌐 Deployment

### Azure Container Apps

1. Build and push to Azure Container Registry:
```bash
docker build -t aegeanacr.azurecr.io/aegean-website:latest .
docker push aegeanacr.azurecr.io/aegean-website:latest
```

2. Deploy to Container Apps:
```bash
az containerapp update \
  --name aegean-visions \
  --resource-group aegean-rg \
  --image aegeanacr.azurecr.io/aegean-website:latest
```

## 📁 Project Structure

```
public-static/          # Static website files
├── index.html         # Landing page
├── cinematic-index.html # Cinematic version
├── portal.html        # Member portal
├── auth-test.html     # Authentication testing
├── js/
│   └── auth.js       # MSAL authentication
└── css/
    └── styles.css    # Custom styles

src/                   # React application (legacy)
├── components/        # React components
├── pages/            # Page components
└── App.tsx           # Main app component
```

## 🔐 Authentication

The website uses Microsoft 365 authentication for portal access. Only users with @aegean-envisions.com email addresses can access the member portal.

### Configuration

Update `public-static/js/auth.js` with your Azure AD app registration details:
- Client ID
- Tenant ID
- Redirect URIs

## 📄 License

© 2025 Aegean Envisions AG. All rights reserved.