# Lucky Wheel Game 🎡

幸運轉盤遊戲 — 一個互動式的幸運轉盤網頁應用程式，使用 Vue 3 + TypeScript 打造。

## Demo

🔗 [線上展示](https://clipwww.github.io/lucky-wheel-game/)

## 功能特色

- 🎯 **互動式轉盤** — 點擊按鈕即可旋轉轉盤，隨機抽選獎項
- 🔢 **自訂獎項數量** — 支援 2 至 20 個獎項區塊，透過下拉選單即時切換
- 🎨 **動態生成** — 根據獎項數量自動計算並繪製轉盤區塊
- 💫 **流暢動畫** — CSS transition 搭配 cubic-bezier 緩動函數，模擬真實轉盤減速效果
- 📐 **響應式設計** — 使用 Tailwind CSS，適配不同裝置螢幕
- 🔔 **事件系統** — 提供 `SpinnerLoaded`、`RotationStart`、`RotationEnd` 等自訂事件

## 技術棧

| 類別 | 技術 |
| --- | --- |
| 前端框架 | [Vue 3](https://vuejs.org/) |
| 程式語言 | [TypeScript](https://www.typescriptlang.org/) |
| 打包工具 | [Parcel](https://parceljs.org/) |
| CSS 框架 | [Tailwind CSS](https://tailwindcss.com/) |
| CSS 預處理器 | [SCSS / Sass](https://sass-lang.com/) |

## 專案結構

```
lucky-wheel-game/
├── src/
│   ├── index.html          # HTML 進入點
│   ├── index.ts            # Vue 應用程式初始化
│   ├── index.scss          # 全域樣式（引入 Tailwind CSS）
│   ├── lucky-wheel.ts      # 轉盤核心邏輯
│   ├── lucky-wheel.scss    # 轉盤元件樣式
│   └── tailwindcss.css     # Tailwind CSS 指令
├── .github/
│   └── workflows/
│       └── gh-page.yml     # GitHub Actions 自動部署
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 快速開始

### 環境需求

- [Node.js](https://nodejs.org/)
- npm

### 安裝

```bash
# 複製專案
git clone https://github.com/clipwww/lucky-wheel-game.git
cd lucky-wheel-game

# 安裝依賴
npm install
```

### 開發

```bash
# 啟動本地開發伺服器（含 Hot Reload）
npm run dev
```

### 建置

```bash
# 建置生產版本（輸出至 ./build 目錄）
npm run build
```

## API 說明

核心模組 `lucky-wheel.ts` 匯出 `createSpinner` 工廠函式，使用方式如下：

```typescript
import { createSpinner, EventEnum } from './lucky-wheel';

const spinner = createSpinner();

// 初始化轉盤，參數為獎項數量（預設 8）
spinner.init(8);

// 旋轉轉盤至指定獎項編號
spinner.rotation(3);

// 監聽事件
spinner.addEventListener(EventEnum.RotationEnd, (target: number) => {
  console.log(`中獎號碼：${target}`);
});
```

### 方法

| 方法 | 說明 |
| --- | --- |
| `init(length)` | 初始化轉盤，`length` 為獎項數量（預設 8） |
| `rotation(target)` | 旋轉轉盤至指定獎項編號 |
| `addEventListener(type, handler)` | 註冊事件監聽 |
| `removeEventListener(type, handler)` | 移除事件監聽 |
| `getRandom(min, max)` | 取得指定範圍內的隨機整數 |
| `setDisabled(bool)` | 設定轉盤是否禁用 |

### 事件

| 事件 | 說明 |
| --- | --- |
| `EventEnum.SpinnerLoaded` | 轉盤初始化完成時觸發 |
| `EventEnum.RotationStart` | 轉盤開始旋轉時觸發 |
| `EventEnum.RotationEnd` | 轉盤停止旋轉時觸發，回傳中獎獎項編號 |

## 部署

專案使用 GitHub Actions 自動部署至 GitHub Pages。當推送至 `master` 分支時，會自動觸發建置並部署。

## 授權

[MIT](https://opensource.org/licenses/MIT)