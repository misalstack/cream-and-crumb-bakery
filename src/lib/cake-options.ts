/**
 * Cake flavours and wedding styles, from the client's menu
 * (`IRIE_VIANDS_Pastry_and_Celebration_Cake_Menu.pdf`).
 *
 * These are presentation options rather than sellable products, so they live
 * here rather than in the seed catalogue — the custom cakes page and the
 * enquiry form both read them.
 */

export const CAKE_FLAVOURS = {
  classic: ["Vanilla", "Chocolate", "Marble", "Carrot", "Banana"],
  premium: [
    "Red Velvet",
    "Chocolate Fudge",
    "Black Forest",
    "Lemon & Vanilla",
    "Coconut",
    "Passion Fruit",
    "Salted Caramel",
    "Cookies & Cream",
  ],
  wedding: [
    "Vanilla & Passion Fruit",
    "Red Velvet & Cream Cheese",
    "Chocolate & Salted Caramel",
    "Lemon & Vanilla",
    "Coconut & Passion Fruit",
  ],
};

/** Every flavour, flattened and de-duplicated, for the enquiry form. */
export const ALL_FLAVOURS = [
  ...new Set([...CAKE_FLAVOURS.classic, ...CAKE_FLAVOURS.premium, ...CAKE_FLAVOURS.wedding]),
];

/** Wedding cake styles and their starting prices in RWF. */
export const WEDDING_STYLES = [
  { style: "Buttercream", fromRwf: 100000 },
  { style: "Semi-naked", fromRwf: 120000 },
  { style: "Fondant", fromRwf: 180000 },
  { style: "Fresh-flower", fromRwf: 200000 },
  { style: "Luxury decorated", fromRwf: 300000 },
  { style: "Custom 4-tier / large event", fromRwf: 450000 },
];
