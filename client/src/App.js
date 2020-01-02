import React, { Component } from 'react';
import axios from 'axios';
import "./styles.css";

class App extends Component {

  render() {
    
    return (

      <div>

        <NaviBar />
        
        <ShrinkModule />
        
        <ProjectInfo />
        
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
      <section className="parallax" id="shrink-section">
        <div className="section-container">

          <p className="section-heading" id="shrink-section-content">
            Take control of your brand.
          </p>

          <div className="container-fluid" id="shrink-container">
            <form id="shrink-form" onSubmit={ this.sendUrl }>
              <div className="form-group row" id="shrink-form-row">

                  <input type="text" className="col-md-10 form-control form-control-lg" id="shrink-text-input" placeholder="Your URL!" name="longUrl" onChange={ event => this.setState({ urlInput: event.target.value }) } />
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

  render() {

    const urlObj = this.props.urlObj;
    const longUrl = urlObj.long_url;
    const fullShortUrl = urlObj.full_short_url;

    return(
      <div className="container-fluid list-group-item list-group-item-action">
        <div className="row">

          <li long-url={ longUrl } full-short-url={ fullShortUrl } ></li> 
          <div className="col-md-6 long-url"> { longUrl } </div>
          <div className="col-md-3 full-short-url"> {fullShortUrl} </div>

        <button type="button" className="col-md-3">COPY</button>

        </div>
      </div>
    )


  }

}

class ProjectInfo extends Component {
  render() {
    return(

      <section id="project-info-section">
        <div className="section-container">

          <p className="section-heading" id="project-info-heading"> About this project </p>
        
          
          <img className="d-flex justify-content-center" id="project-info-icon" src={ require('./static/icons/barchart.png')} alt="" /> 
        

          <span id="project-info-content">
            <p>
              This is a demo project built using React.js and Node.js.
              If you want to see more of my work, please check out my 
              GitHub page. 
            </p>
          </span>

        </div>
      </section>
    )
  }
}

class Contact extends Component {

  render() {
    return(
      <section id="contact-section">
        <div className="section-container">
        
          <p className="section-heading" id="contact-heading"> Get in touch </p>
          

            <div id="contact-info">
              
              <img className="d-flex justify-content-center" id="avatar" src={require("./static/logo200x200.png")} alt="" /> 
              
              <p id="name"> Henry Zheng </p>
              <p><a id="resume" href={ require('./static/resume.pdf') } alt=""> View Resume </a></p>

              <div className="container-fluid">
                  <ul className="list-unstyled" id="personal-links">
                    
                    <li><button type="button" className="btn btn-primary" href="https://www.github.com/hnryzhng">GitHub</button></li>
                    <li><button type="button" className="btn btn-primary" href="https://www.linkedin.com/in/hnryzhng">LinkedIn</button></li>
                  
                  </ul>
              </div>
            </div>

        </div>
      </section>
    )
  }

}


export default App;
