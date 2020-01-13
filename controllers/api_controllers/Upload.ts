import { Request, Response } from 'express'
import { APIHandler, APIResponse } from '../../interfaces';
import { predict } from '../../ml';

class Upload implements APIHandler {
   public requestHandler: (req: Request, res: Response) => void;
   public apiURL: string;

   constructor() {
      this.requestHandler = (req: Request, res: Response) => { };
      this.apiURL = '';
      this.init();
   }

   private init() {
      this.requestHandler = this.index;
      this.apiURL = '/api/upload';
   }


   index = async (req: Request, res: Response) => {
      try {
         let data = await predict(req.body.image) as APIResponse;
         console.log(data);
         res.json({ data, status: '1' });
      } catch (e) {
         console.log(e);
         console.log('error');
         res.json({ data: { Bulbasaur: '0', Charmander: '0', Squirtle: '0', Mewtwo: '0', Pikachu: '0', status: '0'} as APIResponse });
      }
   }
}


export default Upload;