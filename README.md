# Receita na Mão

Receita na Mão is a web application that uses the ingredients available in
your kitchen to generate recipe suggestions with the Google Gemini API. Add
ingredients, remove them when needed, and request a complete recipe with
description, quantities, preparation steps, and estimated cooking time.

The project is built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and
the Vercel Functions runtime.

## Requirements

- Node.js 20 or newer
- Bun 1.0 or newer
- A Google AI Studio API key

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Edmon-Nascimento/receitaNaMao.git
cd receitaNaMao
bun install
```

If you prefer npm, use `npm install` instead.

## Gemini API configuration

The [`api/generate-recipe.ts`](./api/generate-recipe.ts) function requires a
server-side API key. Create a key in
[Google AI Studio](https://aistudio.google.com/apikey), then create a
`.env.local` file in the project root:

```env
GEMINI_API_KEY=your_google_ai_studio_key
```

The application also accepts `GOOGLE_API_KEY`, but `GEMINI_API_KEY` is the
recommended name. Never use `VITE_GEMINI_API_KEY`: variables with the `VITE_`
prefix are exposed in the browser.

`.env.local` is ignored by Git. Never commit your API key.

## Running locally

Use the Vercel development server so the frontend and the `/api` function run
together:

```bash
bunx vercel dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Do not use `bun run dev` to test recipe generation. That command starts Vite
only and does not execute functions in the `api/` directory.

## How to use

1. Enter one or more available ingredients in the input field.
2. Click **Add ingredient**.
3. Repeat the process for all ingredients you want to use.
4. Remove an ingredient with its close button if necessary.
5. Click **Generate recipe**.
6. Read the generated recipe in the result card.

The application prevents duplicate ingredients and displays errors when the
API is unavailable or the request is invalid.

## Available scripts

```bash
bun run dev        # Start Vite only
bun run build      # Type-check and create a production build
bun run typecheck  # Run the TypeScript compiler without emitting files
bun run lint       # Run ESLint
bun run format     # Format TypeScript and TSX files
bun run preview    # Preview the production build
```

For local API development, use `bunx vercel dev` as described above.

## Project structure

```text
api/
  generate-recipe.ts    Gemini-backed server function
src/
  App.tsx               Main recipe generation interface
  index.css             Global styles and design tokens
  components/
    Header.tsx           Application header
    ui/                  Reusable UI components
```

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
