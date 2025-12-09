function _1(md){return(
md`# Nutrition Composition Dashboard

An interactive, multi-view visualization for exploring the nutritional composition of common foods.  
This dashboard provides coordinated views across food categories, nutrient breakdowns, and calorie–protein relationships to support exploratory analysis.

`
)}

function _2(md){return(
md`## Motivation

Understanding the nutritional composition of foods is important for health, diet planning, and making informed food choices.  
However, nutrition datasets are often large and difficult to interpret directly from tables.

This project builds an **interactive dashboard** to help users:
- Explore the distribution of food categories  
- Understand relationships between **calories, protein, fat, and carbs**  
- Compare nutrient profiles across selected foods  
- Use interactive filtering (category selection & brushing) to refine insights  

The goal is to create an intuitive and visually rich interface that supports flexible exploration of the dataset.
`
)}

function _3(md){return(
md`## Data Description and Processing

The dataset comes from a public nutrition database and contains **335 common foods** with attributes including:

- **Food name**
- **Category** (e.g., Dairy products, Vegetables, Meat, Snacks, etc.)
- **Serving measure**
- **Grams per serving**
- **Calories**
- **Protein / Fat / Carbs**
- **Saturated fat, fiber**, and other nutritional attributes

### Data Cleaning Steps

Before visualization, the following processing steps were applied:

1. **Converted numeric attributes**  
   Many nutrient values were strings in the CSV (e.g., \`"7"\`, \`"12"\`).  
   These were converted to proper numbers using \`+d.Calories\`, \`+d.Fat\`, etc.

2. **Handled missing values**  
   Strings like \`"t"\` or empty values were mapped to \`NaN\` or \`0\` where appropriate  
   (e.g., saturated fat \`"t"\` → interpreted as trace → treated as \`NaN\`).

3. **Constructed category-level structures**  
   The dataset was grouped by food category to support treemap visualization.

4. **Created linked selection variables**  
   - \`mutable selectedCategory\` for treemap category selection  
   - \`mutable brushedPoints\` for scatterplot brushing  

These cleaned and structured data enable the interactive multiview dashboard below.
`
)}

function _nutrientsRaw(FileAttachment){return(
FileAttachment("nutrients_csvfile.csv").csv()
)}

function _nutrients(nutrientsRaw){return(
nutrientsRaw.map(d => ({
  food: d.Food,
  category: d.Category,
  measure: d.Measure,
  grams: +d.Grams,
  calories: +d.Calories,
  protein: +d.Protein,
  fat: +d.Fat,
  satfat: d["Sat.Fat"] === "t" ? NaN : +d["Sat.Fat"],
  fiber: +d.Fiber,
  carbs: +d.Carbs
}))
)}

function _sample(Inputs,nutrients){return(
Inputs.table(nutrients.slice(0, 10))
)}

function _searchFood(Inputs){return(
Inputs.text({
  label: "Search food name",
  placeholder: "e.g., cheese, milk, chips..."
})
)}

function _categoriesList(nutrients){return(
Array.from(new Set(nutrients.map(d => d.category))).sort()
)}

function _filterCategories(Inputs,categoriesList){return(
Inputs.checkbox(categoriesList, {
  label: "Filter categories (optional)",
  value: categoriesList   // 默认全选
})
)}

function _caloriesExtent(d3,nutrients){return(
d3.extent(nutrients, d => d.calories)
)}

function _maxCalories(Inputs,caloriesExtent){return(
Inputs.range(caloriesExtent, {
  label: "Max calories per serving",
  step: 10,
  value: caloriesExtent[1]   
})
)}

function _healthyOnly(Inputs){return(
Inputs.toggle({
  label: "Only show relatively high-protein, low-fat foods",
  value: false
})
)}

function _filteredNutrients(nutrients,searchFood,filterCategories,maxCalories,healthyOnly){return(
nutrients.filter(d => {
  const q = (searchFood || "").toLowerCase().trim();
  const matchSearch = !q || d.food.toLowerCase().includes(q);

  const matchCategory = filterCategories.length === 0
    ? true
    : filterCategories.includes(d.category);

  const matchCalories = d.calories <= maxCalories;


  const matchHealthy = !healthyOnly
    ? true
    : (d.protein >= 8 && d.fat <= 10);   

  return matchSearch && matchCategory && matchCalories && matchHealthy;
})
)}

function _14(filteredNutrients){return(
filteredNutrients.length
)}

function _treemapData(d3,filteredNutrients){return(
{
  name: "root",
  children: Array.from(
    d3.group(filteredNutrients, d => d.category),
    ([key, values]) => ({
      name: key,
      children: values
    })
  )
}
)}

function _selectedCategory(){return(
null
)}

function _17(selectedCategory){return(
selectedCategory
)}

function _18(md){return(
md`## View 1: Treemap Overview
`
)}

function _treemap(d3,treemapData,$0)
{
  const width = 1200;
  const height = 400;


  const root = d3.hierarchy(treemapData)
    .sum(d => d.children ? 0 : 1);  


  d3.treemap()
    .size([width, height])
    .paddingInner(4)
    .paddingOuter(4)(root);

  const categories = root.children;

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const cell = svg.selectAll("g")
    .data(categories)
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  cell.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.name))
      .on("click", (event, d) => {

        $0.value = d.data.name;
      });

  cell.append("title")
      .text(d => `${d.data.name}
Count: ${d.value}`);


  cell.append("text")
      .attr("x", d => (d.x1 - d.x0) / 2)
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", 12)
      .text(d => d.data.name);

  return svg.node();
}


function _brushedPoints(){return(
[]
)}

function _21(md){return(
md`## View 2: Calories vs Protein Scatterplot`
)}

function _scatterData(selectedCategory,filteredNutrients){return(
selectedCategory
  ? filteredNutrients.filter(d => d.category === selectedCategory)
  : filteredNutrients
)}

function _scatter(d3,scatterData,$0)
{
  const width = 600;
  const height = 400;
  const margin = {top: 20, right: 20, bottom: 40, left: 50};

 
  const calExtent = d3.extent(scatterData, d => d.calories);
  const proExtent = d3.extent(scatterData, d => d.protein);

  const x = d3.scaleLinear()
    .domain([calExtent[0] - 5, calExtent[1] + 5]).nice()
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([proExtent[0] - 2, proExtent[1] + 2]).nice()
    .range([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);


  const clipId = "clip-scatter";
  svg.append("defs")
    .append("clipPath")
      .attr("id", clipId)
    .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);


  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .text("Calories");

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .text("Protein");


  const points = svg.append("g")
    .attr("clip-path", `url(#${clipId})`)
    .selectAll("circle")
    .data(scatterData)
    .join("circle")
      .attr("cx", d => x(d.calories))
      .attr("cy", d => y(d.protein))
      .attr("r", d => {
        const fiber = Number(d.fiber);
         return Math.sqrt((isNaN(fiber) ? 0 : fiber) + 4);
      })

      .attr("fill", d => color(d.category))
      .attr("fill-opacity", 0.8);

  points.append("title")
    .text(d => `${d.food}
Category: ${d.category}
Calories: ${d.calories}
Protein: ${d.protein}`);


  const brush = d3.brush()
    .extent([[margin.left, margin.top],
             [width - margin.right, height - margin.bottom]])
    .on("brush end", brushed);

  svg.append("g")
    .attr("clip-path", `url(#${clipId})`)
    .call(brush);

  function brushed({selection}) {
    if (!selection) {
      $0.value = [];
      return;
    }
    const [[x0, y0], [x1, y1]] = selection;
    const selected = scatterData.filter(d =>
      x(d.calories) >= x0 && x(d.calories) <= x1 &&
      y(d.protein)  >= y0 && y(d.protein)  <= y1
    );
    $0.value = selected;
  }

  return svg.node();
}


function _24(brushedPoints){return(
brushedPoints.length
)}

function _barData(brushedPoints,scatterData)
{

  const base = brushedPoints.length ? brushedPoints : scatterData;

  return base.slice(0, 8);
}


function _26(md){return(
md`## View 3: Nutrient Comparison Bars
`
)}

function _bars(barData,d3)
{
  const data = barData;
  const nutrients = ["fat", "protein", "carbs"];

  const width = 1000;  
  const rowHeight = 40;
  const margin = {top: 20, right: 200, bottom: 20, left: 160};


  const maxVal = d3.max(data, d => d3.max(nutrients, k => d[k]));

  const x = d3.scaleLinear()
    .domain([0, maxVal]).nice()
    .range([margin.left, width - margin.right]);

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", margin.top + margin.bottom + data.length * rowHeight);

  const g = svg.append("g")
    .attr("transform", `translate(0,${margin.top})`);


  const row = g.selectAll("g.row")
    .data(data)
    .join("g")
      .attr("class", "row")
      .attr("transform", (d, i) => `translate(0,${i * rowHeight})`);


  row.append("text")
    .attr("x", margin.left - 10)
    .attr("y", 15)
    .attr("text-anchor", "end")
    .attr("font-size", 10)
    .text(d => d.food);

  const color = d3.scaleOrdinal()
    .domain(nutrients)
    .range(["#f28e2b", "#4e79a7", "#59a14f"]); // fat / protein / carbs 的颜色


  row.selectAll("rect")
    .data(d => nutrients.map(k => ({ key: k, value: d[k] })))
    .join("rect")
      .attr("x", margin.left)
      .attr("y", (d, i) => i * 10)
      .attr("height", 8)
      .attr("width", d => x(d.value) - x(0))
      .attr("fill", d => color(d.key));


  row.selectAll("text.value")
    .data(d => nutrients.map(k => ({ key: k, value: d[k] })))
    .join("text")
      .attr("class", "value")
      .attr("x", d => x(d.value) + 3)
      .attr("y", (d, i) => i * 10 + 7)
      .attr("font-size", 8)
      .text(d => `${d.key}: ${d.value}`);

  return svg.node();
}


function _28(md){return(
md`## Nutrition Composition Dashboard`
)}

function _dashboard($0,$1,$2)
{
  const container = document.createElement("div");
  container.className = "dash";

  // Treemap
  const row1 = document.createElement("div");
  row1.className = "row";
  const h2_1 = document.createElement("h2");
  h2_1.textContent = "Treemap Overview";
  row1.appendChild(h2_1);
  row1.appendChild($0);      
  container.appendChild(row1);

  // Scatterplot
  const row2 = document.createElement("div");
  row2.className = "row";
  const h2_2 = document.createElement("h2");
  h2_2.textContent = "Calories vs Protein Scatterplot";
  row2.appendChild(h2_2);
  row2.appendChild($1);      
  container.appendChild(row2);

  // Bars
  const row3 = document.createElement("div");
  row3.className = "row";
  const h2_3 = document.createElement("h2");
  h2_3.textContent = "Nutrient Comparison Bars";
  row3.appendChild(h2_3);
  row3.appendChild($2);         
  container.appendChild(row3);

  return container;
}


function _30(md){return(
md`## Findings and Insights

From the coordinated views, several observations emerge:

### 1. Category-Level Patterns  
- Categories such as **Snacks, Desserts, and Bread/Cereals** tend to have higher carbohydrate values.  
- **Meat and Poultry** items are generally high in protein but vary widely in calories.  
- **Vegetables** show low calories and balanced nutrient levels.

### 2. Calories vs Protein Relationship  
- Most foods fall into moderate-calorie, moderate-protein ranges.  
- Outliers (such as sugary drinks) show **high calories but nearly zero protein**, which becomes immediately visible in the scatterplot.

### 3. Nutrient Comparisons  
- The bar chart makes it easy to compare fat/protein/carbs among selected foods.  
- Brushing in the scatterplot highlights nutritionally similar foods, revealing clusters such as:  
  - **High-carb but low-protein beverages**  
  - **High-protein meats**  
  - **Balanced nutrient vegetables**

The interactive linking supports rapid exploration and helps reveal nutritional patterns that are not obvious from raw data alone.
`
)}

function _31(md){return(
md`## Limitations and Future Work

### Limitations
- Serving sizes are inconsistent across foods, making direct nutrient comparisons approximate.  
- Trace or missing nutrient values (\`"t"\` or empty fields) may introduce minor inaccuracies.  
- The dataset does not include micronutrients (vitamins/minerals), which limits deeper nutritional analysis.

### Future Enhancements
- Add **sorting and filtering controls** (e.g., sort foods by calories or protein).  
- Incorporate **micronutrient data** or daily recommended values (DRIs).  
- Add **nutrition score metrics** or clustering to group similar foods automatically.  
- Enable saving selected foods as a “meal” for dietary planning.

Despite these limitations, the dashboard provides a strong foundation for rich, interactive nutritional analysis.
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["nutrients_csvfile.csv", {url: new URL("./files/59cc5490bc746d647b7928f9d0af52f461e6e6248b786dfd450f79a80232825f7d1a8f4179a28af28be0c8088d80521ca053a54290bd67284d432eb4c5cbea75.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("nutrientsRaw")).define("nutrientsRaw", ["FileAttachment"], _nutrientsRaw);
  main.variable(observer("nutrients")).define("nutrients", ["nutrientsRaw"], _nutrients);
  main.variable(observer("viewof sample")).define("viewof sample", ["Inputs","nutrients"], _sample);
  main.variable(observer("sample")).define("sample", ["Generators", "viewof sample"], (G, _) => G.input(_));
  main.variable(observer("viewof searchFood")).define("viewof searchFood", ["Inputs"], _searchFood);
  main.variable(observer("searchFood")).define("searchFood", ["Generators", "viewof searchFood"], (G, _) => G.input(_));
  main.variable(observer("categoriesList")).define("categoriesList", ["nutrients"], _categoriesList);
  main.variable(observer("viewof filterCategories")).define("viewof filterCategories", ["Inputs","categoriesList"], _filterCategories);
  main.variable(observer("filterCategories")).define("filterCategories", ["Generators", "viewof filterCategories"], (G, _) => G.input(_));
  main.variable(observer("caloriesExtent")).define("caloriesExtent", ["d3","nutrients"], _caloriesExtent);
  main.variable(observer("viewof maxCalories")).define("viewof maxCalories", ["Inputs","caloriesExtent"], _maxCalories);
  main.variable(observer("maxCalories")).define("maxCalories", ["Generators", "viewof maxCalories"], (G, _) => G.input(_));
  main.variable(observer("viewof healthyOnly")).define("viewof healthyOnly", ["Inputs"], _healthyOnly);
  main.variable(observer("healthyOnly")).define("healthyOnly", ["Generators", "viewof healthyOnly"], (G, _) => G.input(_));
  main.variable(observer("filteredNutrients")).define("filteredNutrients", ["nutrients","searchFood","filterCategories","maxCalories","healthyOnly"], _filteredNutrients);
  main.variable(observer()).define(["filteredNutrients"], _14);
  main.variable(observer("treemapData")).define("treemapData", ["d3","filteredNutrients"], _treemapData);
  main.define("initial selectedCategory", _selectedCategory);
  main.variable(observer("mutable selectedCategory")).define("mutable selectedCategory", ["Mutable", "initial selectedCategory"], (M, _) => new M(_));
  main.variable(observer("selectedCategory")).define("selectedCategory", ["mutable selectedCategory"], _ => _.generator);
  main.variable(observer()).define(["selectedCategory"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("viewof treemap")).define("viewof treemap", ["d3","treemapData","mutable selectedCategory"], _treemap);
  main.variable(observer("treemap")).define("treemap", ["Generators", "viewof treemap"], (G, _) => G.input(_));
  main.define("initial brushedPoints", _brushedPoints);
  main.variable(observer("mutable brushedPoints")).define("mutable brushedPoints", ["Mutable", "initial brushedPoints"], (M, _) => new M(_));
  main.variable(observer("brushedPoints")).define("brushedPoints", ["mutable brushedPoints"], _ => _.generator);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("scatterData")).define("scatterData", ["selectedCategory","filteredNutrients"], _scatterData);
  main.variable(observer("viewof scatter")).define("viewof scatter", ["d3","scatterData","mutable brushedPoints"], _scatter);
  main.variable(observer("scatter")).define("scatter", ["Generators", "viewof scatter"], (G, _) => G.input(_));
  main.variable(observer()).define(["brushedPoints"], _24);
  main.variable(observer("barData")).define("barData", ["brushedPoints","scatterData"], _barData);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("viewof bars")).define("viewof bars", ["barData","d3"], _bars);
  main.variable(observer("bars")).define("bars", ["Generators", "viewof bars"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("dashboard")).define("dashboard", ["viewof treemap","viewof scatter","viewof bars"], _dashboard);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  return main;
}
