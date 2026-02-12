"use client";

import { MdSearch } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ModelFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  ethnicity: string;
  onEthnicityChange: (value: string) => void;
  total: number;
  filtered: number;
}

const ethnicities = ["All", "Latina", "Ebony", "Asian", "Caucasian"];

export function ModelFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  ethnicity,
  onEthnicityChange,
  total,
  filtered,
}: ModelFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sort</label>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
              <SelectItem value="most-videos">Most Videos</SelectItem>
              <SelectItem value="least-videos">Least Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ethnicity</label>
          <Select value={ethnicity} onValueChange={onEthnicityChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ethnicities.map((eth) => (
                <SelectItem key={eth} value={eth}>
                  {eth}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filtered} of {total} models
      </div>
    </div>
  );
}
