import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';
import { APIResponse } from '../../interfaces';


/**
 * A simple React App to for classifying Pokemons
 *
 * @author iberatkaya
 */

interface Props {

};

/**
 * State of the React App
 * 
 * @property {string} image The file path of the image
 * @property {boolean} scanned To check if the image was scanned
 */

interface State {
  image: string,
  scanned: boolean,
  url: string,
  pred: APIResponse | null,
  status: string
}



class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      image: '',
      scanned: false,
      pred: null,
      url: '',
      status: '1'
    }
  }

  getBase64 = (file: File) => {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = URL.createObjectURL(e.target.files![0]);
    let image = e.target.files![0];
    let imagedata = await this.getBase64(image) as string
    let data = {
      image: imagedata
    };
    let res = await fetch('/api/upload', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",

      },
      method: "POST",
      body: JSON.stringify(data)
    });
    let resjson = await res.json();
    console.log(resjson);
    if (resjson.status === '1')
      this.setState({ image: file, pred: resjson.data, status: resjson.status })
    else
      this.setState({ status: resjson.status })
  }

  onChangeURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e')
    this.setState({url: e.target.value});
  }

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = {
      url: this.state.url
    };
    let res = await fetch('/api/sendlink', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",

      },
      method: "POST",
      body: JSON.stringify(data)
    });
    let resjson = await res.json();
    console.log(resjson);
    if (resjson.status === '1')
      this.setState({ image: data.url, pred: resjson.data, status: resjson.status })
    else
      this.setState({ status: resjson.status })
  }

  /**
   * The prediction used while training
   */

  render() {
    return (
      <div>
        <Navbar bg="success" variant="dark" expand="lg">
          <Navbar.Brand style={{ color: '#eee' }} href="#home">Pokemon Classification</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link style={{ color: '#eee' }} target="_blank" rel="noopener noreferrer" href="https://github.com/iberatkaya">GitHub</Nav.Link>
              <Nav.Link style={{ color: '#eee' }} target="_blank" rel="noopener noreferrer" href="https://linkedin.com/in/ibrahim-berat-kaya">LinkedIn</Nav.Link>
              <Nav.Link style={{ color: '#eee' }} target="_blank" rel="noopener noreferrer" href="https://www.npmjs.com/package/@tensorflow-models/mobilenet">MobileNet</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="m-3">Pokemon Classification</h2>
            </div>
          </div>
        </div>
        <div>
          {
            this.state.image === '' ?
              <div className="container justify-center align-items-center">
                <div className="text-center">
                  <p className="lead" style={{ fontSize: '1.1rem' }}>Upload your Pokemon image to classify it. Images are clasified with Tensorflow.js using a custom trained model. Currently only Bulbasaur, Charmander, and Squirtle are classified. </p>
                  {this.state.status === '1' ? <div></div> : <div className="text-danger mb-4" style={{ fontSize: '1.2rem' }} >Please upload an image with no alpha channel!</div>}
                </div>
                <form className="form">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Upload</span>
                    </div>
                    <div className="custom-file">
                      <input value={this.state.image} onChange={this.onChange} accept="image/*" type="file" className="custom-file-input" />
                      <label className="custom-file-label">Choose image</label>
                    </div>
                  </div>
                </form>
                <form className="form mt-4" onSubmit={this.onSubmit}>
                  <div className="input-group">
                    <input value={this.state.url} onChange={this.onChangeURL} type="text" className="form-control" placeholder="https://www.image.com/charmander.jpg" />
                    <button type="submit" className="btn btn-outline-primary">Submit</button>
                  </div>
                </form>
              </div>
              :
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="text-center">
                      <img alt="input" ref="image" style={{ maxWidth: '60%' }} className="img-responsive" src={this.state.image}></img>
                    </div>
                    <ul className="list-group mb-4">
                      <li className="list-group-item disabled">KNN Predictions</li>
                      <li className="list-group-item">Bulbasaur - Probability: {(parseFloat(this.state.pred!.Bulbasaur) * 100).toFixed(2)}%</li>
                      <li className="list-group-item">Charmander - Probability: {(parseFloat(this.state.pred!.Charmander) * 100).toFixed(2)}%</li>
                      <li className="list-group-item">Squirtle - Probability: {(parseFloat(this.state.pred!.Squirtle) * 100).toFixed(2)}%</li>
                    </ul>
                    <div className="text-center mb-2">
                      <button className="btn btn-outline-primary" onClick={async () => {
                        this.setState({ image: '', url: '', scanned: false })
                      }}>Classify New Image</button>
                    </div>
                  </div>
                </div>
              </div>
          }

        </div>

      </div>
    )
  }
}

export default App
