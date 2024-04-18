import React, { useState, useEffect } from 'react';
import Input from './form/input';
import { Link } from 'react-router-dom';

const GraphQL = () => {
    //set state variables
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fullList, setFullList] = useState([]);

    //perform seach
    const performSearch = (e) => { 
        const payload = `
        {
            search(titleContains: "${searchTerm}") {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        }`

        const headers = new Headers();
        headers.append("Content-Type", "application/graphql");

        const requestOptions = {
            method : "POST",
            headers: headers,
            body: payload
        }
        fetch("/graph", requestOptions)
        .then(response => response.json())
        .then(data => {
            let theList = Object.values(data.data.search);
            setMovies(theList);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

    }

    const handleChange = (e) => {
        e.preventDefault();
        let value = e.target.value;
        setSearchTerm(value);
        if (value.length > 2) {
            performSearch();
            console.log(value);
        }else {
            setMovies(fullList);
        }
    }


    //useEffect to fetch data
    useEffect(() => {
        const payload = `
    {
        list {
            id
            title
            runtime
            release_date
            mpaa_rating
        }
    }`
        const headers = new Headers();
        headers.append("Content-Type", "application/graphql");
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: payload,
        };

        fetch("/graph", requestOptions)
            .then(response => response.json())
            .then(data => {
                let theList = Object.values(data.data.list);
                console.log(data)
                setMovies(theList);
                setFullList(theList);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });

    }, []);
    return (
        <div >
            <h2>Welcome to GraphQL Front End</h2>
            <hr />

            <form onSubmit={handleChange}>
                <Input
                    title="Search"
                    type="search"
                    name="search"
                    className="form-control"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </form>
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
                                <td><Link to = {`/movies/${movie.id}`}>{movie.title}</Link></td>
                                <td>{new Date(movie.release_date).toLocaleDateString()}</td>
                                <td>{movie.mpaa_rating}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

            ):(
                <p>No movies found</p>
            )}
        </div>
    )
}

export default GraphQL;