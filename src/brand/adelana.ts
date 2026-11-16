// Per-brand config. The template reads everything brand-specific from here so a
// new pitch = a new file like this one. UNCONFIRMED: tokens inferred from the
// brand's Instagram (PRD Section 6); owner must supply approved assets.
export type Brand = {
  id: string;
  name: string;
  tagline: string;
  currency: "NGN";
  whatsapp: string; // digits only, international format
  tokens: {
    ground: string;
    surface: string;
    text: string;
    muted: string;
    gold: string;
    accent: string;
    sold: string;
  };
  scene: { fog: string; keyLight: string; rimLight: string };
};

export const brand: Brand = {
  id: "adelana",
  name: "adeLAna",
  tagline: "Hand-embellished, one-of-one. Lagos.",
  currency: "NGN",
  whatsapp: "2348101169734",
  tokens: {
    ground: "#0B0B0C",
    surface: "#151314",
    text: "#EDE3D0",
    muted: "#A89F90",
    gold: "#C9A24B",
    accent: "#E8478B",
    sold: "#7A7266",
  },
  scene: { fog: "#0B0B0C", keyLight: "#fff1d6", rimLight: "#b5301f" },
};
