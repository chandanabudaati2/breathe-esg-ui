# Breathe ESG — Carbon Accounting Dashboard

This is the frontend dashboard for Breathe ESG. It's built with React, Vite, and clean Vanilla CSS to give sustainability teams and auditors a simple, elegant way to upload, review, and verify greenhouse gas emissions data.

---

## ✨ What it does

- **Visual Dashboard**: Spot trends and check emissions KPIs quickly with cards showing Scope 1, 2, and 3 breakdowns.
- **Ingestion Hub**: A simple drag-and-drop uploader built to handle real-world exports from SAP (fuel), utility portals, and Travel platforms (Concur).
- **Audit-Ready Review Grid**: Let analysts review records individually or in bulk. Approve, reject, or flag items with notes before permanently sealing them for audits.
- **Fast Filters & Search**: Quickly narrow down data by date, status, scope, or text search.
- **Secure Logins**: Connects seamlessly with Django's native session cookies and CSRF protection.

---

## 📂 Folder Tour

```
breathe-esg-ui/
├── src/
│   ├── api/             # Pre-configured Axios client (handles Django CSRF & cookies)
│   ├── components/      # Visual blocks (Dashboard, DataTable, StatsCards, UploadPanel)
│   ├── pages/           # Pages (LoginPage, IngestionPage, ReviewPage)
│   ├── index.css        # Design system, colors, glassmorphism UI, & animations
│   └── App.jsx          # App routing
```

---

## 🚀 Get Started Locally

### 1. Install dependencies
Make sure your Django backend is running at `http://localhost:8000`. Then, install the packages:
```bash
npm install
```

### 2. Start the dev server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) to see it in action.

### 3. Build for production
```bash
npm run build
```

---

## 🔒 Security & Style Under the Hood

* **Auth & Cookies**: The network client (`src/api/client.js`) has `withCredentials: true` turned on. It automatically grabs Django’s CSRF tokens from cookies and adds them to all state-changing API requests (`POST`, `PATCH`, etc.) so you don't have to manage them manually.
* **Modern Interface**: Designed with custom HSL colors, responsive grids that work on mobile and desktop, glassmorphic panels, and smooth hover animations.
