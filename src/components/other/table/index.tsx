import {
  ColumnData,
  DataPreviewTable,
} from "@clickpesa/components-library.data-preview-table";
import { FC, ReactNode } from "react";
import { formatTableFilters } from "./utils";
import { useTheme } from "@/contexts/theme";

type TableProps = {
  data: any[];
  columns: ColumnData[];
  loading?: boolean;
  totalCount: number;
  setSkip?: (skip: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
  setSortBy?: (sort_by: string) => void;
  setOrderBy?: (order_by: string) => void;
  customNoData?: ReactNode | string;
  onRowClick?: (record: any) => void;
  rowKey?: string;
  defaultLimit?: number;
  summary?: ReactNode;
};

const Table: FC<TableProps> = ({
  data,
  columns,
  loading,
  totalCount,
  setSkip,
  limit,
  setLimit,
  setSortBy,
  setOrderBy,
  customNoData,
  onRowClick,
  rowKey,
  defaultLimit,
  summary,
}) => {
  const { theme } = useTheme();
  return (
    <DataPreviewTable
      loading={!!loading}
      mode={theme}
      columns={columns}
      platform="clickpesa"
      data={data}
      onTableChange={({ pagination, sorter }) => {
        formatTableFilters({
          pagination,
          sorter,
          setSkip,
          setLimit,
          setSortBy,
          setOrderBy,
          limit,
        });
      }}
      customNoData={customNoData}
      totalCount={totalCount}
      pageSizeOptions={[10, 50, 100]}
      onRowClick={onRowClick}
      rowKey={rowKey}
      defaultPageSize={defaultLimit}
      summary={summary}
    />
  );
};

export default Table;
