/** 
*@fileoverview Este archivo contiene una clase abstracta que representan los datos básicos que van a tener nuestras entidades
 * Esta incluye la siguientes propiedades:
 *  - id: identificador único de la entiedad a la querramos heredar
 *  - createAt: Fecha en que se creo el dato en la bd
 *  - updatedAt: Fecha en que se actualizó el dato en la base de datos.
 */

import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * Clase abstracta que define las columnas comunes entre las entidades
 * @abstract
 */


export abstract class BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at'
    })
    createAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'update_at'
    })
    updateAt: Date;




}