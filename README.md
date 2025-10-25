# CRAudioVizAI Games Pack

A comprehensive collection of 25+ micro-games with premium features, monetization, and extreme challenges. Built with Next.js 14 and designed for both standalone use and integration into larger platforms.

## 🎮 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start playing!

## 🚀 Features

- **25 Micro-Games**: Quick, engaging games across multiple categories
- **1 Extreme Game**: Season-based "Ascension" with advanced mechanics  
- **Monetization**: Stripe & PayPal integration with multiple pricing tiers
- **Feature Flags**: Granular control over game availability
- **Leaderboards**: Local and global scoring systems
- **Responsive Design**: Mobile-first with full desktop support
- **Accessibility**: WCAG AA compliant with keyboard navigation

## 🎯 Game Categories

### Always Free
- Emoji Charades, Fast Math, Word Snap, Color Match
- Memory Flip, Reaction Test, Tap Race, Emoji Bingo
- And 7 more free games!

### Premium (Pro/Elite)
- Pixel Zoom, Sound Bite Guess, Daily Riddle
- Micro Crossword, Trivia Blitz, Reaction Streaks
- And 4 more premium games!

### Extreme (Elite Only)
- **Ascension**: 7-zone extreme challenge with seasonal content

## 💰 Monetization

- **Free Plan**: All basic games, local leaderboards
- **Pro Plan ($9.99)**: Premium modes, global leaderboards, streak multipliers
- **Elite Plan ($19.99)**: All Pro features + Extreme games + Season Pass

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/games/       # Game-specific components
├── lib/                   # Utility libraries & game logic
├── content/               # Static content (Game of the Month)
└── docs/                  # Comprehensive documentation
```

## 🔧 Configuration

Key environment variables:

```bash
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your_paypal_client_id
SITE_URL=http://localhost:3000
```

See `.env.example` for complete configuration.

## 🚀 Deployment

### Netlify (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Manual Build
```bash
npm run build
npm run start
```

## 📊 Performance

- **Lighthouse Scores**: Performance ≥90, Accessibility ≥95, SEO ≥90
- **Bundle Size**: Optimized with Next.js code splitting
- **Mobile-First**: Responsive design for all devices

## 📚 Documentation

- **[User Guide](docs/USER_GUIDE.md)**: Complete player documentation
- **[API Reference](docs/API_REFERENCE.md)**: Full API documentation  
- **[QA Checklist](docs/QA_CHECKLIST.md)**: Testing and deployment guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes and test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs via GitHub Issues
- **Email**: support@craudiovizai.com
- **Documentation**: Check `/docs` folder for detailed guides

---

**Built with ❤️ by CRAudioVizAI**

*Ready to play? Start with our free games and upgrade for the ultimate experience!*

<!-- Deployment triggered: 2025-10-25 01:27:29 UTC -->
