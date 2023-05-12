const SHOPPING_LIST_ITEM_UPDATE_URL = "/shopping-list";

const shoppingListElement = document.getElementById("shopping-list");

/**
 * This function updates the shopping list component at the page.
 */
function updateShoppingList() {
  getShoppingList().then(fillShoppingList);
}

/**
 *
 * This function updates the view of the shopping list item at the page.
 *
 * @param {int} itemId
 * @param {boolean} isBought
 */
function updateShippingListItemView(itemId, isBought) {
  const itemElement = document.getElementById(itemId);
  const labelElement = itemElement.nextElementSibling;

  /* Ensure checkbox is correct */
  itemElement.checked = isBought;
  if (isBought) {
    labelElement.innerHTML = `<del><b>${labelElement.innerHTML}</b></del>`;
  } else {
    labelElement.innerHTML = labelElement.innerHTML.replace("<del>", "");
    labelElement.innerHTML = labelElement.innerHTML.replace("</del>", "");
  }
}

/**
 *
 * This function posts the new status of the shopping list item to the backend API.
 *
 * @param {int} itemId
 * @param {boolean} isBought
 */
async function postShippingListItemStatusChange(itemId, isBought) {
  const url = `${SHOPPING_LIST_ITEM_UPDATE_URL}/${itemId}`;
  const itemDataJson = JSON.stringify({ id: itemId, bought: isBought });

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: itemDataJson,
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Failed to update item");
      }
    })
    .catch((error) => {
      alert(error);

      /* Rollback the view, basically the inverse of the status */
      updateShippingListItemView(itemId, !isBought);
    });
}

/**
 *
 * This function handles the click event on the shopping list items. It will communicate with the backend
 * to keep the sync between the page and the database, marking the item as bought or not.
 *
 * @param {Event} e Click event.
 */
function shoppingListClickHandler(e) {
  if (e.target && e.target.matches("input")) {
    const target = e.target;
    const shoppingListItemId = target.value;
    const isBought = target.checked;

    /* Update the element status in the screen */
    updateShippingListItemView(shoppingListItemId, isBought);

    /* Update the shipping list item status in the backend */
    postShippingListItemStatusChange(shoppingListItemId, isBought);
  }
}

/**
 *
 * This function generates the HTML for the shopping list item to be rendered at the page.
 * @param {object} itemData The data of the item to be rendered.
 * @returns {string} The HTML of the item to be rendered.
 */
function genItemHtml(itemData) {
  let html_item = `
              <li class="list-group-item">
                  <input
                      id=${itemData.id}
                      class="form-check-input me-1"
                      type="checkbox"
                      value="${itemData.id}"
                      ${itemData.bought ? "checked" : ""}
                  />
                  <label
                      class="form-check-label stretched-link"
                      for="${itemData.id}"
                      >`;

  if (itemData.bought) {
    html_item += `<del><b>${itemData.amount}${itemData.measure}</b> ${itemData.product}</label></li></del>`;
  } else {
    html_item += `<b>${itemData.amount}${itemData.measure}</b> ${itemData.product}</label></li>`;
  }

  return html_item;
}

function appendShoppingListItem(itemHtml) {
  /* Create the page element */
  const range = document.createRange();
  const documentFragment = range.createContextualFragment(itemHtml);

  /* Add event listener to the element */
  documentFragment.firstElementChild.addEventListener(
    "click",
    shoppingListClickHandler
  );

  /* Append element to the DOM of the page */
  shoppingListElement.appendChild(documentFragment);
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
    appendShoppingListItem(genItemHtml(listItem));
  });
}

/* Update the shipping list at page load */
updateShoppingList();
