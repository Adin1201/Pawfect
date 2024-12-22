import classNames from 'classnames';
import _ from 'lodash';
import React from 'react';
import styles from './TablePagination.module.scss';

interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination = (props: Props) => {
  const { totalPages, currentPage, onPageChange } = props;

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  const previousPage = () => {
    onPageChange(currentPage - 1);
  };

  const nextPage = () => {
    onPageChange(currentPage + 1);
  };

  const siblingCount = 2;
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.pagination}>
        <button
          className={classNames(
            styles.paginationButton,
            styles.paginationButtonPrevious
          )}
          onClick={() => previousPage()}
          type="button"
          disabled={!canPreviousPage}
        >
          Previous
        </button>

        {_.times(totalPages).map((x) => {
          let showPage = false;
          let showMoreDots = false;

          const pageNumber = x + 1;
          const isFirst = pageNumber === 1;
          const isLast = pageNumber === totalPages;

          if (
            (pageNumber >= leftSiblingIndex &&
              pageNumber <= rightSiblingIndex) ||
            isFirst ||
            isLast
          ) {
            showPage = true;
          } else if (
            pageNumber === leftSiblingIndex - 1 ||
            pageNumber === rightSiblingIndex + 1
          ) {
            showMoreDots = true;
          }

          if (showPage) {
            return (
              <button
                key={pageNumber}
                className={classNames(styles.paginationButton, {
                  [styles.paginationButtonActive]: currentPage === pageNumber,
                })}
                type="button"
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          }

          if (showMoreDots) {
            return (
              <div key={pageNumber} className={styles.moreDots}>
                ...
              </div>
            );
          }

          return null;
        })}

        <button
          className={classNames(
            styles.paginationButton,
            styles.paginationButtonNext
          )}
          onClick={() => nextPage()}
          type="button"
          disabled={!canNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
