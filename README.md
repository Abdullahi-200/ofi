
# Nigerian Tailor Marketplace

A full-stack web application connecting customers with skilled Nigerian tailors, featuring real-time order tracking, AI-powered style recommendations, and integrated payment processing.

## Features

- 🎨 **Marketplace**: Browse and discover Nigerian tailor designs
- 📏 **Smart Measurements**: AR-powered measurement capture
- 💬 **Real-time Communication**: Socket.IO powered live updates
- 💰 **Payment Integration**: Secure payment processing with Paystack
- 📊 **Analytics Dashboard**: Comprehensive business insights
- 🤖 **AI Recommendations**: Personalized style suggestions
- 📱 **Mobile Responsive**: Optimized for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Database**: PostgreSQL with Drizzle ORM
- **Payment**: Paystack integration
- **Real-time**: Socket.IO for live updates
- **UI Components**: Radix UI primitives

## Quick Start

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- Environment variables (see Environment Configuration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nigerian-tailor-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see Environment Configuration section)

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Payment (Paystack)
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key

# Application
NODE_ENV=development
PORT=5000

# Session (for production)
SESSION_SECRET=your_super_secret_session_key
```

## Deployment

### Deploying on Replit (Recommended)

This application is optimized for Replit deployment:

1. **Import from GitHub**:
   - Go to [replit.com/new](https://replit.com/new)
   - Click "Import from GitHub"
   - Enter your repository URL

2. **Configure Environment Variables**:
   - Click on "Secrets" in the left sidebar
   - Add all required environment variables from the list above

3. **Database Setup**:
   - Enable PostgreSQL in the Replit console
   - Use the provided DATABASE_URL in your secrets

4. **Deploy**:
   - Click the "Deploy" button
   - Select your preferred deployment tier
   - The app will be available at `https://your-app-name.replit.app`

### Manual Deployment Steps

For other platforms, follow these general steps:

1. **Build the application**:
```bash
npm run build
```

2. **Set environment variables** on your hosting platform

3. **Start the production server**:
```bash
npm start
```

### Platform-Specific Instructions

#### Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in dashboard

#### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist/public`
4. Add environment variables

#### Railway
1. Connect GitHub repository
2. Set start command: `npm start`
3. Add environment variables
4. Deploy automatically on push

#### DigitalOcean App Platform
1. Create new app from GitHub
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Configure environment variables

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages/routes
│   │   ├── services/    # API and business logic
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend Express application
│   ├── index.ts         # Main server file
│   ├── routes.ts        # API routes
│   └── vite.ts          # Vite integration
├── shared/              # Shared types and schemas
└── migrations/          # Database migrations
```

## Database Schema

The application uses Drizzle ORM with PostgreSQL. Key entities include:

- **Users**: Customer and tailor accounts
- **Designs**: Tailor design listings
- **Orders**: Customer orders and tracking
- **Measurements**: Customer measurement data
- **Reviews**: Design and tailor reviews

## API Endpoints

### Public Routes
- `GET /api/designs` - Browse designs
- `GET /api/designs/trending` - Trending designs
- `GET /api/tailors` - Browse tailors

### Protected Routes
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/measurements` - Save measurements

## Real-time Features

The application uses Socket.IO for real-time updates:

- Order status changes
- Live measurement updates
- Tailor dashboard notifications
- Customer notifications

## Payment Processing

Integrated with Paystack for secure payments:

- Order payments
- Subscription management
- Refund processing
- Transaction history

## Security Features

- Input validation with Zod schemas
- SQL injection prevention with Drizzle ORM
- Secure session management
- Environment variable protection
- CORS configuration

## Performance Optimizations

- Vite for fast development and builds
- Code splitting with React lazy loading
- Image optimization
- Database query optimization
- Caching strategies

## Monitoring and Logging

- Request/response logging
- Error tracking
- Performance monitoring
- Database query logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For deployment issues or questions:
- Check the troubleshooting section
- Review environment configuration
- Ensure all dependencies are installed
- Verify database connectivity

## Troubleshooting

### Common Issues

**Build Failures**:
- Ensure all environment variables are set
- Check Node.js version compatibility
- Verify database connectivity

**Socket.IO Connection Issues**:
- Check CORS configuration
- Verify WebSocket support on hosting platform
- Ensure proper port configuration

**Database Connection**:
- Verify DATABASE_URL format
- Check database permissions
- Ensure database is accessible from hosting platform

**Payment Integration**:
- Verify Paystack API keys
- Check webhook configurations
- Ensure proper environment setup
