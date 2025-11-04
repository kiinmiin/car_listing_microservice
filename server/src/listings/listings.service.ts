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
  fuel?: string;
  transmission?: string;
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
    if (query.fuel) where.fuel = { equals: query.fuel, mode: 'insensitive' };
    if (query.transmission) where.transmission = { equals: query.transmission, mode: 'insensitive' };

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
      const searchTerms = query.q.trim().split(/\s+/);
      const searchConditions = [];
      
      // Add full phrase search
      searchConditions.push(
        { title: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
        { make: { contains: query.q, mode: 'insensitive' } },
        { model: { contains: query.q, mode: 'insensitive' } }
      );
      
      // Add individual word searches
      searchTerms.forEach(term => {
        if (term.length > 0) {
          searchConditions.push(
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { make: { contains: term, mode: 'insensitive' } },
            { model: { contains: term, mode: 'insensitive' } }
          );
        }
      });
      
      // Add year search if the query is a number
      const yearMatch = query.q.match(/^\d{4}$/);
      if (yearMatch) {
        searchConditions.push({ year: { equals: Number(query.q) } });
      }
      
      where.OR = searchConditions;
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
      this.prisma.listing.findMany({ 
        where, 
        orderBy, 
        skip, 
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            }
          }
        }
      }),
      this.prisma.listing.count({ where }),
    ]);

    // Transform image URLs to full URLs
    const itemsWithImageUrls = items.map(item => ({
      ...item,
      images: item.images?.map((imageKey: string) => this.storage.getPublicUrl(imageKey)) || []
    }));

    return { items: itemsWithImageUrls, total, page, limit };
  }

  async getById(id: string): Promise<any | null> {
    const listing = await this.prisma.listing.findUnique({ 
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      }
    });

    if (!listing) return null;

    // Transform image URLs to full URLs
    return {
      ...listing,
      images: listing.images?.map((imageKey: string) => this.storage.getPublicUrl(imageKey)) || []
    };
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

  async getUserListings(userId: string): Promise<any[]> {
    const listings = await this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      }
    });

    // Transform image URLs to full URLs
    return listings.map(listing => ({
      ...listing,
      images: listing.images?.map((imageKey: string) => this.storage.getPublicUrl(imageKey)) || []
    }));
  }

  // getUserAnalytics removed per product decision

  async makePremium(listingId: string, userId: string): Promise<any> {
    // First, check if the user has premium credits remaining
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { premiumListingsRemaining: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.premiumListingsRemaining <= 0) {
      throw new Error('No premium listings remaining');
    }

    // Check if the listing exists and belongs to the user
    const listing = await this.prisma.listing.findFirst({
      where: { 
        id: listingId, 
        userId: userId 
      }
    });

    if (!listing) {
      throw new Error('Listing not found or does not belong to user');
    }

    if (listing.featured) {
      throw new Error('Listing is already premium');
    }

    // Use a transaction to update both the listing and user
    return await this.prisma.$transaction(async (tx) => {
      // Update the listing to be featured
      const updatedListing = await tx.listing.update({
        where: { id: listingId },
        data: { featured: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            }
          }
        }
      });

      // Decrement the user's premium listings remaining
      await tx.user.update({
        where: { id: userId },
        data: {
          premiumListingsRemaining: {
            decrement: 1
          }
        }
      });

      return updatedListing;
    });
  }

  async markAsSold(listingId: string, userId: string): Promise<any> {
    // Check if the listing exists and belongs to the user
    const listing = await this.prisma.listing.findFirst({
      where: { 
        id: listingId, 
        userId: userId 
      }
    });

    if (!listing) {
      throw new Error('Listing not found or does not belong to user');
    }

    if (listing.title.includes('SOLD')) {
      throw new Error('Listing is already marked as sold');
    }

    // Update the listing title to include "SOLD" prefix
    return await this.prisma.listing.update({
      where: { id: listingId },
      data: { 
        title: `SOLD - ${listing.title}`,
        featured: false // Remove premium status when sold
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      }
    });
  }
}
