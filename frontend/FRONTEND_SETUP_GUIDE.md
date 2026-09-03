# EventAI Frontend - Setup & Deployment Guide

## 📋 Table of Contents

1. [Installation](#installation)
2. [Environment Setup](#environment-setup)
3. [Development](#development)
4. [Building](#building)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites

- Node.js 16+ and npm 8+
- Backend API running (see Backend Setup Guide)
- Modern web browser

### Step 1: Clone Repository

```bash
cd eventai
git clone <repository-url> frontend
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages from `package.json`:
- React 18.2
- React Router 6
- Tailwind CSS 3.4
- Axios
- Zustand
- Recharts
- Lucide React
- React Hot Toast

---

## Environment Setup

### Step 1: Create .env File

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `frontend/.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=EventAI
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Logging
VITE_LOG_LEVEL=info

# Production
VITE_PRODUCTION_URL=https://eventai.vercel.app
```

### Environment Variables Explanation

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:8000/api/v1` |
| `VITE_API_TIMEOUT` | Request timeout in ms | `30000` |
| `VITE_APP_NAME` | App display name | `EventAI` |
| `VITE_APP_VERSION` | Version number | `1.0.0` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `true` |
| `VITE_LOG_LEVEL` | Logging level | `info`, `debug`, `error` |

---

## Development

### Start Development Server

```bash
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:3000`
- Enable hot module reloading
- Open browser automatically

### Project Structure