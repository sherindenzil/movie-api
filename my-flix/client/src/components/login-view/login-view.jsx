import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./login-view.scss";

export function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    /* Send a request to the server for authentication then call */
    props.onLoggedIn(username);
  };

  return (
    <Container className="loginContainer">
      <h1>Welcome to My Flix</h1>
      <br></br>
      <br></br>
      <Form>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button id="loginButton" onClick={handleSubmit}>
          Log in
        </Button>
        <Button
          variant="link"
          onclick={handleRegister}
          className="registerButton"
          type="submit"
        >
          Register
        </Button>
      </Form>
    </Container>
  );
}

//   return (
//     <form>
//       <label>
//         Username:
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </label>
//       <label>
//         Password:
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </label>
//       <button type="button" onClick={handleSubmit}>
//         Submit
//       </button>
//     </form>
//   );
// }

// import React from "react";

// export class LoginView extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       username: "",
//       password: "",
//     };

//     this.onUsernameChange = this.onUsernameChange.bind(this);
//     this.onPasswordChange = this.onPasswordChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   onUsernameChange(event) {
//     this.setState({
//       username: event.target.value,
//     });
//   }

//   onPasswordChange(event) {
//     this.setState({
//       password: event.target.value,
//     });
//   }

//   handleSubmit() {
//     const { username, password } = this.state;
//     console.log(username, password);
//     /* Send a request to the server for authentication */
//     /* then call this.props.onLoggedIn(username) */
//   }

//   render() {
//     return (
//       <form>
//         <label>
//           Username:
//           <input
//             type="text"
//             value={this.state.username}
//             onChange={this.onUsernameChange}
//           />
//         </label>
//         <label>
//           Password:
//           <input
//             type="password"
//             value={this.state.password}
//             onChange={this.onPasswordChange}
//           />
//         </label>
//         <button type="button" onClick={this.handleSubmit}>
//           Submit
//         </button>
//       </form>
//     );
//   }
// }
