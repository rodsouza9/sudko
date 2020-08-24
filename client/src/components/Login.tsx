import axios from "axios";
import React, {KeyboardEvent, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Login.css";
import "./Menubar.css";
import {KEY_COMMAND} from "../Types";
import * as _ from "lodash";

export function Login() {
    const [show, setShow] = useState(false);
    function loginClick() {
        console.log("login clicked");
        axios.post(`http://localhost:5000/login/`, {
            email: "user1@gmail.com",
            password: "password",
        })
            .then((res) => {
                console.log(res);
                console.log(res.data);
            });
    }

    useEffect(() => {
        const signUpButton = document.getElementById("signUp");
        const signInButton = document.getElementById("signIn");
        const container = document.getElementById("container");
        if (signInButton && signUpButton && container) {
            signUpButton.addEventListener("click", () => {
                console.log("up");
                container.classList.add("right-panel-active");
            });
            signInButton.addEventListener("click", () => {
                console.log("in");
                container.classList.remove("right-panel-active");
            });
        }
    });

    return (
        <Nav>
            <Modal
                size="lg"
                show={show}
                onHide={() => setShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
                centered
                className = "modal"
            >
                <Modal.Dialog className = "diag">
                    <Modal.Body className = "mmodal">
                        <div className="container" id="container">
                            <SignUpForm/>
                            <SignInForm/>
                            {overlayCont()}
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Button onClick={() => {setShow(true); }}
                    variant="outline-primary">Dank memes
            </Button>
        </Nav>
    );
}

function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const inputNameVal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return(
        <div className="form-container sign-up-container">
            <form action="#">
                <h1>Create Account</h1>
                <div className="social-container">
                    <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                    <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                </div>
                <span>or use your email for registration</span>
                <input
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value);
                    }}
                    placeholder="Name"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value);
                    }}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value);
                    }}
                    placeholder="Password"
                />
                <button>Sign Up</button>
            </form>
        </div>
    );
}

function SignInForm() {
    return(
        <div className="form-container sign-in-container">
            <form action="#">
                <h1>Sign in</h1>
                <div className="social-container">
                    <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                    <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                </div>
                <span>or use your account</span>
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <a href="#">Forgot your password?</a>
                <button>Sign In</button>
            </form>
        </div>
    );
}

function overlayCont() {
    return (
        <div className="overlay-container">
            <div className="overlay">
                <div className="overlay-panel overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>
                        To keep connected with us please login with your personal info
                    </p>
                    <button className="ghost" id="signIn">Sign In</button>
                </div>
                <div className="overlay-panel overlay-right">
                    <h1>Hello, Friend!</h1>
                    <p>Enter your personal details and start journey with us</p>
                    <button className="ghost" id="signUp">Sign Up</button>
                </div>
            </div>
        </div>
    );
}
