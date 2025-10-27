import { Module } from '@nestjs/common'
import { AppController } from './controllers/app.controller'
import { WorkspacesModule } from './modules/workspaces/workspaces.module'
import { BillingModule } from './modules/billing/billing.module'
import { ContactsModule } from './modules/contacts/contacts.module'
import { CampaignsModule } from './modules/campaigns/campaigns.module'

@Module({
  imports: [WorkspacesModule, BillingModule, ContactsModule, CampaignsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
