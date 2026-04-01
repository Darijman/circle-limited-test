import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>("CLIENT_URL") || "http://localhost:5173",
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((err) => Object.values(err.constraints ?? {}));
        return new BadRequestException(messages);
      },
    }),
  );

  const PORT = configService.get<number>("PORT") || 9000;
  await app.listen(PORT);

  logger.debug(`🚀 Server is running on http://localhost:${PORT}`);
}
bootstrap();
