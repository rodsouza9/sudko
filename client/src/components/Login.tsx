import axios from "axios";
import React from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Menubar.css";

export class Login extends React.Component<{}, {}> {

    public loginClick() {
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

    public render() {
        return (
            <Nav>
                <Nav.Link href="#deets">More deets</Nav.Link>
                <Button onClick={() => {
                    this.loginClick();
                }}
                        variant="outline-primary">Dank memes
                </Button>
            </Nav>
        );
    }
}
