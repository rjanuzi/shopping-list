const SHOPPING_LIST_ITEM_UPDATE_URL = "/shopping-list/change-status";

const shoppingListElement = document.getElementById("shoppingList");
const addToListModalSaveBtn = document.getElementById("addToListModalSaveBtn");
const deleteItemConfirmationBtn = document.getElementById(
  "deleteItemConfirmationBtn"
);
const addFormProductFld = document.getElementById("addFormProductFld");
const addFormBrandFld = document.getElementById("addFormBrandFld");
const addFormMeasureFld = document.getElementById("addFormMeasureFld");
const addFormAmountFld = document.getElementById("addFormAmountFld");

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
    labelElement.innerHTML = `<del>${labelElement.innerHTML}</del>`;
  } else {
    labelElement.innerHTML = labelElement.innerHTML.replace("<del>", "");
    labelElement.innerHTML = labelElement.innerHTML.replace("</del>", "");
  }
}

/**
 *
 * This function posts the new status of the shopping list item to the backend API,
 * if the result is 200, update the item in the VIEW.
 *
 * @param {int} itemId
 * @param {boolean} isBought
 * @async
 * @throws {Error} If the API returns a status different than 200.
 */
async function postShippingListItemStatusChange(itemId, isBought) {
  const url = `${SHOPPING_LIST_ITEM_UPDATE_URL}/0/${itemId}`;
  const itemDataJson = JSON.stringify({ bought: isBought });

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

function deleteItemClickHandler(e) {
  /* Simply add the clicked item ID into the confirmation button ("Yes") of the
  deletion confirmation modal */
  if (e.target && e.target.matches("button")) {
    document.getElementById("deleteItemConfirmationBtn").dataset.itemid =
      e.target.dataset.itemid;
  }
}

function deleteItemConfirmationHandler(e) {
  console.log(`Delete ${e.target.dataset.itemid}`);

  /* TODO Delete on backend */

  updateShoppingList();
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
                      class="form-check-label"
                      for="${itemData.id}"
                      >`;

  if (itemData.bought) {
    html_item += `<del>
                      <b>${itemData.amount}${itemData.measure}</b> ${itemData.product}</label></del>
                      <button type="button"
                        class="btn btn-sm btn-danger"
                        data-itemid=${itemData.id}
                        data-bs-toggle="modal"
                        data-bs-target="#deleteItemModal";>
                        X
                      </button>
                    </li>`;
  } else {
    html_item += `<b>${itemData.amount}${itemData.measure}</b> ${itemData.product}</label>
                      <button type="button"
                        class="btn btn-sm btn-danger"
                        data-itemid=${itemData.id}
                        data-bs-toggle="modal"
                        data-bs-target="#deleteItemModal";>
                        X
                      </button>
                    </li>`;
  }

  return html_item;
}

function appendShoppingListItem(itemHtml) {
  /* Create the page element */
  const range = document.createRange();
  const documentFragment = range.createContextualFragment(itemHtml);

  /* Add event listener to the element */
  const listItem = documentFragment.firstElementChild;
  listItem.addEventListener("click", shoppingListClickHandler);

  /* Add event listener to delete item button */
  const deleteItemBtn = listItem.getElementsByTagName("button")[0];
  deleteItemBtn.addEventListener("click", deleteItemClickHandler);

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

/**
 * This function posts the new item to the API. If the result is 200
 * update the items list.
 *
 * @param {object} itemData The data of the item to be added.
 * @async
 * @throws {Error} If the API returns a status different than 200.
 */
async function postNewItem(itemData) {
  const itemDataJson = JSON.stringify(itemData);

  await fetch("/shopping-list/0", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: itemDataJson,
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Failed to add item");
      } else {
        updateShoppingList();
      }
    })
    .catch((error) => {
      alert(error);
    });
}

async function addToListBtnHandler(e) {
  const newItemData = {
    product: addFormProductFld.value,
    brand: addFormBrandFld.value,
    measure: addFormMeasureFld.value,
    amount: addFormAmountFld.value,
  };
  await postNewItem(newItemData);
}

/* Adds the "Add to List" button handler function */
addToListModalSaveBtn.addEventListener("click", addToListBtnHandler);

/* adds the "Delete Item" confirmation button handler function */
deleteItemConfirmationBtn.addEventListener(
  "click",
  deleteItemConfirmationHandler
);

/* Update the shipping list at page load */
updateShoppingList();
