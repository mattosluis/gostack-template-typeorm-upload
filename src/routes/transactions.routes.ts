import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import CreateTransactionService from '../services/CreateTransactionService';
import CreateCategoryOrReturnExistingOne from '../services/CreateCategoryOrReturnExistingOne';
import DeleteTransactionService from '../services/DeleteTransactionService';

import TransactionsRepository from '../repositories/TransactionsRepository';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find();

  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category: categoryName } = request.body;

  const createCategoryOrReturnExistingOne = new CreateCategoryOrReturnExistingOne();
  const category = await createCategoryOrReturnExistingOne.execute(
    categoryName,
  );

  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category_id: category.id,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({
    id,
  });

  return response.json('Transaction was deleted');
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute({
      file: request.file.path,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;
