
import define from "./e587dfc79d028a3f@134.js";
import { Runtime, Inspector } from "./runtime.js";

const runtime = new Runtime();


function appendToFilters(className) {
  const filtersDiv = document.querySelector("#filters");
  const wrapper = document.createElement("div");
  wrapper.className = "filter-item";
  if (className) wrapper.classList.add(className);
  filtersDiv.appendChild(wrapper);
  return new Inspector(wrapper);
}

runtime.module(define, name => {

  // ------- Filters -------
  if (name === "viewof searchFood") {
    return appendToFilters("filter-search");
  }

  if (name === "viewof filterCategories") {
    return appendToFilters("filter-categories");
  }

  if (name === "viewof maxCalories") {
    return appendToFilters("filter-maxcal");
  }

  if (name === "viewof healthyOnly") {
    return appendToFilters("filter-healthy");
  }

  // ------- Treemap -------
  if (name === "viewof treemap") {
    return new Inspector(document.querySelector("#treemap"));
  }

  // ------- Scatterplot -------
  if (name === "viewof scatter") {
    return new Inspector(document.querySelector("#scatter"));
  }

  // ------- Bars -------
  if (name === "viewof bars") {
    return new Inspector(document.querySelector("#bars"));
  }


  return null;
});
