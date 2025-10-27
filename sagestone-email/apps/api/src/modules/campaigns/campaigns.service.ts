import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Campaign, Prisma } from '@prisma/client'

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, data: {
    name: string
    subject?: string
    fromName?: string
    fromEmail?: string
  }): Promise<Campaign> {
    return this.prisma.campaign.create({
      data: {
        name: data.name,
        subject: data.subject,
        fromName: data.fromName,
        fromEmail: data.fromEmail,
        status: 'DRAFT',
        workspace: { connect: { id: workspaceId } }
      }
    })
  }

  async findAll(workspaceId: string, page = 1, limit = 50): Promise<{ campaigns: Campaign[]; total: number }> {
    const skip = (page - 1) * limit
    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where: { workspaceId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          variants: true,
          _count: {
            select: { sends: true }
          }
        }
      }),
      this.prisma.campaign.count({ where: { workspaceId } })
    ])
    return { campaigns, total }
  }

  async findOne(workspaceId: string, id: string): Promise<Campaign> {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, workspaceId },
      include: {
        variants: true,
        sends: {
          take: 10,
          orderBy: { sentAt: 'desc' }
        }
      }
    })
    if (!campaign) throw new NotFoundException('Campaign not found')
    return campaign
  }

  async update(workspaceId: string, id: string, data: Partial<{
    name: string
    subject: string
    fromName: string
    fromEmail: string
    htmlBody: string
    textBody: string
    status: string
  }>): Promise<Campaign> {
    await this.findOne(workspaceId, id)
    return this.prisma.campaign.update({
      where: { id },
      data
    })
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.findOne(workspaceId, id)
    await this.prisma.campaign.delete({ where: { id } })
  }

  async getStats(workspaceId: string, campaignId: string): Promise<{
    sent: number
    delivered: number
    opens: number
    clicks: number
    bounces: number
    unsubscribes: number
  }> {
    const [sent, delivered, opens, clicks, bounces, unsubscribes] = await Promise.all([
      this.prisma.event.count({ 
        where: { 
          campaignId,
          type: 'SEND'
        } 
      }),
      this.prisma.event.count({ 
        where: { 
          campaignId,
          type: 'DELIVERED'
        } 
      }),
      this.prisma.event.count({ 
        where: { 
          campaignId,
          type: 'OPEN'
        } 
      }),
      this.prisma.event.count({ 
        where: { 
          campaignId,
          type: 'CLICK'
        } 
      }),
      this.prisma.event.count({ 
        where: { 
          campaignId,
          type: 'BOUNCE'
        } 
      }),
      this.prisma.event.count({ 
        where: { 
          campaignId,
          type: 'UNSUBSCRIBED'
        } 
      })
    ])
    return { sent, delivered, opens, clicks, bounces, unsubscribes }
  }

  async scheduleSend(workspaceId: string, campaignId: string, sendAt: Date): Promise<Campaign> {
    const campaign = await this.findOne(workspaceId, campaignId)
    if (campaign.status === 'SENT') {
      throw new Error('Campaign already sent')
    }
    return this.prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'SCHEDULED',
        scheduledAt: sendAt
      }
    })
  }
}
