import {NextFunction, Request, Response} from "express";
import {SETTINGS} from "../settings";

export const fromBase64toUTF8 = (code:string) =>{
    const buff = Buffer.from(code, 'base64');
    const decodeAuth =   buff.toString('utf8');
    return decodeAuth
}

export const fromUTF8TOBase64 = (code:string) =>{
   const buff2 = Buffer.from(code, 'utf8');
   const codeAuth = buff2.toString('base64');
  return codeAuth
}

export const adminMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const auth = req.headers['authorization'] as string;
    if (!auth) {
         res.status(401).json({});
        return
    }
    if(auth.slice(0,6) !== 'Basic'){
        res.status(401).json({});
        return
    }
    const codedAuth = fromUTF8TOBase64(SETTINGS.ADMIN)
    if(auth.slice(6) !== codedAuth){

        res.status(401).json({});
        return
    }
    next()

}