import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { sendError } from '../../utils/responses';
import * as AWS from 'aws-sdk';
import csvParser from 'csv-parser';

const importFileParser = async (event) => {
  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const tables = [];
    event.Records.forEach((record) => {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: record.s3.object.key,
      };

      s3.getObject(params)
        .createReadStream()
        .pipe(csvParser())
        .on('data', (data) => {
          console.log(`Data event: ${JSON.stringify(data)}`);
          tables.push(data);
        })
        .on('error', (error) => {
          console.log(error);
        })
        .on('end', async () => {
          console.log(`End event data: ${JSON.stringify(tables)}`);
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
    });
  } catch (error) {
    return sendError(error);
  }
};

export const main = middyfy(importFileParser);
