import { PracticalAiPage, practicalAiMetadata } from "@/components/practical-ai-page";

export const metadata = practicalAiMetadata("nl", "netherlands");

export default function Page() {
  return <PracticalAiPage locale="nl" area="netherlands" />;
}
