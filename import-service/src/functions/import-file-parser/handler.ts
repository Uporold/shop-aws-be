import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';
import * as AWS from 'aws-sdk';
import csvParser from 'csv-parser';

const importFileParser = async (event) => {
  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const sqs = new AWS.SQS({ region: 'eu-west-1' });

    const rows = [];
    for (const record of event.Records) {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: record.s3.object.key,
      };

      s3.getObject(params)
        .createReadStream()
        .pipe(csvParser())
        .on('data', (row) => {
          console.log(`Data event: ${JSON.stringify(row)}`);
          sqs.sendMessage(
            {
              QueueUrl: process.env.SQS_QUEUE_URL,
              MessageBody: JSON.stringify(row),
            },
            (error, data) => {
              if (error) console.log(`SQS error ${error}`);
              console.log(`SQS data ${JSON.stringify(data)}`);
            }
          );
          rows.push(row);
        })
        .on('error', (error) => {
          console.log(error);
        })
        .on('end', async () => {
          console.log(`End event data: ${JSON.stringify(rows)}`);
          await s3
            .copyObject(
              Object.assign(
                {},
                {
                  ...params,
                  CopySource: `${params.Bucket}/${params.Key}`,
                  Key: params.Key.replace('uploads', 'parsed'),
                }
              )
            )
            .promise();

          await s3.deleteObject(params).promise();

          console.log(
            `Csv table for ${
              params.Key.split('/')[1]
            } is created in parsed folder`
          );
        });
    }
    return sendCustomResponse({ message: 'OK' }, 200);
  } catch (error) {
    return sendError(error);
  }
};

export const main = middyfy(importFileParser);
