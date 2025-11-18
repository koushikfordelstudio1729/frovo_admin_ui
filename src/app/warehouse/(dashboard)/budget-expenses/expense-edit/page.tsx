import { Suspense } from "react";
import ExpenseEditPage from "./ExpenseEditPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpenseEditPage />
    </Suspense>
  );
}
