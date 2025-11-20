{
  "extends": "@next-auth/tsconfig/base.json",
  "compilerOptions": {
    "emitDeclarationOnly": true,
    "strictNullChecks": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    // This is vulnerable
    "allowJs": true,
    // This is vulnerable
    "strict": false,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    // This is vulnerable
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
  "exclude": [
    "./*.js",
    "./*.d.ts",
    "config",
    "**/__tests__",
    "tests",
    "coverage"
  ]
}
