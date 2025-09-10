// Arabic Speech Recognition App

class ArabicRecognitionApp {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.recognizedText = '';
        
        // Get DOM elements
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.status = document.getElementById('status');
        this.recognizedTextDiv = document.getElementById('recognizedText');
        this.quranicResultsDiv = document.getElementById('quranicResults');
        
        this.initializeSpeechRecognition();
        this.setupEventListeners();
    }
    
    initializeSpeechRecognition() {
        // Check if browser supports speech recognition
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.updateStatus('Speech recognition not supported in this browser.', 'error');
            this.startBtn.disabled = true;
            return;
        }
        
        // Create recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition settings
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'ar-SA'; // Arabic (Saudi Arabia)
        this.recognition.maxAlternatives = 1;
        
        // Set up event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateStatus('Listening... Speak in Arabic', 'success');
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.startBtn.classList.add('listening');
        };
        
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Update display with current results
            const currentText = this.recognizedText + finalTranscript;
            const displayText = currentText + (interimTranscript ? ' ' + interimTranscript : '');
            this.recognizedTextDiv.textContent = displayText;
            
            // If we have final results, save them and search Quran
            if (finalTranscript) {
                this.recognizedText += finalTranscript;
                this.searchQuranText(finalTranscript.trim());
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            let errorMessage = 'Recognition error: ';
            
            switch (event.error) {
                case 'no-speech':
                    errorMessage += 'No speech detected. Try speaking closer to the microphone.';
                    break;
                case 'audio-capture':
                    errorMessage += 'No microphone found. Please check your microphone.';
                    break;
                case 'not-allowed':
                    errorMessage += 'Microphone permission denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage += 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage += event.error;
            }
            
            this.updateStatus(errorMessage, 'error');
            this.stopRecognition();
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.startBtn.classList.remove('listening');
            
            if (this.recognizedText) {
                this.updateStatus('Recognition completed. Click start to continue.', 'success');
            } else {
                this.updateStatus('Ready to listen...', '');
            }
        };
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            this.startRecognition();
        });
        
        this.stopBtn.addEventListener('click', () => {
            this.stopRecognition();
        });
        
        this.clearBtn.addEventListener('click', () => {
            this.clearResults();
        });
    }
    
    startRecognition() {
        if (!this.recognition) {
            this.updateStatus('Speech recognition not available.', 'error');
            return;
        }
        
        try {
            this.recognition.start();
            this.updateStatus('Starting recognition...', '');
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.updateStatus('Error starting recognition. Please try again.', 'error');
        }
    }
    
    stopRecognition() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
    
    clearResults() {
        this.recognizedText = '';
        this.recognizedTextDiv.textContent = '';
        this.quranicResultsDiv.textContent = '';
        this.updateStatus('Results cleared. Ready to listen...', '');
    }
    
    updateStatus(message, type = '') {
        this.status.textContent = message;
        this.status.className = type;
    }
    
    searchQuranText(searchText) {
        if (!searchText.trim()) {
            return;
        }
        
        // Display the search text
        const searchInfo = document.createElement('div');
        searchInfo.style.cssText = 'margin-bottom: 10px; padding: 10px; background: #e3f2fd; border-radius: 5px; border-left: 4px solid #2196F3;';
        searchInfo.innerHTML = `<strong>Searching for:</strong> "${searchText}"`;
        
        this.quranicResultsDiv.appendChild(searchInfo);
        
        // Note: The quranic-universal-library is designed for Node.js
        // For a browser implementation, you would need to either:
        // 1. Set up a backend API that uses the library
        // 2. Use a browser-compatible alternative
        // 3. Load pre-processed Quranic data
        
        // For now, we'll show a placeholder message
        const placeholder = document.createElement('div');
        placeholder.style.cssText = 'padding: 15px; background: #fff3e0; border-radius: 5px; margin-top: 10px; border-left: 4px solid #ff9800;';
        placeholder.innerHTML = `
            <p><strong>Note:</strong> To integrate with the quranic-universal-library, you'll need to:</p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Set up a Node.js backend server</li>
                <li>Install the quranic-universal-library on the backend</li>
                <li>Create API endpoints to search Quranic text</li>
                <li>Connect this frontend to your backend API</li>
            </ul>
            <p style="margin-top: 10px;"><em>Recognized text: "${searchText}"</em></p>
        `;
        
        this.quranicResultsDiv.appendChild(placeholder);
        
        // Scroll to bottom of results
        this.quranicResultsDiv.scrollTop = this.quranicResultsDiv.scrollHeight;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ArabicRecognitionApp();
});

// Handle page visibility changes to stop recognition when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.app && window.app.isListening) {
        window.app.stopRecognition();
    }
});
