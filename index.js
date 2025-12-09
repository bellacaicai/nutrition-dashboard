// 正确的 index.js —— 可直接替换

import define from "./e587dfc79d028a3f@134.js";
import { Runtime, Inspector } from "./runtime.js";

const runtime = new Runtime();

// 小工具：把 Observable 的控件塞到 Filters 区域
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

  // 其余 cell 不渲染，只执行数据
  return null;
});
