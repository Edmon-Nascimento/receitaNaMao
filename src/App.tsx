import type { SubmitEvent } from "react";

import Header from "./components/Header";
import { Button } from "./components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";

export function App() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const ingredient = input.trim();

    if (!ingredient) return;
    if (
      ingredients.some(
        (item) => item.toLowerCase() === ingredient.toLowerCase(),
      )
    ) {
      alert("Esse ingrediente já foi adicionado!");
      setInput("");
      return;
    }

    setIngredients((current) => [...current, input.trim()]);

    setInput("");
  }

  function handleDelete(item: string) {
    setIngredients((current) =>
      current.filter((ingredient) => ingredient !== item),
    );
  }

  return (
    <>
      <Header />
      <main className="w-full px-10 pt-10">
        <h2 className="text-2xl pb-5">O que tem na cozinha hoje? </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="ingredients">Digitar ingredientes</label>
          <input
            type="text"
            name="ingredients"
            id="ingredients"
            placeholder="Ex: frango, cenoura, tomate"
            className="w-full bg-white border border-black/50 rounded-sm h-8 px-2 py-5 my-2 outline-0 hover:border-black/80 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="h-10 w-full cursor-pointer text-md">
            <Sparkles />
            Gerar Receita
          </Button>
        </form>

        {ingredients.length > 0 &&
          ingredients.map((ingredient) => (
            <div key={ingredient} className="mt-2">
              <Badge className="bg-[#C4DAB5] text-black text-md py-5 px-3">
                {ingredient}
                <Button
                  className="bg-neutral text-black/80 hover:text-red-500 hover:bg-neutral w-0"
                  onClick={() => handleDelete(ingredient)}
                >
                  <X></X>
                </Button>
              </Badge>
            </div>
          ))}
      </main>
    </>
  );
}

export default App;
