'use strict';

// إعدادات الثوابت في كائن موحد
const CONFIG = {
  widthSpacing: 100,
  levelHeight: 120,
  svgHeight: 600,
  nodeRadius: 30,
  mainNodeWidth: 124,
  mainNodeHeight: 60,
  mainNodeRx: 30,
  mainNodeRy: 30,
  linkDistance: 100,
  chargeStrength: -120,        // تقليل قوة التنافر للحصول على استقرار أفضل
  forceXStrength: 0.02,       // تقليل تأثير الجاذبية على المحور الأفقي
  forceYStrength: 0.02,       // تقليل تأثير الجاذبية على المحور الرأسي
  resizeDebounce: 200         // تأخير بسيط لتقليل إعادة الحساب عند تغيير حجم النافذة
};

// بيانات الشجرة
const data = {
  name: "في هذا الموقع",
  children: [
    { name: "الإعدادات" },
    { name: "بلوج" },
    {
      name: "السيرة",
      children: [
        { name: "المهارات" },
        { name: "حساباتي" },
        {
          name: "المشاريع",
          children: [
            { name: "المواقع" },
            { name: "git tolls" },
            { name: "كتب",
            children: [
            { name: "شعر"}
              ]}
          ]
        }
      ]
    },
    {
      name: "التواصل",
      children: [
        { name: "إبلاغ" },
        { name: "التعليقات",
      children: [
        { name: "اكتب تعليق"
        }
      ]}
      ]
    }
  ]
};

// تحديد العنصر الحاوي وإعداد أبعاد SVG
const container = document.querySelector(".itw");
let width = container.getBoundingClientRect().width;
const height = CONFIG.svgHeight;

const svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

// إنشاء مجموعة للرسم وتحويلها إلى منتصف الـ SVG
const g = svg.append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

// إعداد المحاكاة مع قوى محسنة
const simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(d => d.id).distance(CONFIG.linkDistance))
  .force("charge", d3.forceManyBody().strength(CONFIG.chargeStrength))
  .force("center", d3.forceCenter(0, 0))
  .force("x", d3.forceX().strength(CONFIG.forceXStrength))
  .force("y", d3.forceY().strength(CONFIG.forceYStrength));

// إنشاء الهرمية وتنظيم مواضع العقد
const root = d3.hierarchy(data);
root.each(d => {
  d.y = d.depth * CONFIG.levelHeight;
  d.x = (d.parent ? d.parent.x : 0) +
        (d.parent ? (d.parent.children.indexOf(d) - (d.parent.children.length - 1) / 2) * CONFIG.widthSpacing : 0);
});

// تجهيز العقد والروابط
const nodes = root.descendants().map(d => ({ id: d.data.name, ...d }));
const links = root.links().map(d => ({ source: d.source.data.name, target: d.target.data.name }));

// حفظ المواضع الأولية لكل عقدة لتسهيل استعادة الشكل الأصلي
nodes.forEach(d => {
  d.initialX = d.x;
  d.initialY = d.y;
});

// تهيئة المحاكاة بالعقد والروابط
simulation.nodes(nodes);
simulation.force("link").links(links);

// رسم الروابط
const link = g.selectAll(".link")
  .data(links)
  .enter()
  .append("line")
  .attr("class", "link");

// رسم العقد وإضافة دعم للسحب والنقر
const node = g.selectAll(".node")
  .data(nodes)
  .enter()
  .append("g")
  .attr("class", d => d.depth === 0 ? "node main-node" : "node")
  .call(d3.drag()
    .on("start", dragStart)
    .on("drag", dragged)
    .on("end", dragEnd)
  );

node.each(function(d) {
  const elem = d3.select(this);
  if (d.depth === 0) {
    elem.append("rect")
      .attr("width", CONFIG.mainNodeWidth)
      .attr("height", CONFIG.mainNodeHeight)
      .attr("x", -CONFIG.mainNodeWidth / 2)
      .attr("y", -CONFIG.mainNodeHeight / 2)
      .attr("rx", CONFIG.mainNodeRx)
      .attr("ry", CONFIG.mainNodeRy);
  } else {
    elem.append("circle")
      .attr("r", CONFIG.nodeRadius)
      .on("click", (event, d) => {
        if (soundEnabled) playSound("chest.mp3");

        document.querySelectorAll("article[data-page]").forEach(article =>
          article.classList.remove("active")
        );

        const targetPage = document.querySelector(`article[data-page="${d.data.name.toLowerCase()}"]`);
        if (targetPage) targetPage.classList.add("active");

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

// تحديث المحاكاة والرسم مع فرض حدود العنصر
simulation.on("tick", () => {
const bounds = container.getBoundingClientRect();
if (bounds.width > 0 && bounds.height > 0) {
  const minX = -bounds.width / 2 + CONFIG.nodeRadius;
  const maxX = bounds.width / 2 - CONFIG.nodeRadius;
  const minY = -bounds.height / 2 + CONFIG.nodeRadius;
  const maxY = bounds.height / 2 - CONFIG.nodeRadius;

  nodes.forEach(d => {
    d.x = Math.max(minX, Math.min(maxX, d.x));
    d.y = Math.max(minY, Math.min(maxY, d.y));
  });
}
  link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  node.attr("transform", d => `translate(${d.x}, ${d.y})`);
});

// دوال السحب للتفاعل
function dragStart(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnd(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// دالة تشغيل الصوت مع معالجة الأخطاء
function playSound(file) {
  const audio = new Audio(`./sound/${file}`);
  audio.play().catch(error => console.error("خطأ في تشغيل الصوت:", error));
}

// زر التحكم بالصوت
document.getElementById("toggleSound").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  playSound(soundEnabled ? "on.wav" : "off.wav");
});

// تحسين التعامل مع تغيير حجم النافذة باستخدام تقنية debounce
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    width = container.getBoundingClientRect().width;
    svg.attr("width", width);
    g.attr("transform", `translate(${width / 2}, ${height / 2})`);
    simulation.alpha(1).restart();
  }, CONFIG.resizeDebounce);
});

// ملاحظة ظهور العنصر باستخدام IntersectionObserver خارج حلقة tick
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      simulation.alpha(0.3).restart();
    }
  });
}, { threshold: 0.5 });

observer.observe(container);

// دالة لإعادة تهيئة المحاكاة عند ظهور الصفحة الرئيسية
function resetTreeLayout() {
  // إعادة حساب أبعاد العنصر الحاوي
  width = container.getBoundingClientRect().width;
  svg.attr("width", width);
  g.attr("transform", `translate(${width / 2}, ${height / 2})`);
  
  // إعادة ضبط العقد إلى مواقعها الأولية
  nodes.forEach(d => {
    d.x = d.initialX;
    d.y = d.initialY;
    d.fx = d.initialX;
    d.fy = d.initialY;
  });
  
  // إعادة تشغيل المحاكاة بقيمة ألفا كاملة
  simulation.alpha(1).restart();
  
  // بعد فترة قصيرة، تحرير القيود للسماح للحركة الطبيعية
  setTimeout(() => {
    nodes.forEach(d => {
      d.fx = null;
      d.fy = null;
    });
  }, 500);
}

// دالة تبديل الصفحات (مثال)
function switchPage(newPage) {
  // إخفاء جميع الصفحات
  document.querySelectorAll('article[data-page]').forEach(article => {
    article.classList.remove('active');
  });
  
  // إظهار الصفحة المطلوبة
  const targetPage = document.querySelector(`article[data-page="${newPage}"]`);
  if (targetPage) targetPage.classList.add('active');
  
  // إذا كانت الصفحة الرئيسية تظهر، قم بإعادة تهيئة المحاكاة
  if (newPage === 'main') { // تأكد أن الاسم يتوافق مع نظامك
    resetTreeLayout();
  } else {
    // عند الانتقال من الصفحة الرئيسية إلى صفحات أخرى، يمكن إيقاف المحاكاة
    simulation.stop();
  }
}