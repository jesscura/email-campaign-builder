import { Body, Controller, Post } from '@nestjs/common'
import { createBillingDriver } from '@sagestone/billing'

@Controller('billing')
export class BillingController {
  @Post('checkout')
  async checkout(@Body() body: { workspaceId: string; planId: string; successUrl: string; cancelUrl: string }) {
    const driver = createBillingDriver()
    const res = await driver.createCheckout(body)
    return res
  }

  @Post('portal')
  async portal(@Body() body: { workspaceId: string; returnUrl: string }) {
    const driver = createBillingDriver()
    const res = await driver.portal(body)
    return res
  }
}
