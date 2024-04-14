import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Input from './form/input';
import Select from './form/Select';
import TextArea from './form/TextArea';
import CheckBox from './form/CheckBox';
const EditMovie = () => {
    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const mpaaOptions = [
        { id: "G", value: "G" },
        { id: "PG", value: "PG" },
        { id: "PG13", value: "PG13" },
        { id: "R", value: "R" },
        { id: "NC17", value: "NC17" },
        { id: "18A", value: "18A" }
    ]

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }
    const [movie, setMovie] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
        genres: [],
        genres_array: [Array(13).fill(false)],
    });
    let { id } = useParams();
    if (id === undefined) {
        id = 0;

    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate('/login');
            return;
        }
        if (id === 0) {
            setMovie({
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "",
                description: "",
                genres: [],
                genres_array: [Array(13).fill(false)],
            });
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            const requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(`/genres`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    let checks = [];
                    data.forEach((g) => {
                        checks.push({ id: g.id, genre: g.genre, checked: false });
                    });
                    setMovie(m => ({ ...m, genres: checks, genres_array: [] }));
                })
                .catch(error => console.log('error', error));
        } else {
            //edit movie
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + jwtToken);
            const requestOptions = {
                method: 'GET',
                headers: headers,
            };

            fetch(`/admin/movies/${id}`, requestOptions)
                .then(response => {
                    if (response.status !== 200) {
                        setError("Movie not found");
                        navigate('/manage-catalogue');
                    }
                    return response.json();
                })
                .then(data => {
                    //convert release_date to a string
                    data.movies.release_date = new Date(data.movies.release_date).toISOString().split('T')[0];


                    const checks = [];
                    data.genres.forEach((g) => {
                        if (data.movies.genres_array.indexOf(g.id) !== -1) {
                            checks.push({ id: g.id, genre: g.genre, checked: true });
                        } else {
                            checks.push({ id: g.id, genre: g.genre, checked: false });
                        }
                    });
                    //set state
                    setMovie({
                        ...data.movies,
                        genres: checks,
                    })
                })
                .catch(error => console.log('error', error));




        }



    }, [id, jwtToken, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = [];
        let required = [
            { field: movie.title, name: "title" },
            { field: movie.release_date, name: "release_date" },
            { field: movie.runtime, name: "runtime" },
            { field: movie.mpaa_rating, name: "mpaa_rating" },
            { field: movie.description, name: "description" },
        ];

        required.forEach((obj) => {
            if (obj.field === "") {
                errors.push(obj.name);
            }
        });

        if (movie.genres_array.length === 0) {
            alert("Please select at least one genre");
            errors.push("genres");
        }



        setErrors(errors);
        if (errors.length > 0) {
            return false;
        }

        //passed validation
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + jwtToken);
        //assume we are adding a new movie
        let method = 'PUT';
        if (movie.id > 0) {
            method = 'PATCH';
        }

        const requestBody = movie;
        //covert release_date to a date object
        //run time to an integer

        requestBody.release_date = new Date(movie.release_date);
        requestBody.runtime = parseInt(movie.runtime, 10);

        const requestOptions = {
            method: method,
            headers: headers,
            body: JSON.stringify(requestBody),
            Credentials: 'include'
        };
        fetch(`/admin/movies/${movie.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    navigate('/manage-catalogue');
                }
            })
            .catch(error => console.log('error', error));

    };

    const handleChange = () => (e) => {
        let value = e.target.value;
        let name = e.target.name;
        setMovie({ ...movie, [name]: value });
    }

    const handleCheck = (e, p) => {
        console.log("handleCheck called");
        console.log("v handleCheck", e.target.value);
        console.log("c handleCheck", e.target.checked);
        console.log("p handleCheck", p);

        let tmpArr = movie.genres;
        tmpArr[p].checked = !tmpArr[p].checked;

        let tmpIDs = movie.genres_array;
        if (!e.target.checked) {
            tmpIDs.splice(tmpIDs.indexOf(e.target.value));
        } else {
            tmpIDs.push(parseInt(e.target.value, 10));
        }

        setMovie({ ...movie, genres_array: tmpIDs });
    }
    if (error) {
        return <div>Error: {error.message}</div>
    } else {
        return (
            <div >
                <h2>Add/Edit Movie</h2>
                <hr />
                {/* <pre>{JSON.stringify(movie, null, 3)}</pre> */}
                <form onSubmit={handleSubmit}>

                    <input type="hidden" name="id" value={movie.id} ></input>
                    <Input
                        title={"Title"}
                        className={"form-control"}
                        name={"title"}
                        type={"text"}
                        value={movie.title}
                        onChange={handleChange("title")}
                        errorDiv={hasError("title") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />

                    <Input
                        title={"Release Date"}
                        className={"form-control"}
                        name={"release_date"}
                        type={"date"}
                        value={movie.release_date}
                        onChange={handleChange("release_date")}
                        errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a release date"}
                    />

                    <Input
                        title={"Runtime"}
                        className={"form-control"}
                        name={"runtime"}
                        type={"text"}
                        value={movie.runtime}
                        onChange={handleChange("runtime")}
                        errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a runtime"}
                    />

                    <Select
                        title={"MPAA Rating"}
                        name={"mpaa_rating"}
                        options={mpaaOptions}
                        value={movie.mpaa_rating}
                        placeholder={"Choose..."}
                        onChange={handleChange("mpaa_rating")}
                        errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                        errorMsg={"Please choose a rating"}
                    />

                    <TextArea
                        title={"Description"}
                        name={"description"}
                        value={movie.description}
                        rows={3}
                        onChange={handleChange("description")}
                        errorDiv={hasError("description") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a description"}
                    />

                    <hr />

                    <h3>Genres</h3>
                    {movie.genres && movie.genres.length > 1 &&
                        <>
                            {Array.from(movie.genres).map((g, index) =>
                                <CheckBox
                                    title={g.genre}
                                    id={"genre-" + index}
                                    name={"genre"}
                                    key={index}
                                    value={g.id}
                                    checked={movie.genres[index].checked}
                                    onChange={(e) => handleCheck(e, index)}
                                />

                            )}
                        </>
                    }

                    <hr />

                    <button className="btn btn-primary">Save</button>








                </form>
            </div>
        )
    }
}

export default EditMovie;