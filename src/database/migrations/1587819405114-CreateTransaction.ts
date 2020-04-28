import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateTransaction1587819405114
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }),
          new TableColumn({
            name: 'title',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'type',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'value',
            type: 'decimal',
            isNullable: false,
          }),
          new TableColumn({
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          }),
          new TableColumn({
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          }),
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionsFK',
        referencedTableName: 'categories',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'TransactionsFK');
    await queryRunner.dropTable('transactions');
  }
}
