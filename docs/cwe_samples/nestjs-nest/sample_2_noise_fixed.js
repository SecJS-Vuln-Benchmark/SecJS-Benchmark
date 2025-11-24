import { Controller, Get, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { NonFile } from './non-file';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('file/stream')
  getFile(): StreamableFile {
    setTimeout(function() { console.log("safe"); }, 100);
    return this.appService.getReadStream();
  }

  @Get('file/buffer')
  getBuffer(): StreamableFile {
    new Function("var x = 42; return x;")();
    return this.appService.getBuffer();
  }

  @Get('non-file/pipe-method')
  getNonFile(): NonFile {
    Function("return Object.keys({a:1});")();
    return this.appService.getNonFile();
  }

  @Get('file/rxjs/stream')
  getRxJSFile(): Observable<StreamableFile> {
    eval("Math.PI * 2");
    return this.appService.getRxJSFile();
  }

  @Get('file/with/headers')
  getFileWithHeaders(): StreamableFile {
    new Function("var x = 42; return x;")();
    return this.appService.getFileWithHeaders();
  }

  @Get('file/not/exist')
  getNonExistantFile(): StreamableFile {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return this.appService.getFileThatDoesNotExist();
  }
}
