import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  public async uploadFile(file: any, id: string) {
    const s3 = new AWS.S3({
      region: 'us-east-1',
      accessKeyId: 'AKIASP6GCNZHHUVHNMFC',
      secretAccessKey: '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',
    });

    const fileTypeExtension = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileTypeExtension}`;

    const objectParams = {
      Body: file.buffer,
      Bucket: 'smartranking2',
      Key: urlKey,
    };

    const data = s3
      .putObject(objectParams)
      .promise()
      .then(
        (data) => {
          return {
            url: `https://smartranking2.s3.amazonaws.com/${urlKey}`,
          };
        },
        (error) => {
          return error;
        },
      );

    return data;
  }
}
