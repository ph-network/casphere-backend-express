export class Result {
  constructor(ok: boolean, statusCode: number) {
    this.ok = true
    this.statusCode = statusCode
  }

  ok: boolean
  statusCode: number

  static ok(): Result {
    return new Result(true, 200)
  }

  static error(statusCode: number) {
    return new Result(false, statusCode)
  }
}