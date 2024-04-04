import { Link } from 'react-router-dom';
import Ticket from '.././images/movie_tickets.jpg';
const Home = () => {
    return (
        <>
            <div className="text-center">
                <h2>Welcome to Movie Front End</h2>
                <hr />
                <Link to="/movies" >
                <img src={Ticket} alt="Ticket"/>
                </Link>
            </div>
        </>
    )
}

export default Home;