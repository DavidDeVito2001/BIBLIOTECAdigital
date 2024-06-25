/**
 * @fileoverview Este archivo define la entidad ProfilesEntity que representa la tabla de profile_users en la base de datos MySQL.
 *
 * La entidad ProfilesEntity incluye las siguientes propiedades:
 *  - id: identificador heredado de la clase BaseEntity.
 *  - createAt: fecha de creación heredada de la clase BaseEntity.
 *  - updateAt: fecha de creación heredada de la clase BaseEntity.
 *  - firstName: nombre del usuario.
 *  - lastName: apellido del usuario.
 *  - age: edad del usuario.
 *  - tel: telofono del usuario.
 *  - adrress: dirección del usuario.
 *  - userId: es el id del user al que esta asociado el profile
 */

import { UsersEntity } from "../../users/entities/users.entity";
import { BaseEntity } from "../../config/base.entity";
import { IProfile } from "../../interfaces/profile.interface";
import { Column, Entity, OneToOne} from "typeorm";

/**
 * Entidad que representa en la BD la tabla 'profile_users'
 * Hereda de una clase abstracta e implementa la interfaz IProfile
 */


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
    
    @Column({ nullable: true })
    userId: number;
}