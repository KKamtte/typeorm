import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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
      // 어떤 프로퍼티를 선택할지
      // 기본은 모든 프로퍼티를 가져온다. (select 를 정의하지 않으면)
      // select 를 정의하면 정의된 프로퍼티만 가져온다.
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        version: true,
        profile: {
          id: true,
        },
      },
      // 필터링할 조건을 입력하게 된다. (AND 조건으로 묶이게 된다)
      // where: {
      //   version: 1,
      //   id: 3,
      // },
      // OR 조건을 사용할 경우 배열로 처리
      // where: [
      //   {
      //     id: 3,
      //   },
      //   {
      //     version: 1,
      //   },
      // ],
      // 관계를 가져오는 법
      relations: {
        profile: true,
      },
      // where: {
      //   profile: {
      //     id: 3,
      //   },
      // },
      // 오름차순 내림차순
      // ASC -> 오름차순
      // DESC -> 내림차순
      order: {
        id: 'DESC',
      },
      // 처음 몇개를 제외할지 (정렬 이후) - OFFSET
      skip: 0,
      // 몇 개를 가져올 지 (default 테이블 길이) - LIMIT
      take: 1,
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
      email: user.email + '0',
    });
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'seunghyeon2@arsenal.com',
      profile: {
        profileImg: 'asdf.jpg',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'arsenal.jpg',
    //   user,
    // });

    return user;
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
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
