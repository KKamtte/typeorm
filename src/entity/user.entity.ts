import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn() // 자동으로 ID 를 생성한다. -> 순서대로 올라감 (1->2->3)
  // @PrimaryGeneratedColumn('uuid') // 자동으로 ID 를 생성한다. (uuid 타입)
  // @PrimaryColumn() // 모든 테이블에서 기본적으로 존재해야 한다.
  id: number;

  @Column()
  email: string;

  // @Column({
  //   type: 'varchar', // 데이터베이스에서 인지하는 칼럼 타입 (자동 유추됨)
  //   name: 'title', // 데이터베이스 칼럼 이름 (자동 유추됨)
  //   length: 300, // 값의 길이, 입력할 수 있는 글자 길이가 300
  //   nullable: true, // null 값이 가능한지
  //   update: true, // true 면 처음 저장할 때만 값 지정 가능, 이후에는 값 변경 불가능,
  //   select: false, // find() 를 실행할 때 기본으로 값을 불러올지
  //   default: 'default value', // 기본값으로 아무 값을 입력하지 않았을 때 저장될 값
  //   unique: false, // 칼럼에서 유니크한 값으로 존재해야 하는지
  // })
  // title: string;

  @Column({
    type: 'enum',
    enum: Role, // enum 으로 사용될 타입
    default: Role.USER, // 기본값
  })
  role: Role;

  @CreateDateColumn() // 데이터가 생성되는 날짜와 시간이 자동으로 찍힌다.
  createdAt: Date;

  @UpdateDateColumn() // 데이터가 업데이트 되는 날짜와 시간이 자동으로 찍힌다.
  updatedAt: Date;

  @VersionColumn() // 데이터가 업데이트 될때 마다 1씩 올라간다.
  // 처음 생성되면 값은 1이다.
  // save() 함수가 몇번 호출되었는지
  version: number;

  @Column()
  @Generated('uuid')
  additionalId: string;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;

  // 유저 입장에서 하나의 사용자가 many 포스트를 관리하게 됨
  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
