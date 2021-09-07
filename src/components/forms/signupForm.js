import React, { Component } from 'react';
import Cookies from 'js-cookie';

import loading from "../../../static/assets/loading.gif";

export default class SignupForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: "",
            passwordComfirm: "",
            error: "",
            loading: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault();
    
        if (this.state.username === "" || this.state.password === "" || this.state.passwordComfirm === "") {
          this.setState({ error: "Please fill out all fields" });
        } 
        else if (this.state.password !== this.state.passwordComfirm){
            this.setState({error: "passwords do not match"})
        }
        else {
          this.setState({
            loading: true,
            error: "",
          });
    
          fetch("http://127.0.0.1:5000/user/add", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
    
                this.setState({ loading: false });

                this.props.handleSetUser(this.state.username);
                Cookies.set("username", this.state.username);
                this.props.changeRoute("/rules");
                
            })
            .catch((error) => {
              console.log("Error logging in", error);
              this.setState({
                loading: false,
                error: "An error occurred. Please try again later.",
              });
            });
        }
      }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value})
    }

    render() {
        return (
            <form className="form-wrapper" onSubmit={this.handleSubmit}>
                <input type="text" 
                placeholder="Username"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                />
                <input type="password" 
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                />
                <input type="password" 
                placeholder="Password Comfirm"
                name="passwordComfirm"
                value={this.state.passwordComfirm}
                onChange={this.handleChange}
                />
            <button type="submit" disabled={this.state.loading}>Signup</button>
            {this.state.loading ? <img src={loading} /> :  <div className="spacer"/>}
            <p>{this.state.error}</p>
            </form>
        )
    }
}