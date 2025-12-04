import Listing from "../models/Listing.js";

function parseNumber(value) {
  if (value === undefined || value === null) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeAmenities(spotAmenities = {}, overrideAmenities = {}) {
  return {
    bathroom:
      overrideAmenities.bathroom ??
      spotAmenities.bathroom ??
      false,
    evCharging:
      overrideAmenities.evCharging ??
      overrideAmenities.ev ??
      spotAmenities.evCharging ??
      spotAmenities.ev ??
      false,
    shuttle:
      overrideAmenities.shuttle ??
      spotAmenities.shuttle ??
      false,
    tailgateFriendly:
      overrideAmenities.tailgateFriendly ??
      spotAmenities.tailgateFriendly ??
      false,
    overnightAllowed:
      overrideAmenities.overnightAllowed ??
      spotAmenities.overnightAllowed ??
      false,
  };
}

export function canPublishListing(spot, overrides = {}) {
  const lat = parseNumber(overrides.latitude ?? overrides.lat ?? spot?.latitude ?? spot?.lat);
  const lng = parseNumber(overrides.longitude ?? overrides.lng ?? spot?.longitude ?? spot?.lng);
  const price = parseNumber(overrides.price ?? spot?.price);
  const spaces = parseNumber(overrides.spacesAvailable ?? spot?.spacesAvailable);
  const eventDate = parseDate(overrides.eventDate ?? spot?.eventDate);
  const startTime = overrides.startTime ?? spot?.startTime;
  const endTime = overrides.endTime ?? spot?.endTime;

  return (
    lat !== null &&
    lng !== null &&
    price !== null &&
    price > 0 &&
    spaces !== null &&
    spaces > 0 &&
    !!eventDate &&
    !!startTime &&
    !!endTime
  );
}

export async function upsertListingFromSpot(spot, overrides = {}) {
  if (!spot || !canPublishListing(spot, overrides)) {
    return null;
  }

  const lat = parseNumber(overrides.latitude ?? overrides.lat ?? spot.latitude);
  const lng = parseNumber(overrides.longitude ?? overrides.lng ?? spot.longitude);
  const price = parseNumber(overrides.price ?? spot.price) ?? 0;
  const spaces = parseNumber(overrides.spacesAvailable ?? spot.spacesAvailable) ?? 0;
  const date = parseDate(overrides.eventDate ?? spot.eventDate);

  const amenities = normalizeAmenities(spot.amenities, overrides.amenities);

  const listingPayload = {
    spotId: spot._id,
    title:
      overrides.title ??
      spot.title ??
      spot.hostName ??
      "Parking Spot",
    description: overrides.description ?? spot.description ?? "",
    eventName:
      overrides.eventName ??
      spot.eventName ??
      spot.closestStadium ??
      "",
    address: overrides.address ?? spot.address ?? "",
    closestStadium:
      overrides.closestStadium ?? spot.closestStadium ?? "",
    lat,
    lng,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
    date,
    startTime: overrides.startTime ?? spot.startTime,
    endTime: overrides.endTime ?? spot.endTime,
    price,
    pricePerHour: price,
    spacesAvailable: spaces,
    isActive: overrides.isActive ?? spot.isActive ?? true,
    amenities,
  };

  const listing = await Listing.findOneAndUpdate(
    { spotId: spot._id },
    {
      $set: {
        ...listingPayload,
        status:
          spaces > 0 ? "active" : "inactive",
      },
      $setOnInsert: { status: "active" },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!spot.listingId || spot.listingId.toString() !== listing._id.toString()) {
    spot.listingId = listing._id;
    await spot.save();
  }

  return listing;
}

