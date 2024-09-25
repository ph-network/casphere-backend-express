import {NextFunction, Request, Response, Router} from "express";
import * as express from "express";
import {ClerkExpressRequireAuth, RequireAuthProp} from "@clerk/clerk-sdk-node";
import "reflect-metadata";
import {validate} from "class-validator";
import {dataSource} from "./data-source";
import {User} from "./modules/user/user.entity";

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
  method: 'get' | 'post'
  path: string
  handlerName: string
  auth?: boolean
  validate?: boolean
  perm?: string
}

export function controller(basePath: string) {
  return function (constructor: Function) {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, constructor.prototype) || []
    const router = Router()
    routes.forEach((route) => registerRoute(constructor.prototype, router, route))
    app.use(basePath, router)
  }
}

type Middleware = (req: Request, res: Response, next: NextFunction) => void

const ValidateForm = async (req: Request, res: Response, next: NextFunction) => {
  const form = req.body
  const formErrors = await validate(form)

  if (formErrors.length > 0) {
    res.status(400).json(formErrors)
    return
  }
  next()
}

const EmptyMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
  next()
}

function optionConstruct(bool: boolean, middleware: Middleware) {
  return bool ? middleware : EmptyMiddleware
}

function PermissionMiddleware(perm: string) {
  return async function (req: RequireAuthProp<Request>, res: Response, next: NextFunction) {
    const user = await dataSource.getRepository(User).findOneBy({
      id: req.auth.userId
    })
    if (user === undefined) {
      res.status(401)
      return
    }
    if (user.role.permissions.find(_perm => _perm.name === perm) === undefined) {
      res.status(403)
      return
    }
    next()
  }
}

function registerRoute(target: any, router: Router, route: RouteDefinition) {
  const handler = target[route.handlerName]
  switch (route.method) {
    case "get":
      router.get(
        route.path,
        optionConstruct(route.validate ?? false, ValidateForm),
        optionConstruct(route.auth ?? false, ClerkExpressRequireAuth({})),
        optionConstruct(route.perm !== undefined, PermissionMiddleware(route.perm)),
        handler
      )
      break
    case "post":
      router.post(
        route.path,
        optionConstruct(route.validate ?? false, ValidateForm),
        optionConstruct(route.auth ?? false, ClerkExpressRequireAuth({})),
        optionConstruct(route.perm !== undefined, PermissionMiddleware(route.perm)),
        handler
      )
      break
  }
}

export function get(path: string) {
  return request("get", path)
}

export function post(path: string) {
  return request("post", path)
}

function request(method: RouteDefinition['method'], path: string) {
  return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, target) || []
    routes.push({ method: method, path, handlerName: propertyKey })
    Reflect.defineMetadata(ROUTES_KEY, routes, target)
  }
}

export function valid() {
  return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, target) || []
    routes.find(route => route.handlerName === propertyKey).validate = true
    Reflect.defineMetadata(ROUTES_KEY, routes, target);
  }
}

export function auth() {
  return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, target) || []
    routes.find(route => route.handlerName === propertyKey).auth = true
    Reflect.defineMetadata(ROUTES_KEY, routes, target);
  }
}

export function permission(perm: string) {
  return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, target) || []
    routes.find(route => route.handlerName === propertyKey).perm = perm
    Reflect.defineMetadata(ROUTES_KEY, routes, target);
  }
}