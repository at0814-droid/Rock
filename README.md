<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Studio React App

這個專案是結合 AI Studio 以及 Vite + React 的 Web 應用程式。

## 📦 專案設定與安裝 (Installation)

**Prerequisites:** 電腦需安裝 Node.js (建議 v18 或 v20 以上版本)。

1. **安裝依賴套件**:
   ```bash
   npm install
   ```
2. **環境變數設定**:
   請將 `.env.example` 複製一份並命名為 `.env.local`，並填入您的 `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env.local
   ```
3. **啟動本地開發伺服器**:
   ```bash
   npm run dev
   ```
   啟動後，您可以在瀏覽器中預覽您的應用程式。

## 🚀 部署 (Deployment)

專案內已經為您設定了 **GitHub Actions** (`.github/workflows/deploy.yml`) 來進行自動化部署至 **GitHub Pages**。

### 如何部署：
1. 將此專案推送到 GitHub Repository。
2. 前往儲存庫的 **Settings > Pages**。
3. 在 `Source` 換成 **GitHub Actions**。
4. 只要將程式碼 Push 到 `main` 或 `master` 分支，GitHub Action 就會觸發並自動 Build 與 Deploy。

## 🛡️ 版控 (Version Control)

本專案配置有完善的 `.gitignore` 檔案：
- **避免上傳大檔**：例如 `node_modules/` 與編譯後的 `dist/`。
- **保護隱私檔**：例如 `.env` 與 `.env.local` 等存放環境變數或敏感金鑰的檔案皆已自動過濾。僅供範例參考的 `.env.example` 才能被推送。
- **過濾暫存檔**：例如 IDE 配置 (`.vscode/`、`.idea/`) 與 OS 產生的 `.DS_Store`。
