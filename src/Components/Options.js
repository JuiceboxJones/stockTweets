import React, { Component } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Results from './Results';
import './Options.css'

let history = [];

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      resCount: {}
    };
    // preserve the initial state in a new object
    this.baseState = this.state;
  }

  //Process the parameters and manage the response from the API
  //Due to the restrictions the API has introduces with partner level access
  //we are calling the API once per selected option

  handleAddValues = e => {
    //Built for polling, but not in use due to the API rate limit. Avoiding app being blacklisted for DOS attack.
    //Ideally would like to use a socket to keep open communication with server if it werent restrictive.

    // setInterval(() => {
    //   console.log('polling')
    //   e.forEach((item, index) =>
    //     this.getResults(item.value).then(data =>
    //       function(JSON.stringify(data.messages) === JSON.stringify(history[0])) => {
    //        this.handleState(data.messages)
    //}
    //     )
    //   );
    // }, 60000);

    if (e) {
      history = [];
      e.forEach(item =>
        this.getResults(item.value).then(data =>
          (data.messages ? 
            this.handleState(data.messages, data.symbol.symbol) : 
            this.setState({
              resCount: { [item.value]: data.statusText, ...this.state.resCount }
            }))
        )
      );
    } else {
      this.handleState(null);
    }
  };

  //Call the API with our selected parameters

  getResults(params, index) {
    this.setState(this.baseState);
    let url = `https://cors-anywhere.herokuapp.com/https://api.stocktwits.com/api/2/streams/symbol/${params}.json`;
    return fetch(url, {
      method: 'GET',
      dataType: 'jsonp'
    }).then(res =>
      !res.ok ? res : res.json()
    );
  }

  //Set the state locally and send to the parent for page re-render and content update

  handleState = (results, tag) => {
    history.push(results);
    if (!results) {
      this.setState(this.baseState);
      this.sendData(null);
    } else {
      this.setState({
        results: [results, ...this.state.results],
        resCount: { [tag]: results.length, ...this.state.resCount }
      });
      this.sendData(this.state.results);
    }
  };

  handleResCount = () => {
    let s = this.state.resCount;
    return Object.keys(s).length>0 ? Object.entries(s).map((item, index) => {
      return(
        <div className='res-count'>
          {`${item[0]} ( ${item[1]} )`}
        </div>
      )
    }) : ''
  }

  //function for communicating with parent

  sendData = res => {
    this.props.handleData(res);
  };

  render() {

    //User input introduces errors, used a searchable select.
    //It is scalable and more options could be added without problems.

    const options = [
      { value: 'AAPL', label: 'AAPL' },
      { value: 'BABA', label: 'BABA' },
      { value: 'BAC', label: 'BAC' },
      { value: 'BLDP', label: 'BLDP' },
      { value: 'INTC', label: 'INTC' },
      { value: 'GOOGL', label: 'GOOGL' },
      { value: 'TSLA', label: 'TSLA' },
    ];

    const components = {
      DropdownIndicator: null,
    };

    return (
      <div className="op-ctr">
        <div className="op-bar">
          <CreatableSelect
            isMulti
            name="options"
            components={components}
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={e => this.handleAddValues(e)}
            placeholder="Click to select from below or type something and press enter..."
          />
          <div className="res-count-ctr">
          {this.handleResCount()}
          </div>
        </div>
        <div className="data-res">
          <Results results={this.state.results} />
        </div>
      </div>
    );
  }
}

export default Options;
