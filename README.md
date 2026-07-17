# AI HR Assistant — Backend API

Backend REST API untuk aplikasi AI HR Assistant yang membantu tim HR dalam proses rekrutmen menggunakan kecerdasan buatan.

## 🚀 Tech Stack

- **Runtime**: Node.js v22+
- **Framework**: Express.js v5
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **AI**: Groq API (Llama 3.3 70B)
- **Auth**: JWT + Refresh Token + bcryptjs
- **File Processing**: Multer, pdf-parse, Mammoth

## 📁 Struktur Folder
backend/
├── src/
│   ├── config/          # Konfigurasi (Supabase, Groq, Multer)
│   ├── controllers/     # Request handler
│   ├── routes/          # Definisi endpoint API
│   ├── middlewares/     # Auth, role, error handler
│   ├── services/        # Business logic
│   ├── repositories/    # Query database
│   ├── utils/           # Helper functions
│   ├── database/        # Schema SQL
│   └── server.js        # Entry point
├── .env.example
├── .gitignore
└── package.json

## ⚙️ Environment Variables

Salin `.env.example` menjadi `.env` lalu isi nilainya:

```bash
cp .env.example .env
```

| Variable | Keterangan |
|---|---|
| `PORT` | Port server (default: 5000) |
| `NODE_ENV` | Environment (`development` / `production`) |
| `SUPABASE_URL` | URL project Supabase |
| `SUPABASE_KEY` | Publishable/anon key Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key Supabase (rahasia!) |
| `JWT_SECRET` | Secret key untuk access token |
| `JWT_REFRESH_SECRET` | Secret key untuk refresh token |
| `GROQ_API_KEY` | API key dari console.groq.com |

## 🗄️ Setup Database

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Jalankan isi file `src/database/schema.sql`
4. Semua tabel akan terbuat otomatis

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Salin dan isi environment variables
cp .env.example .env

# Jalankan server development
npm run dev

# Jalankan server production
npm start
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrasi akun baru | - |
| POST | `/api/auth/login` | Login dan dapat token | - |
| POST | `/api/auth/refresh` | Refresh access token | Cookie |
| POST | `/api/auth/logout` | Logout | - |
| GET | `/api/auth/me` | Data user yang login | ✅ |

### Vacancies
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/vacancies` | List semua lowongan | ✅ |
| GET | `/api/vacancies/:id` | Detail lowongan | ✅ |
| POST | `/api/vacancies` | Buat lowongan baru | HR/Admin |
| PUT | `/api/vacancies/:id` | Update lowongan | HR/Admin |
| DELETE | `/api/vacancies/:id` | Hapus lowongan | HR/Admin |

### CV & AI Analysis
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/cv/upload` | Upload CV + analisis AI | Candidate |
| GET | `/api/cv/my-analyses` | Hasil analisis CV saya | Candidate |
| GET | `/api/cv/analysis/:applicationId` | Detail analisis | ✅ |

### Applications
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/applications` | List semua kandidat | HR/Admin |
| GET | `/api/applications/my-applications` | Lamaran saya | Candidate |
| PATCH | `/api/applications/:id/status` | Update status | HR/Admin |

### AI Chat
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/chat` | List conversations | ✅ |
| POST | `/api/chat` | Buat conversation baru | ✅ |
| GET | `/api/chat/:id/messages` | List pesan | ✅ |
| POST | `/api/chat/:id/stream` | Kirim pesan (streaming SSE) | ✅ |
| PATCH | `/api/chat/:id/title` | Rename conversation | ✅ |
| DELETE | `/api/chat/:id` | Hapus conversation | ✅ |

### Users
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| PUT | `/api/users/profile` | Update profil | ✅ |
| PUT | `/api/users/change-password` | Ganti password | ✅ |

## 🔒 Keamanan

- JWT Access Token (15 menit) + Refresh Token (7 hari)
- Refresh Token disimpan di HttpOnly Cookie
- Password di-hash dengan bcrypt (salt rounds: 12)
- Role-based access control (Admin, HR, Candidate)
- CORS dikonfigurasi hanya izinkan origin frontend
- Compression response dengan gzip
- Environment variables untuk semua secret

## 🚀 Deploy ke Railway

1. Push repo ke GitHub
2. Buka [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Pilih repo backend
4. Tambahkan semua environment variables di Railway dashboard
5. Railway otomatis detect Node.js dan deploy

---

Made with ❤️ by Dhonts18