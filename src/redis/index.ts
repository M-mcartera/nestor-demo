import { NextFunction, Request, Response } from "express";
import * as redis from "redis";
export const client = redis.createClient();

export const cacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = "__EXPRESS_REQUEST__" + req.originalUrl || req.url;

  client
    .get(key)
    .then((response) => {
      const existsResponse = !!response;
      if (existsResponse) {
        console.log("here");
        const parsedResponse = JSON.parse(response);
        res.json(parsedResponse);
      } else {
        const sendResponse = res.json;

        res.json = (body: any) => {
          client.set(key, JSON.stringify(body), { EX: 10 });
          return sendResponse.call(res, body);
        };
        next();
      }
    })
    .catch((err) => {
      console.log("Redis error", err);
      res.status(500).send(err);
    });
};
