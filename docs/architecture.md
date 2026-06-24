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
 ├── Features
 └── Widgets
 │
 ▼
UI / Use-case Hooks
 │
 ├── useRecommendations
 └── usePWAInstall
 │
 ▼
TanStack Query Layer
 │
 ├── bookQueries
 └── bookQueryKeys
 │
 ▼
API Layer
 │
 └── googleBooksApi
 │
 ▼
Google Books API
---

## 2. Directory Structure

Заменить блок на:

```md
## Directory Structure

```txt
src/
│
├── api/
│   External API clients
│
├── config/
│   Environment variables and API configuration
│
├── features/
│   Reusable domain-specific components, domain types, and query contracts
│
├── hooks/
│   Reusable behavior and use-case hooks
│
├── pages/
│   Route-level pages
│
├── store/
│   Zustand client state management
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

Low-level API access is implemented inside:

```txt
src/api/googleBooksApi.ts
```

Responsibilities:

* build Google Books API request URLs
* search books by query
* fetch book details by id
* pass AbortSignal to fetch
* validate the minimal response shape at the API boundary
* return raw Google Books volumes to the query layer

The API layer does not manage React state, caching, loading states, or UI behavior. It only communicates with the external data source.

---

## Server State

Server state is managed with TanStack Query.

Book-related query contracts are implemented inside:

```txt
src/features/books/bookQueries.ts
src/features/books/bookQueryKeys.ts
```

Responsibilities:

define stable query keys for book search and book details
call the Google Books API layer through query functions
normalize raw API responses into application book models
manage loading, error, retry, stale, and cached states
disable requests for empty or invalid input with enabled
prefetch book details on user intent
support multiple favorite book detail queries with useQueries

This keeps external server data separate from local UI state and allows multiple screens to reuse cached book data.

---

## State Management

Client state is managed with Zustand.

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

Using Zustand keeps local client state lightweight while TanStack Query handles external server state.

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

* TanStack Query based book search, details, favorites, and recommendations flows
* reusable behavior hooks
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
