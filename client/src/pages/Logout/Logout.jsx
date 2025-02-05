import {Link} from 'react-router-dom';
import './logout.css'
import Header from '../../components/header/Header';


const Logout = () => {

    // *****Confirmación*****
    let option = window.confirm("Seguro que quieres Salir???")
    if (option === true) {
        // *****Nos Deslogueamos*****
        // Make a request to the server to handle session termination
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include' // Include cookies in the request
        })
        .then(() => {
            // Clear local storage
            localStorage.removeItem('role');
            localStorage.removeItem('name');

            // Clear cookies on the client side as a backup
            document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
            document.cookie = `token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;

            // Force redirect to ensure clean state
            window.location.href = '/login';
        })
        .catch(error => {
            console.error('Error during logout:', error);
            // Redirect anyway to ensure user is logged out
            window.location.href = '/login';
        });
    };
    return (
        <div className='logout'>
            <div className="header">
                <Header />
            </div>
            <div className="container bodyLogout">
                <div className='centerLogout'>
                    <div className="logoutTitle text-center"><p>Sesión Cerrada Correctamente</p></div>
                    <div className='row justify-content-center'><img src="/images/logo.png" alt="Castillo" className="logoLogout col-auto" /></div>
                </div>
                {/* *****Buttons***** */}
                <div className="container buttonsLogout">
                    <div className=' row justify-content-between'>
                        <div className="col-auto">
                            <Link className="btn btn-primary" type="button" to="/">Volver</Link>
                        </div>
                        <div className="col-auto">
                            <Link className="btn btn-success" type="button" to="/login">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Logout;