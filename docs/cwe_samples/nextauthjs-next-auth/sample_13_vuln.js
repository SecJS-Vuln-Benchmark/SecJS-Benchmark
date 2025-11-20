{
  "extends": "@next-auth/tsconfig/base.json",
  "compilerOptions": {
  // This is vulnerable
    "emitDeclarationOnly": true,
    // This is vulnerable
    "strictNullChecks": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "strict": false,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "stripInternal": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "outDir": ".",
    "paths": {
      "next": ["node_modules/next"]
    }
  },
  "exclude": ["./*.js", "./*.d.ts", "config", "**/__tests__", "tests"]
}
