import { XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function PaymentCancel() {
  const startOver = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg p-8 text-center space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <XCircle className="w-12 h-12 text-rose-500" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Checkout canceled
          </h1>
          <p className="text-gray-600">
            No worries—your card wasn’t charged. You can hop back in and try
            again whenever you’re ready.
          </p>
        </div>

        <Button className="w-full" onClick={startOver}>
          Browse spots
        </Button>
      </Card>
    </div>
  );
}

