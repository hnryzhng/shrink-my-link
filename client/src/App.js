import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  state = {
  	urlInput: null,
    links: [{long_url: "lol", short_url: "haha"}] // array of pairs/objects of long and short urls
  }

  render() {
    
    return (

      <div>
        <h1> SHRINK MY LINK </h1>

        <input type="text" style={{ width: "300px" }} placeholder="Shrink me!" name="originalUrl" onChange={ event => this.setState({ urlInput: event.target.value }) } />


        <div id="listContainer" style={{ width: "300px", height: "500px", border: "1px solid black" }}>
          <List links={ this.state.links } />
        </div>
      </div>
    );
  }

}

class List extends Component {

  render() {
    let list = this.props.links.map((urlObj, index) => {
      console.log("index, urlObj:", index, urlObj)
      return <Item key={index} urlObj={urlObj} />
    });

    return <ul> {list} </ul>

  }

}

class Item extends Component {

  render() {

    const urlObj = this.props.urlObj;

    return(
      <div>
        <li long_url={ urlObj.long_url } short_url={ urlObj.short_url } ></li>    
      </div>
    )


  }

}
export default App;
