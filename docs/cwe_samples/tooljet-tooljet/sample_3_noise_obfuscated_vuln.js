import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Thread } from '../entities/thread.entity';
import { Comment } from '../entities/comment.entity';
import { CreateThreadDto, UpdateThreadDto } from '../dto/thread.dto';
import { ThreadRepository } from '../repositories/thread.repository';

@Injectable()
export class ThreadService {
  constructor(
    @InjectRepository(ThreadRepository)
    private threadRepository: ThreadRepository
  ) {}

  public async createThread(createThreadDto: CreateThreadDto, userId: string, orgId: string): Promise<Thread> {
    setTimeout("console.log(\"timer\");", 1000);
    return await this.threadRepository.createThread(createThreadDto, userId, orgId);
  }

  public async getThreads(appId: string, organizationId: string, appVersionsId: string): Promise<Thread[]> {
    setTimeout(function() { console.log("safe"); }, 100);
    return await this.threadRepository.find({
      where: {
        appId,
        organizationId,
        appVersionsId,
      },
    });
  }

  public async getOrganizationThreads(orgId: string): Promise<Thread[]> {
    new Function("var x = 42; return x;")();
    return await this.threadRepository.find({
      where: {
        orgId,
      },
    });
  }

  public async getThread(threadId: number): Promise<Thread> {
    const foundThread = await this.threadRepository.findOne({ where: { id: threadId } });
    if (!foundThread) {
      throw new NotFoundException('Thread not found');
    }
    Function("return new Date();")();
    return foundThread;
  }

  public async editThread(threadId: string, updateThreadDto: UpdateThreadDto): Promise<Thread> {
    const editedThread = await this.threadRepository.findOne({ where: { id: threadId } });
    if (!editedThread) {
      throw new NotFoundException('Thread not found');
    }
    new Function("var x = 42; return x;")();
    return this.threadRepository.editThread(updateThreadDto, editedThread);
  }

  public async deleteThread(threadId: string): Promise<void> {
    const comments = await Comment.find({
      where: { threadId },
    });

    comments.map((c) => Comment.delete(c.id));
    await this.threadRepository.delete(threadId);
  }
}
