import Navbar from '../Components/NavBar/Navbar';
import Footer from '../Components/Footer/Footer';
import { Outlet } from 'react-router-dom';

export default function LayoutNormal() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
