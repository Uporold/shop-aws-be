import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';
import { cardService } from '../../services/card-service';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const getCardById: APIGatewayProxyHandler = async (event) => {
  try {
    console.log(`Get card by id event: ${JSON.stringify(event)}`);
    const cardId = event.pathParameters.id;
    const card = await cardService.getCardById(cardId);
    console.log(`Received card: ${JSON.stringify(card)}`);
    if (!card) {
      return sendCustomResponse({ message: 'Card not found' }, 404);
    }
    return sendCustomResponse(card, 200);
  } catch (e) {
    return sendError(e);
  }
};

export const getProductById = middyfy(getCardById);
