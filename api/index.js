import express from "express";
import url from "url";
import path from "path";

const PORT = process.env.PORT || 80;
const app = express();

/* Set-up the public folder for pages */
const currentPath = url.fileURLToPath(import.meta.url);
const publicFoder = path.join(currentPath, "../..", "public");
app.use(express.static(publicFoder));

/* Auto convert body to JSON */
app.use(express.json());

const shoppingListDb = [
  {
    id: 1,
    product: "Arroz",
    brand: "Broto Legal",
    measure: "kg",
    amount: 5,
    forecasted_price: 8.99,
    bought: false,
  },
  {
    id: 2,
    product: "Feijão",
    brand: "Broto Legal",
    measure: "kg",
    amount: 2,
    forecasted_price: 14.99,
    bought: false,
  },
  {
    id: 3,
    product: "Papel Toalha",
    brand: "Snob",
    measure: "un",
    amount: 3,
    forecasted_price: 5.0,
    bought: false,
  },
  {
    id: 4,
    product: "Coxinha de Frango",
    brand: "Açougue",
    measure: "kg",
    amount: 1,
    forecasted_price: 5.0,
    bought: false,
  },
];

app.get("/shopping-list/:id", (req, res) => {
  res.status(200).json(shoppingListDb);
});

app.put("/shopping-list/:id", (req, res) => {
  for (let i = 0; i < shoppingListDb.length; i++) {
    if (shoppingListDb[i].id == req.body.id) {
      shoppingListDb[i].bought = req.body.bought;
      break;
    }
  }
  res.status(200).json({ message: "Item updated" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
