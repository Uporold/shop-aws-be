import productList from '../../product-list.json';
import { middyfy } from '@libs/lambda';
import {sendCustomResponse, sendError} from "../../utils/responses";

const getCardList = async (_event) => {
    try {
        return sendCustomResponse({
            cards: productList
        }, 200)
    } catch (e) {
        return sendError(e);
    }
}

export const getProductList = middyfy(getCardList);
