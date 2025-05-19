import React, { useState } from "react";
import './AdminPainel.css';
import SideBar from "../NavBar/SideBar";
import ComponentAdmin from "./ComponentAdmin";

const AdminPainel = () => {
 
  return (
    <>
      <div className="container-dashboard">
        <SideBar />
        <ComponentAdmin />
      </div>
    </>
  );
};

export default AdminPainel;
