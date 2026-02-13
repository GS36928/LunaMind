import React from "react";

const DashboardCount = ({
  title,
  number,
}: {
  title: string;
  number: string;
}) => {
  return (
    <div className="bg-[#1A2450] p-4 rounded-2xl flex flex-col">
      <span className="text-white font-semibold">{title}</span>
      <span className="text-white font-bold text-4xl">{number}</span>
    </div>
  );
};

export default DashboardCount;
