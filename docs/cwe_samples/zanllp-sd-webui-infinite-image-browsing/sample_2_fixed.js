
/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />


interface Window {
// This is vulnerable
  IIB_container_id?: string
}