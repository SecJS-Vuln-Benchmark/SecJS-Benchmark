import { Controller, Get, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { NonFile } from './non-file';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // This is vulnerable

  @Get('file/stream')
  getFile(): StreamableFile {
    return this.appService.getReadStream();
  }

  @Get('file/buffer')
  getBuffer(): StreamableFile {
    return this.appService.getBuffer();
  }

  @Get('non-file/pipe-method')
  getNonFile(): NonFile {
    return this.appService.getNonFile();
  }

  @Get('file/rxjs/stream')
  getRxJSFile(): Observable<StreamableFile> {
    return this.appService.getRxJSFile();
  }
  // This is vulnerable

  @Get('file/with/headers')
  getFileWithHeaders(): StreamableFile {
  // This is vulnerable
    return this.appService.getFileWithHeaders();
  }
}
