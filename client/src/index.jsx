// import React from "react";
// import ReactDOM from "react-dom";

// // Import statement to indicate that you need to bundle `./index.scss`
// import "./index.scss";

// // Main component (will eventually use all the others)
// class MyFlixApplication extends React.Component {
//   render() {
//     return (
//       <div className="my-flix">
//         <div>Good morning</div>
//       </div>
//     );
//   }
// }

// // Finds the root of your app
// const container = document.getElementsByClassName("app-container")[0];

// // Tells React to render your app in the root DOM element
// ReactDOM.render(React.createElement(MyFlixApplication), container);

// client/src/index.jsx
// import React from "react";
// import ReactDOM from "react-dom";
// import { createStore } from "redux";
// import { Provider } from "react-redux";

// import MainView from "./components/main-view/main-view";
// import moviesApp from "./reducers/reducers";

// // Import statement to indicate that we need to bundle `./index.scss`
// import "./index.scss";

// const store = createStore(moviesApp);

// // Main component (will eventually use all the others)
// class MyFlixApplication extends React.Component {
//   render() {
//     return (
//       <Provider store={store}>
//         <MainView />
//       </Provider>
//     );
//   }
// }

// // Find the root of our app
// const container = document.getElementsByClassName("app-container")[0];

// // Tell React to render our app in the root DOM element
// ReactDOM.render(React.createElement(MyFlixApplication), container);

import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import MainView from "./components/main-view/main-view";
import moviesApp from "./reducers/reducers";

import "./index.scss";

const store = createStore(moviesApp);

class MyFlixApplication extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

const container = document.getElementsByClassName("app-container")[0];

ReactDOM.render(React.createElement(MyFlixApplication), container);
