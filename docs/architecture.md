# Architecture

## Overview

Estrella Libros is a client-side React SPA built with Vite.

The application is organized around a feature-oriented structure that separates:

- UI rendering
- routing
- API integration
- state management
- localization
- reusable business logic

The primary data source is the Google Books API.

The application does not require a backend service and persists user-specific data locally.

---

## High-Level Architecture

```txt
User
 │
 ▼
React UI
 │
 ├── Pages
 │
 ├── Features
 │
 ├── Widgets
 │
 ▼
Custom Hooks
 │
 ├── useGoogleBooks
 ├── useRecommendations
 └── usePWAInstall
 │
 ▼
Google Books API
```

---

## Directory Structure

```txt
src/
│
├── config/
│   Environment variables and API configuration
│
├── features/
│   Reusable domain-specific components
│
├── hooks/
│   Custom hooks and business logic
│
├── pages/
│   Route-level pages
│
├── store/
│   Zustand state management
│
├── utils/
│   Data normalization and helper functions
│
├── widgets/
│   Layout-level reusable UI blocks
│
├── i18n/
│   Localization configuration
│
└── locales/
    Translation resources
```

---

## Routing

Routing is implemented with React Router.

Pages are responsible for:

* route composition
* page-level data loading
* feature orchestration

Reusable UI logic is delegated to features and widgets.

This keeps route components focused on application flow rather than implementation details.

---

## API Layer

The Google Books API is the primary external integration.

Core API behavior is implemented inside:

```txt
hooks/useGoogleBooks
```

Responsibilities:

* search books by query
* fetch book details by id
* normalize API responses
* handle loading states
* handle API failures
* handle request timeouts
* detect offline scenarios
* provide fallback values for incomplete data

The hook acts as the main abstraction between the UI layer and external services.

---

## State Management

Global state is managed with Zustand.

Current global state includes:

```txt
Favorites Store
```

Responsibilities:

* store favorite book ids
* toggle favorites
* clear favorites
* persist data to localStorage
* restore state after page reload

Middleware:

* persist
* devtools
* immer

Using Zustand keeps state management lightweight while avoiding unnecessary complexity.

---

## Internationalization

Localization is implemented with:

* i18next
* react-i18next
* i18next-http-backend
* i18next-browser-languagedetector

Supported languages:

* English
* Russian
* Spanish

Language detection order:

```txt
querystring
↓
localStorage
↓
navigator
↓
cookie
```

Translation files are loaded dynamically from:

```txt
/locales/{{lng}}/{{ns}}.json
```

---

## Progressive Web App

PWA support is implemented through:

```txt
vite-plugin-pwa
```

Capabilities:

* installable application
* service worker
* runtime caching
* automatic updates
* offline-aware behavior

Caching strategies:

### Google Books API

```txt
NetworkFirst
```

Used to prioritize fresh data while preserving access to cached responses.

### Book Covers

```txt
CacheFirst
```

Used to reduce repeated image downloads and improve perceived performance.

---

## Offline Strategy

The application is designed to remain usable when connectivity is limited.

Available mechanisms:

* cached application shell
* cached API responses
* cached book cover images
* offline-aware UI states

The user can continue accessing previously visited content even when network access becomes unavailable.

---

## Testing Strategy

Testing is implemented with:

* Jest
* React Testing Library

Covered areas include:

* custom hooks
* Zustand store logic
* feature components
* route-level pages
* PWA-related functionality
* localization UI behavior

Quality verification workflow:

```bash
npm run lint
npm run build
npm run test
npm audit
```

---

## Build & Deployment

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Deployment target:

```txt
Netlify
```

Build output is generated through Vite and served as static assets.
