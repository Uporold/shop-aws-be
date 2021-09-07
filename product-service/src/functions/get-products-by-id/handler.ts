import { middyfy } from '@libs/lambda';
import {sendCustomResponse, sendError} from "../../utils/responses";
import {cardService} from "../../card-service";

export const getCardById = async (event) => {
    try {
        const cardId = event.pathParameters.id
        const card = await cardService.getCardById(cardId);
        if (!card) {
            return sendCustomResponse({ message: 'Card not found' }, 404)
        }
        return sendCustomResponse(card, 200)
    } catch (e) {
        return sendError(e);
    }
};

export const getProductById = middyfy(getCardById);