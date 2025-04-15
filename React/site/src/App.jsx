import { BrowserRouter, Routes, Route } from 'react-router'; 
import Navbar from './Components/NavBar/Navbar';
import Home from './Routes/Home/Home';
import Cadastro from './Routes/Cadastro/Cadastro';
import Login from './Routes/Login/Login';
import Colecao from './Routes/Colecao/Colecao';
import ProdutoDetalhe from './Components/Produtos/ProdutoDetalhe';

function App() {
  return (
    <>
      
      <BrowserRouter>
      <Navbar/>
        <Routes>          
            <Route path="/" element={<Navbar/>} Component={Home}  />    
            
            <Route path="/Produto/:id" element={<ProdutoDetalhe />} />
            <Route path="/Colecao" element={<Navbar/>} Component={Colecao}  />  
            <Route path="/Cadastro" element={<Navbar/>} Component={Cadastro}  />              
            <Route path="/Login" element={<Navbar/>} Component={Login}  />         
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
