import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  state = {
  	urlInput: null,
    links: [], // [{long_url: "", full_short_url: ""}, ...]
    error: null
  }

  sendUrl = (event) => {
    event.preventDefault();

    const urlInput = this.state.urlInput;
    console.log("state urlInput:", this.state.urlInput);
    
    // axios.post("http://localhost:3001/api/shrink", {
    axios.post("/shrink", {
            longUrl: urlInput
          })
          .then(response => response.data)
          .then(data => {
            if (data.success) {
              // add long and short urls from response to links array
              console.log("response data:", data);
              this.setState( { links: [...this.state.links, {long_url: data.long_url, full_short_url: data.full_short_url}] } );
            } else {      
              console.log("could not shrink your link");
              this.setState({ error: data.error })  // sets error message 
            }

          })
          .catch(error => console.log("processing error:", error));

  }


  render() {
    
    return (

      <div>
        <h1> SHRINK MY LINK </h1>

        <form onSubmit={ this.sendUrl }>
          <input type="text" style={{ width: "300px" }} placeholder="Your URL!" name="longUrl" onChange={ event => this.setState({ urlInput: event.target.value }) } />
          <button type="submit">SHRINK ME</button >
        </form>

        <div id="error-container" style={{ width: "300px" }} >
          Err Message: {this.state.error}
        </div>

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
      return <Item key={index} urlObj={urlObj} />
    });

    return <ul> {list} </ul>

  }

}

class Item extends Component {

  render() {

    const urlObj = this.props.urlObj;
    const longUrl = urlObj.long_url;
    const fullShortUrl = urlObj.full_short_url;

    return(
      <div>
        <li long_url={ longUrl } full_short_url={ fullShortUrl } ></li> 
        long url: { longUrl } ||| shortened url: {fullShortUrl}
      </div>
    )


  }

}
export default App;
