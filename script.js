const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn = document.querySelector("#clear");
const itemFilter = document.querySelector("#filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

const displayItems = () => {
    itemsFromStorage = getItemsToStorage();
    itemsFromStorage.forEach((item) => {
        addItemToDOM(item);
    });
    checkUI();
};

const onAddItemSubmit = (e) => {
    e.preventDefault();

    const newItem = itemInput.value;

    if (newItem === "") {
        alert("Please add an item");
        return;
    }

    addItemToDOM(newItem);

    addItemToStorage(newItem);

    checkUI();

    itemInput.value = "";
};

const addItemToDOM = (item) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    itemList.appendChild(li);
};

const createButton = (classes) => {
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
};

const createIcon = (classes) => {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
};

const addItemToStorage = (item) => {
    const itemsFromStorage = getItemsToStorage();

    itemsFromStorage.push(item);

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const getItemsToStorage = () => {
    let itemsFromStorage;
    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }
    return itemsFromStorage;
};

const onClickItem = (e) => {
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        // console.log(1);
        setItemToEdit(e.target);
    }
};

const setItemToEdit = (item) => {
    isEditMode = true;

    itemList.querySelectorAll("li").forEach((item) => {
        item.classList.remove("edit-mode");
    });

    item.classList.add("edit-mode");
    formBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Update item`;
    formBtn.style.backgroundColor = "#228b22";
    itemInput.value = item.textContent;
};

const removeItem = (item) => {
    if (confirm("Are you sure?")) {
        item.remove();

        removeItemFromStorage(item.textContent);

        checkUI();
    }
};

const removeItemFromStorage = (item) => {
    let itemsFromStorage = getItemsToStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const clearItems = (e) => {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem("items");

    checkUI();
};

const filterItems = (e) => {
    const items = itemList.querySelectorAll("li");
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) !== -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
};

const checkUI = () => {
    const items = itemList.querySelectorAll("li");

    if (items.length === 0) {
        clearBtn.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
    }
};

function init() {
    itemForm.addEventListener("submit", onAddItemSubmit);
    itemList.addEventListener("click", onClickItem);
    clearBtn.addEventListener("click", clearItems);
    itemFilter.addEventListener("input", filterItems);

    document.addEventListener("DOMContentLoaded", displayItems);

    checkUI();
}

init();
