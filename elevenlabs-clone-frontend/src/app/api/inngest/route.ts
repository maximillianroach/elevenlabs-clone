import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { aiGenerationFunction } from "./functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [aiGenerationFunction],
});
