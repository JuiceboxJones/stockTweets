import React, { Component } from 'react';
import Select from 'react-select';
import Results from './Results';

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
          this.handleState(data.messages, data.symbol.symbol)
        )
      );
    } else {
      this.handleState(null);
    }
  };

  //Call the API with our selected parameters

  getResults(params, index) {
    this.setState(this.baseState);
    let url = `https://api.stocktwits.com/api/2/streams/symbol/${params}.json`;
    return fetch(url, {
      method: 'GET'
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
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

  //function for communicating with parent

  sendData = res => {
    this.props.handleData(res);
  };

  render() {
    let s = this.state.resCount;

    //User input introduces errors, used a searchable select.
    //It is scalable and more options could be added without problems.

    const options = [
      { value: 'AAPL', label: 'AAPL' },
      { value: 'BABA', label: 'BABA' },
      { value: 'BAC', label: 'BAC' },
      { value: 'BLDP', label: 'BLDP' }
    ];

    return (
      <div className="op-ctr">
        <div className="op-bar">
          <Select
            isMulti
            name="options"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={e => this.handleAddValues(e)}
          />
          <div className="res-count-ctr">
            <div className={s.AAPL ? 'res-count' : 'res-hide'}>
              {!s.AAPL ? '' : `AAPL (${s.AAPL})`}
            </div>
            <div className={s.BABA ? 'res-count' : 'res-hide'}>
              {!s.BABA ? '' : `BABA (${s.BABA})`}
            </div>
            <div className={s.BAC ? 'res-count' : 'res-hide'}>
              {!s.BAC ? '' : `BAC (${s.BAC})`}
            </div>
            <div className={s.BLDP ? 'res-count' : 'res-hide'}>
              {!s.BLDP ? '' : `BLDP (${s.BLDP})`}
            </div>
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
