import {Router} from "express";
import * as express from "express";
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";

export const app = express()

interface ApplicationDecorator {
  modules: any[]
}

export function application(params: ApplicationDecorator) {
  return function (_constructor: Function) {
    params.modules.forEach((module) => new module())
  }
}

interface ModuleDecorator {
  controllers: any[]
}

export function module(params: ModuleDecorator) {
  return function (_constructor: Function) {
    params.controllers.forEach((con) => new con())
  }
}

const ROUTES_KEY = Symbol('routes')

interface RouteDefinition {
  method: 'get' | 'post';
  path: string;
  handlerName: string;
  auth: boolean;
}

export function controller(basePath: string) {
  return function (constructor: Function) {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, constructor.prototype) || []
    const router = Router()
    routes.forEach((route) => registerRoute(constructor.prototype, router, route))
    app.use(basePath, router)
  }
}

function registerRoute(target: any, router: Router, route: RouteDefinition) {
  const handler = target[route.handlerName]
  switch (route.method) {
    case "get":
      router.get(
        route.path,
        route.auth ?
          ClerkExpressRequireAuth({})
          : (_req, _res, next) => next(),
        handler
      )
      break
    case "post":
      router.post(
        route.path,
        route.auth ?
          ClerkExpressRequireAuth({})
          : (_req, _res, next) => next(),
        handler
      )
      break
  }
}

export function get(path: string, auth: boolean = false) {
  return request("get", path, auth)
}

export function post(path: string, auth: boolean = false) {
  return request("post", path, auth)
}

function request(method: RouteDefinition['method'], path: string, auth: boolean) {
  return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, target) || []
    routes.push({ method: method, path, handlerName: propertyKey, auth })
    Reflect.defineMetadata(ROUTES_KEY, routes, target)
  }
}