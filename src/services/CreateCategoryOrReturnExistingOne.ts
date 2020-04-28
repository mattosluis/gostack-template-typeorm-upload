import { getRepository } from 'typeorm';

import Category from '../models/Category';

// import AppError from '../errors/AppError';

class CreateCategoryOrReturnExistingOne {
  public async execute(category: string): Promise<Category> {
    // pensar em uma estrategia para remover acentuacao
    const categoryRepository = getRepository(Category);

    let categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      categoryExists = await categoryRepository.save(newCategory);
    }

    return categoryExists;
  }
}

export default CreateCategoryOrReturnExistingOne;
