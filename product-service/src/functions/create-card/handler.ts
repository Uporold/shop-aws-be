import { middyfy } from "@libs/lambda";
import { sendCustomResponse, sendError } from "../../utils/responses";
import { cardService } from "../../services/card-service";
import { CardDto } from "../../dto/card.dto";

export const createCard = async (event) => {
  try {
    console.log(`Create card event: ${JSON.stringify(event)}`);
    const body = event.body as CardDto;
    const card = await cardService.createCard(body);
    console.log(`Created card: ${JSON.stringify(card)}`);
    return sendCustomResponse(card, 200);
  } catch (e) {
    return sendError(e);
  }
};

export const createProduct = middyfy(createCard);
