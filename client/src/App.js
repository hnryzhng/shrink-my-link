import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import "./styles.css";

import Footer from "./components/Footer.js";

class App extends Component {

  render() {
    
    return (
      <Router>

        <div>

          <NaviBar />
          
          <ShrinkModule />
          
          <ProjectInfo />
          
          <Contact />

          <Switch>
            <Route exact path="/:shorturl" component={RedirectComponent} />
          </Switch>

        
          <Footer />


        </div>


      </Router>
    );
  }

}

class RedirectComponent extends Component {
  

  redirect = () => {

    const production = "https://shrink-my-link.herokuapp.com";
    const development = "http://localhost:3001";
    const baseURL = (process.env.NODE_ENV? production : development);

    const s = this.props.match.params.shorturl;

    axios.get(`${baseURL}/api/redirect`, {
        params: {
          shorturl: s
        }
      })
      .then(response => response.data)
      .then(data => {
        if (data.success) {
          const longUrl = data.longurl;
          console.log('long url:', longUrl);
          window.location.href = longUrl; 
        } else {
          console.log('url could not be fetch from backend');
        }        
      })
      .catch("error", console.log("could not redirect"));

  }

  render(){

    this.redirect();

    return(

      <>
      </>

    )

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
              <a href="#shrink-tag" className="nav-link" id="shrink-link-nav-item">
                Shrink URL
              </a>            
            </li>

            <li className="nav-item">
              <a href="#contact-tag"className="nav-link" id="contact-nav-item">
                Contact Me
              </a>
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
    links: [], // [{long_url: "", short_url: ""}, ...]
    errorMessage: ""
  }

  validateUrl = (url) => {
    // check if url has https://, if not, prepend
    if (url.trim().substr(0,8) === "https://") {
      return url
    } else {
      console.log("please put in a working url that has 'https://' in the beginning");
      this.setState({ errorMessage: "please put in a working url that has 'https://' in the beginning" }, () => { alert(this.state.errorMessage) })      
      return false
    }

  }

  sendUrl = (event) => {
    event.preventDefault();

    const urlInput = this.state.urlInput;
    console.log("state urlInput:", this.state.urlInput);

    if (this.validateUrl(urlInput) === false) {
      return
    }

    const production = "https://shrink-my-link.herokuapp.com";
    const development = "http://localhost:3001";
    const baseURL = (process.env.NODE_ENV? production : development);

    axios.post(`${baseURL}/api/shrink`, {
            longUrl: urlInput
          })
          .then(response => response.data)
          .then(data => {
            if (data.success) {
              // add long and short urls from response to links array
              console.log("response data:", data);
              this.setState( { links: [...this.state.links, {long_url: data.long_url, short_url: data.short_url}] } );
            } else {      
              console.log("could not shrink your link");
            }

          })
          .catch(error => console.log("processing error:", error));

  }

  render() {
    return(
      <section>
        <div className="section-container parallax" id="shrink-section">

          <a id="shrink-tag"></a>

          <p className="section-heading" id="shrink-section-heading">
            Take control of your brand.
          </p>

          <div className="container-fluid" id="shrink-container">
            <form id="shrink-form" onSubmit={ this.sendUrl }>
              <div className="form-group row" id="shrink-form-row">

                  <input type="text" className="col-md-10 form-control form-control-lg" id="shrink-text-input" placeholder="Put in your URL!" name="longUrl" onChange={ event => this.setState({ urlInput: event.target.value }) } />
                  <button type="submit" className="col-md-2 btn btn-primary" id="shrink-button">shrink me</button >
                
              </div>
            </form>
          </div>

          <ListContainer links={ this.state.links } />

        </div>
      </section>

    )
  }
}

class ListContainer extends Component {

  render(){
    return(

      <div id="list-container">
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

    return <ul className="list-group list-unstyled"> {list} </ul>

  }

}

class Item extends Component {

  // TASK: copy function
  // TASK: limit to 3 links per IP address
  // TASK: if long url length too long, limit display in overflow

  constructor(props) {

    super(props);

    this.textAreaRef = React.createRef();

  }

  copyLink = (fullShortUrl) => {

    var dummy = document.createElement('input');  // create dummy input element
    document.body.appendChild(dummy); // append element to DOM
    dummy.setAttribute('value', fullShortUrl);  // set element value to url

    dummy.select(); // select input element
    document.execCommand('copy'); // copy value from selected input element
    
    document.body.removeChild(dummy); // remove input element from body

  }


  render() {

    const urlObj = this.props.urlObj;
    const longUrl = urlObj.long_url;
    const shortUrl = urlObj.short_url;
    const fullShortUrl = window.location.hostname + '/' + shortUrl;

    return(
      <div className="container-fluid list-group-item list-group-item-action">
        <div className="row">

          <li long-url={ longUrl } short-url={ shortUrl } ></li> 
          <div className="col-md-6 long-url"> { longUrl } </div>
          <div className="col-md-3 full-short-url"> {fullShortUrl} </div>

          <button type="button" className="copy-button col-md-3 btn btn-success" onClick={this.copyLink(fullShortUrl)} >COPY</button>
          

        </div>
      </div>
    )


  }

}

class ProjectInfo extends Component {
  render() {
    return(

      <section>
        <div className="section-container" id="project-info-section">

          <p className="section-heading" id="project-info-heading"> About this project </p>
        
          
          <img className="d-flex justify-content-center" id="project-info-icon" src={ require('./static/icons/barchart.png')} alt="" /> 
        

          <div id="project-info-content">
            <p>
              This is a demo project built using React.js and Node.js.
              If you want to see more of my work, please check out my GitHub page given below. 
            </p>
          </div>

        </div>
      </section>
    )
  }
}

class Contact extends Component {

  render() {
    return(
      <section>
        <div className="section-container" id="contact-section">
        
          <p className="section-heading" id="contact-heading"> Get in touch </p>
            <a id="contact-tag"></a>          

            <div id="contact-info">
              
              <img className="d-flex justify-content-center" id="avatar" src={require("./static/avatar.png")} alt="" /> 
              
              <p id="name"> Henry Zheng </p>
              <p><a id="resume" href={ require('./static/resume.pdf') } alt=""> View Resume </a></p>

              <div className="container-fluid">
                  <ul className="list-unstyled" id="personal-links">
                    
                    <li><a className="btn btn-primary" href="https://www.github.com/hnryzhng" role="button">GitHub</a></li>
                    <li><a className="btn btn-primary" href="https://www.linkedin.com/in/hnryzhng" role="button">LinkedIn</a></li>
                  
                  </ul>
              </div>
            </div>

        </div>
      </section>
    )
  }

}


export default App;
