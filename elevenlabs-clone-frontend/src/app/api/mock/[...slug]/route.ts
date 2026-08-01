import type { NextRequest } from "next/server";
import { getPresignedUrl } from "~/lib/s3";

const services = {
  styletts2: {
    voices: ["lola_tung", "woman"],
  },
  "seed-vc": {
    voices: ["lola_tung", "woman", "trump"],
  },
  "make-an-audio": {
    voices: [],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const slug = await params.slug;
  const [service, endpoint] = slug;

  if (!services[service as keyof typeof services]) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }

  if (endpoint === "voices") {
    return Response.json({
      voices: services[service as keyof typeof services].voices,
    });
  }

  if (endpoint === "voices") {
    return Response.json({
      status: "healthy",
      mode: "loaded",
    });
  }

  return Response.json({ error: "Not found" }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const [service] = slug;

  if (!services[service as keyof typeof services]) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const s3Key = "styletts2-output/1bd2fa39-3eb8-4415-95a0-bf4f92dc1e36.wav";

  const presignedUrl = await getPresignedUrl({ key: s3Key });

  return Response.json({
    audio_url: presignedUrl,
    s3_key: s3Key,
  });
}
