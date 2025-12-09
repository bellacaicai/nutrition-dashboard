// 把这里的文件名改成你仓库里那个 js 文件，比如 e587dfc79d028a3f@101.js
import define from "./e587dfc79d028a3f@134.js";
import {Runtime, Inspector} from "@observablehq/runtime";

const runtime = new Runtime();

// 小工具：往 filters 区里依次塞控件
function appendToFilters() {
  const filtersDiv = document.querySelector("#filters");
  const wrapper = document.createElement("div");
  wrapper.className = "filter-item";
  filtersDiv.appendChild(wrapper);
  return new Inspector(wrapper);
}

runtime.module(define, name => {
  // 四个过滤控件：按顺序放进 Filters panel
  if (name === "viewof searchFood"
    || name === "viewof filterCategories"
    || name === "viewof maxCalories"
    || name === "viewof healthyOnly") {
    return appendToFilters();
  }

  // Treemap 视图
  if (name === "viewof treemap") {
    const node = document.querySelector("#treemap");
    return new Inspector(node);
  }

  // Scatterplot 视图
  if (name === "viewof scatter") {
    const node = document.querySelector("#scatter");
    return new Inspector(node);
  }

  // Bars 视图
  if (name === "viewof bars") {
    const node = document.querySelector("#bars");
    return new Inspector(node);
  }

  // 其它 cell 不直接渲染，只当作依赖执行
  return null;
});
