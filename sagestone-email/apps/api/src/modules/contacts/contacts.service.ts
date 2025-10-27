import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Contact, Prisma } from '@prisma/client'

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, data: Prisma.ContactCreateInput): Promise<Contact> {
    return this.prisma.contact.create({
      data: {
        ...data,
        workspace: { connect: { id: workspaceId } }
      }
    })
  }

  async findAll(workspaceId: string, page = 1, limit = 50): Promise<{ contacts: Contact[]; total: number }> {
    const skip = (page - 1) * limit
    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where: { workspaceId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          attributes: true
        }
      }),
      this.prisma.contact.count({ where: { workspaceId } })
    ])
    return { contacts, total }
  }

  async findOne(workspaceId: string, id: string): Promise<Contact> {
    const contact = await this.prisma.contact.findFirst({
      where: { id, workspaceId },
      include: { attributes: true }
    })
    if (!contact) throw new NotFoundException('Contact not found')
    return contact
  }

  async update(workspaceId: string, id: string, data: Prisma.ContactUpdateInput): Promise<Contact> {
    await this.findOne(workspaceId, id)
    return this.prisma.contact.update({
      where: { id },
      data
    })
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.findOne(workspaceId, id)
    await this.prisma.contact.delete({ where: { id } })
  }

  async bulkImport(workspaceId: string, contacts: Array<{ email: string; [key: string]: any }>): Promise<{ imported: number; skipped: number }> {
    let imported = 0
    let skipped = 0

    for (const contactData of contacts) {
      try {
        const existing = await this.prisma.contact.findFirst({
          where: { email: contactData.email, workspaceId }
        })
        
        if (existing) {
          skipped++
          continue
        }

        await this.prisma.contact.create({
          data: {
            email: contactData.email,
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            workspace: { connect: { id: workspaceId } }
          }
        })
        imported++
      } catch (error) {
        skipped++
      }
    }

    return { imported, skipped }
  }

  async getStats(workspaceId: string): Promise<{
    total: number
    subscribed: number
    unsubscribed: number
    bounced: number
  }> {
    const [total, subscribed, unsubscribed, bounced] = await Promise.all([
      this.prisma.contact.count({ where: { workspaceId } }),
      this.prisma.contact.count({ where: { workspaceId, status: 'SUBSCRIBED' } }),
      this.prisma.contact.count({ where: { workspaceId, status: 'UNSUBSCRIBED' } }),
      this.prisma.contact.count({ where: { workspaceId, status: 'BOUNCED' } })
    ])
    return { total, subscribed, unsubscribed, bounced }
  }
}
