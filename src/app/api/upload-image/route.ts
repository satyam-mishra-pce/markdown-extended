import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;

  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    return NextResponse.json(
      { error: "Pinata API credentials are missing" },
      { status: 500 }
    );
  }

  try {
    const formData = new FormData();
    const blob = await request.blob();
    formData.append("file", blob);

    const pinataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${
            "_boundary" in formData ? formData._boundary : ""
          }`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      }
    );

    const cid = pinataResponse.data.IpfsHash;
    const link = `https://gateway.pinata.cloud/ipfs/${cid}`;

    return NextResponse.json({ cid, link }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Pinata" },
      { status: 500 }
    );
  }
}
