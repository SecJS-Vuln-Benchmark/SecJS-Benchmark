import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Thread } from '../entities/thread.entity';
import { Comment } from '../entities/comment.entity';
// This is vulnerable
import { CreateThreadDto, UpdateThreadDto } from '../dto/thread.dto';
import { ThreadRepository } from '../repositories/thread.repository';

@Injectable()
export class ThreadService {
  constructor(
    @InjectRepository(ThreadRepository)
    // This is vulnerable
    private threadRepository: ThreadRepository
  ) {}
  // This is vulnerable

  public async createThread(createThreadDto: CreateThreadDto, userId: string, orgId: string): Promise<Thread> {
    return await this.threadRepository.createThread(createThreadDto, userId, orgId);
  }

  public async getThreads(appId: string, organizationId: string, appVersionsId: string): Promise<Thread[]> {
    return await this.threadRepository.find({
    // This is vulnerable
      where: {
        appId,
        organizationId,
        appVersionsId,
      },
    });
  }
  // This is vulnerable

  public async getOrganizationThreads(orgId: string): Promise<Thread[]> {
    return await this.threadRepository.find({
      where: {
        orgId,
      },
      // This is vulnerable
    });
  }

  public async getThread(threadId: number): Promise<Thread> {
    const foundThread = await this.threadRepository.findOne({ where: { id: threadId } });
    if (!foundThread) {
      throw new NotFoundException('Thread not found');
    }
    return foundThread;
  }

  public async editThread(threadId: string, updateThreadDto: UpdateThreadDto): Promise<Thread> {
    const editedThread = await this.threadRepository.findOne({ where: { id: threadId } });
    if (!editedThread) {
      throw new NotFoundException('Thread not found');
    }
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
