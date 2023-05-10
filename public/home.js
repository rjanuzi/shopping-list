const shoppingListElement = document.getElementById("shopping-list");

// TODO - How to make this function available into the HTML to be called by the onclick event?
function shoppingListClickHandler(event) {
  const target = event.target;
  console.log(target);
}

/**
 *
 * This function generates the HTML for the shopping list item to be rendered at the page.
 * @param {object} itemData The data of the item to be rendered.
 * @returns {string} The HTML of the item to be rendered.
 */
function genItemHtml(itemData) {
  let html_item = `
              <li id=${itemData.id} class="list-group-item" onclick="shoppingListClickHandler">
                  <input
                      class="form-check-input me-1"
                      type="checkbox"
                      value=""
                      id="${itemData.product}_CheckboxStretched"
                  />
                  <label
                      class="form-check-label stretched-link"
                      for="${itemData.product}_CheckboxStretched"
                      >`;

  if (itemData.bought) {
    html_item += `<del><b>${itemData.amount}${itemData.measure}</b></del>`;
  } else {
    html_item += `<b>${itemData.amount}${itemData.measure}</b>`;
  }

  html_item += `${itemData.product}</label></li>`;

  return html_item;
}

/**
 * This function gets the shopping list from the API.
 * @returns {Promise} The promise of the shopping list.
 * @async
 */
async function getShoppingList() {
  const response = await fetch("/shopping-list/0");
  return await response.json();
}

/**
 *
 * This function fills the shopping list with the data from the API.
 * @param {object[]} shoppingList The shopping list to be rendered.
 */
function fillShoppingList(shoppingList) {
  shoppingListElement.innerHTML = "";

  shoppingList.forEach((listItem) => {
    shoppingListElement.innerHTML += genItemHtml(listItem);
  });
}

/**
 * This function updates the shopping list.
 */
function updateShoppingList() {
  getShoppingList().then(fillShoppingList);
}

/* Update the shipping list at page load */
updateShoppingList();
