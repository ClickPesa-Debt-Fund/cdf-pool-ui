import { useState } from "react";
import useDebounce from "./use-debounce";

export const usePagination = (defaults?: { limit?: number }) => {
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(defaults?.limit ?? 10);
  const [search, setSearch] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState<string>("timestamp");
  const [orderBy, setOrderBy] = useState<"DESC" | "ASC">("DESC");
  const [dateRange, setDateRange] = useState<string[] | undefined>();

  useDebounce(
    () => {
      setSearch(searchKeyword);
    },
    [searchKeyword],
    400
  );

  return {
    skip,
    setSkip,
    limit,
    setLimit,
    search,
    setSearch,
    sortBy,
    setSortBy,
    orderBy,
    setOrderBy,
    dateRange,
    setDateRange,
    searchKeyword,
    setSearchKeyword,
  };
};
