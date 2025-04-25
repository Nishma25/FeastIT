import React from "react";
import "../assets/css/Pagination.css"; // Adjust the path as necessary

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <div className="pagination-container">
      <button
        className="pagination-button"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="pagination-button"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
