import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard, Roles, Permissions } from 'src/security/custom-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Permissions('create:items')
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Permissions('findAll:items')
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  @Permissions('read:items')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
