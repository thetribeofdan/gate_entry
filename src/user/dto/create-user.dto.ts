// src/user/dto/create-user.dto.ts
import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsEmail,
  MinLength,
  IsNumber,
  IsStrongPassword,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isHouseIdRequired', async: false })
class IsHouseIdRequiredConstraint implements ValidatorConstraintInterface {
  validate(house_id: any, args: ValidationArguments) {
    const role_id = (args.object as any).role_id;
    // If role is occupant (3), house_id must be present and a number
    if (role_id === 3) {
      return typeof house_id === 'number' && !isNaN(house_id);
    }
    return true; // otherwise optional
  }

  defaultMessage(args: ValidationArguments) {
    return 'house_id is required when role_id is 3 (occupant)';
  }
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber('NG') // You can adjust region as needed
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  // @IsStrongPassword()
  password: string;

  @IsNumber()
  role_id: number;

  @Validate(IsHouseIdRequiredConstraint)
  house_id?: number;
}
