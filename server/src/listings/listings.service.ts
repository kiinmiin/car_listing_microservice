import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

export type ListingsQuery = {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  q?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc';
};

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService) {}

  private buildWhere(query: ListingsQuery): any {
    const where: any = {};
    if (query.make) where.make = { equals: query.make, mode: 'insensitive' };
    if (query.model) where.model = { equals: query.model, mode: 'insensitive' };
    if (query.featured !== undefined) where.featured = query.featured;

    if (query.yearMin || query.yearMax) {
      where.year = {};
      if (query.yearMin) where.year.gte = query.yearMin;
      if (query.yearMax) where.year.lte = query.yearMax;
    }
    if (query.priceMin || query.priceMax) {
      where.price = {};
      if (query.priceMin) where.price.gte = query.priceMin;
      if (query.priceMax) where.price.lte = query.priceMax;
    }
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private buildOrderBy(sort?: ListingsQuery['sort']): any {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' };
      case 'price_desc':
        return { price: 'desc' };
      case 'mileage_asc':
        return { mileage: 'asc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }

  async listAll(query: ListingsQuery = {}): Promise<{ items: any[]; total: number; page: number; limit: number }>
  {
    const page = Math.max(1, Number(query.page) || 1);
    const rawLimit = Number(query.limit) || 20;
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query.sort);

    const [items, total] = await Promise.all([
      this.prisma.listing.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.listing.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  getById(id: string): Promise<any | null> {
    return this.prisma.listing.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    const { userId, ...rest } = data ?? {};
    if (!userId) throw new BadRequestException('userId is required');
    return this.prisma.listing.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    const exists = await this.prisma.listing.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Listing not found');
    const { userId, ...rest } = data ?? {};
    return this.prisma.listing.update({ where: { id }, data: rest });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.listing.delete({ where: { id } });
  }

  async getUploadUrl(listingId: string, contentType: string): Promise<{ url: string; key: string }>
  {
    const key = `listings/${listingId}/${Date.now()}`;
    return this.storage.createPresignedPutUrl(key, contentType);
  }

  async attachImage(listingId: string, key: string): Promise<any> {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');
    const images = Array.isArray(listing.images) ? listing.images : [];
    if (!images.includes(key)) images.push(key);
    return this.prisma.listing.update({ where: { id: listingId }, data: { images } });
  }
}
