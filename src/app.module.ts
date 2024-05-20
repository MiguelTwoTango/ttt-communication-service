import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeetModule } from './meet/meet.module';
import { MeetController } from './meet/meet.controller';
import { MeetService } from './meet/meet.service';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({

        // projectId: configService.get<string>('PROJECT_ID'),
        // databaseId: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    MeetModule,
    MailModule],
  controllers: [AppController, MeetController],
  providers: [AppService, MeetService],
})
export class AppModule {}
