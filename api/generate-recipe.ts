import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";
import { GoogleGenAI } from "@google/genai";

const localEnvPath = resolve(process.cwd(), ".env.local");

if (existsSync(localEnvPath)) {
  loadEnvFile(localEnvPath);
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return Response.json(
        { error: "Método não permitido. Use POST." },
        { status: 405 },
      );
    }

    try {
      const body: unknown = await request.json();

      if (
        typeof body !== "object" ||
        body === null ||
        !("ingredients" in body) ||
        !Array.isArray(body.ingredients) ||
        body.ingredients.length === 0 ||
        !body.ingredients.every(
          (ingredient: unknown) =>
            typeof ingredient === "string" && ingredient.trim().length > 0,
        )
      ) {
        return Response.json(
          { error: "Envie uma lista válida de ingredientes." },
          { status: 400 },
        );
      }

      const ingredients = body.ingredients.map(
        (ingredient: string) => ingredient.trim(),
      );

      const apiKey = (
        process.env.GEMINI_API_KEY ??
        process.env.GOOGLE_API_KEY ??
        ""
      ).trim();

      if (!apiKey) {
        console.error(
          "Chave do Gemini não configurada. Defina GEMINI_API_KEY no ambiente da função.",
        );

        return Response.json(
          { error: "Serviço de receitas não configurado no servidor." },
          { status: 500 },
        );
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: `
          Você é um assistente culinário especializado.

          Crie uma receita em português do Brasil utilizando
          os seguintes ingredientes: ${ingredients.join(", ")}.

          Organize a resposta com:
          - Nome da receita
          - Descrição
          - Ingredientes e quantidades
          - Modo de preparo passo a passo
          - Tempo estimado de preparo

          Não invente ingredientes principais que não foram
          informados. Temperos básicos podem ser sugeridos.
        `,
      });

      const recipe = response.output_text;

      if (!recipe) {
        throw new Error("O Gemini não retornou uma receita.");
      }

      return Response.json({ recipe }, { status: 200 });
    } catch (error) {
      console.error("Erro ao gerar receita com Gemini:", error);

      const errorMessage =
        error instanceof Error ? error.message.toLowerCase() : "";
      const isAuthenticationError =
        errorMessage.includes("api key") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("permission denied") ||
        errorMessage.includes("forbidden");

      return Response.json(
        {
          error: isAuthenticationError
            ? "A chave do Gemini foi rejeitada. Verifique a variável GEMINI_API_KEY no ambiente do servidor."
            : "Não foi possível gerar a receita. Tente novamente.",
        },
        { status: 502 },
      );
    }
  },
};
