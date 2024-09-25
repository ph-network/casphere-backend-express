import {NextFunction, Request, Response, Router} from "express";
import * as express from "express";
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";
import "reflect-metadata";
import {validate} from "class-validator";

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

interface RouteOptions {
  auth?: boolean
  validate?: boolean
}

interface RouteDefinition {
  method: 'get' | 'post'
  path: string
  handlerName: string
  options: RouteOptions
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

const ValidateForm = async (req: Request, res: Response, _next: NextFunction) => {
  const form = req.body
  const formErrors = await validate(form)

  if (formErrors.length > 0) {
    res.status(400).json(formErrors)
    return
  }
}

const EmptyMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
  next()
}

function optionConstruct(bool: boolean, middleware: Middleware) {
  return bool ? middleware : EmptyMiddleware
}

function registerRoute(target: any, router: Router, route: RouteDefinition) {
  const handler = target[route.handlerName]
  switch (route.method) {
    case "get":
      router.get(
        route.path,
        optionConstruct(route.options.validate ?? false, ValidateForm),
        optionConstruct(route.options.auth ?? false, ClerkExpressRequireAuth({})),
        handler
      )
      break
    case "post":
      router.post(
        route.path,
        optionConstruct(route.options.validate ?? false, ValidateForm),
        optionConstruct(route.options.auth ?? false, ClerkExpressRequireAuth({})),
        handler
      )
      break
  }
}

export function get(path: string, options: RouteOptions = { auth: false, validate: false }) {
  return request("get", path, options)
}

export function post(path: string, options: RouteOptions = { auth: false, validate: false }) {
  return request("post", path, options)
}

function request(method: RouteDefinition['method'], path: string, options: RouteOptions) {
  return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, target) || []
    routes.push({ method: method, path, handlerName: propertyKey, options })
    Reflect.defineMetadata(ROUTES_KEY, routes, target)
  }
}