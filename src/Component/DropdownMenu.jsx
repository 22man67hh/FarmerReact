import React, { useState } from "react";
import { Link } from "react-router-dom";

const DropdownMenu = ({ label, items }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="w-full text-left px-2 py-2 hover:underline focus:outline-none flex justify-between items-center"
      >
        {label}
        <span className="ml-2">▼</span>
      </button>

      {open && (
        <ul className="bg-white border rounded-md shadow-md mt-1 z-10 transition-all duration-200 ease-out">
          {items.map(({ label, to }, idx) => (
            <li key={idx} className="px-4 py-2 hover:bg-green-100">
              <Link to={to} onClick={close}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
