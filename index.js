export {default} from "./e587dfc79d028a3f@134.js";
import {Runtime, Inspector} from "@observablehq/runtime";

const main = new Runtime().module(define, name => {
  if (name === "dashboard") {
    // 把 notebook 中名为 "dashboard" 的 cell 渲染到 #dashboard 这个容器
    return new Inspector(document.querySelector("#dashboard"));
  }
  // 其他所有 cell 都不渲染（返回 null）
  return null;
});
