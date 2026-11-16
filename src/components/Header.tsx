import { Book, ChefHat } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="border-b border-orange-900/10 bg-[#fffaf3]/90 px-4 py-4 shadow-[0_8px_30px_rgb(124_45_18/0.06)] backdrop-blur-md sm:px-8 sm:py-5">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex w-fu size-11 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-orange-50 shadow-lg shadow-orange-900/15 sm:size-12">
            <ChefHat size={27} strokeWidth={2.2} />
          </div>
          <h1 className="text-lg leading-[0.9] font-bold text-orange-950 sm:text-xl">
          Receita <br />
          na Mão
          </h1>
        </div>

      </div>
    </header>
  );
}
