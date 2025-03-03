import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BillingHistoryModule } from './billing_history/billing_history.module';
import { CategoryModule } from './category/category.module';
import { GenresModule } from './genres/genres.module';
import { GenresImagesModule } from './genres_images/genres_images.module';
import { LanguageModule } from './language/language.module';
import { PaymentMethodModule } from './payment_method/payment_method.module';
import { ProfileModule } from './profile/profile.module';
import { SearchHistoryModule } from './search_history/search_history.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscriptionPlansModule } from './subscription_plans/subscription_plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:".env",isGlobal: true}),
    UsersModule,
    PrismaModule,
    AuthModule,
    AdminModule,
    BillingHistoryModule,
    CategoryModule,
    GenresModule,
    GenresImagesModule,
    LanguageModule,
    PaymentMethodModule,
    ProfileModule,
    SearchHistoryModule,
    SubscriptionModule,
    SubscriptionPlansModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
