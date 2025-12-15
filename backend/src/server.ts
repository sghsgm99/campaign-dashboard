import app from "./app";
import { env } from "./config/env";
import { checkDatabaseConnection } from "./database/health";

async function bootstrap() {
  await checkDatabaseConnection();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
  });
}

bootstrap();
