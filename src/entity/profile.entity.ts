import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  // 첫번째 파라미터는 대상, 두번째 파라미터는 어떤 모델과 연결 시킬지
  @OneToOne(() => UserModel, (user) => user.profile)
  // user 모델 테이블에 있는 아이디를 profile 모델에서 들고 있음, 반대로 만들 경우(user.entity의 profile 에 JoinColumn 추가) 경우 profile 모델 아이디를 user 모델에서 들고 있음
  @JoinColumn()
  user: UserModel;

  @Column()
  profileImg: string;
}
