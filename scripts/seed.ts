import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const name = process.env.MONGODB_DB;
if (!uri || !name || !["127.0.0.1", "localhost"].includes(new URL(uri).hostname) || name !== "wtf2cook_dev") {
  throw new Error("Seed refuses anything except the localhost wtf2cook_dev database");
}

const now = new Date();
const recipes = [
  { id: "burger01", name: "The really good burger", description: "Crisp edges, melty cheese and a sauce worth making twice.", photo_url: "/images/burger.jpg", servings: 4, time_prep: 20, time_cook: 15, ingredients: [{ title: "For the burgers", ingredients: ["500 g ground beef", "4 brioche buns", "4 slices cheddar", "Lettuce and tomato"] }, { title: "For the sauce", ingredients: ["3 tbsp mayonnaise", "1 tbsp ketchup", "1 tsp mustard"] }], instructions: [{ title: null, instructions: ["Mix the sauce and set it aside.", "Shape the beef into four loose patties and season well.", "Sear in a hot pan until browned, then add cheese.", "Toast the buns, build the burgers, and serve while hot."] }] },
  { id: "pasta001", name: "Lemon butter pasta", description: "Bright, silky and ready before you can decide what to watch.", servings: 2, time_prep: 10, time_cook: 15, ingredients: [{ title: null, ingredients: ["250 g pasta", "1 lemon", "40 g butter", "Parmesan", "Black pepper"] }], instructions: [{ title: null, instructions: ["Cook pasta in well-salted water.", "Melt butter with lemon zest and a splash of pasta water.", "Toss pasta into the sauce with Parmesan and pepper.", "Finish with lemon juice and serve."] }] },
  { id: "tacos001", name: "Smoky weeknight tacos", description: "A little heat, a lot of crunch, and almost no washing up.", servings: 4, time_prep: 15, time_cook: 20, ingredients: [{ title: null, ingredients: ["8 small tortillas", "400 g mushrooms", "1 tsp smoked paprika", "1 avocado", "1 lime", "Coriander"] }], instructions: [{ title: null, instructions: ["Slice and sear the mushrooms with smoked paprika.", "Warm tortillas in a dry pan.", "Add mushrooms, avocado, lime and coriander."] }] },
  { id: "salad001", name: "Big green crunchy salad", description: "Not a side salad. The whole, glorious lunch.", servings: 2, time_prep: 20, time_cook: 0, ingredients: [{ title: null, ingredients: ["1 cucumber", "1 avocado", "A handful of greens", "Chickpeas", "Feta", "Olive oil and lemon"] }], instructions: [{ title: null, instructions: ["Chop everything into generous bite-size pieces.", "Toss with olive oil, lemon and salt.", "Top with feta and eat immediately."] }] },
  { id: "toast001", name: "Crispy mushroom toast", description: "Golden toast under buttery mushrooms and soft herbs.", servings: 2, time_prep: 8, time_cook: 12, ingredients: [{ title: null, ingredients: ["250 g mushrooms", "2 thick slices sourdough", "2 tbsp butter", "1 clove garlic", "Parsley"] }], instructions: [{ title: null, instructions: ["Toast the bread until deeply golden.", "Sear mushrooms in butter without crowding the pan.", "Add garlic and parsley, then spoon over toast."] }] },
  { id: "rice0001", name: "Ginger sesame rice bowl", description: "Comfort food with enough zing to keep it interesting.", servings: 2, time_prep: 10, time_cook: 20, ingredients: [{ title: null, ingredients: ["1 cup rice", "2 eggs", "1 carrot", "1 tbsp soy sauce", "Fresh ginger", "Sesame seeds"] }], instructions: [{ title: null, instructions: ["Cook the rice.", "Fry the eggs and shred the carrot.", "Mix soy sauce with grated ginger.", "Build bowls and scatter sesame seeds on top."] }] },
];

async function main() {
  if (!uri) throw new Error("MONGODB_URI is missing");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db(name).collection("recipes");
    await collection.createIndex({ id: 1 }, { unique: true });
    for (const recipe of recipes) {
      await collection.updateOne({ id: recipe.id }, { $setOnInsert: {
        ...recipe, photo_url: "photo_url" in recipe ? recipe.photo_url : "", user_id: "local-seed-owner", seed: true,
        time_chill: 0, time_total: recipe.time_prep + recipe.time_cook, notes: "",
        created_at: now, updated_at: now,
      } }, { upsert: true });
    }
    console.log(`Seeded ${recipes.length} sample recipes in ${name} (existing records kept).`);
  } finally {
    await client.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
