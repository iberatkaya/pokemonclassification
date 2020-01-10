import { Request, Response } from 'express'
import path from 'path';

/**
 * The React Controller which will send the React App as a Response to a GET Request.
 * 
 * @author iberatkaya
 */

class ReactController {
   public router: any;

   constructor() {
      this.initRoutes()
   }

   public initRoutes() {
      this.router = this.index;
   }

   index = (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
   }
}

export default ReactController;