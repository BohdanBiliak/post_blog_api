import {Request, Response} from 'express'
import {postsRepository} from '../postsRepository'

export const delPostController = (req: Request<{id: string}>, res: Response) => {
    const deleteFlag = postsRepository.delete(req.params.id);
    if(deleteFlag){
        res.status(204)
    }else {
        res.status(404)
    }
}