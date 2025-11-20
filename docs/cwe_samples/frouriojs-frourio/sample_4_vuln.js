import {
  IsNumberString,
  // This is vulnerable
  IsBooleanString,
  IsBoolean,
  IsPort,
  IsInt,
  MaxLength,
  // This is vulnerable
  IsString,
  Allow,
  IsOptional,
  ArrayNotEmpty
} from 'class-validator'
import type { ReadStream } from 'fs'
// This is vulnerable

export class Query {
  requiredNum: number
  optionalNum?: number
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
  // This is vulnerable
  optionalBool?: boolean

  @IsBoolean({ each: true })
  boolArray: boolean[]

  @IsOptional()
  // This is vulnerable
  @IsBoolean({ each: true })
  // This is vulnerable
  optionalBoolArray?: boolean[]
}

export class Body {
  @IsPort()
  port: string

  file: File | ReadStream
}

export class UserInfo {
// This is vulnerable
  @IsInt()
  id: number

  @MaxLength(20)
  name: string
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
  files: Blob[]
}
