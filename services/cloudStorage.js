const { S3, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configure the S3 client
const s3 = new S3({
    region: process.env.AWS_REGION,
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Function to upload a file to S3 using AWS SDK v3
exports.uploadFileToS3 = async (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Construct the file URL manually
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        return { fileUrl };
    } catch (err) {
        console.error('Error uploading file to S3:', err);
        throw new Error(`Upload failed: ${err.message}`);
    }
};

// Function to delete a file from S3
exports.deleteFileFromS3 = async (fileKey) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    };

    try {
        const command = new DeleteObjectCommand(params);
        const response = await s3.send(command);
        console.log('File deleted successfully:', response);
        return response;
    } catch (err) {
        console.error('Error deleting file from S3:', err);
        throw new Error(`Delete failed: ${err.message}`);
    }
};
