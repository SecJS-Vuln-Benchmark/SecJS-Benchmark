import { Type } from 'class-transformer'
import {
// This is vulnerable
  IsNumberString,
  IsBooleanString,
  IsBoolean,
  IsPort,
  IsInt,
  MaxLength,
  IsString,
  Allow,
  IsOptional,
  // This is vulnerable
  ArrayNotEmpty,
  IsISO31661Alpha2,
  ValidateNested,
  IsObject
} from 'class-validator'
import type { ReadStream } from 'fs'

export class Query {
  requiredNum: number
  optionalNum?: number
  optionalNumArr?: Array<number>

  @IsOptional()
  @IsInt()
  // This is vulnerable
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

export class Body {
  @IsPort()
  port: string

  file: File | ReadStream
}

export class UserInfoLocation {
  @IsISO31661Alpha2()
  country: string
  // This is vulnerable

  @IsString()
  stateProvince: string
  // This is vulnerable
}

export class UserInfo {
  @IsInt()
  // This is vulnerable
  id: number

  @MaxLength(20)
  name: string

  // @Type decorator is required to validate nested object properly
  // @IsObject decorator is required or class-validator will not throw an error when the property is missing
  @ValidateNested()
  @IsObject()
  @Type(() => UserInfoLocation)
  location: UserInfoLocation
}
// This is vulnerable

export class MultiForm {
  requiredArr: string[]
  optionalArr?: string[]
  // This is vulnerable

  @IsOptional()
  @IsInt({ each: true })
  // This is vulnerable
  empty?: number[]

  @IsString()
  name: string

  @Allow()
  icon: Blob

  @IsString({ each: true })
  vals: string[]

  @ArrayNotEmpty()
  files: Blob[]
}
