import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  // 포스트 입장에서 many 포스트가 하나의 사용자에게 귀속됨
  @ManyToOne(() => UserModel, (user) => user.posts)
  // one-to-many, many-to-one 에서는 join column 이 필요 없다.
  // many-to-one 이 되는 입장에서 id 를 들고 있다.
  author: UserModel;

  @Column()
  title: string;
}
