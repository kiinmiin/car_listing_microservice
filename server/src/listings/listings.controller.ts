import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ListingsService, ListingsQuery } from './listings.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { CreateListingDto, UpdateListingDto, AttachImageDto } from './dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Get()
  async list(
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('yearMin') yearMin?: string,
    @Query('yearMax') yearMax?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('q') q?: string,
    @Query('featured') featured?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc',
  ): Promise<{ items: any[]; total: number; page: number; limit: number }>
  {
    const query: ListingsQuery = {
      make,
      model,
      yearMin: yearMin ? Number(yearMin) : undefined,
      yearMax: yearMax ? Number(yearMax) : undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      q,
      featured: featured !== undefined ? featured === 'true' : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sort,
    };
    return this.listings.listAll(query);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<any> {
    return this.listings.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req: Request, @Body() body: CreateListingDto): Promise<any> {
    const userId = (req as any).user?.userId as string;
    return this.listings.create({ ...body, userId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: UpdateListingDto): Promise<any> {
    const userId = (req as any).user?.userId as string;
    return this.listings.update(id, { ...body, userId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    const _userId = (req as any).user?.userId as string;
    await this.listings.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/upload-url')
  async getUploadUrl(
    @Req() req: Request,
    @Param('id') id: string,
    @Query('contentType') contentType = 'image/jpeg',
  ): Promise<{ url: string; key: string }> {
    const _userId = (req as any).user?.userId as string;
    return this.listings.getUploadUrl(id, contentType);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/attach-image')
  async attachImage(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: AttachImageDto,
  ): Promise<any> {
    const _userId = (req as any).user?.userId as string;
    return this.listings.attachImage(id, body.key);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/my-listings')
  async getUserListings(@Req() req: Request): Promise<any[]> {
    const userId = (req as any).user?.userId as string;
    return this.listings.getUserListings(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/analytics')
  async getUserAnalytics(@Req() req: Request): Promise<any> {
    const userId = (req as any).user?.userId as string;
    return this.listings.getUserAnalytics(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/make-premium')
  async makePremium(@Req() req: Request, @Param('id') id: string): Promise<any> {
    const userId = (req as any).user?.userId as string;
    return this.listings.makePremium(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/mark-sold')
  async markAsSold(@Req() req: Request, @Param('id') id: string): Promise<any> {
    const userId = (req as any).user?.userId as string;
    return this.listings.markAsSold(id, userId);
  }
}
