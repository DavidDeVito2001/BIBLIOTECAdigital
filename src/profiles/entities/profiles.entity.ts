import { UsersEntity } from "../../users/entities/users.entity";
import { BaseEntity } from "../../config/base.entity";
import { IProfile } from "../../interfaces/profile.interface";
import { Column, Entity, OneToOne} from "typeorm";

@Entity('profile_users')
export class ProfileEntity extends BaseEntity implements IProfile{
    
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column()
    tel: string;

    @Column()
    adrress: string;

    
    @OneToOne(()=>UsersEntity, user=> user.profile)
    user: UsersEntity; 
}