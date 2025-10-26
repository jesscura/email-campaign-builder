import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/campaigns - List all campaigns for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const where: any = { userId: session.user.id };
    if (status) {
      where.status = status;
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          audience: {
            select: { name: true },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      subject,
      preheader,
      fromName,
      fromEmail,
      replyTo,
      htmlContent,
      mjmlContent,
      jsonContent,
      audienceId,
      segmentIds,
      isABTest,
      abTestVariants,
    } = body;

    if (!name || !subject || !fromName || !fromEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    const campaignCount = await prisma.campaign.count({
      where: { userId: session.user.id },
    });

    if (user.plan && campaignCount >= user.plan.maxCampaigns) {
      return NextResponse.json(
        { error: 'Campaign limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        userId: session.user.id,
        name,
        subject,
        preheader,
        fromName,
        fromEmail,
        replyTo,
        htmlContent,
        mjmlContent,
        jsonContent,
        audienceId,
        segmentIds: segmentIds || [],
        isABTest: isABTest || false,
        abTestVariants: abTestVariants || null,
        status: 'DRAFT',
      },
    });

    // Update user's campaign count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { campaignsCount: { increment: 1 } },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
