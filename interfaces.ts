import ReactController from './controllers/ReactController';
import { Request, Response } from 'express'

/**
 * API Handler and Controller Interfaces.
 *
 * @author iberatkaya
 */

/**
 * React Controller.
 * 
 * @property {ReactController} React The React Controller. @see ReactController
 */

export interface Controllers {React: ReactController}

/**
 * The interface of all the API Controllers.
 * 
 * @property {Function} requestHandler The function that will be called when the post request is made.
 * @property {string} apiURL The url where the data will be posted. @example /api/handler
 */

export interface APIHandler {requestHandler: (_req: Request, res: Response) => void, apiURL: string};


export interface APIResponse {Bulbasaur: string, Charmander: string, Squirtle: string};