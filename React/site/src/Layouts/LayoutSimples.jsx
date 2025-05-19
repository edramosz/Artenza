import NavbarSimples from '../Components/NavBar/NavbarSimples';
import FooterSimples from '../Components/Footer/FooterSimples';
import { Outlet } from 'react-router-dom';

export default function LayoutSimples() {
  return (
    <>
      <NavbarSimples />
      <Outlet />
      <FooterSimples />
    </>
  );
}
