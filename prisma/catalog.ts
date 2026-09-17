/**
 * The product catalogue — shared by `prisma/seed.ts` (which writes it to the
 * database) and `scripts/fetch-photos.ts` (which fetches a photo per `slug`).
 *
 * Names, prices, sizes and flavours are the CLIENT'S REAL MENU, taken from
 * `IRIE_VIANDS_Pastry_and_Celebration_Cake_Menu.pdf` plus the snack list they
 * sent. Prices are RWF, whole francs, as "recommended retail" in that menu.
 *
 * Still placeholder: the photography (stand-ins matched to each product name)
 * and the descriptive copy, which is written to fit the range but has not been
 * approved by the client.
 */

export type SeedVariant = { name: string; priceRwf: number };

export type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  priceRwf: number;
  unit: string;
  allergens: string;
  leadTimeHours?: number;
  isFeatured?: boolean;
  isSoldOut?: boolean;
  variants?: SeedVariant[];
  /** Search term used to fetch the placeholder photo. */
  photoQuery: string;
};

export type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  photoQuery: string;
  products: SeedProduct[];
};

/**
 * The five the client picked to launch with — surfaced on the home page.
 * (Cinnamon Roll, Chicken Pie, Butter Croissant, Chocolate Chip Cookie,
 * Pain au Chocolat.)
 */
export const LAUNCH_PRODUCTS = [
  "cinnamon-roll",
  "chicken-pie",
  "butter-croissant",
  "chocolate-chip-cookie",
  "pain-au-chocolat",
];

// Cake flavours and wedding styles live in src/lib/cake-options.ts — they are
// presentation options rather than sellable products.

export const CATALOG: SeedCategory[] = [
  {
    slug: "pastries",
    name: "Pastries",
    description:
      "Sweet and savoury, baked fresh every morning — croissants, pies, rolls and cookies to take away.",
    photoQuery: "assorted pastries display",
    products: [
      {
        slug: "butter-croissant",
        name: "Butter Croissant",
        description: "Laminated in real butter, shattering crust, honeycomb inside.",
        longDescription:
          "Folded over three days in real butter, which is the only way to get a crust that shatters down your shirt and a honeycomb interior underneath. Best within an hour of the bake, and we will tell you honestly when that was.",
        priceRwf: 3000,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        isFeatured: true,
        photoQuery: "croissants",
      },
      {
        slug: "pain-au-chocolat",
        name: "Pain au Chocolat",
        description: "The same laminated dough, wrapped around two dark batons.",
        longDescription:
          "Our croissant dough folded around two batons of dark chocolate, which soften but never quite melt away. The most presentable thing in the box, and the first to go.",
        priceRwf: 3500,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        isFeatured: true,
        photoQuery: "pain au chocolat",
      },
      {
        slug: "cinnamon-roll",
        name: "Cinnamon Roll",
        description: "Soft coils, dark cinnamon butter, cream cheese glaze.",
        longDescription:
          "An enriched dough rolled around dark brown sugar and cinnamon butter, baked close together so the middles stay soft, then flooded with cream cheese glaze while still hot. Our signature — order two.",
        priceRwf: 3500,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        isFeatured: true,
        photoQuery: "cinnamon rolls",
      },
      {
        slug: "glazed-doughnut",
        name: "Glazed Doughnut",
        description: "Fried in the morning, glazed while still too hot to hold.",
        longDescription:
          "Proofed slowly overnight, fried in the early morning and glazed straight away so the sugar sets to a thin shell. When they are gone they are gone — we do not fry twice.",
        priceRwf: 1500,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "glazed donuts plate",
      },
      {
        slug: "beef-meat-pie",
        name: "Beef Meat Pie",
        description: "Seasoned minced beef and onion in a short, buttery crust.",
        longDescription:
          "Minced beef cooked down with onion and warm spice until it holds together, sealed in a short buttery crust and baked to a deep gold. Substantial enough to be lunch on its own.",
        priceRwf: 3000,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "beef meat pie pastry",
      },
      {
        slug: "sausage-roll",
        name: "Sausage Roll",
        description: "Seasoned sausage in flaky puff pastry, glazed and salted.",
        longDescription:
          "Seasoned sausage rolled in puff pastry, egg-washed and finished with flaked salt. Warm from the counter it is the best two thousand francs in the building.",
        priceRwf: 2500,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "sausage roll pastry",
      },
      {
        slug: "chicken-pie",
        name: "Chicken Pie",
        description: "Creamy chicken filling, short crust, properly filled.",
        longDescription:
          "Chicken and vegetables in a light cream sauce, packed into a short crust that holds up in one hand. The one offices order by the box for morning meetings.",
        priceRwf: 3000,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        isFeatured: true,
        photoQuery: "chicken pie pastry",
      },
      {
        slug: "apple-turnover",
        name: "Apple Turnover",
        description: "Cinnamon apples folded into puff pastry, sugar-crusted.",
        longDescription:
          "Apples cooked down with cinnamon and a little lemon until they hold their shape, folded into puff pastry and baked until the sugar on top turns to glass.",
        priceRwf: 3000,
        unit: "each",
        allergens: "Gluten,Dairy",
        photoQuery: "apple turnover puff pastry",
      },
      {
        slug: "passion-pineapple-danish",
        name: "Passion & Pineapple Danish",
        description: "Vanilla custard, passion fruit and pineapple in laminated pastry.",
        longDescription:
          "A pinwheel of laminated pastry holding vanilla crème pâtissière, then passion fruit and pineapple spooned on and glazed while warm. Sharp, tropical and very much of this place.",
        priceRwf: 3500,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "danish pastry fruit custard",
      },
      {
        slug: "premium-muffin",
        name: "Premium Muffin",
        description: "Tall, domed and generous — flavours change through the week.",
        longDescription:
          "Baked hot to get a proper domed top, then left to cool just enough to hold. Flavours rotate through the week — chocolate, blueberry, banana and whatever the market gave us.",
        priceRwf: 2500,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "muffins bakery",
      },
      {
        slug: "cupcake",
        name: "Cupcake",
        description: "Swirled buttercream, sprinkles, decorated to match your day.",
        longDescription:
          "A light sponge under a high swirl of buttercream. Tell us the colours and we will match them — these are what most Kigali offices put on the table for a birthday.",
        priceRwf: 2500,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "cupcakes buttercream swirl",
      },
      {
        slug: "banana-bread-slice",
        name: "Banana Bread Slice",
        description: "Very ripe bananas, brown butter, a crackled sugar top.",
        longDescription:
          "We wait for the bananas to go properly black before they go anywhere near the mixer, and we brown the butter first. Cut thick, with a demerara top that crackles.",
        priceRwf: 2000,
        unit: "per slice",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "banana bread sliced",
      },
      {
        slug: "chocolate-chip-cookie",
        name: "Chocolate Chip Cookie",
        description: "Crisp edge, soft middle, proper chunks of dark chocolate.",
        longDescription:
          "Rested overnight so the flavour deepens, baked until the edges set but the middle is still soft, with chunks rather than chips so you get pools of chocolate. The easiest thing to add to any order.",
        priceRwf: 2000,
        unit: "each",
        allergens: "Gluten,Dairy,Eggs",
        isFeatured: true,
        photoQuery: "chocolate chip cookies",
      },
      {
        slug: "mini-pizza-pastry",
        name: "Mini Pizza Pastry",
        description: "Tomato, cheese and herbs on a crisp pastry base.",
        longDescription:
          "A crisp pastry base with tomato, melted cheese and herbs — small enough to eat standing up, savoury enough to count as a proper snack.",
        priceRwf: 3000,
        unit: "each",
        allergens: "Gluten,Dairy",
        photoQuery: "mini pizza",
      },
      {
        slug: "palmier",
        name: "Palmier",
        description: "Caramelised puff pastry hearts, crisp all the way through.",
        longDescription:
          "Puff pastry rolled in demerara and folded into hearts, baked until the sugar caramelises right to the edge. Crisp all the way through, and they keep for a week in a tin.",
        priceRwf: 2500,
        unit: "each",
        allergens: "Gluten,Dairy",
        photoQuery: "palmiers pastry",
      },
    ],
  },
  {
    slug: "cakes",
    name: "Celebration Cakes",
    description:
      "Birthdays, weddings and every occasion between — decorated by hand, made to order.",
    photoQuery: "decorated birthday cake",
    products: [
      {
        slug: "classic-birthday-cake",
        name: "Classic Birthday Cake",
        description: "Your flavour, your colours, your message piped by hand.",
        longDescription:
          "Choose a classic flavour — vanilla, chocolate, marble, carrot or banana — tell us the name and the age, and we will pipe it by hand. Sprinkles included whether you asked for them or not.",
        priceRwf: 25000,
        unit: "6 inch round",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 48,
        isFeatured: true,
        variants: [
          { name: "6 inch — serves 8–10", priceRwf: 25000 },
          { name: "8 inch — serves 15–20", priceRwf: 40000 },
        ],
        photoQuery: "birthday cake candles",
      },
      {
        slug: "premium-birthday-cake",
        name: "Premium Birthday Cake",
        description: "A premium flavour and a finish to match the occasion.",
        longDescription:
          "Built on the premium flavour list — red velvet, chocolate fudge, black forest, salted caramel, cookies and cream and more — with a cleaner, taller finish than the classic. For the birthdays that matter.",
        priceRwf: 50000,
        unit: "8 inch round",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 48,
        variants: [
          { name: "8 inch — serves 15–20", priceRwf: 50000 },
          { name: "10 inch — serves 25–30", priceRwf: 70000 },
        ],
        photoQuery: "frosted layer cake",
      },
      {
        slug: "drip-cake",
        name: "Drip Cake",
        description: "Ganache poured over the top and left to run down the sides.",
        longDescription:
          "Ganache poured warm over a chilled cake so it runs down the sides and sets where it stops, then loaded on top with whatever the occasion calls for. The one that photographs best.",
        priceRwf: 55000,
        unit: "8 inch round",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 48,
        isFeatured: true,
        variants: [
          { name: "8 inch — serves 15–20", priceRwf: 55000 },
          { name: "10 inch — serves 25–30", priceRwf: 75000 },
        ],
        photoQuery: "chocolate ganache cake",
      },
      {
        slug: "photo-theme-cake",
        name: "Photo / Theme Cake",
        description: "An edible print of your photo, or a theme built to order.",
        longDescription:
          "Send us the photo or the theme and we will build the cake around it, with an edible print finished by hand. Priced from 60,000 RWF — the final quote depends on how much handwork the design needs. Three days notice.",
        priceRwf: 60000,
        unit: "8 inch round · from",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 72,
        photoQuery: "photo print cake decorated",
      },
      {
        slug: "kids-character-cake",
        name: "Kids Character Cake",
        description: "Their favourite character, modelled and coloured by hand.",
        longDescription:
          "Whatever they are obsessed with this month, modelled and coloured by hand. Priced from 55,000 RWF depending on the character and how much sculpting it takes. Three days notice.",
        priceRwf: 55000,
        unit: "8 inch round · from",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 72,
        photoQuery: "kids character birthday cake",
      },
      {
        slug: "red-velvet-cake",
        name: "Red Velvet Cake",
        description: "Deep crimson crumb with tangy cream cheese frosting.",
        longDescription:
          "A proper red velvet: buttermilk and a whisper of cocoa for that soft, faintly tangy crumb, under a cream cheese frosting sharp enough to cut the sweetness. Finished with velvet crumbs around the sides.",
        priceRwf: 50000,
        unit: "8 inch round",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 48,
        isFeatured: true,
        photoQuery: "red velvet cake",
      },
      {
        slug: "chocolate-fudge-cake",
        name: "Chocolate Fudge Cake",
        description: "Dark layers under a thick blanket of fudge ganache.",
        longDescription:
          "Layers of deep, damp chocolate sponge, each one soaked and stacked with a fudge ganache made from dark chocolate, then finished in a thick swoop of the same. This is the cake people come back for.",
        priceRwf: 50000,
        unit: "8 inch round",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 48,
        photoQuery: "chocolate fudge layer cake",
      },
      {
        slug: "luxury-floral-cake",
        name: "Luxury Floral Cake",
        description: "Fresh or sugar flowers, arranged the morning it goes out.",
        longDescription:
          "Fresh or sugar flowers arranged the morning the cake goes out, so nothing has wilted by the time it reaches the table. Priced from 65,000 RWF depending on the flowers. Three days notice.",
        priceRwf: 65000,
        unit: "8 inch round · from",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 72,
        photoQuery: "cake decorated fresh flowers",
      },
      {
        slug: "wedding-cake",
        name: "Wedding Cake",
        description: "Tiered, hand-finished, tasted with you before the day.",
        longDescription:
          "Tiered wedding cakes finished by hand in whatever style you bring us — buttercream, semi-naked, fondant, fresh-flower or fully decorated. Every couple gets a tasting before the deposit. Two weeks notice at least; talk to us early for peak season.",
        priceRwf: 100000,
        unit: "per tier set · from",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 336,
        isFeatured: true,
        variants: [
          { name: "1 tier — 30–40 servings", priceRwf: 100000 },
          { name: "2 tiers — 50–70 servings", priceRwf: 180000 },
          { name: "3 tiers — 80–120 servings", priceRwf: 300000 },
          { name: "4 tiers — 150+ servings", priceRwf: 450000 },
        ],
        photoQuery: "tiered wedding cake",
      },
    ],
  },
  {
    slug: "boxes",
    name: "Boxes & Combos",
    description:
      "Assorted boxes for the office, the family table, or two people and a coffee.",
    photoQuery: "box of assorted pastries",
    products: [
      {
        slug: "breakfast-duo",
        name: "Breakfast Duo",
        description: "A butter croissant and a coffee, for the walk to work.",
        longDescription:
          "One butter croissant and one coffee. The simplest thing on the menu and the one most people order before eight in the morning.",
        priceRwf: 5000,
        unit: "croissant + coffee",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "coffee and croissant breakfast",
      },
      {
        slug: "sweet-duo",
        name: "Sweet Duo",
        description: "A cinnamon roll and a chocolate chip cookie.",
        longDescription:
          "Our signature cinnamon roll with a chocolate chip cookie alongside. Enough for two people, or one person having a day.",
        priceRwf: 5000,
        unit: "roll + cookie",
        allergens: "Gluten,Dairy,Eggs",
        photoQuery: "sweet pastries plate",
      },
      {
        slug: "office-box",
        name: "Office Box",
        description: "Six assorted pastries, boxed for the morning meeting.",
        longDescription:
          "Six assorted pastries chosen across sweet and savoury, boxed and ready to put on a table. Tell us if anyone has an allergy and we will pack around it.",
        priceRwf: 17000,
        unit: "6 assorted",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 12,
        isFeatured: true,
        photoQuery: "box of assorted pastries",
      },
      {
        slug: "family-box",
        name: "Family Box",
        description: "Twelve assorted pastries for the table at home.",
        longDescription:
          "Twelve assorted pastries across the whole range — croissants, pies, rolls and something sweet. The Sunday morning order.",
        priceRwf: 32000,
        unit: "12 assorted",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 12,
        photoQuery: "pastries tray assorted",
      },
      {
        slug: "premium-box",
        name: "Premium Box",
        description: "Six of the premium pastries, presented to give away.",
        longDescription:
          "Six of the premium pastries — the laminated ones and the filled ones — boxed and presented well enough to arrive as a gift.",
        priceRwf: 20000,
        unit: "6 premium",
        allergens: "Gluten,Dairy,Eggs",
        leadTimeHours: 12,
        photoQuery: "pastries box",
      },
    ],
  },
];

/** Atmosphere shots for the gallery that are not tied to a single product. */
export const GALLERY_EXTRAS = [
  { slug: "bakery-counter", caption: "The counter, just after opening", tag: "bakery", photoQuery: "bread display bakery" },
  { slug: "baker-hands-dough", caption: "Shaping the morning batch", tag: "bakery", photoQuery: "baker hands kneading dough" },
  { slug: "pastry-tray", caption: "Viennoiserie, seven in the morning", tag: "pastries", photoQuery: "tray of croissants pastries bakery" },
  { slug: "cake-decorating", caption: "Finishing a celebration cake by hand", tag: "cakes", photoQuery: "cake decorating" },
  { slug: "coffee-and-pastry", caption: "Coffee and a croissant, most mornings", tag: "bakery", photoQuery: "coffee cup croissant table" },
  { slug: "cake-table-celebration", caption: "A table we were proud of", tag: "cakes", photoQuery: "celebration dessert table cakes" },
  { slug: "savoury-pies", caption: "Pies out of the oven at eleven", tag: "pastries", photoQuery: "meat pies" },
  { slug: "cookies-cooling", caption: "Cookies, still cooling", tag: "pastries", photoQuery: "cookies cooling rack" },
];

/** Hero and section imagery. */
export const FEATURE_IMAGES = [
  { slug: "hero-main", photoQuery: "assorted pastries croissants cakes" },
  { slug: "hero-story", photoQuery: "bakery kitchen shaping dough" },
  { slug: "custom-cake-hero", photoQuery: "cake decorated flowers" },
];

export const ALL_PRODUCTS = CATALOG.flatMap((c) => c.products);
