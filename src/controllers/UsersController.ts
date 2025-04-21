import { Request, Response } from "express";
import { RequestWithQuery } from "../types/request-types";
import { QueryModel } from "../models/global/QueryModel";
import { SortOrder } from "mongoose";
import { ObjectId } from "mongodb";
import { UsersService } from "../application/users-service";
import { UsersQueryRepository } from "../infrastructure/repositories/query-repos/users-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository
  ) {}
  async createUser(req: Request, res: Response) {
    const newUser = await this.usersService.createUser(
      req.body.login,
      req.body.password,
      req.body.email
    );
    res.status(201).json(newUser);
  }

  async getUsers(req: RequestWithQuery<QueryModel>, res: Response) {
    const foundUsers = await this.usersQueryRepository.findUsers(
      Number(req.query.pageNumber) || 1,
      Number(req.query.pageSize) || 10,
      req.query.sortBy,
      req.query.sortDirection as SortOrder,
      req.query.searchLoginTerm,
      req.query.searchEmailTerm
    );
    res.json(foundUsers);
  }

  async deleteUser(req: Request, res: Response) {
    const isDeleted = await this.usersService.deleteUser(
      new ObjectId(req.params.id)
    );
    if (isDeleted) {
      res.sendStatus(204);
    }
  }

  async deleteUsers(req: Request, res: Response) {
    const isDeleted = await this.usersService.deleteAll();
    if (isDeleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
}