import React from "react";
import { Link } from "react-router";

const NavItem = (props) => {
  return (
    <>
      <li>
        <Link to={props.url} className={`nav-item ${props.IsActive ? 'active' : ''}`}> {props.label} </Link>
      </li>
    </>
  );
};

export default NavItem;
