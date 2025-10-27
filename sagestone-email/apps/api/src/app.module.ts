import { Module } from '@nestjs/common'
import { AppController } from './controllers/app.controller'
import { WorkspacesModule } from './modules/workspaces/workspaces.module'
import { BillingModule } from './modules/billing/billing.module'

@Module({
  imports: [WorkspacesModule, BillingModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
