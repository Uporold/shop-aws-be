import {productList} from "./utils/product-list";
import {CardInterface, CardServiceInterface} from "./utils/types";

class CardService implements CardServiceInterface{
    getCardList(): Promise<CardInterface[]> {
        return Promise.resolve(productList)
    }

    getCardById(cardId: string): Promise<CardInterface> {
        return Promise.resolve(productList.find(card => card.id === cardId))
    }
}

export const cardService = new CardService();