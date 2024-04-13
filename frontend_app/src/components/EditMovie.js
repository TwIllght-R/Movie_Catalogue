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
        { id: "18A", value: "18A"}
    ]   

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }
    const [movie, setMovie] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mapp_rating: "",
        description: "",
        genres : "",
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
                mapp_rating: "",
                description: "",
                genres : "",
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
                       checks.push({id: g.id, genre: g.genre, checked: false});
                    });
                    setMovie(m => ({ ...m, genres: checks, genres_array: []}));
                })
                .catch(error => console.log('error', error));
        }else {

        }



    }, [id,jwtToken, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

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
        }else {
            tmpIDs.push(parseInt(e.target.value,10));
        }

        setMovie({ ...movie, genres_array: tmpIDs });
    }

    return (
        <div >
            <h2>Add/Edit Movie</h2>
            <hr />
            <pre>{JSON.stringify(movie, null, 3)}</pre>
            <form onSubmit={handleSubmit}>

                <input type="hidden" name="id" value={movie.id} ></input>
                <Input
                    title={"Title"}
                    className={"form-control"}
                    name={"title"}
                    type={"text"}
                    value={movie.title}
                    onChange={handleChange("title")}
                    errorDiv={hasError("title") ? "alert alert-danger" : "d-none"}
                    errorMsg={"Please enter a title"}
                />

                <Input
                    title={"Release Date"}
                    className={"form-control"}
                    name={"release_date"}
                    type={"date"}
                    value={movie.release_date}
                    onChange={handleChange("release_date")}
                    errorDiv={hasError("release") ? "alert alert-danger" : "d-none"}
                    errorMsg={"Please enter a release date"}
                />

                <Input
                    title={"Runtime"}
                    className={"form-control"}
                    name={"runtime"}
                    type={"text"}
                    value={movie.runtime}
                    onChange={handleChange("runtime")}
                    errorDiv={hasError("runtime") ? "alert alert-danger" : "d-none"}
                    errorMsg={"Please enter a runtime"}
                />

                <Select
                    title={"MPAA Rating"}
                    name={"mpaa_rating"}
                    options={mpaaOptions}
                    placeholder={"Choose..."}
                    onChange={handleChange("mpaa_rating")}
                    errorDiv={hasError("mpaa_rating") ? "alert alert-danger" : "d-none"}
                    errorMsg={"Please choose a rating"}
                />

                <TextArea
                    title={"Description"}
                    name={"description"}
                    value={movie.description}
                    rows={3}
                    onChange={handleChange("description")}
                    errorDiv={hasError("description") ? "alert alert-danger" : "d-none"}
                    errorMsg={"Please enter a description"}
                />

                <hr />

                <h3>Genres</h3>
                {movie.genres && movie.genres.length > 1 && 
                    <>
                    {Array.from(movie.genres).map((g,index) => 
                        <CheckBox 
                            title = {g.genre}
                            id = {"genre-" + index}
                            name = {"genre"}
                            key = {index}
                            value = {g.id}
                            checked = {movie.genres[index].checked}
                            onChange = {(e) => handleCheck(e, index)}
                        />

                    )}
                    </>
                }
               

                





            </form>
        </div>
    )
}

export default EditMovie;