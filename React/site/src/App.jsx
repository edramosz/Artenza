import { BrowserRouter, Routes, Route } from 'react-router'; 
import Navbar from './Components/Navbar'
import Home from './Routes/Home';

function App() {
  return (
    <>
      
      <BrowserRouter>
      <Navbar/>
        <Routes>          
            <Route path="/" element={<Navbar/>} Component={Home}  />          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
