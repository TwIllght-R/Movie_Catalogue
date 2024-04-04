import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const Movies = () => {
    const [movies, setMovies] = useState([]);


    useEffect(() => {
        let moviesList = [
            {
                id: 1,
                title: "The Godfather",
                release_date: "1972-03-24",
                runtime: 175,
                mpaa_rating: "R",
                description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",

            },
            {
                id: 2,
                title: "The Shawshank Redemption",
                release_date: "1994-10-14",
                runtime: 142,
                mpaa_rating: "R",
                description: "Two imprisoned",
            },
        ]

        setMovies(moviesList)
    }, [])
    return (
        <div >
            <h2>Welcome to Movie Front End</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(m => (
                        <tr key={m.id}>
                            <td><Link to={`/movie/${m.id}`}>
                                {m.title}
                            </Link></td>
                            <td>{m.release_date}</td>
                            <td>{m.mpaa_rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Movies;