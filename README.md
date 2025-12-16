# 🎬 QuickShow - Movie Ticket Management System

A full-stack movie ticket booking platform that allows users to browse movies, view showtimes, book seats, and manage their reservations. Built with modern web technologies and designed for seamless user experience.

🌐 **Live Demo:**(https://movie-ticket-management-ecru.vercel.app/)

## ✨ Features

### User Features
- 🎥 Browse current movies and upcoming releases
- 🎭 View theater details and showtimes
- 💺 Interactive seat selection with real-time availability
- 💳 Secure payment processing with Stripe
- ⭐ Favorite movies for quick access
- 📧 Email notifications for bookings
- 📱 Responsive design for all devices
- 🔐 Secure authentication with Clerk

### Admin Features
- 📊 Dashboard with booking analytics
- 🎬 Manage movie shows and schedules
- 🏛️ Theatre management
- 📋 View and manage all bookings
- ➕ Add new shows with seat configurations

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Styling
- **React Router DOM** - Navigation
- **Clerk** - Authentication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications
- **Clerk Express** - Authentication middleware
- **Inngest** - Background job processing
- **Cloudinary** - Image management
- **CORS** - Cross-origin resource sharing

### Testing
- **Jest** - Testing framework
- Unit tests with coverage reports

## 📁 Project Structure

```
QuickShow/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── configs/           # Configuration files
│   └── inngest/           # Background jobs
│
├── Unit_Testing/          # Unit tests and coverage
│   ├── coverage/          # Test coverage reports
│   └── *.test.js          # Test files
│
└── uml-class-diagram.puml # System architecture diagram
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Clerk account for authentication
- Stripe account for payments
- Cloudinary account for image uploads

### Environment Variables

#### Client (.env)
Create a `.env` file in the `client` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

#### Server (.env)
Create a `.env` file in the `server` directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Server
PORT=5000
NODE_ENV=development
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuickShow
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Install testing dependencies**
   ```bash
   cd ../Unit_Testing
   npm install
   ```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run server
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

#### Production Mode

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

### Running Tests

Run unit tests with coverage:
```bash
cd Unit_Testing
npm run test:coverage
```

View coverage report:
- Open `Unit_Testing/coverage/lcov-report/index.html` in your browser

## 📡 API Endpoints

### User Routes
- `POST /api/users/register` - Register new user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Theatre Routes
- `GET /api/theatres` - Get all theatres
- `GET /api/theatres/:id` - Get theatre details
- `GET /api/theatres/:id/shows` - Get theatre shows

### Show Routes
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show details
- `POST /api/shows/:id/check-availability` - Check seat availability

### Booking Routes
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/user` - Get user bookings
- `POST /api/bookings/payment` - Process payment

### Admin Routes
- `POST /api/admin/shows` - Add new show
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/shows/:id` - Update show
- `DELETE /api/admin/shows/:id` - Delete show

## 🎨 Key Features Explained

### Seat Selection System
- Interactive seat map with visual feedback
- Real-time seat availability checking
- Locked seats during booking process
- Different seat categories (Regular, Premium, VIP)

### Payment Integration
- Secure Stripe payment processing
- Webhook handling for payment confirmation
- Automatic booking confirmation emails

### Authentication
- Clerk-based authentication system
- Protected routes for user and admin
- Session management

### Background Jobs
- Inngest integration for async tasks
- Email notifications
- Booking confirmations

## 🧪 Testing

The project includes unit tests for critical functionality:
- Seat availability checking
- Booking validation
- Date and time formatting utilities

Test coverage is tracked and available in the `Unit_Testing/coverage` directory.

## 📦 Deployment

### Vercel Deployment

Both client and server include `vercel.json` configuration files for easy deployment on Vercel.

**Client Deployment:**
```bash
cd client
vercel
```

**Server Deployment:**
```bash
cd server
vercel
```

Make sure to configure environment variables in your Vercel dashboard.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Authors

Developed as a modern movie ticket booking platform.

## 🙏 Acknowledgments

- React and Vite teams for excellent developer experience
- Clerk for authentication solution
- Stripe for payment processing
- Tailwind CSS for the styling framework


**Note:** Remember to keep your environment variables secure and never commit them to version control.
