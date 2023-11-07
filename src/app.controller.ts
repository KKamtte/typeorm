import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import {
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
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

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안함
    // const user1 = this.userRepository.create({
    //   email: 'test@arsenal.com',
    // });

    // 저장
    // const user2 = await this.userRepository.save({
    //   email: 'test@arsenal.com',
    // });

    // preload
    // 입력된 값을 기반으로 데이터 베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함
    // 저장하지는 않음
    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'saka@arsenal.com',
    // });

    // 삭제하기
    // await this.userRepository.delete(101);

    // 조건에 해당하는 모든 row 에 column 데이터를 조건에 맞게 증가
    // await this.userRepository.increment(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   2,
    // );

    // 조건에 해당하는 모든 row 에 column 데이터를 조건에 맞게 감소
    // await this.userRepository.decrement(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   1,
    // );

    // 갯수 카운팅하기
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // });

    // sum
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%0%'),
    // });

    // 평균
    // const avg = await this.userRepository.average('count', {
    //   id: LessThan(4),
    // });

    // 최소, 최대값
    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });
    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });

    // 페이지네이션
    const usersAndCount = await this.userRepository.findAndCount({
      take: 3,
    });

    return JSON.stringify({ data: usersAndCount[0], total: usersAndCount[1] });
  }

  @Post('users')
  async postUsers() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      where: {
        // 아닌 경우 가져오기
        // id: Not(1),
        // 적은 경우 가져오기
        // id: LessThan(30),
        // 작거나 같은 경우
        // id: LessThanOrEqual(30),
        // id: MoreThan(30),
        // id: MoreThanOrEqual(30),
        // 같은 경우
        // id: Equal(30),
        // 유사 값 (대소문자 구분)
        // email: Like('%0%'),
        // 대소문자 구분 하지 않음
        // email: ILike('%GOOGLE%'),
        // id: Between(10, 15),
        // 해당되는 여러개의 값
        // id: In([1, 3, 5, 99]),
        // Null 인 경우 가져오기
        profile: IsNull(),
      },
      // 어떤 프로퍼티를 선택할지
      // 기본은 모든 프로퍼티를 가져온다. (select 를 정의하지 않으면)
      // select 를 정의하면 정의된 프로퍼티만 가져온다.
      // select: {
      //   id: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   version: true,
      //   profile: {
      //     id: true,
      //   },
      // },
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
      // relations: {
      //   profile: true,
      // },
      // where: {
      //   profile: {
      //     id: 3,
      //   },
      // },
      // 오름차순 내림차순
      // ASC -> 오름차순
      // DESC -> 내림차순
      order: {
        id: 'ASC',
      },
      // 처음 몇개를 제외할지 (정렬 이후) - OFFSET
      // skip: 0,
      // 몇 개를 가져올 지 (default 테이블 길이) - LIMIT
      // take: 1,
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
