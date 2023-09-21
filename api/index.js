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

const shoppingListDb = {
  0: [
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
  ],
};

app.get("/shopping-list/:list_id", (req, res) => {
  res.status(200).json(shoppingListDb[0]);
});

app.post("/shopping-list/:list_id", (req, res) => {
  const itemData = req.body;
  const shoppingList = shoppingListDb[0];
  const lastId =
    shoppingList.length > 0 ? shoppingList[shoppingList.length - 1].id : 1;
  itemData.id = lastId + 1;
  shoppingList.push(itemData);
  res.status(200).json({ message: "Item added" });
});

app.delete("/shopping-list/:list_id", (req, res) => {
  const itemId = req.body.itemId;
  const shoppingList = shoppingListDb[0];
  const indexToDelete = shoppingList.findIndex((item) => item.id == itemId);

  if (indexToDelete >= 0) {
    shoppingList.splice(indexToDelete, 1);
  }

  res.status(200).json({ message: "Item deleted" });
});

app.put("/shopping-list/change-status/:list_id/:item_id", (req, res) => {
  const shoppingList = shoppingListDb[0];
  for (let i = 0; i < shoppingList.length; i++) {
    if (shoppingList[i].id == req.params.item_id) {
      shoppingList[i].bought = req.body.bought;
      break;
    }
  }
  res.status(200).json({ message: "Item updated" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
