"use client";
import React, { useState } from "react";

const filters = [
  { name: "Name", id: 0 },
  { name: "Email", id: 1 },
];

type CatagoryProps = {
  filter: any;
};

export default function Filters({ filter }: CatagoryProps) {
  const [selected, setSelected] = useState("Name");
  return (
    <div className="w-full flex justify-start gap-x-1 flex-shrink-0 scroll">
      {filters.map((item) => (
        <div
          key={item.name}
          className={`whitespace-nowrap transition-all duration-300 text-xs px-3 py-1.5 flex justify-center items-center rounded-lg cursor-pointer
          ${
            item.name == selected
              ? "dark:bg-white bg-black dark:text-black text-white"
              : "dark:bg-white/10 bg-forth-color hover:bg-black/10 dark:hover:bg-white/20 text-black dark:text-white"
          }
          `}
          onClick={() => {
            setSelected(item.name);
            filter(item.id);
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
