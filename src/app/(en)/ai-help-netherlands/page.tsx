import { PracticalAiPage, practicalAiMetadata } from "@/components/practical-ai-page";

export const metadata = practicalAiMetadata("en", "netherlands");

export default function Page() {
  return <PracticalAiPage locale="en" area="netherlands" />;
}
