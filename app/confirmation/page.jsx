import { Suspense } from "react";
import ConfirmationPage from "./ConfirmationPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationPage />
    </Suspense>
  );
}
