import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Options from './Components/Options';
import Results from './Components/Results';
import { Header } from './Components/Header';

// Using React and whatever other libraries you’d like, create a simple application using the
// StockTwits API. Use of UI libraries is allowed.
// Hint: you will need to have separate backend to handle CORS.

// ● When a new tweet comes in, it should automatically be added without having to refresh
// the page.

//use polling every 60 seconds

// ● The page has to be responsive.

// ● Pay attention to details and make the user-interface and user-experience the best you
// possibly can, considering time constraints.

class App extends Component {
  state = {
    data: []
  };

  handleChild = data => {
    if (!data) {
      this.setState({ data: [] });
    } else {
      this.setState({ data });
    }
  };

  render() {
    return (
      <div className="App">
        <Header />
        <Options handleData={this.handleChild} />
      </div>
    );
  }
}

export default App;
