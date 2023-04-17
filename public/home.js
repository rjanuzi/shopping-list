const shoppingListElement = document.getElementById("shopping-list");

function genItemHtml(itemData) {
  return `
            <li class="list-group-item">
                <input
                    class="form-check-input me-1"
                    type="checkbox"
                    value=""
                    id="firstCheckboxStretched"
                />
                <label
                    class="form-check-label stretched-link"
                    for="firstCheckboxStretched"
                    ><b>${itemData.amount}${itemData.measure}</b> ${itemData.product}</label
                >
            </li>
            `;
}

async function getShoppingList() {
  const response = await fetch("/shopping-list/0");
  return await response.json();
}

function fillShoppingList(shoppingList) {
  shoppingListElement.innerHTML = "";

  shoppingList.forEach((listItem) => {
    console.log(listItem);
    shoppingListElement.innerHTML += genItemHtml(listItem);
  });
}

function updateShoppingList() {
  getShoppingList().then(fillShoppingList);
}

/* Run at render */
updateShoppingList();
