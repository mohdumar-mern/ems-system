import React from "react";
import "./Pagination.scss";
import Button from "../Button/Button";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  prevPage,
  nextPage,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <Button
        className="page-btn nav-btn"
        onClick={() => hasPrevPage && onPageChange(prevPage)}
        disabled={!hasPrevPage}
        text={'Prev'}
      />
       

      {pages.map((page) => (
        <Button
          key={page}
          className={`page-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
          text={page}
        />
          
        
      ))}

      <Button
        className="page-btn nav-btn"
        onClick={() => hasNextPage && onPageChange(nextPage)}
        disabled={!hasNextPage}
        text={"Next"}
      />
  
    </div>
  );
};

export default Pagination;
