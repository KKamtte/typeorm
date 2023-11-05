import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Post('users')
  postUsers() {
    return this.userRepository.save({
      // title: 'test title',
      role: Role.ADMIN,
    });
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      relations: {
        profile: true,
        posts: true,
      },
    });
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return this.userRepository.save({
      ...user,
      // title: user.title + '0',
    });
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'seunghyeon@arsenal.com',
    });

    const profile = await this.profileRepository.save({
      profileImg: 'arsenal.jpg',
      user,
    });

    return user;
  }

  @Post('user/post')
  async createUserAndPost() {
    const user = await this.userRepository.save({
      email: 'saka@arsenal.com',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });

    return user;
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'martinelli',
    });

    const post2 = await this.postRepository.save({
      title: 'saka',
    });

    const post3 = await this.postRepository.save({
      title: 'reus',
    });

    const tag1 = await this.tagRepository.save({
      name: 'arsenal',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'bvb',
      posts: [post3],
    });

    const post4 = await this.postRepository.save({
      title: 'PL',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('posts')
  async getPosts() {
    return await this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  async getTags() {
    return await this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
