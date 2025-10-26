import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create subscription plans
  const freePlan = await prisma.plan.upsert({
    where: { id: 'plan_free' },
    update: {},
    create: {
      id: 'plan_free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      interval: 'month',
      emailsPerMonth: 500,
      maxSubscribers: 100,
      maxCampaigns: 5,
      hasAutomation: false,
      hasAIFeatures: false,
      hasAdvancedAnalytics: false,
      hasTeamAccess: false,
      maxTeamMembers: 1,
      sortOrder: 1,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { id: 'plan_pro' },
    update: {},
    create: {
      id: 'plan_pro',
      name: 'Pro',
      description: 'For growing businesses',
      price: 49.99,
      interval: 'month',
      stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
      emailsPerMonth: 10000,
      maxSubscribers: 2500,
      maxCampaigns: 50,
      hasAutomation: true,
      hasAIFeatures: true,
      hasAdvancedAnalytics: true,
      hasTeamAccess: false,
      maxTeamMembers: 1,
      sortOrder: 2,
    },
  });

  const businessPlan = await prisma.plan.upsert({
    where: { id: 'plan_business' },
    update: {},
    create: {
      id: 'plan_business',
      name: 'Business',
      description: 'For enterprise teams',
      price: 199.99,
      interval: 'month',
      stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID,
      emailsPerMonth: 100000,
      maxSubscribers: 25000,
      maxCampaigns: 500,
      hasAutomation: true,
      hasAIFeatures: true,
      hasAdvancedAnalytics: true,
      hasTeamAccess: true,
      maxTeamMembers: 10,
      sortOrder: 3,
    },
  });

  console.log('✅ Created subscription plans');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      planId: businessPlan.id,
      subscriptionStatus: 'ACTIVE',
    },
  });

  console.log('✅ Created admin user');

  // Create demo user
  const demoPassword = await bcrypt.hash('Demo123!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: demoPassword,
      role: 'USER',
      emailVerified: new Date(),
      planId: proPlan.id,
      subscriptionStatus: 'ACTIVE',
    },
  });

  console.log('✅ Created demo user');

  // Create sample audience for demo user
  const audience = await prisma.audience.create({
    data: {
      userId: demoUser.id,
      name: 'Newsletter Subscribers',
      description: 'Main email list for newsletter',
      subscribersCount: 3,
    },
  });

  // Create sample subscribers
  await prisma.subscriber.createMany({
    data: [
      {
        audienceId: audience.id,
        email: 'subscriber1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'ACTIVE',
      },
      {
        audienceId: audience.id,
        email: 'subscriber2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        status: 'ACTIVE',
      },
      {
        audienceId: audience.id,
        email: 'subscriber3@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        status: 'ACTIVE',
      },
    ],
  });

  console.log('✅ Created sample audience and subscribers');

  // Create sample templates
  await prisma.template.createMany({
    data: [
      {
        name: 'Welcome Email',
        description: 'Warm welcome email for new subscribers',
        category: 'welcome',
        tags: ['welcome', 'onboarding'],
        isPublic: true,
        isPremium: false,
      },
      {
        name: 'Product Launch',
        description: 'Announce new product or feature',
        category: 'announcement',
        tags: ['product', 'launch', 'announcement'],
        isPublic: true,
        isPremium: false,
      },
      {
        name: 'Newsletter Template',
        description: 'Weekly newsletter template',
        category: 'newsletter',
        tags: ['newsletter', 'update'],
        isPublic: true,
        isPremium: false,
      },
    ],
  });

  console.log('✅ Created sample templates');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
