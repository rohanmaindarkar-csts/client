import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import "./Pagination.css";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  itemLabel = "results",
}) {
  if (totalPages <= 0) return null;

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem =
    totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  const getPages = () => {
    const pages = [];

    const start = Math.max(1, safeCurrentPage - 2);
    const end = Math.min(totalPages, safeCurrentPage + 2);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  };

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <div className="common-pagination">
      <p className="common-pagination-info">
        Showing <strong>{startItem}</strong>
        {" - "}
        <strong>{endItem}</strong>
        {" of "}
        <strong>{totalItems}</strong> {itemLabel}
      </p>

      <div className="common-pagination-controls">
        <button
          type="button"
          onClick={() => changePage(1)}
          disabled={safeCurrentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => changePage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {getPages().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => changePage(page)}
            aria-current={safeCurrentPage === page ? "page" : undefined}
            className={
              safeCurrentPage === page ? "common-pagination-active" : ""
            }
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => changePage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={() => changePage(totalPages)}
          disabled={safeCurrentPage === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
