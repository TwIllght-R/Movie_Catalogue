import React, { useState } from 'react';
import Input from './form/input';
import { useNavigate, useOutlet, useOutletContext } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setJwtToken, setAlertClass, setAlertMessage } = useOutletContext();

    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        if (email === "admin@example.com") {
            setJwtToken("aaa");
            setAlertClass("d-none");
            setAlertMessage("");
            navigate("/");
            return;
        } else {
            setAlertClass("alert alert-danger");
            setAlertMessage("Invalid credentials. Please try again.");
        }
    }

    return (
        <div className='col-md-6 offset-md-3'>
            <h2>Login</h2>
            <hr />

            <form onSubmit={handlesubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <hr />
                <input type="submit" value="Login" className="btn btn-primary" />
            </form>
        </div>
    )
}

export default Login;