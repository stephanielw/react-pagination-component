import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const renderData = (data) => {
  return (
    <ul>
      {data.map((todo, index) => {
        return <li key={index}>{todo.title}</li>;
      })}
    </ul>
  );
};
function Pagination() {
  const [data, setdata] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const handleClick = (event) => {
    setcurrentPage(+event.target.id);
    console.log(event.target.id);
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pages.push(i);
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={currentPage === number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos").then((response) => {
      setdata(response.data);
    });
  }, []);
  const handleNextBtn = () => {
    setcurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setminPageNumberLimit(minPageNumberLimit + 5);
      setmaxPageNumberLimit(maxPageNumberLimit + 5);
    }
  };

  const handlePrevBtn = () => {
    setcurrentPage(currentPage - 1);
    if ((currentPage - 1) % 5 === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - 5);
      setminPageNumberLimit(minPageNumberLimit - 5);
    }
  };

  const handleLoadMore = () => {
    setitemsPerPage(itemsPerPage + 5);
  };

  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextBtn}>&hellip;</li>;
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePrevBtn}>&hellip;</li>;
  }

  return (
    <>
      <h1>TodoList</h1>
      <br />

      <ul className="pageNumbers">
        <li>
          <button
            onClick={handlePrevBtn}
            disabled={currentPage === pages[0] ? true : false}
          >
            Prev
          </button>
        </li>
        {pageDecrementBtn}
        {renderPageNumbers}
        {pageIncrementBtn}

        <li>
          <button
            onClick={handleNextBtn}
            disabled={currentPage === pages[pages.length - 1] ? true : false}
          >
            Next
          </button>
        </li>
      </ul>
      <button onClick={handleLoadMore} className="loadmore">
        Load More
      </button>
      {renderData(currentItems)}
    </>
  );
}

export default Pagination;
