import { apiFetch } from "./api";

/* ===== GET SAVED CARDS ===== */
export function getSavedCards() {
  return apiFetch("/payments/cards", { auth: true });
}

/* ===== CREATE SETUP INTENT ===== */
export function createSetupIntent() {
  return apiFetch("/payments/save-card", {
    method: "POST",
    auth: true,
  });
}

/* ===== DELETE CARD ===== */
export function deleteCard(pmId) {
  return apiFetch(`/payments/cards/${pmId}`, {
    method: "DELETE",
    auth: true,
  });
}
