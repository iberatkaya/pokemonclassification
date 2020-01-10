import { Request, Response } from 'express'
import { APIHandler, APIResponse } from '../../interfaces';
import { predict } from '../../ml';
const image2base64 = require('image-to-base64');

class SendLink implements APIHandler {
   public requestHandler: (req: Request, res: Response) => void;
   public apiURL: string;

   constructor() {
      this.requestHandler = (req: Request, res: Response) => { };
      this.apiURL = '';
      this.init();
   }

   private init() {
      this.requestHandler = this.index;
      this.apiURL = '/api/sendlink';
   }


   index = async (req: Request, res: Response) => {
      try {
         let url = req.body.url;
         let image = await image2base64(url);
         let data = await predict(image) as APIResponse;
         res.json({ data, status: '1' });
      } catch (e) {
         console.log(e);
         console.log('error');
         res.json({ data: { Bulbasaur: '0', Charmander: '0', Squirtle: '0', status: '0'} as APIResponse });
      }
   }
}


export default SendLink;