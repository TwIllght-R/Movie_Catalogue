import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";


const  OneGenre = () => {
    
    const location = useLocation();
    const { genreName } = location.state;
    const [movies, setMovies] = useState([]);

    let { id } = useParams();




    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`/movies/genres/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                   console.log(data.message);

                } else {
                    setMovies(data);

                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [id]);

    return (
      <>
      <h2>Genre:{genreName}</h2>
        <hr />
        {movies ? (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Movie</th>
                    <th>Release Date</th>
                    <th>Rating</th>
                </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>
                                <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                            </td>
                            <td>{movie.release_date}</td>
                            <td>{movie.rating}</td>
                         
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>There are no movies in this genre</p>
        )}
        
      </>
    )
}

export default OneGenre;