import { cardService } from '../../services/card-service';
import { SNS } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { SQSHandler } from 'aws-lambda';

export const handleSingleProductProcess = async (
  sns: SNS,
  recordBody: string
) => {
  try {
    const card = await cardService.createCard(JSON.parse(recordBody));
    console.log(`Card saved: ${recordBody}`);
    const response = await sns
      .publish({
        Subject: `Card with id ${card.id} created successfully`,
        Message: JSON.stringify(card),
        TopicArn: process.env.SNS_TOPIC_ARN,
        MessageAttributes: {
          count: {
            DataType: 'Number',
            StringValue: card.count.toString(),
          },
        },
      })
      .promise();
    console.log(`Send email with data: ${JSON.stringify(response)}`);
  } catch (e) {
    throw e;
  }
};

export const catalogBatchProcess: SQSHandler = async (event) => {
  try {
    console.log(`Event: ${JSON.stringify(event)}`);
    const sns = new SNS();
    const cards = event.Records.map((record) => record.body);
    console.log(`Cards to save: ${cards}`);
    for (const card of cards) {
      console.log(JSON.parse(card));
      await handleSingleProductProcess(sns, card);
    }
  } catch (e) {
    console.log(`Error during catalogBatchProcess: ${e}`);
  }
};

export const main = middyfy(catalogBatchProcess);
