import React, { Component } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Linkify from 'react-linkify';
import './Results.css'

let dat = [];

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  componentWillUpdate() {
    dat = [];
    this.props.results.forEach(i => i.map((item, index) => dat.push(item)));
  }

  handleData = () => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US');
    return dat.map((item, index) => {
      let event = timeAgo.format(new Date(item.created_at));
      return (
        <li key={index}>
          <img src={item.user.avatar_url} alt={`avatar${index}`} />
          <div className="usr-info">
            <span className="usr-name">{`${item.user.name} `}</span>
            <span className="usr-usrname">{` @${item.user.username} `}</span>
            <span className="dateTime">{event.toString()}</span>
            <div className="post-cont">
              <Linkify>{item.body}</Linkify>
            </div>
          </div>
        </li>
      );
    });
  };

  render() {
    this.handleData(dat);
    return <div>{this.handleData()}</div>;
  }
}

export default Results;
