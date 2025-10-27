import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@sagestone.dev' },
    create: { email: 'demo@sagestone.dev', name: 'Demo User', password: crypto.randomBytes(16).toString('hex') },
    update: {}
  })

  const ws = await prisma.workspace.create({ data: { name: "Demo Workspace" } })
  await prisma.workspaceMember.create({ data: { userId: user.id, workspaceId: ws.id, role: 'OWNER' } })

  const plan = await prisma.plan.create({
    data: {
      name: 'Starter',
      featuresJson: { ai: true, automations: true },
      usageCapsJson: { contacts: 5000, emailsPerMonth: 10000 },
      priceMonthly: 2900,
      priceYearly: 29000
    }
  })

  await prisma.subscription.create({
    data: { workspaceId: ws.id, planId: plan.id, driver: 'stripe', externalIds: {}, status: 'ACTIVE' }
  })

  // Seed a couple of contacts
  for (const email of ['alice@example.com', 'bob@example.com']) {
    await prisma.contact.create({ data: { workspaceId: ws.id, email } })
  }

  console.log('Seed complete:', { user: user.email, workspace: ws.name })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
