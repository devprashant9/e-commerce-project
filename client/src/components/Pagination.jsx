import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setPage } from "../store/slices/productSlice";

const Pagination = () => {
  const dispatch = useDispatch();
  const { page, pages } = useSelector((state) => state.products.pagination);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    dispatch(setPage(newPage)); // update state
    dispatch(fetchProducts({ page: newPage })); // fetch new data
  };

  const getPageNumbers = () => {
    const delta = 2;
    const pagesArr = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);

    pagesArr.push(1);
    if (left > 2) pagesArr.push("...");
    for (let i = left; i <= right; i++) pagesArr.push(i);
    if (right < pages - 1) pagesArr.push("...");
    if (pages > 1) pagesArr.push(pages);

    return pagesArr;
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full md:w-1/2 flex justify-center flex-wrap">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 m-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-3 py-1 m-1">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1 m-1 rounded ${
                page === p
                  ? "bg-red-500 text-white"
                  : "bg-red-300 hover:bg-red-400"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pages}
          className="bg-gray-200 px-3 py-1 m-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
