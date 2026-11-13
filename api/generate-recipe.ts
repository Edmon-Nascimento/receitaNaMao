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
          {
            error:
              "Envie uma lista de ingredientes válida e com pelo menos um item.",
          },
          { status: 400 },
        );
      }

      const ingredients = body.ingredients.map((ingredient: string) =>
        ingredient.trim(),
      );

      return Response.json(
        {
          message: "Ingredientes recebidos com sucesso!",
          ingredients,
        },
        { status: 200 },
      );
    } catch {
      return Response.json(
        { error: "Não foi possível processar o corpo da requisição." },
        { status: 400 },
      );
    }
  },
};
