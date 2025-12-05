import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CategoryResponse } from './dto';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoryService {

  private readonly logger = new Logger('CategoryService');

  constructor(

    // Inyeccion de dependencia de repositorio de categoria
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ){}

  // funcion para crear una categoria
  async create(createCategoryDto: CreateCategoryDto) {

    try {

      const categoryCreate = this.categoryRepository.create({...createCategoryDto});

      const categorySave = await this.categoryRepository.save(categoryCreate);

      return plainToInstance(CategoryResponse, categorySave, {excludeExtraneousValues: true});
      
    } catch (error) {
      this.handleDBExceptions(error);
      this.logger.error(error);
      throw new InternalServerErrorException('Problems created');
    }

  }

  // Funcion para listar todas las categorias
  async findAll(): Promise<CategoryResponse[]> {

    // consultar solo las categorias que tengan estado en true
    const categories: Category[] = await this.categoryRepository.find({
      where: {state: true}
    });

    const categoryResponseArray = plainToInstance(CategoryResponse, categories, { excludeExtraneousValues: true });

    return categoryResponseArray;

  }

  // Funcion para encontrar categoria por nombre o UUID
  async findOne(term: string) {

    let category: Category | null;

    if(isUUID( term )){
      category = await this.categoryRepository.findOneBy( { id: term });
    } else {
      const queryBuilder = this.categoryRepository.createQueryBuilder('cat')
      category = await queryBuilder
        .where('UPPER(name) = :name',{
          name: term.toLocaleUpperCase()
        })
        .getOne();   
    }

    if(!category) 
      throw new NotFoundException(`Category with ${ term } not found`);

    return plainToInstance(CategoryResponse, category, { excludeExtraneousValues: true });

  }

  // Funcion para actualizar categoria
  async update(term: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponse> {

    const category = await this.categoryRepository.preload({id: term, ...updateCategoryDto});

    if (!category)
      throw new BadRequestException(`Category with id ${term} not found`);

    try {
      await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }

    return plainToInstance(CategoryResponse, category, { excludeExtraneousValues: true });

  }

  // Funcion de servicio para cambiar el state de una categoria
  async remove(term: string) {
    const category = await this.findOne(term);

    const removeCategory = {...category, state: false};

    await this.categoryRepository.save(removeCategory);
  }

  async seedBookCategories() {
    const categories = [
      'NOVELA CONTEMPORÁNEA', 'NOVELA HISTÓRICA', 'CIENCIA FICCIÓN', 'FANTASÍA', 'TERROR',
      'MISTERIO', 'THRILLER / SUSPENSO', 'ROMANCE', 'ROMANCE JUVENIL', 'FICCIÓN JUVENIL',
      'AVENTURA', 'REALISMO MÁGICO', 'DISTOPÍA', 'UTOPÍA', 'FICCIÓN LITERARIA', 'FICCIÓN CLÁSICA',
      'CUENTOS CORTOS', 'POESÍA', 'TEATRO / DRAMATURGIA', 'ENSAYO', 'FILOSOFÍA', 'PSICOLOGÍA',
      'AUTOAYUDA', 'DESARROLLO PERSONAL', 'NEGOCIOS', 'EMPRENDIMIENTO', 'LIDERAZGO', 'ECONOMÍA',
      'HISTORIA', 'BIOGRAFÍAS', 'MEMORIAS', 'CIENCIA', 'DIVULGACIÓN CIENTÍFICA', 'TECNOLOGÍA',
      'INTELIGENCIA ARTIFICIAL', 'EDUCACIÓN', 'PEDAGOGÍA', 'SALUD', 'MEDICINA', 'NUTRICIÓN',
      'ESPIRITUALIDAD', 'RELIGIÓN', 'MITOLOGÍA', 'VIAJES', 'ARTE', 'FOTOGRAFÍA', 'ARQUITECTURA',
      'COCINA / GASTRONOMÍA', 'DERECHO', 'POLÍTICA'
    ];

    try {
      const insertedCategories: Category[] = [];

      for (const name of categories) {
        const exists = await this.categoryRepository.findOne({ where: { name } });

        if (!exists) {
          const category = this.categoryRepository.create({ name });
          const saved = await this.categoryRepository.save(category);
          insertedCategories.push(saved);
        }
      }

      return plainToInstance(CategoryResponse, insertedCategories, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error al ejecutar el seed de categorías');
    }
  }

  // Funcion para retornar un error en especifico de duplicado
  handleDBExceptions(error: any) {

    if(error.code == '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
