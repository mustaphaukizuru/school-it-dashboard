# School IT Dashboard

A full-stack IT management dashboard built for school environments.
Built with **Django REST Framework** (backend) and **React** (frontend).

Live demo: [Add your Render URL here after deploying]

---

## Features

- Device inventory — track all school devices with name, IP, location, and status
- IT ticket system — create and manage support tickets with priority levels
- Uptime tracker — automatic uptime percentage per device
- Live dashboard — charts showing device status and ticket breakdown
- Admin panel — manage everything via Django admin
- REST API — fully documented endpoints

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Python 3.11, Django 4.2, DRF            |
| Frontend  | React 18, Recharts, React Router, Axios |
| Database  | SQLite (local) / PostgreSQL (production)|
| Deployment| Render.com (free tier)                  |

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/school-it-dashboard.git
cd school-it-dashboard
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
python manage.py makemigrations dashboard
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at: http://127.0.0.1:8000
Admin panel at:  http://127.0.0.1:8000/admin
API root at:     http://127.0.0.1:8000/api

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

---

## API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/devices/         | List all devices     |
| POST   | /api/devices/         | Add a device         |
| PATCH  | /api/devices/{id}/    | Update a device      |
| DELETE | /api/devices/{id}/    | Delete a device      |
| GET    | /api/tickets/         | List all tickets     |
| POST   | /api/tickets/         | Create a ticket      |
| PATCH  | /api/tickets/{id}/    | Update a ticket      |
| DELETE | /api/tickets/{id}/    | Delete a ticket      |
| GET    | /api/stats/           | Dashboard summary    |

---

## Deployment (Render.com)

### Backend
1. Push this repo to GitHub
2. Go to render.com → New → Web Service
3. Connect your repo, set root directory to `backend`
4. Build command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
5. Start command: `gunicorn core.wsgi`
6. Add env variable: `SECRET_KEY` (any random string), `DEBUG=false`

### Frontend
1. Go to render.com → New → Static Site
2. Connect same repo, set root directory to `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `build`
5. Add env variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

---

## Project Structure

```
school-it-dashboard/
├── backend/
│   ├── core/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── dashboard/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── admin.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Devices.jsx
│       │   └── Tickets.jsx
│       ├── api.js
│       ├── App.js
│       └── index.js
├── render.yaml
├── .gitignore
└── README.md
```

---

## Author

**Ukizuru Mustapha**
IT Manager & Full-Stack Developer | Google Certified Educator L2
- Website: [mustaphaukizuru.com](https://mustaphaukizuru.com)
- LinkedIn: [linkedin.com/in/mustaphaukizuru](https://linkedin.com/in/mustaphaukizuru)
- GitHub: [github.com/mustaphaukizuru](https://github.com/mustaphaukizuru)
