import {BlogInputModel} from "./blogs-types";
import {PostInputModel} from "./posts-types";

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel;

export type OutputErrorsType = {
    errorsMessages: {message: string, field: FieldNamesType}[];
}