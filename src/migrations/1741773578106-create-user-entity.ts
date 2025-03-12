import { UserRole } from '../common/constants/enum.constant';
import { TABLE_NAMES } from '../common/constants/table-name.constant';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

const columns = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  },
  {
    name: 'name',
    type: 'varchar',
    isNullable: false,
  },
  {
    name: 'email',
    type: 'varchar',
    isNullable: false,
  },
  {
    name: 'password',
    type: 'varchar',
    isNullable: false,
  },
  {
    name: 'role',
    type: 'enum',
    enum: Object.values(UserRole),
    isNullable: false,
  },
  {
    name: 'deletedAt',
    type: 'timestamp',
    isNullable: true,
  },
  {
    name: 'createdAt',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  },
  {
    name: 'updatedAt',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  },
];

const columnsObjects = columns.map((column) => {
  const { generationStrategy, ...rest } = column;
  if (generationStrategy) {
    return new TableColumn({
      ...rest,
      generationStrategy: generationStrategy as any,
    });
  }
  return new TableColumn(rest);
});

export class UserEntity1741773578106 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.USER,
        columns: columnsObjects,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAMES.USER);
  }
}
