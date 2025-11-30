import { Suspense } from "react";
import ExpenseEditPage from "./ExpenseEditPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ExpenseEditPage />
    </Suspense>
  );
}
