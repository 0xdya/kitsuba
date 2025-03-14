'use strict';


const data = {
  name: "في هذا الموقع",
  children: [
    { name: "بلوج" },
    { name: "الإعدادات" },
    {
      name: "السيرة",
      children: [
        { name: "المهارات" },
        { name: "التعليقات" },
        {
          name: "المشاريع",
          children: [
            { name: "المواقع" },
            { name: "git tolls" },
            { name: "كتب" }
          ]
        }
      ]
    },
    {
      name: "التواصل",
      children: [
        { name: "حساباتي" },
        { name: "إبلاغ" }
      ]
    }
  ]
};

const width = 410, height = 600;
const svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

const simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-500))
  .force("center", d3.forceCenter(0, 0))
  .force("x", d3.forceX().strength(0.1))
  .force("y", d3.forceY().strength(0.1));

const root = d3.hierarchy(data);
const levelHeight = 120;
const widthSpacing = 100;
let maxDepth = 0;

root.each((d) => {
  d.y = d.depth * levelHeight;
  d.x = (d.parent ? d.parent.x : 0) + (d.parent ? (d.parent.children.indexOf(d) - (d.parent.children.length - 1) / 2) * widthSpacing : 0);
  maxDepth = Math.max(maxDepth, d.depth);
});

const nodes = root.descendants().map(d => ({ id: d.data.name, ...d }));
const links = root.links().map(d => ({ source: d.source.data.name, target: d.target.data.name }));

simulation.nodes(nodes);
simulation.force("link").links(links);

const link = g.selectAll(".link")
  .data(links)
  .enter()
  .append("line")
  .attr("class", "link");

const node = g.selectAll(".node")
  .data(nodes)
  .enter()
  .append("g")
  .attr("class", d => d.depth === 0 ? "node main-node" : "node")
  .call(d3.drag()
    .on("start", dragStart)
    .on("drag", dragged)
    .on("end", dragEnd));

node.each(function (d) {
  const elem = d3.select(this);

  if (d.depth === 0) {
    elem.append("rect")
      .attr("width", 124)
      .attr("height", 60)
      .attr("x", -60)
      .attr("y", -30)
      .attr("rx", 30)
      .attr("ry", 30);
  } else {
    elem.append("circle")
      .attr("r", 30)
      .on("click", (event, d) => {
        if (soundEnabled) playSound("mine.wav"); // تشغيل الصوت عند الضغط فقط إذا كان مفعلاً

        document.querySelectorAll("article[data-page]").forEach(article => {
          article.classList.remove("active");
        });

        const targetPage = document.querySelector(`article[data-page="${d.data.name.toLowerCase()}"]`);
        if (targetPage) {
          targetPage.classList.add("active");
        }

        document.querySelectorAll("[data-nav-link]").forEach(link => {
          link.classList.remove("active");
          if (link.innerText.trim().toLowerCase() === d.data.name.toLowerCase()) {
            link.classList.add("active");
          }
        });

        window.scrollTo(0, 0);
      });
  }

  elem.append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle") 
    .style("font-size", "14px")
    .style("fill", "#fff")
    .text(d.data.name);
});

simulation.on("tick", () => {
  link.attr("x1", d => clamp(d.source.x, minX, maxX))
    .attr("y1", d => clamp(d.source.y, minY, maxY))
    .attr("x2", d => clamp(d.target.x, minX, maxX))
    .attr("y2", d => clamp(d.target.y, minY, maxY));

  node.attr("transform", d => `translate(${clamp(d.x, minX, maxX)}, ${clamp(d.y, minY, maxY)})`);
});

function dragStart(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = clamp(event.x, minX, maxX);
  d.fy = clamp(event.y, minY, maxY);
}

function dragEnd(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const minX = -width / 2 + 50, maxX = width / 2 - 50;
const minY = -height / 2 + 50, maxY = height / 2 - 50;

// دالة تشغيل الصوت
function playSound(file) {
  const audio = new Audio(`./sound/${file}`);
  audio.play().catch(error => console.error("خطأ في تشغيل الصوت:", error));
}

// زر التحكم بالصوت
document.getElementById("toggleSound").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  playSound(soundEnabled ? "on.wav" : "off.wav");
});