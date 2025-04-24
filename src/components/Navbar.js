import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    const handleLogout = () => {
        // Logic for logout (e.g., clearing tokens, redirecting)
        console.log('Déconnexion effectuée');
    };

    // Hide the navbar if the route is "/login", "/register", or "/"
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
        return null;
    }

    return (
        <nav className="nav-wrapper grey darken-3">
            <ul id="nav-mobile" className="left hide-on-med-and-down">
                <li>
                    <Link to="/dashboard">Tableau de Bord</Link>
                </li>
                <li>
                    <Link to="/progress">Livres terminés</Link>
                </li>
            </ul>
            <ul className="right">
                <li>
                    <Link
                        to="/login"
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;