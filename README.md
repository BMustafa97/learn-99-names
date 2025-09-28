# Arabic Recognition App

> **Author:** Bilal Mustafa  
> **Status:** ✅ Production Ready  
> **Last Updated:** 28-09-2025  
> **Live URL:** [LIVE URL](https://p3nsmqm8we.eu-west-1.awsapprunner.com/)  
> **Infrastructure:** AWS App Runner (Fully Managed Container Service)

This is a web application that combines Arabic speech recognition with the [`quranic-universal-library`](https://github.com/TarteelAI/quranic-universal-library) GitHub library to provide access to Quranic text and metadata. The app allows users to speak in Arabic and have their speech recognized and processed.

## 🏗️ Cloud Architecture

This application is deployed using **AWS App Runner**, a fully managed container service that provides:

- ✅ **Automatic HTTPS** - Built-in SSL/TLS certificates
- ✅ **Auto Scaling** - Scales from 0 to handle traffic spikes
- ✅ **Cost Optimization** - Pay only for what you use (~$20-30/month savings vs traditional ECS+ALB)
- ✅ **Zero Infrastructure Management** - No servers, load balancers, or VPCs to manage
- ✅ **Continuous Deployment** - Automatic deployments from ECR container registry

## Features

- **Arabic Speech Recognition**: Uses the Web Speech API to recognize spoken Arabic
- **Real-time Transcription**: Displays recognized Arabic text in real-time
- **Learn 99 Names of Allah**: Interactive learning page with pronunciation practice
- **Accuracy Scoring**: Get percentage accuracy feedback on your pronunciation
- **Progress Tracking**: Track your learning progress with detailed statistics
- **Quranic Integration**: Designed to work with the `quranic-universal-library` for text processing
- **Responsive Web Interface**: Clean, modern UI that works on desktop and mobile
- **Browser-based**: No additional software installation required

## Getting Started

### Prerequisites

- Modern web browser with Web Speech API support (Chrome, Edge, Safari)
- Microphone access permission
- Internet connection for speech recognition
- Node.js (v14+ recommended) for development server
- npm or yarn

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/BMustafa97/learn-99-names.git
    cd src
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000`

### Usage

#### Main Speech Recognition Page
1. **Grant Microphone Permission**: When prompted, allow the browser to access your microphone
2. **Start Recognition**: Click the "🎤 Start Recognition" button
3. **Speak Arabic**: Speak clearly in Arabic - the app will transcribe your speech in real-time
4. **Stop Recognition**: Click the "⏹️ Stop Recognition" button when finished
5. **Clear Results**: Use the "🗑️ Clear Text" button to reset the transcription

#### Learn 99 Names of Allah Page
1. **Navigate to Learning Page**: Click "📚 Learn 99 Names of Allah" from the main page
2. **Choose a Name**: Review the first 10 names displayed with Arabic text, transliteration, and meaning
3. **Practice Pronunciation**: Click the "🎤 Practice" button for any name
4. **Speak the Name**: Pronounce the Arabic name clearly when prompted
5. **Get Feedback**: Receive instant accuracy percentage and feedback on your pronunciation
6. **Track Progress**: View your overall statistics including total attempts, average accuracy, and best score

### Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Safari (macOS/iOS)
- ❌ Firefox (limited Web Speech API support)

### Integrating with Quranic Universal Library

The current frontend implementation includes placeholders for Quranic text search. To fully integrate with the `quranic-universal-library`, you'll need to:

1. **Create a Backend API**: Set up a Node.js server that uses the `quranic-universal-library`
2. **API Endpoints**: Create endpoints to search and retrieve Quranic text
3. **Frontend Integration**: Connect the speech recognition results to your backend API

Example backend integration:

```js
// backend/server.js
const express = require('express');
const { Quran } = require('quranic-universal-library');
const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for frontend

app.post('/api/search', async (req, res) => {
  try {
    const { searchText } = req.body;
    const quran = new Quran();
    
    // Search for the text in Quranic verses
    const results = await quran.search(searchText);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});
```

### Deployment & Infrastructure

The application is deployed on **AWS App Runner** with the following benefits:

- 🚀 **Fully Managed**: No infrastructure management required
- 💰 **Cost Effective**: ~60% cost reduction compared to ECS+ALB setup
- 🔒 **Secure by Default**: Automatic HTTPS, built-in load balancing
- 📈 **Auto Scaling**: Scales based on traffic (min: 1, max: 10 instances)
- 🔄 **CI/CD Integration**: Automatic deployments from GitHub Actions

**Infrastructure Stack:**
- **Container Service**: AWS App Runner
- **Container Registry**: Amazon ECR
- **CI/CD**: GitHub Actions
- **Infrastructure as Code**: Terraform

### Current Implementation

The current web application includes:
- ✅ Arabic speech recognition using Web Speech API
- ✅ Real-time transcription display
- ✅ Clean, responsive user interface
- ✅ Production deployment on AWS App Runner
- ⏳ Quranic search integration (requires backend setup)

## Resources

- [quranic-universal-library Documentation](https://github.com/TarteelAI/quranic-universal-library)
- [Quranic Universal Library on npm](https://www.npmjs.com/package/quranic-universal-library)

## License

This project is licensed under the MIT License.