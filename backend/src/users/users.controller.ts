import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Scoped to the logged-in user only — ignores any :id in the URL for writes
  @Patch('me')
  updateOwn(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const payload = (req as any).user;
    return this.usersService.update(payload.sub, dto);
  }

  @Delete('me')
  removeOwn(@Req() req: Request) {
    const payload = (req as any).user;
    return this.usersService.remove(payload.sub);
  }
}
