# Breathe ESG — Carbon Accounting Dashboard (`breathe-esg-ui`)

This is the React frontend dashboard for the Breathe ESG platform. Built on **Vite**, **React**, and **Vanilla CSS**, it provides an elegant, highly responsive interface for sustainability managers and external auditors to ingest, analyze, approve, and lock corporate greenhouse gas (GHG) activity data.

---

## ✨ Features & Design Highlights

- **Vibrant Modern Dashboard**: Interactive KPIs and metrics cards showing total CO₂e emissions broken down by Scope 1, 2, and 3.
- **Unified Ingestion Hub**: Simple drag-and-drop or select file uploader supporting SAP fuel data, utility bills, and corporate travel CSVs with real-time status tracking.
- **Review & Sign-Off Grid**: High-density grid supporting single and bulk record approvals, rejections, or flagging with auditor comments.
- **Audit-Ready Locking**: Interactive confirmation dialog allowing users to irreversibly seal approved records, creating an audit-ready snapshot.
- **Sophisticated Filter Controls**: Fast search and client-side filtering by Scope, Data Source, Status, and keyword.
- **Secured session integrations**: Native authentication connecting seamlessly to Django's CSRF-protected session system.

---

## 📂 Project Structure

```
breathe-esg-ui/
├── public/              # Static public assets (favicons, logos)
├── src/
│   ├── api/             # API configuration and client setup
│   │   └── client.js    # Axios client pre-configured for Django CSRF
│   ├── components/      # Reusable UI component blocks
│   │   ├── Dashboard.jsx# Unified shell header & sidebars
│   │   ├── DataTable.jsx# Interactive data grid for record review
│   │   ├── StatsCards.x # Core metrics widgets for Scope emissions
│   │   └── UploadPanel.x# File ingestion uploader component
│   ├── pages/           # Page layouts
│   │   ├── LoginPage.jsx# Custom premium authentication view
│   │   ├── IngestionPage# Ingestion Hub page
│   │   └── ReviewPage.jx# Core audit review workflow grid
│   ├── index.css        # Premium Global CSS styling & design system tokens
│   ├── main.jsx         # React application root entrypoint
│   └── App.jsx          # Router & main application routing tree
├── index.html           # HTML template wrapper
├── package.json         # Node.js project configurations & dependency list
└── vite.config.js       # Vite bundle & dev server configurations
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18 or higher recommended) and npm installed.
- Ensure the backend Django server is running locally (default: `http://localhost:8000`).

### 2. Installation
From the `breathe-esg-ui` folder, run:
```bash
# Install node packages
npm install
```

### 3. Development Server
Start the local Vite dev server:
```bash
npm run dev
```
The application will start at [http://localhost:5173/](http://localhost:5173/). Open this URL in your web browser.

### 4. Build for Production
To bundle and optimize the application for production deployment:
```bash
npm run build
```
This generates a static bundle in the `dist/` directory, ready to be served by any static host (like Vercel, Netlify, or Nginx).

---

## 🔒 Authentication & API Integration

The frontend uses **Axios** to communicate with the Django REST API. 

The client file `src/api/client.js` is automatically configured to handle security:
- **Credentials**: `withCredentials: true` is enabled on all requests to ensure browser session cookies are stored and sent.
- **CSRF Token Handling**: It automatically reads the `csrftoken` cookie from Django and appends the `X-CSRFToken` header to all mutating operations (`POST`, `PATCH`, `PUT`, `DELETE`).

---

## 🎨 Premium CSS Styling System

All styling is managed using a design system built in `src/index.css`. Key attributes include:
- ** Harmonious Palettes**: Curated CSS variables defining modern slate backgrounds, vibrant status accents (emerald, gold, rose, sky), and card borders.
- **Glassmorphism Panels**: Smooth backdrop-filter blurs and translucent borders giving the interface a cutting-edge feel.
- **Responsive Layout**: Designed using CSS Flexbox and CSS Grid, ensuring compatibility across all viewport sizes.
- **Smooth Micro-Animations**: Interactivity enhanced with transitions on buttons, row hovers, status badges, and tabs.
