import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import App from './app';
import ReactController from './controllers/ReactController';
import Upload from './controllers/api_controllers/Upload';
import SendLink from './controllers/api_controllers/SendLink';


/**
 * The app that will run once the server is started.
 * 
 * @property {number} port The port number of the server.
 * @property {Object} controllers The controllers of the server. Determines what will be served as a GET Request. Every GET Request will be to the React app. 
 * @property {Array.<ApiHandler>} apiCalls The API Handlers passed to this property will be added to the server's POST Requests.
 * @property {Array.<mongoose.Model<mongoose.Document>>} models The database models passed to this property will be added to the MongoDB Server and will created.
 * @property {Array} middleWares The middlewares may be passed to this property to be used in Express. 
 */

let envPort = process.env.PORT !== undefined ? parseInt(process.env.PORT) : null;

const app = new App({
   port: envPort || 3001,
   controllers: {
      React: new ReactController()
   },
   apiCalls: [
      new Upload(),
      new SendLink()
   ],
   middleWares: [
      bodyParser.json({limit: '50mb'}),
      bodyParser.urlencoded({ limit: '50mb', extended: true }),
      logger('dev'),
      cookieParser()
   ]
})

app.listen();