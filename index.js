import define from "./e587dfc79d028a3f@134.js";   // ✅ 已经加 ./，保持不动
import {Runtime, Inspector} from "./runtime.js";   // ❗ 把 @observablehq/runtime 改成 ./runtime.js


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
// ----- Filters with custom wrapper classes -----

    if (name === "viewof searchFood") {
      const wrapper = appendToFilters();
      wrapper._node.classList.add("filter-search");
      return wrapper;
    }

    if (name === "viewof filterCategories") {
      const wrapper = appendToFilters();
      wrapper._node.classList.add("filter-categories");
      return wrapper;
    }

    if (name === "viewof maxCalories") {
      const wrapper = appendToFilters();
      wrapper._node.classList.add("filter-maxcal");
      return wrapper;
    }

    if (name === "viewof healthyOnly") {
      const wrapper = appendToFilters();
      wrapper._node.classList.add("filter-healthy");
      return wrapper;
    }

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
