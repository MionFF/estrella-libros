/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Для CSS
declare module '*.css' {
  const css: { [key: string]: string }
  export default css
}

// Для других assets (на будущее)
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_GOOGLE_BOOKS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
