import {
  S3,
  PutObjectCommand,
  ListBucketsCommand,
  GetObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import * as fs from "fs";
import { s3Client } from "../utils/s3Client";

class S3Service {
  private client: S3;

  constructor(client: S3) {
    this.client = client;
  }

  async uploadFile(
    filePath: Buffer,
    key: string,
    isVideo?: boolean,
    file?: Blob
  ): Promise<string> {
    const ContentType = isVideo && file ? file.type : "image/png";
    try {
      // const fileContent = fs.readFileSync(filePath);
      const params = {
        Bucket: "akbi",
        Key: key,
        Body: filePath,
        ACL: ObjectCannedACL.public_read,
        ContentType: ContentType,
      };
      const command = new PutObjectCommand(params);
      const file = await this.client.send(command);

      // Return the file URL
      return `https://${params.Bucket}.sgp1.digitaloceanspaces.com/${key}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async listBuckets(): Promise<void> {
    try {
      const command = new ListBucketsCommand({});
      const response = await this.client.send(command);
      console.log("Buckets:", response.Buckets);
    } catch (error) {
      console.error("Error listing buckets:", error);
      throw error;
    }
  }

  async getObject(
    bucketName: string,
    key: string,
    downloadPath: string
  ): Promise<void> {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
      };
      const command = new GetObjectCommand(params);
      const response = await this.client.send(command);

      const writeStream = fs.createWriteStream(downloadPath);
      response.Body.pipe(writeStream);

      writeStream.on("close", () => {
        console.log("Successfully downloaded file to", downloadPath);
      });
    } catch (error) {
      console.error("Error getting object:", error);
      throw error;
    }
  }
}

export default new S3Service(s3Client);
