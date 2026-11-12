import { Book, ChefHat } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex justify-between px-5 py-7 bg-white shadow">
      <div className="flex items-center gap-1">
        <ChefHat size={50} />
        <h1 className="text-xl font-bold">
          Receita <br />
          na Mão
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button>
          <Book />
          <span className="text-md">Meus Pratos</span>
        </Button>
      </div>
    </header>
  );
}
