"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHeader } from "@/lib/header-context";
import { ModelCard } from "@/components/models/model-card";
import { ModelFilters } from "@/components/models/model-filters";
import { AddModelSheet } from "@/components/models/add-model-sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Model } from "@/lib/types";

const ITEMS_PER_PAGE = 12;

async function fetchModels(
  search: string,
  ethnicity: string,
  page: number,
): Promise<{ data: Model[]; total: number }> {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const params = new URLSearchParams({
    skip: skip.toString(),
    take: ITEMS_PER_PAGE.toString(),
    search: search,
  });

  if (ethnicity !== "All") {
    params.append("ethnicity", ethnicity);
  }

  const response = await fetch(`/api/models?${params}`);
  if (!response.ok) throw new Error("Failed to fetch models");
  return response.json();
}

export default function ModelsPage() {
  const { setTitle } = useHeader();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("a-z");
  const [ethnicity, setEthnicity] = useState("All");
  const [showImages, setShowImages] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: modelsData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["models", search, ethnicity, page],
    queryFn: () => fetchModels(search, ethnicity, page),
  });

  const models = modelsData?.data ?? [];
  const total = modelsData?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    setTitle("Models");
    return () => {
      setTitle("GASM FANS");
    };
  }, [setTitle]);

  // Load showImages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("showModelsImages");
    if (stored !== null) {
      setShowImages(JSON.parse(stored));
    }
  }, []);

  // Save showImages to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("showModelsImages", JSON.stringify(showImages));
  }, [showImages]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [search, ethnicity]);

  let filteredModels = models;

  if (sort === "a-z") {
    filteredModels.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "z-a") {
    filteredModels.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "most-videos") {
    filteredModels.sort(
      (a, b) => (b.videos?.length || 0) - (a.videos?.length || 0),
    );
  } else if (sort === "least-videos") {
    filteredModels.sort(
      (a, b) => (a.videos?.length || 0) - (b.videos?.length || 0),
    );
  }

  return (
    <main className="p-6">
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading models...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            {/* Filter Toggle Button - Mobile */}
            <div className="lg:hidden">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full justify-between"
              >
                Search & Filters
                <FaChevronDown
                  className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </Button>
            </div>

            {/* Filters - Hidden on mobile by default, always visible on desktop */}
            <div
              className={`lg:flex flex-col gap-4 ${showFilters ? "flex" : "hidden"}`}
            >
              <ModelFilters
                search={search}
                onSearchChange={setSearch}
                sort={sort}
                onSortChange={setSort}
                ethnicity={ethnicity}
                onEthnicityChange={setEthnicity}
                total={total}
                filtered={filteredModels.length}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="show-images"
                  checked={showImages}
                  onCheckedChange={setShowImages}
                />
                <Label htmlFor="show-images" className="cursor-pointer">
                  Show Images
                </Label>
              </div>
              <AddModelSheet />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                id={model.id}
                name={model.name}
                videos={model.videos?.length || 0}
                image={model.image}
                hideImage={!showImages}
              />
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No models found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      const isVisible =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - page) <= 1;

                      if (!isVisible && pageNum === 2) {
                        return (
                          <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      if (!isVisible && pageNum === totalPages - 1) {
                        return (
                          <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      if (!isVisible) return null;

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setPage(pageNum)}
                            isActive={page === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    },
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </main>
  );
}
