# Consultas de IA - Proyecto Mapty

## 1. Configuración de ESLint - Semicolons

**Pregunta:** ¿Cuál es la configuración para no usar punto y coma al final?

**Respuesta:**

```js
semi: ['error', 'never']
```

---

## 2. Integración ESLint + Prettier

**Pregunta:** ¿Qué tengo que descargar para que Prettier no choque con ESLint?

**Respuesta:**

```bash
npm install --save-dev eslint-config-prettier
```

Config en `eslint.config.js`:

```js
import prettier from 'eslint-config-prettier'

export default [
  // ... otras configs
  prettier, // Siempre al final
]
```

---

## 3. Revisión de eslint.config.js

**Problemas encontrados:**

- Comentarios contradictorios (decía "Obliga punto y coma" pero la regla era `'never'`)
- Faltaba integración con Prettier

**Correcciones aplicadas:**

- Agregado `eslint-config-prettier` como último plugin
- Corregidos comentarios

---

## 4. Revisión de .prettierrc

**Configuración:**

```json
{
  "trailingComma": "all",
  "tabWidth": 2,
  "arrowParens": "always",
  "bracketSpacing": true,
  "bracketSameLine": true,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "htmlWhitespaceSensitivity": "css",
  "singleAttributePerLine": false
}
```

**Estado:** Consistente con ESLint ✅

---

## 5. Revisión de .editorconfig

**Problemas encontrados:**

- `quote_type = single` no es propiedad estándar de EditorConfig
- `indent_size = 2` redundante en secciones específicas

**Correcciones:**

- Eliminado `quote_type` (no estándar)
- Eliminado `indent_size` redundante (ya heredado de `[*]`)

---

## 6. Configuración para HTML, CSS y JavaScript

**Recomendaciones:**

1. Stylelint para CSS
2. eslint-plugin-html para HTML
3. Husky + lint-staged para pre-commit hooks
4. Scripts de lint/format en package.json

---

## 7. Husky - Configuración paso a paso

**Pregunta:** ¿Para qué sirve Husky?

**Respuesta:** Husky ejecuta scripts automáticamente antes de eventos de git (commit, push). Se usa para ejecutar `lint-staged` antes de cada commit, garantizando que ESLint y Prettier verifiquen los archivos staged.

**Configuración:**

1. `npm install --save-dev husky`
2. `git init`
3. `npx husky init`
4. Editar `.husky/pre-commit` → `npx lint-staged`
5. Configurar `lint-staged` en `package.json`

---

## 8. .gitignore

**Creado con:**

- `node_modules/`
- `dist/`, `build/`
- `.env*`
- `.vscode/`, `.idea/`
- `.DS_Store`, `Thumbs.db`
- `*.log`
- `coverage/`
- `.husky/_`
- `*.min.js`, `*.map`

---

## 9. Husky en staged

**Pregunta:** ¿Por qué `.husky` aparece en el staged?

**Respuesta:** Es correcto. `.husky/pre-commit` SÍ debe ir a Git para que el equipo tenga las mismas reglas. Lo que NO va es `.husky/_` (archivos internos), ya ignorado por `.gitignore`.

---

## 10. Pug + Empaquetador

**Pregunta:** ¿Cómo agregar Pug y un empaquetador para compilar Pug con CSS y JS?

**Recomendación:** Vite con `vite-plugin-pug`

---

## 11. Problema con Vite dev server

**Problema:** El servidor sí funcionaba, solo que el comando se queda corriendo (comportamiento normal).

---

## 12. Error de build con Vite

**Error:** `Cannot resolve entry module src/index.html`

**Causa:** `vite-plugin-pug` no es compatible con Vite 8 (usa `rolldown` en lugar de `rollup`).

**Solución:** Bajar a Vite 6 o cambiar a Webpack.

---

## 13. Migración a Webpack

**Paquetes instalados:**

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin pug pug-loader css-loader style-loader mini-css-extract-plugin
```

**webpack.config.js configurado con:**

- Entry: `./src/main.js`
- Output: `dist/js/[name].[contenthash].js`
- Dev server: puerto 3000
- Pug loader con `pretty: true`
- CSS: style-loader (dev) / MiniCssExtractPlugin (prod)
- HtmlWebpackPlugin con template Pug
- Auto-discovery de páginas en `src/pages/`

---

## 14. HtmlWebpackPlugin - templateParameters

**Uso:**

```js
templateParameters: {
  ENV: isProd ? 'production' : 'development',
  APP_NAME: 'Mapty',
  API_URL: 'http://localhost:8080',
}
```

En Pug:

```pug
if ENV === 'development'
  p Modo desarrollo
else
  p Modo producción
```

---

## 15. HTML minificado en development

**Problema:** El HTML salía minificado incluso en development.

**Solución:**

1. `minify: false` en HtmlWebpackPlugin
2. `pretty: true` en pug-loader options
3. Mover meta tags al template Pug en vez de usar `meta: {}` del plugin

---

## 16. dotenv en webpack.config.js

**Configuración:**

```js
import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.resolve(__dirname, '.env') })
```

**DefinePlugin para inyectar variables:**

```js
new DefinePlugin({
  'process.env.APP_NAME': JSON.stringify(process.env.APP_NAME || 'Mapty'),
  'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8080'),
  'process.env.ENV': JSON.stringify(isProd ? 'production' : 'development'),
})
```

---

## 17. Forzando production en build

**Problema:** El script `"build": "NODE_ENV=production webpack"` sobrescribe el `.env`.

**Solución:** Cambiar a `"build": "webpack"` para que respete el `.env`.

---

## 18. Estructura de templates con Pug

**Estructura creada:**

```
src/
├── templates/
│   ├── layout.pug
│   └── partials/
│       ├── head.pug
│       ├── header.pug
│       └── footer.pug
├── pages/
│   ├── index.pug
│   └── about.pug
```

**Cómo funciona:**

- `layout.pug` define estructura base con `block content`
- `pages/*.pug` extienden el layout con `extends ../templates/layout.pug`
- `partials/` contienen fragmentos reutilizables

---

## 19. Auto-discovery de páginas

**Problema:** Cada nueva página requería agregar manualmente un HtmlWebpackPlugin.

**Solución:**

```js
const pagesDir = path.resolve(__dirname, 'src/pages')
const pageFiles = readdirSync(pagesDir).filter((f) => f.endsWith('.pug'))

const htmlPlugins = pageFiles.map((file) => {
  const name = path.basename(file, '.pug')
  return new HtmlWebpackPlugin({
    template: path.resolve(pagesDir, file),
    filename: `${name}.html`,
    title: `Mapty - ${name.charAt(0).toUpperCase() + name.slice(1)}`,
    minify: false,
  })
})
```

Ahora solo crear el `.pug` en `src/pages/` y se genera automáticamente.

---

## 20. Arquitectura Senior para Vanilla JS

**Recomendaciones:**

| Categoría         | Qué agregar                                    |
| ----------------- | ---------------------------------------------- |
| **Arquitectura**  | `/utils`, `/services`, `/components`, `/state` |
| **Testing**       | Vitest/Jest + Playwright                       |
| **Performance**   | Code splitting, lazy loading, bundle analyzer  |
| **Accesibilidad** | HTML semántico, WCAG compliance                |
| **Seguridad**     | CSP headers, sanitización de inputs            |
| **CI/CD**         | GitHub Actions                                 |
| **Alias**         | `@/` imports en Webpack                        |
| **Environments**  | `.env.development`, `.env.production`          |
| **Commits**       | commitlint + conventional commits              |
| **JSDoc**         | Documentación inline                           |

**Implementado:**

- ✅ Directorios: `utils/`, `services/`, `components/`, `state/`, `assets/`
- ✅ Alias de imports: `@`, `@utils`, `@services`, `@components`, `@state`, `@assets`
- ✅ Environments separados: `.env.development`, `.env.production`
- ✅ Store de estado global
- ✅ Servicio de API
- ✅ Utilidades DOM

---

## Archivos de configuración finales

### eslint.config.js

```js
import js from '@eslint/js'
import css from '@eslint/css'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  css.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'prefer-const': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'no-alert': 'error',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: { globals: { ...globals.browser } },
  },
  { ignores: ['dist/', 'build/', 'node_modules/', '*.min.js'] },
  prettier,
]
```

### .prettierrc

```json
{
  "trailingComma": "all",
  "tabWidth": 2,
  "arrowParens": "always",
  "bracketSpacing": true,
  "bracketSameLine": true,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "htmlWhitespaceSensitivity": "css",
  "singleAttributePerLine": false
}
```

### webpack.config.js

```js
import path from 'path'
import { fileURLToPath } from 'url'
import { readdirSync } from 'fs'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV === 'production'

const envFile = isProd ? '.env.production' : '.env.development'
config({ path: path.resolve(__dirname, envFile) })
config({ path: path.resolve(__dirname, '.env') })

const { DefinePlugin } = webpack

const pagesDir = path.resolve(__dirname, 'src/pages')
const pageFiles = readdirSync(pagesDir).filter((f) => f.endsWith('.pug'))

const htmlPlugins = pageFiles.map((file) => {
  const name = path.basename(file, '.pug')
  return new HtmlWebpackPlugin({
    template: path.resolve(pagesDir, file),
    filename: `${name}.html`,
    title: `Mapty - ${name.charAt(0).toUpperCase() + name.slice(1)}`,
    minify: false,
  })
})

export default {
  mode: isProd ? 'production' : 'development',
  entry: './src/main.js',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
    extensions: ['.js', '.json'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true,
  },
  devServer: {
    static: { directory: path.resolve(__dirname, 'dist') },
    port: 3000,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [{ loader: 'pug-loader', options: { pretty: true } }],
      },
      {
        test: /\.css$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
    new DefinePlugin({
      'process.env.APP_NAME': JSON.stringify(process.env.APP_NAME || 'Mapty'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8080'),
      'process.env.ENV': JSON.stringify(isProd ? 'production' : 'development'),
    }),
  ],
}
```

### package.json (scripts)

```json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "webpack",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,html}": "eslint --fix",
    "*.{js,html,css,json,md}": "prettier --write"
  }
}
```

---

_Generado el 31 de marzo de 2026_
