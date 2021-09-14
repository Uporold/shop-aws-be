import { CardEntity } from "../entities/card.entity";
import { CardDto } from "../dto/card.dto";

export interface CardInterface {
  id: string;
  count: number;
  price: number;
  description: string;
  title: string;
  imageSrc: string;
}

export interface CardServiceInterface {
  getCardList: () => Promise<CardEntity[]>;
  getCardById: (id: string) => Promise<CardEntity>;
  createCard: (cardDto: CardDto) => Promise<CardEntity>;
}
