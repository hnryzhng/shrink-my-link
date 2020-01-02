import React, { Component } from 'react';
import axios from 'axios';
import "./styles.css";

class App extends Component {

  render() {
    
    return (

      <div>

        <NaviBar />

        <div className="parallax" id="parallax-bg-1">
          <ShrinkModule />
        </div>

      </div>
    );
  }

}

class NaviBar extends Component {

  render() {
    return(

      <nav id="navibar" className="navbar navbar-expand-md shadow-sm bg-white rounded">

            <Logo />

      </nav>

    )
  }

}


class Logo extends Component {
  render() {
    return(
    
      <a className="navbar-brand" id="logo-container" href="/">
        <img src={ require("/") } alt="shrink my link"/>
      </a>  
    
    )
  }
}


class ShrinkModule extends Component {

  state = {
    urlInput: null,
    links: [] // [{long_url: "", full_short_url: ""}, ...]
  }

  sendUrl = (event) => {
    event.preventDefault();

    const urlInput = this.state.urlInput;
    console.log("state urlInput:", this.state.urlInput);
    
    const baseURL = process.env.baseURL || "http://localhost:3001";     

    axios.post(`${baseURL}/api/shrink`, {
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
            }

          })
          .catch(error => console.log("processing error:", error));

  }

  render() {
    return(
      <>

        <form onSubmit={ this.sendUrl }>
          <input type="text" style={{ width: "300px" }} placeholder="Your URL!" name="longUrl" onChange={ event => this.setState({ urlInput: event.target.value }) } />
          <button type="submit">SHRINK ME</button >
        </form>

        <ListContainer links={ this.state.links } />

      </>

    )
  }
}

class ListContainer extends Component {

  render(){
    return(

      <div id="listContainer" style={{ width: "300px", height: "500px", border: "1px solid black" }}>
        <List links={ this.props.links } />
      </div>

    )
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
