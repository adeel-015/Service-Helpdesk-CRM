import React from "react";

const Pagination = ({
  page = 1,
  pages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}) => {
  if (pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const makeRange = () => {
    const range = [];
    const delta = 2; // show current +/- delta
    const left = Math.max(1, page - delta);
    const right = Math.min(pages, page + delta);

    for (let i = left; i <= right; i++) range.push(i);
    if (left > 2) range.unshift("...");
    if (left > 1) range.unshift(1);
    if (right < pages - 1) range.push("...");
    if (right < pages) range.push(pages);
    return range;
  };

  const range = makeRange();

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing {start}–{end} of {total} items
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {range.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="px-3 py-1 text-sm text-gray-500"
            >
              {p}
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 border rounded ${
                p === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page >= pages}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
