import { IsDefined } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("userKeys")
export class userKeyModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int", { nullable: false })
    @IsDefined()
    consumerKey: number;

    @Column("int", { nullable: true })
    consumerSecret: string;

    @Column("int", { nullable: true })
    wsauthAccessKey: string;

    @Column("int", { nullable: true })
    wsauthAccessSecret: string;

    @Column("int", { nullable: true })
    loginAccessKey: string;

    @Column("int", { nullable: true })
    loginAccessSecret: string;

    @Column("int", { nullable: true })
    hotelId: number;

    @Column("int", { nullable: true })
    counterId: number;

    @Column("int", { nullable: true })
    email: string;

    @Column("date")
    @CreateDateColumn({ select: true })
    createdDate: Date;

    @Column("date")
    @UpdateDateColumn({ select: true })
    updatedDate: Date;
}