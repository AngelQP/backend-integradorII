import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteService {

    private readonly logger = new Logger('FavoriteService');
  
  constructor(

    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>

  ){}


  async create(createFavoriteDto: CreateFavoriteDto) {

    // TODO!
    const {userId, bookId} = createFavoriteDto;

    try {
      // 1. Crear la instancia de Favorite, referenciando solo los IDs.
      // TypeORM manejará la creación de la relación.
      const newFavorite = await this.favoriteRepository.create({
        user: {id: userId},
        book: {id: bookId}
      })

      // 2. Guardar el nuevo favorito. La restricción UNIQUE lanzará un error si ya existe.
      await this.favoriteRepository.save(newFavorite);
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

    // TODO!: simular que solo devuelva 201 creado no deberia devolver nada mas
    return '';
    
  }

  async findAllByUser(term: string) {

    

    // TODO!
    
  }

  async findOne(term: string) {

    // TODO!

  }

  // Codigo no se necesita para este servicio igual en el controlador
  // async update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
  //   return `This action updates a #${id} favorite`;
  // }

  async remove(term: string) {

    // TODO!

  }

  // Funcion para retornar un error en especifico de duplicado
  handleDBExceptions(error: any) {
  
      if(error.code == '23505')
        throw new BadRequestException(error.detail);
  
      this.logger.error(error);
  
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}
