import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <ul className="flex justify-between list-none gap-5">
        <li>
          <Link to="/signup">SignUp</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
