import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/subscribers - List subscribers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const audienceId = searchParams.get('audienceId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');

    if (!audienceId) {
      return NextResponse.json(
        { error: 'audienceId is required' },
        { status: 400 }
      );
    }

    // Verify user owns this audience
    const audience = await prisma.audience.findFirst({
      where: {
        id: audienceId,
        userId: session.user.id,
      },
    });

    if (!audience) {
      return NextResponse.json(
        { error: 'Audience not found' },
        { status: 404 }
      );
    }

    const where: any = { audienceId };
    if (status) {
      where.status = status;
    }

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscriber.count({ where }),
    ]);

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/subscribers - Add a new subscriber
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      audienceId,
      email,
      firstName,
      lastName,
      phone,
      customFields,
      tags,
    } = body;

    if (!audienceId || !email) {
      return NextResponse.json(
        { error: 'audienceId and email are required' },
        { status: 400 }
      );
    }

    // Verify user owns this audience
    const audience = await prisma.audience.findFirst({
      where: {
        id: audienceId,
        userId: session.user.id,
      },
    });

    if (!audience) {
      return NextResponse.json(
        { error: 'Audience not found' },
        { status: 404 }
      );
    }

    // Check user's plan limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscriberCount = user.subscribersCount;

    if (user.plan && subscriberCount >= user.plan.maxSubscribers) {
      return NextResponse.json(
        { error: 'Subscriber limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Check if subscriber already exists
    const existing = await prisma.subscriber.findFirst({
      where: {
        audienceId,
        email,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Subscriber already exists in this audience' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        audienceId,
        email,
        firstName,
        lastName,
        phone,
        customFields,
        tags: tags || [],
        status: 'ACTIVE',
      },
    });

    // Update counts
    await Promise.all([
      prisma.audience.update({
        where: { id: audienceId },
        data: { subscribersCount: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { subscribersCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
