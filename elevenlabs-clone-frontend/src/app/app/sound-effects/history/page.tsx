import { PageLayout } from "~/components/client/page-layout";
import { HistoryList } from "~/components/client/sound-effects/history-list";
import { SoundEffectsGenerator } from "~/components/client/sound-effects/sound-effects-generator";
import { TextToSpeechEditor } from "~/components/client/speech-synthesis/text-to-speech-editor";
import { getHistoryItems } from "~/lib/history";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function SoundEffectsHistoryPage() {
  const soundEffectsTabs = [
    {
      name: "Generate",
      path: "/app/sound-effects/generate",
    },
    {
      name: "History",
      path: "/app/sound-effects/history",
    },
  ];

  const service = "make-an-audio";

  const historyItems = await getHistoryItems(service);

  return (
    <PageLayout
      title={"Text to Speech"}
      showSideBar={true}
      tabs={soundEffectsTabs}
      service={service}
    >
      <HistoryList historyItems={historyItems} />
    </PageLayout>
  );
}
