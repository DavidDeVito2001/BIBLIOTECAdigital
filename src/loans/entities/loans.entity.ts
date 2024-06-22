
import { ILoan } from "../../interfaces/loan.interfaces";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "../../users/entities/users.entity";
import { CopiesEntity } from "../../copies/entities/copies.entity";

@Entity('loans')
export class LoansEntity implements ILoan{
    
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'loan_date'
    })
    loan_date: Date;

    @Column({
        type: 'timestamp',
        name: 'loan_return',
        default: () => 'CURRENT_TIMESTAMP'
    })
    loan_return: Date; //"2024-06-21T14:30:00.000Z" Un formato así hay que usar en json

    @Column({
        type: 'timestamp',
        name: 'real_day_return',
        nullable: true
    })
    real_day_return: Date|null; //"2024-06-21T14:30:00.000Z" Un formato así hay que usar en json

    @Column({
        type: 'boolean',
        name: 'is_returned',
        default: false
    })
    is_returned: boolean;
    
    //Estableciendo relación muchos a uno con "users"
    @ManyToOne(()=> UsersEntity, user => user.loans)
    @JoinColumn()
    user: UsersEntity

    @Column()
    userId: number;

    //Estableciendo relación muchos a uno con "copies"
    @ManyToOne(()=> CopiesEntity, copy => copy.loans)
    @JoinColumn()
    copy: CopiesEntity;

    @Column({nullable:true})
    copyId: number;


}