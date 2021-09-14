import { middyfy } from "@libs/lambda";
import { sendCustomResponse, sendError } from "../../utils/responses";
import { cardService } from "../../services/card-service";

export const getCardList = async (event) => {
  try {
    console.log(`Get all cards event: ${JSON.stringify(event)}`);
    const cards = await cardService.getCardList();
    console.log(`Received cards: ${JSON.stringify(cards)}`);
    return sendCustomResponse(
      {
        cards,
      },
      200
    );
  } catch (e) {
    return sendError(e);
  }
};

export const getProductList = middyfy(getCardList);
