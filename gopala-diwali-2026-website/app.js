/* Gopala Diwali 2026 collection website */
"use strict";

let products = [];
let activeCategory = "All";

const grid = document.querySelector("#product-grid");
const search = document.querySelector("#search");
const empty = document.querySelector("#empty");
const categoryOrder = [
  "Treasured Treat",
  "Elegante Collection",
  "Healthy Galore",
  "Crystal Collection",
  "Happiness Basket",
  "Sweet Luxe"
];

function addElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = text;
  return el;
}

function pagePath(page) {
  return "assets/pages/page-" + String(page).padStart(2, "0") + ".jpg";
}

function matchesSearch(product, query) {
  return [
    product.title,
    product.code,
    product.category,
    product.desc,
    ...(product.priceOptions || []).map(function(option) {
      return option.weight + " " + option.code + " " + option.price;
    })
  ].join(" ").toLowerCase().includes(query);
}

function makeProductCard(product) {
  const index = products.indexOf(product);
  const card = addElement("article", "product-card");
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", "View details for " + product.title);
  card.dataset.index = String(index);

  const imageWrap = addElement("div", "product-image");
  const image = addElement("img");
  image.src = pagePath(product.page);
  image.alt = product.title + " — Gopala Diwali 2026 collection";
  image.loading = "lazy";
  imageWrap.appendChild(image);

  const code = addElement("span", "product-code", "CODE " + (product.code || "—"));
  imageWrap.appendChild(code);

  const info = addElement("div", "product-info");
  info.appendChild(addElement("span", "product-category", product.category));
  info.appendChild(addElement("h3", "", product.title));
  info.appendChild(addElement("p", "", product.desc || "See the full catalogue for product details."));

  const bottom = addElement("div", "product-bottom");
  const priceBlock = addElement("div");
  priceBlock.appendChild(addElement("span", "price-label", product.priceOptions ? "MRP · FROM" : "MRP"));
  const displayPrice = product.priceOptions ? "From " + product.price : product.price;
  priceBlock.appendChild(addElement("span", "price", displayPrice));
  bottom.appendChild(priceBlock);
  bottom.appendChild(addElement("span", "view-link", "VIEW DETAILS ↗"));
  info.appendChild(bottom);

  card.appendChild(imageWrap);
  card.appendChild(info);
  return card;
}

function makeCollectionGroup(category, items) {
  const section = addElement("section", "collection-group");
  const heading = addElement("div", "collection-group-heading");
  const titleBlock = addElement("div");
  titleBlock.appendChild(addElement("span", "collection-overline", "THE FESTIVE EDIT"));
  titleBlock.appendChild(addElement("h3", "", category));
  heading.appendChild(titleBlock);
  heading.appendChild(addElement("span", "collection-count", items.length + (items.length === 1 ? " gift" : " gifts")));
  section.appendChild(heading);

  const cards = addElement("div", "collection-products");
  items.forEach(function(product) {
    cards.appendChild(makeProductCard(product));
  });
  section.appendChild(cards);
  return section;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const filtered = products.filter(function(product) {
    return (activeCategory === "All" || product.category === activeCategory) &&
      matchesSearch(product, query);
  });

  grid.replaceChildren();

  if (activeCategory === "All") {
    categoryOrder.forEach(function(category) {
      const items = filtered.filter(function(product) {
        return product.category === category;
      });
      if (items.length) grid.appendChild(makeCollectionGroup(category, items));
    });
  } else if (filtered.length) {
    const items = addElement("div", "collection-products");
    filtered.forEach(function(product) {
      items.appendChild(makeProductCard(product));
    });
    grid.appendChild(items);
  }

  empty.hidden = filtered.length !== 0;
}

function openProduct(product) {
  const image = document.querySelector("#modal-img");
  image.src = pagePath(product.page);
  image.alt = product.title;

  document.querySelector("#modal-category").textContent = product.category;
  document.querySelector("#modal-title").textContent = product.title;
  document.querySelector("#modal-desc").textContent = product.desc || "";

  const priceBox = document.querySelector(".modal-price");
  const priceLabel = document.querySelector("#modal-price-label");
  const priceValue = document.querySelector("#modal-price");
  const codeValue = document.querySelector("#modal-code");
  const sizeBox = document.querySelector("#modal-sizes");

  sizeBox.replaceChildren();

  if (Array.isArray(product.priceOptions) && product.priceOptions.length) {
    /* Only weight-varying sweet boxes show a quantity-and-price table. */
    priceBox.style.display = "none";
    sizeBox.hidden = false;
    sizeBox.appendChild(addElement("div", "modal-sizes-title", "Available pack sizes and prices"));

    product.priceOptions.forEach(function(option) {
      const row = addElement("div", "modal-size-row");
      row.appendChild(addElement("span", "", option.weight + " · Code " + option.code));
      row.appendChild(addElement("strong", "", option.price));
      sizeBox.appendChild(row);
    });
    codeValue.textContent = "Codes " + product.priceOptions.map(function(option) {
      return option.code;
    }).join(" · ");
  } else {
    priceBox.style.display = "flex";
    sizeBox.hidden = true;
    priceLabel.textContent = "MRP";
    priceValue.textContent = product.price;
    codeValue.textContent = product.code ? "Code " + product.code : "";
  }

  const message = encodeURIComponent(
    "Hello Gopala, I'm interested in " + product.title +
    " (Code " + (product.code || "not listed") +
    ") from the Diwali 2026 catalogue. Please confirm availability and price."
  );
  document.querySelector("#modal-whatsapp").href =
    "https://wa.me/917290031303?text=" + message;
  document.querySelector("#modal-page").href =
    "assets/Gopala_Diwali_2026_Catalogue.pdf#page=" + product.page;

  const modal = document.querySelector("#modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.querySelector("#modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

fetch("assets/products.json")
  .then(function(response) {
    if (!response.ok) throw new Error("Unable to load product catalogue.");
    return response.json();
  })
  .then(function(data) {
    if (!Array.isArray(data)) throw new Error("Product catalogue format is invalid.");
    products = data;
    render();
  })
  .catch(function(error) {
    grid.replaceChildren(addElement("p", "load-error",
      "The product collection could not be loaded. Please refresh the page."));
    console.error(error);
  });

search.addEventListener("input", render);

document.querySelectorAll(".filter").forEach(function(button) {
  button.addEventListener("click", function() {
    activeCategory = button.dataset.category || "All";
    document.querySelectorAll(".filter").forEach(function(item) {
      item.classList.toggle("active", item === button);
    });
    render();
  });
});

grid.addEventListener("click", function(event) {
  const card = event.target.closest(".product-card");
  if (card) openProduct(products[Number(card.dataset.index)]);
});

grid.addEventListener("keydown", function(event) {
  if ((event.key === "Enter" || event.key === " ") &&
      event.target.classList.contains("product-card")) {
    event.preventDefault();
    openProduct(products[Number(event.target.dataset.index)]);
  }
});

document.querySelectorAll("[data-close]").forEach(function(element) {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") closeModal();
});

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav nav");
menu.addEventListener("click", function() {
  const open = nav.classList.toggle("mobile-open");
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(function(link) {
  link.addEventListener("click", function() {
    nav.classList.remove("mobile-open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "☰";
  });
});
