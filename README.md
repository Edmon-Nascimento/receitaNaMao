# React + TypeScript + Vite + shadcn/ui

## Configuração da API do Gemini

A função [`api/generate-recipe.ts`](./api/generate-recipe.ts) precisa de uma
chave configurada no ambiente do servidor. No Vercel, crie a variável
`GEMINI_API_KEY` em **Settings > Environment Variables** e habilite-a para o
ambiente usado pelo deploy (Preview e/ou Production). Depois, faça um novo
deploy: alterações de variáveis não atualizam deployments já publicados.

Para desenvolvimento local com a função `/api`, crie um arquivo `.env.local`
na raiz e execute `bunx vercel dev`. Não use `bun run dev` nesse caso: esse
comando inicia apenas o Vite e não executa as funções da pasta `api/`.

```env
GEMINI_API_KEY=sua_chave_do_google_ai_studio
```

Não use `VITE_GEMINI_API_KEY`: variáveis com esse prefixo ficam expostas no
navegador. Também é possível usar `GOOGLE_API_KEY` como alternativa, mas
`GEMINI_API_KEY` é o nome recomendado.

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

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
