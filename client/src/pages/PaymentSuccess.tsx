import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { confirmCheckoutSession } from "../lib/paymentsApi";

export function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<any | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("Missing Stripe session_id.");
      setLoading(false);
      return;
    }

    async function confirm() {
      try {
        const result = await confirmCheckoutSession(sessionId);
        setBooking(result);
      } catch (e: any) {
        setError(e.message || "Unable to confirm checkout.");
      } finally {
        setLoading(false);
      }
    }

    confirm();
  }, []);

  const goHome = () => {
    window.location.href = "/";
  };

  const goToBookings = () => {
    window.location.href = "/?view=bookings";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-xl p-8 space-y-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <h1 className="text-2xl font-semibold text-gray-900">
            {loading
              ? "Confirming your booking…"
              : error
              ? "We hit a snag"
              : "Payment confirmed!"}
          </h1>
          <p className="text-gray-600">
            {loading &&
              "Retrieving your payment details from Stripe. Hang tight."}
            {!loading && error && error}
            {!loading && !error && booking && (
              <>
                Your parking spot is locked in. We also emailed your receipt.
              </>
            )}
          </p>
        </div>

        {!loading && !error && booking && (
          <div className="text-left bg-gray-100 rounded-lg p-4 text-sm text-gray-700 space-y-1">
            <div className="font-semibold text-gray-900">
              Reservation Details
            </div>
            <div>
              Spot ID: <span className="font-mono">{booking.listingId}</span>
            </div>
            <div>
              Starts:{" "}
              {new Date(booking.start).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
            <div>
              Ends:{" "}
              {new Date(booking.end).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
            <div>Total paid: ${booking.totalPrice}</div>
            <div className="text-xs text-gray-500">
              Payment reference: {booking.paymentId}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={goHome}
            disabled={loading}
          >
            Back to home
          </Button>
          <Button className="flex-1" onClick={goToBookings} disabled={loading}>
            View my bookings
          </Button>
        </div>
      </Card>
    </div>
  );
}

