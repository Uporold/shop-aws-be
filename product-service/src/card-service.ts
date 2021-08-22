import {productList} from "./utils/product-list";

class CardService {
    getCardList() {
        return Promise.resolve(productList)
    }

    getCardById(cardId: string) {
        return Promise.resolve(productList.find(card => card.id === cardId))
    }
}

export const cardService = new CardService();