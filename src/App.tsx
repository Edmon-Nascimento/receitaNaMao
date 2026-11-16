
import { useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, X } from "lucide-react";

import Header from "./components/Header";
import { Button } from "./components/ui/button";
import { Badge } from "@/components/ui/badge";

type RecipeResponse = {
  recipe?: string;
  error?: string;
};

export function App() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const ingredient = input.trim();

    if (!ingredient || isLoading) return;

    const alreadyExists = ingredients.some(
      (item) => item.toLowerCase() === ingredient.toLowerCase(),
    );

    if (alreadyExists) {
      setError("Esse ingrediente já foi adicionado.");
      return;
    }

    setIngredients((current) => [...current, ingredient]);
    setInput("");
    setRecipe("");
    setError("");
  }

  function handleDelete(item: string) {
    if (isLoading) return;

    setIngredients((current) =>
      current.filter((ingredient) => ingredient !== item),
    );

    setRecipe("");
    setError("");
  }

  async function handleGenerateRecipe() {
    if (ingredients.length === 0 || isLoading) return;

    setIsLoading(true);
    setError("");
    setRecipe("");

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (
        typeof data !== "object" ||
        data === null
      ) {
        throw new Error("A resposta do servidor é inválida.");
      }

      const result = data as RecipeResponse;

      if (!response.ok) {
        throw new Error(
          result.error || "Não foi possível gerar a receita.",
        );
      }

      if (
        typeof result.recipe !== "string" ||
        !result.recipe.trim()
      ) {
        throw new Error("A API não retornou uma receita válida.");
      }

      setRecipe(result.recipe);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <section className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="mb-3 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold tracking-[0.16em] text-orange-800 uppercase">
              Cozinhe com o que você tem
            </span>
            <h2 className="mb-2 text-3xl leading-tight font-semibold text-orange-950 sm:text-4xl">
            O que tem na cozinha hoje?
            </h2>

            <p className="max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
            Adicione os ingredientes disponíveis e descubra o que
            pode preparar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-orange-900/10 bg-white/75 p-4 shadow-[0_18px_50px_rgb(124_45_18/0.08)] sm:p-6">
            <label
              htmlFor="ingredients"
              className="mb-2 block text-sm font-bold text-orange-950"
            >
              Digitar ingredientes
            </label>

            <input
              type="text"
              name="ingredients"
              id="ingredients"
              placeholder="Ex: frango, cenoura, tomate"
              className="my-2 h-12 w-full rounded-xl border border-orange-900/20 bg-orange-50/60 px-4 text-sm text-orange-950 outline-none transition-all placeholder:text-stone-400 hover:border-orange-500 focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-600/10 disabled:cursor-not-allowed disabled:opacity-50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="h-12 w-full cursor-pointer rounded-xl bg-orange-600 text-base font-bold text-orange-50 shadow-lg shadow-orange-900/15 hover:bg-orange-700"
              disabled={!input.trim() || isLoading}
            >
              Adicionar ingrediente
            </Button>
          </form>
        </section>

        {ingredients.length > 0 && (
          <section className="my-7 rounded-2xl border border-amber-900/10 bg-amber-50/55 p-4 sm:p-5">
            <h3 className="mb-3 text-sm font-bold text-orange-950">
              Ingredientes adicionados ({ingredients.length})
            </h3>

            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  className="gap-2 rounded-full border border-amber-300/70 bg-amber-100 px-3 py-2 text-sm text-amber-950"
                >
                  <span>{ingredient}</span>

                  <Button
                    type="button"
                    aria-label={`Remover ${ingredient}`}
                    title={`Remover ${ingredient}`}
                    className="h-6 w-6 cursor-pointer bg-transparent p-0 text-amber-900 hover:bg-transparent hover:text-red-600"
                    onClick={() => handleDelete(ingredient)}
                    disabled={isLoading}
                  >
                    <X size={15} />
                  </Button>
                </Badge>
              ))}
            </div>
          </section>
        )}

        <Button
          type="button"
          className="mt-2 h-13 w-full cursor-pointer rounded-xl bg-stone-900 text-base font-bold text-orange-50 shadow-xl shadow-stone-900/15 hover:bg-stone-800 disabled:bg-stone-400"
          disabled={ingredients.length === 0 || isLoading}
          onClick={handleGenerateRecipe}
        >
          <Sparkles size={18} />

          {isLoading ? "Gerando sua receita..." : "Gerar receita"}
        </Button>

        {error && (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {isLoading && (
          <div
            className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-orange-900/10 bg-white/60 py-10 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />

            <p className="font-bold text-orange-950">
              Preparando algo especial...
            </p>

            <p className="text-sm text-stone-500">
              Estamos criando uma receita com seus ingredientes.
            </p>
          </div>
        )}

        {recipe && !isLoading && (
          <section className="mb-10 mt-10">
            <div className="mb-4 flex items-center gap-2 text-orange-700">
              <Sparkles size={20} />

              <h2 className="text-2xl font-semibold text-orange-950 sm:text-3xl">
                Sua receita
              </h2>
            </div>

            <article className="rounded-3xl border border-orange-900/10 bg-[#fffdf9] p-5 shadow-[0_18px_50px_rgb(124_45_18/0.08)] sm:p-8">
              <div className="space-y-4 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-orange-950">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="border-b border-orange-900/10 pb-2 text-xl font-semibold text-orange-950">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-orange-900">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm leading-7 text-stone-700">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="ml-5 list-disc space-y-2 text-sm text-stone-700 marker:text-orange-600">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="ml-5 list-decimal space-y-3 text-sm text-stone-700 marker:font-bold marker:text-orange-600">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="pl-1 leading-6">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-orange-950">
                        {children}
                      </strong>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-orange-400 pl-4 italic text-stone-600">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {recipe}
                </ReactMarkdown>
              </div>
            </article>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
