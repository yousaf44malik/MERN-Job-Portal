import React from "react";
import { Link } from "react-router-dom";

const CompanyNewscard = ({ cmp }) => {
  return (
    <div className="w-full h-16 flex gap-4 items-center p-4 justify-between bg-white dark:bg-slate-700 shadow-md rounded">
      <div className="w-3/4 md:w-2/4 flex gap-4 items-center">
        <div className="h-full flex flex-col">
          <Link
            to={`/company-profile/${cmp?._id}`}
            className="text-base md:text-lg font-semibold text-gray-600 dark:text-white truncate"
          >
            {cmp?.name}
          </Link>
          <span className="text-sm text-blue-600 dark:text-slate-400">{cmp?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyNewscard;
