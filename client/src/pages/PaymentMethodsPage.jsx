import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement
} from "@stripe/react-stripe-js";

import {
  getSavedCards,
  createSetupIntent,
  deleteCard
} from "../lib/paymentsApi.js";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { ArrowLeft, CreditCard, Trash2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/* ======================================================
   ADD CARD MODAL
====================================================== */
function AddCardModal({ onClose, onCardAdded }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const [billing, setBilling] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });

  useEffect(() => {
    createSetupIntent().then((res) => {
      setClientSecret(res.clientSecret);
    });
  }, []);

  async function handleSave() {
    if (!stripe || !elements) return;

    setLoading(true);

    const card = elements.getElement(CardElement);

    const { error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: billing.name,
          address: {
            line1: billing.address,
            city: billing.city,
            state: billing.state,
            postal_code: billing.zip
          }
        }
      }
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    onCardAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-[#0A2540] mb-4">
          Add New Card
        </h2>

        <div className="space-y-3 mb-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Name on card"
            value={billing.name}
            onChange={(e) => setBilling({ ...billing, name: e.target.value })}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Address"
            value={billing.address}
            onChange={(e) => setBilling({ ...billing, address: e.target.value })}
          />

          <div className="flex gap-2">
            <input
              className="border p-2 w-full rounded"
              placeholder="City"
              value={billing.city}
              onChange={(e) => setBilling({ ...billing, city: e.target.value })}
            />
            <input
              className="border p-2 w-full rounded"
              placeholder="State"
              value={billing.state}
              onChange={(e) => setBilling({ ...billing, state: e.target.value })}
            />
          </div>

          <input
            className="border p-2 w-full rounded"
            placeholder="ZIP"
            value={billing.zip}
            onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
          />
        </div>

        <div className="border border-gray-300 rounded p-3 mb-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#0A2540",
                  fontFamily: "Arial, sans-serif",
                  "::placeholder": {
                    color: "#94A3B8"
                  }
                },
                invalid: {
                  color: "#EF4444"
                }
              }
            }}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleSave}>
            {loading ? "Saving..." : "Save Card"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   APPLE PAY / GOOGLE PAY BUTTON
====================================================== */
function ApplePayButton() {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: { label: "Test Payment", amount: 100 },
      requestPayerName: true,
      requestPayerEmail: true
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
  }, [stripe]);

  if (!paymentRequest) return null;

  return (
    <div className="mt-4">
      <PaymentRequestButtonElement options={{ paymentRequest }} />
    </div>
  );
}

/* ======================================================
   MAIN PAGE
====================================================== */
export default function PaymentMethodsPage({ onNavigate }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  async function loadCards() {
    setLoading(true);
    try {
      const res = await getSavedCards();
      setCards(res);
    } catch (err) {
      alert("Failed to load saved cards");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCards();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this card?")) return;

    try {
      await deleteCard(id);
      loadCards();
    } catch (err) {
      alert("Error deleting card");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#0A2540]"
            onClick={() => onNavigate("profile")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <p className="text-[#0A2540] font-semibold">Payment Methods</p>
            <p className="text-xs text-gray-500">
              Manage your saved cards and Apple Pay
            </p>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Saved Cards */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg text-[#0A2540]">Saved Cards</h3>
            <Button onClick={() => setShowAddModal(true)}>Add Card</Button>
          </div>

          <Separator />

          {loading ? (
            <p className="text-gray-500 mt-4">Loading...</p>
          ) : cards.length === 0 ? (
            <p className="text-gray-500 mt-4">No saved cards.</p>
          ) : (
            <div className="space-y-3 mt-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-[#06B6D4]" />
                    <div>
                      <p className="font-semibold text-[#0A2540]">
                        {card.card.brand.toUpperCase()} •••• {card.card.last4}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {card.card.exp_month}/{card.card.exp_year}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDelete(card.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Apple Pay */}
        <Elements stripe={stripePromise}>
          <ApplePayButton />
        </Elements>
      </div>

      {showAddModal && (
        <Elements stripe={stripePromise}>
          <AddCardModal
            onClose={() => setShowAddModal(false)}
            onCardAdded={loadCards}
          />
        </Elements>
      )}
    </div>
  );
}
