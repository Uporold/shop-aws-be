import { cardService } from '../../services/card-service';
import { sendCustomResponse, sendError } from '../../utils/responses';
import { middyfy } from '@libs/lambda';

export const catalogBatchProcess = async (event) => {
  try {
    const cards = event.Records.map((record) => record.body);
    console.log(`Cards to save: ${cards}`);
    for (const card of cards) {
      console.log(JSON.parse(card));
      await cardService.createCard(JSON.parse(card));
      console.log(`Card saved: ${card}`);
    }
    return sendCustomResponse({ message: 'Success batch' }, 200);
  } catch (e) {
    return sendError(e);
  }
};

export const main = middyfy(catalogBatchProcess);
