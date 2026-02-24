# Trident Group Site Induction Page

This is a mobile-first, QR-accessible induction page built with Next.js 15, Tailwind CSS, and Nodemailer.

## ✨ Features
- **Mobile-First Design**: Optimized for small screens (max width 480px).
- **Safety Induction Video**: Integrated video player for site safety training.
- **Mandatory Compliance**: Submit button only appears once the video is watched and safety terms are agreed to.
- **Email Notifications**: Text-only email is sent to `Vijay@tridentgroup.au` upon submission.
- **No Database**: Lightweight and privacy-focused.

---

## 📁 Folder Structure
```text
qr-form/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── send-email/
│   │   │       └── route.ts     # Backend: Nodemailer logic
│   │   ├── layout.tsx           # Global layout & SEO metadata
│   │   ├── page.tsx             # Frontend: Form & UI
│   │   └── globals.css          # Styling
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- A Gmail account (for SMTP)

### 2. Setup Environment Variables
Create a `.env.local` file in the root directory:
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```
> **Note:** For Gmail, you MUST use an **App Password** if you have 2FA enabled. [Generate one here](https://myaccount.google.com/apppasswords).

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Deployment Instructions (Vercel)

Vercel is the recommended platform for Next.js apps.

1. **Push to GitHub**: Initialize a git repo and push your code.
2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com).
   - Click "New Project".
   - Import your GitHub repository.
3. **Configure Environment Variables**:
   - During the import, add `EMAIL_USER` and `EMAIL_PASS` in the "Environment Variables" section.
4. **Deploy**: Click "Deploy". Your site will be live on a `vercel.app` domain.

---

## 📱 How to Generate a QR Code

Once the site is deployed and you have a URL (e.g., `https://induction.tridentgroup.au`):

### Option 1: Using Chrome (Easiest)
1. Open your deployed URL in Google Chrome.
2. Right-click anywhere on the page.
3. Select **"Create QR Code for this Page"**.
4. Download the QR code image and print it for on-site use.

### Option 2: Using Online Generator
1. Visit [QR Code Generator](https://www.qr-code-generator.com/) or [MonkeyQR](https://www.qrcode-monkey.com/).
2. Select **URL** icon.
3. Paste your final deployment URL.
4. Customize (optional) and click **Download PNG**.

---

## 📧 Email Format (Text Only)
The backend sends a clean text-only email as requested:
- **Recipient**: Vijay@tridentgroup.au
- **Subject**: Site Induction Form Submission
- **Body**: Contains Name and confirmation status.
