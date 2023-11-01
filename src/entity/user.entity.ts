import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn() // 자동으로 ID 를 생성한다. -> 순서대로 올라감 (1->2->3)
  // @PrimaryGeneratedColumn('uuid') // 자동으로 ID 를 생성한다. (uuid 타입)
  // @PrimaryColumn() // 모든 테이블에서 기본적으로 존재해야 한다.
  id: number;

  @Column()
  title: string;

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
}
