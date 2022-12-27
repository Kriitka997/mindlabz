import { IsDefined } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("VendorTokens")
export class VendorTokenModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int", { nullable: false })
    @IsDefined()
    vendorId: number;

    @Column("int", { nullable: false })
    vendorToken: string;

    @Column("date")
    @CreateDateColumn({ select: true })
    createdDate: Date;

    @Column("date")
    @UpdateDateColumn({ select: true })
    updatedDate: Date;
}