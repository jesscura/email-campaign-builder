import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cors())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  const port = process.env.PORT || 4000
  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
}

bootstrap()
