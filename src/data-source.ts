import "reflect-metadata"
import {DataSource, Logger, QueryRunner} from "typeorm"
import {logger} from "./utils/logger";

export class WinstonTypeormLogger implements Logger {
  log(level: "log" | "info" | "warn", message: any, _queryRunner?: QueryRunner): any {
    switch (level) {
      case "info":
      case "log":
        logger.info(message)
        break
      case "warn":
        logger.warn(message)
    }
  }

  logMigration(message: string, _queryRunner?: QueryRunner): any {
    logger.info(message)
  }

  logQuery(query: string, _parameters?: any[], _queryRunner?: QueryRunner): any {
    logger.debug(query)
  }

  logQueryError(error: string | Error, query: string, _parameters?: any[], _queryRunner?: QueryRunner): any {
    logger.error(`Error: ${error} when performing query: ${query}`)
  }

  logQuerySlow(_time: number, query: string, _parameters?: any[], _queryRunner?: QueryRunner): any {
    logger.debug(query)
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner): any {
    logger.debug(message)
  }
}

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT as unknown as number,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: true,
  logger: new WinstonTypeormLogger(),
  entities: ["src/modules/**/*.entity.ts"],
  migrations: [],
  subscribers: [],
})