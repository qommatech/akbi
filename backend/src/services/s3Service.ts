import {
  S3,
  PutObjectCommand,
  ListBucketsCommand,
  ObjectCannedACL,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
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

  async uploadFiles(
    files: { filePath: Buffer; key: string; isVideo?: boolean; file?: Blob }[]
  ): Promise<{ url: string; type: string }[]> {
    const results = [];
    for (const { filePath, key, isVideo, file } of files) {
      try {
        const url = await this.uploadFile(filePath, key, isVideo, file);
        const type = isVideo ? "Video" : "Image";
        results.push({ url, type });
      } catch (error) {
        console.error(`Error uploading file ${key}:`, error);
        throw error;
      }
    }
    return results;
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
  async deleteFiles(files: { url: string; type: string }[]): Promise<boolean> {
    try {
      const keys = files.map((file) => {
        const url = new URL(file.url);
        return url.pathname.substring(1); // Remove the leading '/'
      });
      console.log(keys);
      const objects = keys.map((key) => ({ Key: key }));
      const params = {
        Bucket: "akbi",
        Delete: { Objects: objects },
      };
      const command = new DeleteObjectsCommand(params);
      const response = await this.client.send(command);
      console.log(`Files with keys ${keys.join(", ")} deleted successfully.`);
      console.log("Deleted objects:", response.Deleted);
      return true;
      if (response.Errors && response.Errors.length > 0) {
        console.error(
          "Errors occurred while deleting some objects:",
          response.Errors
        );
      }
    } catch (error) {
      console.error("Error deleting files:", error);
      throw error;
    }
  }
}

export default new S3Service(s3Client);
