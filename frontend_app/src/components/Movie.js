import { useEffect ,useState} from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
    const [movie, setMovie] = useState({});
    let { id } = useParams();
    useEffect(() => {
        let myMovie = {
            id: 1,
            title: "The Godfather",
            release_date: "1972-03-24",
            runtime: 175,
            mpaa_rating: "R",
            description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        }
        setMovie(myMovie)
    }, [id])
    return (
            <div >
                <h2>Movie: {movie.title}</h2>
                <small ><em>{movie.release_date} , minutes, Rated {movie.runtime}, {movie.mpaa_rating}</em></small>
                <hr />
                <p>{movie.description}</p>
            </div>
    )
}

export default Movie;