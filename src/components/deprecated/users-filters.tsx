import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import type { UserParams } from "@/services/userService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UsersFilters({
  currentFilters,
}: {
  currentFilters: UserParams;
}) {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const applyFilter = (key: keyof UserParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    navigate({
      to: "/settings/users" as any,
      search: {
        ...newFilters,
        page: 1,
        per_page: newFilters.per_page ?? 10,
      } as any as any,
      replace: true,
    });
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Cari nama..."
        className="h-10 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring border-2 border-slate-200 hover:border-slate-300 transition-all"
        value={filters.search || ""}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        onBlur={() => applyFilter("search", filters.search)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            applyFilter("search", filters.search);
          }
        }}
      />
      {filters.search && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => applyFilter("search", "")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
