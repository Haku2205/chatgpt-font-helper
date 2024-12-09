// 中文常用字体映射表
const fontNameMapping = {
  "宋体": "Songti SC",
  "微软雅黑": "Microsoft YaHei",
  "黑体": "SimHei",
  "楷体": "KaiTi",
  "仿宋": "FangSong",
  "隶书": "LiSu",
  "幼圆": "YouYuan",
  "华文行楷": "STXingkai",
  "华文楷体": "STKaiti",
  "华文细黑": "STXihei"
};

// 常用字体列表（以中文为主）
const fontList = [
  "宋体", "微软雅黑", "黑体", "楷体", "仿宋", "隶书", 
  "幼圆", "华文行楷", "华文楷体", "华文细黑", 
  "Arial", "Verdana", "Times New Roman", "Georgia", "Courier New"
];

const fontListDiv = document.getElementById("font-list");
const customFontInput = document.getElementById("custom-font");
const previewButton = document.getElementById("preview-font");
const applyButton = document.getElementById("apply-font");

let selectedFont = ""; // 当前选择的字体

// 将用户输入或选择的字体转换为系统支持的名称
function getSystemFontName(font) {
  return fontNameMapping[font] || font;
}

// 检测字体是否可用
function isFontAvailable(font) {
  const systemFont = getSystemFontName(font);
  const testString = "mmmmmmmmmmlli";
  const testSize = "72px";
  const defaultFont = "monospace";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = `${testSize} ${defaultFont}`;
  const defaultWidth = context.measureText(testString).width;

  context.font = `${testSize} ${systemFont}, ${defaultFont}`;
  const testWidth = context.measureText(testString).width;

  return testWidth !== defaultWidth;
}

// 显示字体列表
function displayFonts() {
  fontListDiv.innerHTML = "";
  fontList.forEach(font => {
    const systemFont = getSystemFontName(font);
    if (isFontAvailable(systemFont)) {
      const fontItem = document.createElement("div");
      fontItem.textContent = font;
      fontItem.className = "font-item";
      fontItem.style.fontFamily = systemFont;
      fontItem.style.fontSize = "20px";
      fontItem.addEventListener("click", () => {
        selectFont(fontItem, font);
      });
      fontListDiv.appendChild(fontItem);
    }
  });
}

// 设置选定字体的样式
function selectFont(element, font) {
  const previousSelected = document.querySelector(".font-item.selected");
  if (previousSelected) {
    previousSelected.classList.remove("selected");
  }
  element.classList.add("selected");
  selectedFont = font;
}

// 应用字体到网页（预览或确定）
function applyFontToPage(font) {
  const systemFont = getSystemFontName(font);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (selectedFont) => {
        document.body.style.fontFamily = selectedFont;
      },
      args: [systemFont]
    });
  });
}

// 事件监听：预览字体
previewButton.addEventListener("click", () => {
  const font = customFontInput.value || selectedFont;
  if (font) {
    applyFontToPage(font);
  } else {
    alert("请输入字体名称");
  }
});

// 事件监听：确定并应用字体
applyButton.addEventListener("click", () => {
  const font = customFontInput.value || selectedFont;
  if (font) {
    applyFontToPage(font);
    alert(`字体 "${font}" 已应用到当前页面`);
  } else {
    alert("请输入字体名称");
  }
});

// 初始化
document.addEventListener("DOMContentLoaded", displayFonts);