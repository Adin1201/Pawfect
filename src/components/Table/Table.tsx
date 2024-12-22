import 'moment/locale/bs';
import React, { useEffect } from 'react';
import { Column, Row, usePagination, useSortBy, useTable } from 'react-table';
import sortAscIcon from '../../assets/images/sort_asc.png';
import sortDescIcon from '../../assets/images/sort_desc.png';
import sortNoneIcon from '../../assets/images/sort_none.png';
import TableHeader from '../TableHeader';
import TablePagination from '../TablePagination';
import styles from './Table.module.scss';

interface TableColumnSort {
  column: string;
  desc: boolean;
}

export interface TableData<T> {
  results: T[];
  totalPages: number;
  pageSize: number;
  currentPage: number;
  query?: string;
  sort?: TableColumnSort;
}

interface Props {
  columns: any;
  data: TableData<any>;
  isLoading?: boolean;
  emptyMessage?: string;
  onPageChange?: (page: number, pageSize: number) => void;
  onSearchChange?: (query?: string) => void;
  onSortChange?: (sorting?: TableColumnSort) => void;
  showHeader?: boolean;
}

export type TableColumn = Column & {
  sortable?: boolean;
};

export default function Table(props: Props) {
  const { columns, data, showHeader = true } = props;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // @ts-ignore
    page,
    state: {
      // @ts-ignore
      sortBy,
      // @ts-ignore
      pageIndex,
    },
  } = useTable(
    {
      columns,
      data: data.results,
      useControlledState: (state) => {
        return React.useMemo(
          () => ({
            ...state,
            pageIndex: props.data.currentPage,
          }),
          [state, props.data.currentPage]
        );
      },
      // @ts-ignore
      pageCount: props.data.totalPages,
      // @ts-ignore
      initialState: { pageIndex: props.data.currentPage }, // Pass our hoisted table state
      // @ts-ignore
      manualPagination: true,
      // @ts-ignore
      manualSortBy: true,
      // @ts-ignore
      autoResetPage: false,
      // @ts-ignore
      autoResetSortBy: false,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (props.onPageChange && pageIndex !== props.data.currentPage) {
      props.onPageChange(pageIndex, props.data.pageSize);
    }
  }, [pageIndex]);

  useEffect(() => {
    if (sortBy.length === 0 && props.data.sort === undefined) {
      return;
    }

    if (props.onSortChange) {
      props.onSortChange(
        sortBy[0] ? { column: sortBy[0]?.id, desc: sortBy[0]?.desc } : undefined
      );
    }
  }, [sortBy]);

  return (
    <div className={styles.tableWrapper}>
      {showHeader && (
        <div className="mb-4">
          <TableHeader
            onPageSizeChange={(pageSize) => {
              if (props.onPageChange) {
                props.onPageChange(1, pageSize);
              }
            }}
            onSearchChange={(query) => {
              if (props.onSearchChange) {
                props.onSearchChange(query);
              }
            }}
          />
        </div>
      )}

      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps({})}>
              {headerGroup.headers.map((column) => {
                const isSortable = (column as any).sortable;
                let sortedDesc = null;

                if ((column as any).isSorted && (column as any).isSortedDesc) {
                  sortedDesc = true;
                } else if (
                  (column as any).isSorted &&
                  !(column as any).isSortedDesc
                ) {
                  sortedDesc = false;
                }

                return (
                  <th
                    {...column.getHeaderProps(
                      isSortable ? (column as any).getSortByToggleProps() : {}
                    )}
                  >
                    {column.render('Header')}
                    {isSortable && (
                      <span className={styles.sortIcons}>
                        {sortedDesc === null && (
                          <img src={sortNoneIcon} alt="Sort" />
                        )}

                        {sortedDesc === true && (
                          <img src={sortDescIcon} alt="Sort" />
                        )}

                        {sortedDesc === false && (
                          <img src={sortAscIcon} alt="Sort" />
                        )}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        {!props.isLoading && data.results.length > 0 && (
          <tbody {...getTableBodyProps()}>
            {page.map((row: Row<object>) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>

      {props.isLoading && <div className="spinner my-4" />}

      {!props.isLoading && !data.results.length && (
        <div className={styles.emptyMessage}>
          {props.emptyMessage ?? 'No data found.'}
        </div>
      )}

      {props.onPageChange && (
        <div
          style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}
        >
          <TablePagination
            totalPages={props.data.totalPages || 0}
            currentPage={props.data.currentPage || 0}
            onPageChange={(page) =>
              props.onPageChange
                ? props.onPageChange(page, props.data.pageSize)
                : {}
            }
          />
        </div>
      )}
    </div>
  );
}
