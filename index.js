import define from "./e587dfc79d028a3f@134.js";
import {Runtime, Inspector} from "./runtime.js";

console.log("index.js loaded");

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
  // 调试：打印当前 cell 名
  console.log("module cell:", name);

  if (
    name === "viewof searchFood" ||
    name === "viewof filterCategories" ||
    name === "viewof maxCalories" ||
    name === "viewof healthyOnly"
  ) {
    console.log("mounting filter:", name);
    return appendToFilters();
  }

  if (name === "viewof treemap") {
    console.log("mounting treemap");
    const node = document.querySelector("#treemap");
    return new Inspector(node);
  }

  if (name === "viewof scatter") {
    console.log("mounting scatter");
    const node = document.querySelector("#scatter");
    return new Inspector(node);
  }

  if (name === "viewof bars") {
    console.log("mounting bars");
    const node = document.querySelector("#bars");
    return new Inspector(node);
  }

  return null;
});


  // 其它 cell 不直接渲染，只当作依赖执行
  return null;
});
