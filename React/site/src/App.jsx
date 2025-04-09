import { BrowserRouter, Routes, Route } from 'react-router'; 
import Navbar from './Components/NavBar/Navbar';
import Home from './Routes/Home';
import Cadastro from './Routes/Cadastro/Cadastro';

function App() {
  return (
    <>
      
      <BrowserRouter>
      <Navbar/>
        <Routes>          
            <Route path="/" element={<Navbar/>} Component={Home}  />               
            <Route path="/Cadastro" element={<Navbar/>} Component={Cadastro}  />          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
