
import Navigation from "./Navigation";
import {Link} from "react-router-dom";

function Header() {
  return (
    <header className="px-5 py-5 bg-gray-700 text-white text-center flex justify-between">
      <h1 className="text-3xl font-bold"><Link to="/">Banksajt</Link></h1>
      <Navigation />
    </header>
  );
}

export default Header;