
import define from "./e587dfc79d028a3f@134.js";  // ← 用你仓库里的那个 js 文件名
import {Runtime, Inspector} from "@observablehq/runtime";

const runtime = new Runtime();

// 小工具：往 filters 容器里插入一个小 div 用来放控件
function appendToFilters() {
  const filtersDiv = document.querySelector("#filters");
  const wrapper = document.createElement("div");
  wrapper.className = "filter-item";
  filtersDiv.appendChild(wrapper);
  return new Inspector(wrapper);
}

runtime.module(define, name => {
  // 过滤控件：根据名字判断
  if (name === "viewof searchFood"
   || name === "viewof filterCategories"
   || name === "viewof maxCalories"
   || name === "viewof healthyOnly") {
    return appendToFilters();
  }

  // Treemap
  if (name === "viewof treemap") {
    const node = document.querySelector("#treemap");
    return new Inspector(node);
  }

  // Scatterplot
  if (name === "viewof scatter") {
    const node = document.querySelector("#scatter");
    return new Inspector(node);
  }

  // Bars
  if (name === "viewof bars") {
    const node = document.querySelector("#bars");
    return new Inspector(node);
  }

  // 其它 cell 不渲染（只作为依赖被执行）
  return null;
});
