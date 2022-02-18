const fs = require('fs')
const AWS = require('aws-sdk')

// Enter copied or downloaded access id and secret here
const ID = 'AKIA5D526RAUHAYT7D76'
const SECRET = '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'

// Enter the name of the bucket that you have created here
const BUCKET_NAME = 'cs307'

// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
})

module.exports.uploadFile = async (fileName) => {
    return new Promise((resolve, reject) => {
        // read content from the file
        const fileContent = fs.readFileSync(fileName.path)
        // console.log(fileName.path);
        //  console.log(fileName.originalname);
        //const k = keyName

        // setting up s3 upload parameters
        let params = {
            Bucket: BUCKET_NAME,
            Key: fileName.path.substring(8), // file name you want to save as
            Body: fileContent,
        }

        // Uploading files to the bucket
        s3.upload(params, async (err, data) => {
            if (err) {
                reject(err)
            }
            console.log(`File uploaded successfully. ${data.Location}`)

            resolve(data.Location)
        })
    })
}

// Enter the file you want to upload here\
