// import { IsBoolean, IsOptional, IsString } from 'class-validator';

// export class UpdateMeDto {
//   @IsOptional() @IsString() name?: string;
//   @IsOptional() @IsBoolean() isActive?: boolean;
// }



import {
  IsBoolean,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
