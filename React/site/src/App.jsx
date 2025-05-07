import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css'
import Navbar from './Components/NavBar/Navbar';
import Home from './Routes/Home/Home';
import Cadastro from './Routes/Cadastro/Cadastro';
import Login from './Routes/Login/Login';
import Colecao from './Routes/Colecao/Colecao';
import ProdutoDetalhe from './Components/Produtos/ProdutoDetalhe';
import AdminPainel from './Components/PaineisAdmin/AdminPainel';
import AdicionarProduto from './Components/Produtos/AdicionarProduto';
import EditarProduto from './Components/Produtos/EditarProduto';
import Footer from './Components/Footer/Footer';
import AdminProduto from './Components/PaineisAdmin/AdminProduto';
import AdminUsuario from './Components/PaineisAdmin/AdminUsuario';
import AdicionarUsuario from './Components/Usuarios/AdicionarUsuario';
import AdminEndereco from './Components/PaineisAdmin/AdminEndereco';
import EditarEndereco from './Components/Endereco/EditarEndereco';
import EditarUsuario from './Components/Usuarios/EditarUsuario';
import AdicionarEndereco from './Components/Endereco/AdicionarEndereco';

function App() {
  return (
    <>

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navbar />} Component={Home} />

          <Route path="/Produto/:id" element={<ProdutoDetalhe />} />
          <Route path="/Colecao" element={<Navbar />} Component={Colecao} />
          <Route path="/Cadastro" element={<Navbar />} Component={Cadastro} />
          <Route path="/Login" element={<Navbar />} Component={Login} />

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

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
