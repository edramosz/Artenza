import React from "react";
import { Link } from "react-router";

const NavItem = (props) => {
  return (
    <>
      <li>
        <Link to={props.url}> {props.label} </Link>
      </li>
    </>
  );
};

export default NavItem;
