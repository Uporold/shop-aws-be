import productList from '../../product-list.json';
import { middyfy } from '@libs/lambda';
import {sendCustomResponse, sendError} from "../../utils/responses";

const getCardById = async (event) => {
    try {
        const cardId = event.pathParameters.id
        const card = productList.find(card => card.id === cardId);
        if (!card) {
            return sendCustomResponse({ message: 'Card not found' }, 404)
        }
        return sendCustomResponse(card, 200)
    } catch (e) {
        return sendError(e);
    }
};

export const getProductById = middyfy(getCardById);