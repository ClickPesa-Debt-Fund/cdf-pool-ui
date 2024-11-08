export const formatTableFilters = ({
  setLimit,
  setOrderBy,
  setSkip,
  setSortBy,
  sorter,
  pagination,
  limit,
}: TableHelperProps) => {
  setLimit?.(pagination.pageSize);
  setSkip?.((limit || 10) * (pagination.current - 1));
  if (!sorter?.order) {
    setOrderBy?.("DESC");
    setSortBy?.("ledger");
  }
  if (sorter?.order) {
    setSortBy?.(sorter?.field);
    setOrderBy?.(sorter?.order === "ascend" ? "ASC" : "DESC");
  }
};
