require('dotenv/config');
const express = require('express');
const aws = require('aws-sdk'); 

const app = express();
const port = 4444;
 
aws.config.update({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    signatureVersion: 'v4',
    region: process.env.AWS_REGION
})

const s3 = new aws.S3();


const main = async() => {
    try{
        const url = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: 'image-or-file-name.jpg',
            Expires: 60
        })
        console.log(url);
    } catch(error) {
        console.log(error)
    }
}

main();

app.get('/getawss3bucketdata', (req, res) => {
    (async function() {
    try{
        aws.config.setPromisesDependency();
        const response = await s3.listObjectsV2({
            Bucket: process.env.AWS_BUCKET_NAME,
            // Prefix: 'folder1'
        }).promise();
    
        res.status(200).send(response)
    
    } catch(error) {
        if(error) {
            res.status(500).send(error)
        }
    }
})();
// console.log('eq4');
})

app.listen(port, () => {
    console.log(`Server is up and running at ${port}`)
})



