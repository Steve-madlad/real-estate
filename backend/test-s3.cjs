// const { S3Client } = require('@aws-sdk/client-s3');
// const { Upload } = require('@aws-sdk/lib-storage');
// const fs = require('fs');

// const s3Client = new S3Client({
//   region: 'eu-west-2',
//   credentials: {
//     accessKeyId: 'id',
//     secretAccessKey: 'key',
//   }
// });

// const buffer = Buffer.from('test image content', 'utf8');

// async function test() {
//   const uploadParams = {
//     Bucket: 'rs-next-app-2-s3-images',
//     Key: `test-${Date.now()}.txt`,
//     Body: buffer,
//     ContentType: 'text/plain',
//   };

//   const uploadResult = await new Upload({
//     client: s3Client,
//     params: uploadParams,
//   }).done();

//   console.log('Upload Result:', uploadResult.Location);
// }
// test().catch(console.error);
