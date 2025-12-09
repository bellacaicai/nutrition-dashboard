
import define from "./e587dfc79d028a3f@134.js"";
import {Runtime, Inspector} from "@observablehq/runtime";

// 只把 notebook 中名为 "dashboard" 的 cell 渲染到 #dashboard 容器
const runtime = new Runtime();
runtime.module(define, name => {
  if (name === "dashboard") {
    const el = document.querySelector("#dashboard");
    return new Inspector(el);
  }
  // 其他 cell 不渲染
  return null;
});
