import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavItem = ({ url, label, IsActive, submenu }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <li
      className="nav-item-wrapper"
      onMouseEnter={() => setShowSubmenu(true)}
      onMouseLeave={() => setShowSubmenu(false)}
    >
      <Link to={url} className={`nav-item ${IsActive ? "active" : ""}`}>
        {label}
      </Link>

      {submenu && showSubmenu && (
        <ul className="submenu">
          {submenu.map((category, index) => (
            <li key={index} className="submenu-column">
              <p className="submenu-title">{category.title}</p>
              {category.items.map((item, idx) => (
                <Link key={idx} to={item.url} className="submenu-item">
                  {item.label}
                </Link>
              ))}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};


export default NavItem;
