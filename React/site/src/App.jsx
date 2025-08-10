
import LayoutNormal from './Layouts/LayoutNormal';
import LayoutSimples from './Layouts/LayoutSimples';
import NotFound from './Routes/NotFound/NotFound';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';


import Home from './Routes/Home/Home';
import Cadastro from './Routes/Cadastro/Cadastro';
import Login from './Routes/Login/Login';
import Colecao from './Routes/Colecao/Colecao';
import ProdutoDetalhe from './Components/Produtos/ProdutoDetalhe';
import AdminPainel from './Components/PaineisAdmin/AdminPainel';
import AdicionarProduto from './Components/Produtos/AdicionarProduto';
import EditarProduto from './Components/Produtos/EditarProduto';
import AdminProduto from './Components/PaineisAdmin/AdminProduto';
import AdminUsuario from './Components/PaineisAdmin/AdminUsuario';
import AdicionarUsuario from './Components/Usuarios/AdicionarUsuario';
import AdminEndereco from './Components/PaineisAdmin/AdminEndereco';
import EditarEndereco from './Components/Endereco/EditarEndereco';
import EditarUsuario from './Components/Usuarios/EditarUsuario';
import AdicionarEndereco from './Components/Endereco/AdicionarEndereco';
import Perfil from './Routes/Perfil/Perfil';
import Cupons from './Routes/Perfil/PerfilComponents/Cupons';
import Enderecos from './Routes/Perfil/PerfilComponents/Enderecos';
import Favoritos from './Routes/Perfil/PerfilComponents/Favoritos';
import Pagamentos from './Routes/Perfil/PerfilComponents/Pagamentos';
import Pedidos from './Routes/Perfil/PerfilComponents/Pedidos';
import Config from './Routes/Perfil/PerfilComponents/Config';
import Carrinho from './Routes/Carrinho/Carrinho';
import Masculino from './Routes/Masculino/Masculino';
import Feminino from './Routes/Feminino/Feminino';
import FinalizarPedido from './Routes/FinalizarPedido/FinalizarPedido';
import AdminCupon from './Components/PaineisAdmin/AdminCupon';
import AdicionarCupom from './Components/Cupom/AdicionarCupom';
import Busca from './Components/Busca';
import Sobre from './Routes/Sobre/Sobre';
import Contato from './Routes/Contato/Contato';
import { RequireAuth, RequireAdmin, RequireNoAuth } from './Routes/ProtecaoPastas/RotaProtegida';



function AppContent() {
  return (
    <Routes>
      <Route element={<LayoutNormal />}>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/Produto/:id" element={<ProdutoDetalhe />} />
        <Route path="/masculino" element={<Masculino />} />
        <Route path="/feminino" element={<Feminino />} />
        <Route path="/Sobre" element={<Sobre />} />
        <Route path="/Contato" element={<Contato />} />
        <Route path="/Carrinho" element={<Carrinho />} />
        <Route path="/FinalizarPedido" element={<FinalizarPedido />} />
        <Route path="/Busca" element={<Busca />} />

        {/* Rotas protegidas - só usuário logado */}
        <Route element={<RequireAuth />}>
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/Cupons" element={<Cupons />} />
          <Route path="/Enderecos" element={<Enderecos />} />
          <Route path="/Favoritos" element={<Favoritos />} />
          <Route path="/Pagamentos" element={<Pagamentos />} />
          <Route path="/Pedidos" element={<Pedidos />} />
          <Route path="/Config" element={<Config />} />
        </Route>

        {/* Rotas protegidas - só admin */}
        <Route element={<RequireAdmin />}>
          <Route path="/Admin" element={<AdminPainel />} />
          <Route path="/AdminProduto" element={<AdminProduto />} />
          <Route path="/Admin/adicionar-produto" element={<AdicionarProduto />} />
          <Route path="/Admin/editar-produto/:id" element={<EditarProduto />} />
          <Route path="/AdminUsuario" element={<AdminUsuario />} />
          <Route path="/Admin/adicionar-usuario" element={<AdicionarUsuario />} />
          <Route path="/Admin/editar-usuario/:id" element={<EditarUsuario />} />
          <Route path="/AdminEndereco" element={<AdminEndereco />} />
          <Route path="/Admin/adicionar-endereco" element={<AdicionarEndereco />} />
          <Route path="/Admin/editar-endereco/:id" element={<EditarEndereco />} />
          <Route path="/AdminCupons" element={<AdminCupon />} />
          <Route path="/Admin/adicionar-cupom" element={<AdicionarCupom />} />
        </Route>
      </Route>

      {/* Rotas sem layout ou restritas para quem não está logado */}
      <Route element={<LayoutSimples />}>
        <Route element={<RequireNoAuth />}>
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Login" element={<Login />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}



function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App; 
