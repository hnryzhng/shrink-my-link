import React, { Component } from 'react';
import axios from 'axios';
import "./styles.css";

class App extends Component {

  render() {
    
    return (

      <div>

        <NaviBar />

        <ShrinkModule />

        <Contact />

      </div>
    );
  }

}

class NaviBar extends Component {

  render() {
    return(

      <nav id="navibar" className="navbar navbar-expand-md shadow-sm bg-white rounded">

            <Logo />

            <NavigationMenu />

      </nav>

    )
  }

}


class Logo extends Component {
  render() {
    return(
    
      <a className="navbar-brand" id="logo-container" href="/">
        <img src={ require("./static/logo_cropped.png") } alt="shrink my link"/>
      </a>  
    
    )
  }
}

class NavigationMenu extends Component {
  render() {
    return(
    <div className="container-fluid">
      <div className="d-md-flex justify-content-end" id="navigation-menu-container">
        <div id="navigation-menu">
          <ul className="navbar-nav">

            <li className="nav-item">
              <button type="button" className="nav-link btn btn-link" id="shrink-link-nav-item">
                Shrink URL
              </button>            
            </li>

            <li className="nav-item">
              <button type="button" className="nav-link btn btn-link" id="contact-nav-item">
                Contact Me
              </button>
            </li>

          </ul>
        </div>
      </div>
      </div>

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
      <section className="parallax" id="shrink-module-section">

        <p id="shrink-section-content">
          Take control of your brand.
        </p>

        <div className="container-fluid d-flex justify-content-center" id="shrink-container">
          <form className="form-inline" id="shrink-form" onSubmit={ this.sendUrl }>
            <div className="form-group">
    
              <input type="text" className="col form-control form-control-lg" id="shrink-text-input" placeholder="Your URL!" name="longUrl" onChange={ event => this.setState({ urlInput: event.target.value }) } />
              <button type="submit" class="col btn btn-primary" id="shrink-button">shrink me</button >
      
            </div>
          </form>
        </div>

        <ListContainer links={ this.state.links } />

      </section>

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

class Contact extends Component {

  render() {
    return(
      <section id="contact-section">

      </section>
    )
  }

}


export default App;
