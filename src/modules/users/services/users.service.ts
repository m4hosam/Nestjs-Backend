import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../services/generic/generic.service';
import { User } from '../../../entities/users/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRepository } from '../../../repositories/users/user.repository';
import { plainToInstance } from 'class-transformer';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends GenericService<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto
> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository, 'User');
  }

  toResponseDto(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  toEntity(dto: CreateUserDto | UpdateUserDto): Partial<User> {
    const entity: Partial<User> = {
      username: dto.username,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roles: dto.roles,
    };

    if (dto.password) {
      entity.password = dto.password;
    }

    return entity;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findEntityById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(dto: CreateUserDto, userId?: number): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new BusinessValidationException('USERNAME_ALREADY_EXISTS');
    }

    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new BusinessValidationException('EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userDto = { ...dto, password: hashedPassword };

    return super.create(userDto, userId);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(userId, { refreshToken } as any);
  }
}
