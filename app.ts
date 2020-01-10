import express, { Application } from "express";
import path from 'path';
import { Controllers, APIHandler } from "./interfaces";


/**
 * App Class to initiate the server.
 * 
 * @author iberatkaya
 */

class App {
  public app: Application;
  public port: number;

  constructor(init: { port: number, apiCalls: Array<APIHandler>, middleWares: Array<any>, controllers: Controllers}) {
    this.app = express()
    this.port = init.port
    this.middlewares(init.middleWares)
    this.assets()
    this.routes(init.controllers)
    this.apiCalls(init.apiCalls)
  }


  /**
   * Function to handle all API Handlers. Two types of Handlers exist. One supports file uploads while the other does not.
   * 
   * @author iberatkaya
   */

  private apiCalls(postReq: Array<APIHandler>) {
    postReq.forEach(reqHandler => {
      this.app.post(reqHandler.apiURL, reqHandler.requestHandler);
    })
  }

  /**
   * Function to connect each supplied middleware.
   * 
   * @author iberatkaya
   */

  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare)
    })
  }

  /**
   * Configuration for React.
   * 
   * @author iberatkaya
   */

  private routes(controllers: Controllers) {
    this.app.get('*', controllers.React.router);   //Route for react
  }

  /**
   * Configuration for React.
   * 
   * @author iberatkaya
   */

  private assets() {
    this.app.use(express.static(path.join(__dirname, 'client/build')));
  }

  /**
   * Function to start the server.
   * 
   * @author iberatkaya
   */

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`)
    })
  }
}

export default App