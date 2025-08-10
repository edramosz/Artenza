

// Verifica se o usuário está logado
export function isLogged() {
  return !!localStorage.getItem("idUsuario");
}

// Verifica se o usuário é admin
export function isAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

export function logout() {
  localStorage.removeItem("idUsuario");
  localStorage.removeItem("idEndereco");
  localStorage.removeItem("nomeUsuario");
  localStorage.removeItem("nomeCompletoUser");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("email");
  localStorage.removeItem("telefone");
  localStorage.removeItem("dataCadastro");
  localStorage.removeItem("perfilUrl");
}
