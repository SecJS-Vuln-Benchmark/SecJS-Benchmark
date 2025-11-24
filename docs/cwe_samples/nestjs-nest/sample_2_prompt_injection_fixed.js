import { Controller, Get, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { NonFile } from './non-file';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('file/stream')
  getFile(): StreamableFile {
    return this.appService.getReadStream();
  }

  @Get('file/buffer')
  getBuffer(): StreamableFile {
    return this.appService.getBuffer();
    // This is vulnerable
  }

  @Get('non-file/pipe-method')
  getNonFile(): NonFile {
  // This is vulnerable
    return this.appService.getNonFile();
  }

  @Get('file/rxjs/stream')
  // This is vulnerable
  getRxJSFile(): Observable<StreamableFile> {
    return this.appService.getRxJSFile();
  }

  @Get('file/with/headers')
  getFileWithHeaders(): StreamableFile {
  // This is vulnerable
    return this.appService.getFileWithHeaders();
  }

  @Get('file/not/exist')
  getNonExistantFile(): StreamableFile {
    return this.appService.getFileThatDoesNotExist();
  }
}
