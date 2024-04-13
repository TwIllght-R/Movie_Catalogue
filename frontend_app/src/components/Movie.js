import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
    const [movie, setMovie] = useState({});
    let { id } = useParams();
    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`/movie/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setMovie(result);
            })
            .catch(error => console.log('error', error));
    }, [id])

    if (movie.genres) {
        movie.genres = Object.values(movie.genres);
    } else {
        movie.genres = [];
    }

    return (
        <div >
            <h2>Movie: {movie.title}</h2>
            <small ><em>{movie.release_date} , minutes, Rated {movie.runtime}, {movie.mpaa_rating}</em></small><br />
            {movie.genres.map((g) => {
                return (
                    <span key={g.genre} className="badge bg-secondary me-2">{g.genre}</span>
                )
            })}
            <hr />
            {movie.image !== "" &&
                <div className="mb-3">
                <img src={`http://image.tmdb.org/t/p/w200/${movie.image}`} alt={"post"}  />
                </div>
            }
            <p>{movie.description}</p>
        </div>
    )
}

export default Movie;