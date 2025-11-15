import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Notas() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button asChild className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent md:hidden">
        <Link to="/agenda">
          <CalendarCheck2 className="w-4 h-4 text-white" />
          <span className="ml-2">Agendar</span>
        </Link>
      </Button>

      <button
        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </>
  );
}