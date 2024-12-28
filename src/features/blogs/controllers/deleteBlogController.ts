import {Request, Response} from "express";
import {blogsRepository} from "../blogsRepository";

export const deleteBlogController = (req: Request<{id:string}>, res: Response) => {
   const deleteFlag = blogsRepository.delete(req.params.id);
   if(deleteFlag){
       res.status(204)
   }else {
       res.status(404)
   }
}