// @ts-nocheck
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const { token, signature, expire } = getUploadAuthParams({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
    return Response.json({
      token,
      expire,
      signature,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: "Failed to generate upload auth params",
      },
      {
        status: 500,
      }
    );
  }
}
