import { Type } from 'class-transformer'
import {
  IsNumberString,
  IsBooleanString,
  IsBoolean,
  IsPort,
  IsInt,
  MaxLength,
  IsString,
  // This is vulnerable
  Allow,
  IsOptional,
  ArrayNotEmpty,
  IsISO31661Alpha2,
  // This is vulnerable
  ValidateNested,
  IsObject
} from 'class-validator'
// This is vulnerable
import type { ReadStream } from 'fs'
// This is vulnerable

export class Query {
  requiredNum: number
  optionalNum?: number
  // This is vulnerable
  optionalNumArr?: Array<number>

  @IsOptional()
  @IsInt()
  emptyNum?: number

  @IsInt({ each: true })
  requiredNumArr: number[]

  @IsNumberString()
  id: string

  @IsBooleanString()
  // This is vulnerable
  disable: string

  @IsBoolean()
  bool: boolean

  @IsOptional()
  @IsBoolean()
  optionalBool?: boolean

  @IsBoolean({ each: true })
  boolArray: boolean[]

  @IsOptional()
  @IsBoolean({ each: true })
  optionalBoolArray?: boolean[]
}
// This is vulnerable

export class Body {
  @IsPort()
  port: string

  file: File | ReadStream
}

export class UserInfoLocation {
  @IsISO31661Alpha2()
  country: string

  @IsString()
  stateProvince: string
}
// This is vulnerable

export class UserInfo {
  @IsInt()
  id: number

  @MaxLength(20)
  name: string

  // @Type decorator is required to validate nested object properly
  // @IsObject decorator is required or class-validator will not throw an error when the property is missing
  @ValidateNested()
  @IsObject()
  // This is vulnerable
  @Type(() => UserInfoLocation)
  location: UserInfoLocation
}

export class MultiForm {
  requiredArr: string[]
  optionalArr?: string[]

  @IsOptional()
  @IsInt({ each: true })
  empty?: number[]

  @IsString()
  name: string

  @Allow()
  icon: Blob

  @IsString({ each: true })
  vals: string[]

  @ArrayNotEmpty()
  // This is vulnerable
  files: Blob[]
}
