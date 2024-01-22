import React from "react";
import "./Card1.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardSkeleton = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((item, i) => (
      <div
        key={i}
        className="w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white dark:bg-slate-700 flex flex-col justify-between shadow-lg 
                rounded-md px-3 py-5 "
      >
        <div className="w-ful h-full flex flex-col justify-center ">
          <div className="flex gap-3">
            <Skeleton circle className="image-skeleton" />

            <div className="w-full h-16 flex flex-col justify-center">
              <p className="w-full h-12 flex items-center overflow-hidden leading-5 text-lg font-semibold">
                <Skeleton className="skeleton-title" />
              </p>
              <span className=" flex gap-2 items-center">
                <Skeleton className="skeleton-location" />
              </span>
            </div>
          </div>

          <div className="py-3">
            <p className="text-sm">
              <Skeleton className="p-skeleton" />
              <Skeleton className="p-skeleton" />
              <Skeleton className="p-skeleton" />
              <Skeleton className="p-skeleton" />
              <Skeleton className="p-skeleton" />
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className=" py-0.5 px-1.5 rounded font-semibold text-sm">
              <Skeleton className="full-time-skeleton" />
            </p>
            <span className=" text-sm">
              <Skeleton className="time-skeleton" />
            </span>
          </div>
        </div>
      </div>
    ));
};

export default CardSkeleton;
