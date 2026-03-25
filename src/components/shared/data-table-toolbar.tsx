"use client";

import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  children,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(debouncedSearch);
    }
  }, [debouncedSearch, searchKey, table]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {searchKey && (
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-8 w-full text-xs sm:w-56"
        />
      )}
      {children}
    </div>
  );
}
