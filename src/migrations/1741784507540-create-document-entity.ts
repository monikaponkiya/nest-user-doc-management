import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { TABLE_NAMES } from '../common/constants/table-name.constant';

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
    name: 'path',
    type: 'varchar',
    isNullable: false,
  },
  {
    name: 'size',
    type: 'int',
    isNullable: false,
  },
  {
    name: 'mimeType',
    type: 'varchar',
    isNullable: false,
  },
  {
    name: 'description',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'userId',
    type: 'int',
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

export class DocumentEntity1741784507540 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.DOCUMENT,
        columns: columnsObjects,
      }),
    );
    await queryRunner.createForeignKey(
      TABLE_NAMES.DOCUMENT,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: TABLE_NAMES.USER,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(TABLE_NAMES.DOCUMENT, 'FK_DOCUMENT_USER');
    await queryRunner.dropTable(TABLE_NAMES.DOCUMENT);
  }
}
