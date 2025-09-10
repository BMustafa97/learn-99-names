# Installation Guide

This guide will walk you through setting up the Arabic Recognition App on your local machine.

## Prerequisites

Before installing the application, ensure you have the following:

### System Requirements
- **Node.js** version 14 or higher
- **npm** (comes with Node.js) or **yarn**
- **Modern web browser** with Web Speech API support:
  - ✅ Google Chrome (recommended)
  - ✅ Microsoft Edge
  - ✅ Safari (macOS/iOS)
  - ❌ Firefox (limited support)

### Hardware Requirements
- **Microphone** for speech recognition
- **Internet connection** for speech processing
- **Speakers/Headphones** for audio feedback (optional)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/BMustafa97/learn-99-names.git
cd arabic-recognition-app
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Start the Development Server

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn dev
```

The application will start on `http://localhost:3000` and automatically open in your default browser.

## Project Structure

After installation, your project structure will look like this:

```
arabic-recognition-app/
├── src/                          # Source files
│   ├── index.html               # Main page
│   ├── learn-99-names.html      # Learning page
│   ├── script.js                # Main page JavaScript
│   ├── learn-names.js           # Learning page JavaScript
│   ├── styles.css               # Main stylesheet
│   └── learn-names.css          # Learning page styles
├── docs/                        # Documentation
├── package.json                 # Dependencies and scripts
└── README.md                    # Main readme
```

## Verification

To verify your installation:

1. **Open the main page**: Navigate to `http://localhost:3000`
2. **Test speech recognition**: Click "🎤 Start Recognition" and grant microphone permission
3. **Access learning page**: Click "📚 Learn 99 Names of Allah"
4. **Test practice buttons**: Click any "🎤 Practice" button and verify it starts listening

## Development Scripts

The following npm scripts are available:

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm start` | Start production server |
| `dev` | `npm run dev` | Start development server with auto-reload |
| `install-quranic` | `npm run install-quranic` | Install quranic-universal-library |

## Configuration

### Environment Variables

The application doesn't require environment variables for basic functionality, but you can configure:

- **Port**: Default is 3000, can be changed in package.json
- **Cache**: Development server runs with cache disabled (`-c-1`)

### Browser Permissions

The application requires:

1. **Microphone Access**: Essential for speech recognition
2. **HTTPS** (in production): Web Speech API requires secure context

## Troubleshooting Installation

### Common Issues

**Node.js not found**
```bash
# Install Node.js from https://nodejs.org/
# Verify installation:
node --version
npm --version
```

**Permission errors**
```bash
# On macOS/Linux, use sudo if needed:
sudo npm install

# Or fix npm permissions:
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Port already in use**
```bash
# Kill process using port 3000:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npx http-server src -p 3001 -o
```

**Dependencies not installing**
```bash
# Clear npm cache:
npm cache clean --force

# Delete node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
```

### Browser Issues

**Microphone not working**
- Ensure microphone permissions are granted
- Check browser's site settings
- Test microphone in other applications

**Speech recognition not supported**
- Switch to Chrome or Edge
- Ensure you're using HTTPS in production
- Check browser console for errors

## Next Steps

After successful installation:

1. Read the [Quick Start Guide](./quick-start.md)
2. Explore the [Learning System](./learning-system.md)
3. Check [Browser Requirements](./browser-requirements.md) for optimization tips

## Support

If you encounter issues during installation:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Ensure all prerequisites are met
3. Verify your Node.js and npm versions
4. Check browser compatibility

---

*Need help? Open an issue on the project repository.*
