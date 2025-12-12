import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export abstract class BaseTransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy?: number;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updatedBy?: number;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator?: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater?: any;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
