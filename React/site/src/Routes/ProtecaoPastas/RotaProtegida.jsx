import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLogged, isAdmin } from "./auth";

// Para rotas que só usuário logado pode acessar
export function RequireAuth() {
  console.log("isLogged?", isLogged());
  if (!isLogged()) {
    return <Navigate to="/Login" replace />;
  }
  return <Outlet />;
}


// Para rotas que só admin pode acessar
export function RequireAdmin() {
  if (!isLogged() || !isAdmin()) {
    return <Navigate to="/Login" replace />;
  }
  return <Outlet />;
}

// Para rotas que só quem NÃO está logado pode acessar (ex: Login, Cadastro)
export function RequireNoAuth() {
  if (isLogged()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
