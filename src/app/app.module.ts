import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from '../config/validate-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [validateEnv],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
