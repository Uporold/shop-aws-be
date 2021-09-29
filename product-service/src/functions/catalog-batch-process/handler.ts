import { cardService } from '../../services/card-service';
import { SNS } from 'aws-sdk';
import { sendCustomResponse, sendError } from '../../utils/responses';
import { middyfy } from '@libs/lambda';

export const catalogBatchProcess = async (event) => {
  try {
    console.log(`Event: ${JSON.stringify(event)}`);
    const sns = new SNS();
    const cards = event.Records.map((record) => record.body);
    console.log(`Cards to save: ${cards}`);
    for (const card of cards) {
      console.log(JSON.parse(card));
      const newCard = await cardService.createCard(JSON.parse(card));
      console.log(`Card saved: ${card}`);
      sns.publish(
        {
          Subject: `Card with id ${newCard.id} created successfully`,
          Message: JSON.stringify(newCard),
          TopicArn: process.env.SNS_TOPIC_ARN,
          MessageAttributes: {
            count: {
              DataType: 'Number',
              StringValue: newCard.count.toString(),
            },
          },
        },
        (error, data) => {
          if (error) console.log(error);
          else console.log(`Send email with data: ${JSON.stringify(data)}`);
        }
      );
    }
    return sendCustomResponse({ message: 'Success batch' }, 200);
  } catch (e) {
    return sendError(e);
  }
};

export const main = middyfy(catalogBatchProcess);
