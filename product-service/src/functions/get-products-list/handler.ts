import { middyfy } from '@libs/lambda';
import {sendCustomResponse, sendError} from "../../utils/responses";
import {cardService} from "../../card-service";

export const getCardList = async () => {
    try {
        const cards = await cardService.getCardList();
        return sendCustomResponse({
            cards
        }, 200)
    } catch (e) {
        return sendError(e);
    }
}

export const getProductList = middyfy(getCardList);
