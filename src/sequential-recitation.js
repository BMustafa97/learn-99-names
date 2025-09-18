// Sequential Recitation of 99 Names of Allah

class SequentialRecitationApp {
    constructor() {
        // All 99 Names of Allah
        this.allNames = [
            { arabic: 'الرَّحْمَٰنُ', simple: 'الرحمن', transliteration: 'Ar-Rahman', meaning: 'The Most Merciful' },
            { arabic: 'الرَّحِيمُ', simple: 'الرحيم', transliteration: 'Ar-Raheem', meaning: 'The Most Compassionate' },
            { arabic: 'الْمَلِكُ', simple: 'الملك', transliteration: 'Al-Malik', meaning: 'The King' },
            { arabic: 'الْقُدُّوسُ', simple: 'القدوس', transliteration: 'Al-Quddus', meaning: 'The Most Holy' },
            { arabic: 'السَّلَامُ', simple: 'السلام', transliteration: 'As-Salaam', meaning: 'The Source of Peace' },
            { arabic: 'الْمُؤْمِنُ', simple: 'المؤمن', transliteration: 'Al-Mu\'min', meaning: 'The Guardian of Faith' },
            { arabic: 'الْمُهَيْمِنُ', simple: 'المهيمن', transliteration: 'Al-Muhaymin', meaning: 'The Guardian' },
            { arabic: 'الْعَزِيزُ', simple: 'العزيز', transliteration: 'Al-Aziz', meaning: 'The Mighty' },
            { arabic: 'الْجَبَّارُ', simple: 'الجبار', transliteration: 'Al-Jabbar', meaning: 'The Compeller' },
            { arabic: 'الْمُتَكَبِّرُ', simple: 'المتكبر', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme' },
            { arabic: 'الْخَالِقُ', simple: 'الخالق', transliteration: 'Al-Khaliq', meaning: 'The Creator' },
            { arabic: 'الْبَارِئُ', simple: 'البارئ', transliteration: 'Al-Bari\'', meaning: 'The Originator' },
            { arabic: 'الْمُصَوِّرُ', simple: 'المصور', transliteration: 'Al-Musawwir', meaning: 'The Fashioner' },
            { arabic: 'الْغَفَّارُ', simple: 'الغفار', transliteration: 'Al-Ghaffar', meaning: 'The Repeatedly Forgiving' },
            { arabic: 'الْقَهَّارُ', simple: 'القهار', transliteration: 'Al-Qahhar', meaning: 'The Subduer' },
            { arabic: 'الْوَهَّابُ', simple: 'الوهاب', transliteration: 'Al-Wahhab', meaning: 'The Bestower' },
            { arabic: 'الرَّزَّاقُ', simple: 'الرزاق', transliteration: 'Ar-Razzaq', meaning: 'The Provider' },
            { arabic: 'الْفَتَّاحُ', simple: 'الفتاح', transliteration: 'Al-Fattah', meaning: 'The Opener' },
            { arabic: 'الْعَلِيمُ', simple: 'العليم', transliteration: 'Al-Aleem', meaning: 'The All-Knowing' },
            { arabic: 'الْقَابِضُ', simple: 'القابض', transliteration: 'Al-Qabid', meaning: 'The Constrictor' },
            { arabic: 'الْبَاسِطُ', simple: 'الباسط', transliteration: 'Al-Basit', meaning: 'The Expander' },
            { arabic: 'الْخَافِضُ', simple: 'الخافض', transliteration: 'Al-Khafid', meaning: 'The Abaser' },
            { arabic: 'الرَّافِعُ', simple: 'الرافع', transliteration: 'Ar-Rafi\'', meaning: 'The Exalter' },
            { arabic: 'الْمُعِزُّ', simple: 'المعز', transliteration: 'Al-Mu\'izz', meaning: 'The Honorer' },
            { arabic: 'الْمُذِلُّ', simple: 'المذل', transliteration: 'Al-Mudhill', meaning: 'The Humiliator' },
            { arabic: 'السَّمِيعُ', simple: 'السميع', transliteration: 'As-Samee\'', meaning: 'The All-Hearing' },
            { arabic: 'الْبَصِيرُ', simple: 'البصير', transliteration: 'Al-Baseer', meaning: 'The All-Seeing' },
            { arabic: 'الْحَكَمُ', simple: 'الحكم', transliteration: 'Al-Hakam', meaning: 'The Judge' },
            { arabic: 'الْعَدْلُ', simple: 'العدل', transliteration: 'Al-Adl', meaning: 'The Just' },
            { arabic: 'اللَّطِيفُ', simple: 'اللطيف', transliteration: 'Al-Lateef', meaning: 'The Gentle' },
            { arabic: 'الْخَبِيرُ', simple: 'الخبير', transliteration: 'Al-Khabeer', meaning: 'The Aware' },
            { arabic: 'الْحَلِيمُ', simple: 'الحليم', transliteration: 'Al-Haleem', meaning: 'The Forbearing' },
            { arabic: 'الْعَظِيمُ', simple: 'العظيم', transliteration: 'Al-Azeem', meaning: 'The Magnificent' },
            { arabic: 'الْغَفُورُ', simple: 'الغفور', transliteration: 'Al-Ghafoor', meaning: 'The Forgiving' },
            { arabic: 'الشَّكُورُ', simple: 'الشكور', transliteration: 'Ash-Shakoor', meaning: 'The Appreciative' },
            { arabic: 'الْعَلِيُّ', simple: 'العلي', transliteration: 'Al-Ali', meaning: 'The Most High' },
            { arabic: 'الْكَبِيرُ', simple: 'الكبير', transliteration: 'Al-Kabeer', meaning: 'The Greatest' },
            { arabic: 'الْحَفِيظُ', simple: 'الحفيظ', transliteration: 'Al-Hafeedh', meaning: 'The Preserver' },
            { arabic: 'الْمُقِيتُ', simple: 'المقيت', transliteration: 'Al-Muqeet', meaning: 'The Nourisher' },
            { arabic: 'الْحَسِيبُ', simple: 'الحسيب', transliteration: 'Al-Haseeb', meaning: 'The Reckoner' },
            { arabic: 'الْجَلِيلُ', simple: 'الجليل', transliteration: 'Al-Jaleel', meaning: 'The Majestic' },
            { arabic: 'الْكَرِيمُ', simple: 'الكريم', transliteration: 'Al-Kareem', meaning: 'The Generous' },
            { arabic: 'الرَّقِيبُ', simple: 'الرقيب', transliteration: 'Ar-Raqeeb', meaning: 'The Watchful' },
            { arabic: 'الْمُجِيبُ', simple: 'المجيب', transliteration: 'Al-Mujeeb', meaning: 'The Responsive' },
            { arabic: 'الْوَاسِعُ', simple: 'الواسع', transliteration: 'Al-Wasi\'', meaning: 'The All-Encompassing' },
            { arabic: 'الْحَكِيمُ', simple: 'الحكيم', transliteration: 'Al-Hakeem', meaning: 'The Wise' },
            { arabic: 'الْوَدُودُ', simple: 'الودود', transliteration: 'Al-Wadood', meaning: 'The Loving' },
            { arabic: 'الْمَجِيدُ', simple: 'المجيد', transliteration: 'Al-Majeed', meaning: 'The Glorious' },
            { arabic: 'الْبَاعِثُ', simple: 'الباعث', transliteration: 'Al-Ba\'ith', meaning: 'The Resurrector' },
            { arabic: 'الشَّهِيدُ', simple: 'الشهيد', transliteration: 'Ash-Shaheed', meaning: 'The Witness' },
            { arabic: 'الْحَقُّ', simple: 'الحق', transliteration: 'Al-Haqq', meaning: 'The Truth' },
            { arabic: 'الْوَكِيلُ', simple: 'الوكيل', transliteration: 'Al-Wakeel', meaning: 'The Trustee' },
            { arabic: 'الْقَوِيُّ', simple: 'القوي', transliteration: 'Al-Qawiyy', meaning: 'The Strong' },
            { arabic: 'الْمَتِينُ', simple: 'المتين', transliteration: 'Al-Mateen', meaning: 'The Firm' },
            { arabic: 'الْوَلِيُّ', simple: 'الولي', transliteration: 'Al-Waliyy', meaning: 'The Friend' },
            { arabic: 'الْحَمِيدُ', simple: 'الحميد', transliteration: 'Al-Hameed', meaning: 'The Praiseworthy' },
            { arabic: 'الْمُحْصِي', simple: 'المحصي', transliteration: 'Al-Muhsee', meaning: 'The Counter' },
            { arabic: 'الْمُبْدِئُ', simple: 'المبدئ', transliteration: 'Al-Mubdi\'', meaning: 'The Originator' },
            { arabic: 'الْمُعِيدُ', simple: 'المعيد', transliteration: 'Al-Mu\'eed', meaning: 'The Restorer' },
            { arabic: 'الْمُحْيِي', simple: 'المحيي', transliteration: 'Al-Muhyee', meaning: 'The Giver of Life' },
            { arabic: 'الْمُمِيتُ', simple: 'المميت', transliteration: 'Al-Mumeet', meaning: 'The Taker of Life' },
            { arabic: 'الْحَيُّ', simple: 'الحي', transliteration: 'Al-Hayy', meaning: 'The Living' },
            { arabic: 'الْقَيُّومُ', simple: 'القيوم', transliteration: 'Al-Qayyoom', meaning: 'The Self-Existing' },
            { arabic: 'الْوَاجِدُ', simple: 'الواجد', transliteration: 'Al-Wajid', meaning: 'The Finder' },
            { arabic: 'الْمَاجِدُ', simple: 'الماجد', transliteration: 'Al-Majid', meaning: 'The Noble' },
            { arabic: 'الْوَاحِدُ', simple: 'الواحد', transliteration: 'Al-Wahid', meaning: 'The One' },
            { arabic: 'الْأَحَدُ', simple: 'الأحد', transliteration: 'Al-Ahad', meaning: 'The Unique' },
            { arabic: 'الصَّمَدُ', simple: 'الصمد', transliteration: 'As-Samad', meaning: 'The Eternal' },
            { arabic: 'الْقَادِرُ', simple: 'القادر', transliteration: 'Al-Qadir', meaning: 'The Capable' },
            { arabic: 'الْمُقْتَدِرُ', simple: 'المقتدر', transliteration: 'Al-Muqtadir', meaning: 'The Powerful' },
            { arabic: 'الْمُقَدِّمُ', simple: 'المقدم', transliteration: 'Al-Muqaddim', meaning: 'The Expediter' },
            { arabic: 'الْمُؤَخِّرُ', simple: 'المؤخر', transliteration: 'Al-Mu\'akhkhir', meaning: 'The Delayer' },
            { arabic: 'الْأَوَّلُ', simple: 'الأول', transliteration: 'Al-Awwal', meaning: 'The First' },
            { arabic: 'الْآخِرُ', simple: 'الآخر', transliteration: 'Al-Akhir', meaning: 'The Last' },
            { arabic: 'الظَّاهِرُ', simple: 'الظاهر', transliteration: 'Az-Zahir', meaning: 'The Manifest' },
            { arabic: 'الْبَاطِنُ', simple: 'الباطن', transliteration: 'Al-Batin', meaning: 'The Hidden' },
            { arabic: 'الْوَالِي', simple: 'الوالي', transliteration: 'Al-Wali', meaning: 'The Governor' },
            { arabic: 'الْمُتَعَالِي', simple: 'المتعالي', transliteration: 'Al-Muta\'ali', meaning: 'The Most Exalted' },
            { arabic: 'الْبَرُّ', simple: 'البر', transliteration: 'Al-Barr', meaning: 'The Source of Goodness' },
            { arabic: 'التَّوَّابُ', simple: 'التواب', transliteration: 'At-Tawwab', meaning: 'The Acceptor of Repentance' },
            { arabic: 'الْمُنْتَقِمُ', simple: 'المنتقم', transliteration: 'Al-Muntaqim', meaning: 'The Avenger' },
            { arabic: 'الْعَفُوُّ', simple: 'العفو', transliteration: 'Al-Afuww', meaning: 'The Pardoner' },
            { arabic: 'الرَّؤُوفُ', simple: 'الرؤوف', transliteration: 'Ar-Ra\'oof', meaning: 'The Compassionate' },
            { arabic: 'مَالِكُ الْمُلْكِ', simple: 'مالك الملك', transliteration: 'Malik-ul-Mulk', meaning: 'Owner of All Sovereignty' },
            { arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', simple: 'ذو الجلال والإكرام', transliteration: 'Dhu-l-Jalali wa-l-Ikram', meaning: 'Lord of Glory and Honor' },
            { arabic: 'الْمُقْسِطُ', simple: 'المقسط', transliteration: 'Al-Muqsit', meaning: 'The Equitable' },
            { arabic: 'الْجَامِعُ', simple: 'الجامع', transliteration: 'Al-Jami\'', meaning: 'The Gatherer' },
            { arabic: 'الْغَنِيُّ', simple: 'الغني', transliteration: 'Al-Ghaniyy', meaning: 'The Self-Sufficient' },
            { arabic: 'الْمُغْنِي', simple: 'المغني', transliteration: 'Al-Mughni', meaning: 'The Enricher' },
            { arabic: 'الْمَانِعُ', simple: 'المانع', transliteration: 'Al-Mani\'', meaning: 'The Preventer' },
            { arabic: 'الضَّارُّ', simple: 'الضار', transliteration: 'Ad-Darr', meaning: 'The Distresser' },
            { arabic: 'النَّافِعُ', simple: 'النافع', transliteration: 'An-Nafi\'', meaning: 'The Benefiter' },
            { arabic: 'النُّورُ', simple: 'النور', transliteration: 'An-Noor', meaning: 'The Light' },
            { arabic: 'الْهَادِي', simple: 'الهادي', transliteration: 'Al-Hadi', meaning: 'The Guide' },
            { arabic: 'الْبَدِيعُ', simple: 'البديع', transliteration: 'Al-Badee\'', meaning: 'The Incomparable' },
            { arabic: 'الْبَاقِي', simple: 'الباقي', transliteration: 'Al-Baqi', meaning: 'The Everlasting' },
            { arabic: 'الْوَارِثُ', simple: 'الوارث', transliteration: 'Al-Warith', meaning: 'The Inheritor' },
            { arabic: 'الرَّشِيدُ', simple: 'الرشيد', transliteration: 'Ar-Rasheed', meaning: 'The Guide to Right Path' },
            { arabic: 'الصَّبُورُ', simple: 'الصبور', transliteration: 'As-Saboor', meaning: 'The Patient' }
        ];

        // Recitation state
        this.currentPosition = 0;
        this.totalMistakes = 0;
        this.isReciting = false;
        this.isPaused = false;
        this.recitationHistory = [];
        
        // Speech recognition
        this.recognition = null;
        this.isListening = false;
        
        // DOM elements
        this.elements = {
            startBtn: document.getElementById('startRecitation'),
            pauseBtn: document.getElementById('pauseRecitation'),
            resetBtn: document.getElementById('resetRecitation'),
            skipBtn: document.getElementById('skipName'),
            namesGrid: document.getElementById('namesGrid'),
            listeningIndicator: document.getElementById('listeningIndicator'),
            currentNameNumber: document.getElementById('currentNameNumber'),
            recognitionFeedback: document.getElementById('recognitionFeedback'),
            recognizedText: document.getElementById('recognizedText'),
            feedbackMessage: document.getElementById('feedbackMessage'),
            mistakeIndicator: document.getElementById('mistakeIndicator'),
            historyList: document.getElementById('historyList'),
            currentPosition: document.getElementById('currentPosition'),
            progressPercentage: document.getElementById('progressPercentage'),
            recitationProgress: document.getElementById('recitationProgress'),
            mistakeCount: document.getElementById('mistakeCount')
        };

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.generateNamesGrid();
        this.updateProgress();
        this.updateListeningIndicator();
    }

    generateNamesGrid() {
        const gridHTML = this.allNames.map((name, index) => {
            const cardClass = this.currentPosition > index ? 'name-card filled' : 'name-card empty';
            const isCurrentCard = this.currentPosition === index;
            
            return `
                <div class="${cardClass} ${isCurrentCard ? 'current' : ''}" data-index="${index}">
                    <div class="card-number">${index + 1}</div>
                    <div class="card-content">
                        ${this.currentPosition > index ? `
                            <div class="card-arabic">${name.arabic}</div>
                            <div class="card-transliteration">${name.transliteration}</div>
                            <div class="card-meaning">${name.meaning}</div>
                        ` : `
                            <div class="card-placeholder">Name #${index + 1}</div>
                        `}
                    </div>
                </div>
            `;
        }).join('');
        
        this.elements.namesGrid.innerHTML = gridHTML;
        this.scrollToCurrentCard();
    }

    scrollToCurrentCard() {
        const currentCard = this.elements.namesGrid.querySelector('.current');
        if (currentCard) {
            currentCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    updateListeningIndicator() {
        if (this.isReciting && !this.isPaused && this.currentPosition < 99) {
            this.elements.listeningIndicator.classList.remove('hidden');
            this.elements.currentNameNumber.textContent = this.currentPosition + 1;
        } else {
            this.elements.listeningIndicator.classList.add('hidden');
        }
    }

    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => {
            if (!this.isReciting) {
                this.startRecitation();
            } else {
                this.resumeRecitation();
            }
        });

        this.elements.pauseBtn.addEventListener('click', () => {
            this.pauseRecitation();
        });

        this.elements.resetBtn.addEventListener('click', () => {
            this.resetRecitation();
        });

        this.elements.skipBtn.addEventListener('click', () => {
            this.skipCurrentName();
        });
    }

    initializeSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showFeedback('Speech recognition is not supported in this browser.', 'error');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'ar-SA';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.showFeedback('🎤 Listening... Please recite the next name', 'waiting');
        };

        this.recognition.onresult = (event) => {
            const recognizedText = event.results[0][0].transcript.trim();
            this.elements.recognizedText.textContent = recognizedText;
            this.processRecognitionResult(recognizedText);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.handleRecognitionError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (this.isReciting && !this.isPaused) {
                // Auto-restart recognition for continuous recitation
                setTimeout(() => {
                    if (this.isReciting && !this.isPaused && this.currentPosition < 99) {
                        this.startListening();
                    }
                }, 500);
            }
        };
    }

    startRecitation() {
        this.isReciting = true;
        this.isPaused = false;
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        this.elements.skipBtn.disabled = false;
        this.elements.startBtn.textContent = '🎤 Resume Recitation';
        
        this.updateListeningIndicator();
        this.showFeedback('🎤 Ready! Start reciting from name #' + (this.currentPosition + 1), 'waiting');
        this.startListening();
    }

    pauseRecitation() {
        this.isPaused = true;
        this.stopListening();
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.skipBtn.disabled = true;
        
        this.updateListeningIndicator();
        this.showFeedback('Recitation paused. Click "Resume" to continue.', 'waiting');
    }

    resumeRecitation() {
        this.isPaused = false;
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        this.elements.skipBtn.disabled = false;
        
        this.updateListeningIndicator();
        this.showFeedback('🎤 Resuming... Recite name #' + (this.currentPosition + 1), 'waiting');
        this.startListening();
    }

    resetRecitation() {
        this.currentPosition = 0;
        this.totalMistakes = 0;
        this.isReciting = false;
        this.isPaused = false;
        this.recitationHistory = [];
        
        this.stopListening();
        
        // Reset buttons
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.skipBtn.disabled = true;
        this.elements.startBtn.textContent = '🎤 Start Recitation';
        
        // Clear displays
        this.elements.recognizedText.textContent = '';
        this.elements.historyList.innerHTML = '';
        this.elements.mistakeIndicator.classList.remove('show');
        
        this.generateNamesGrid();
        this.updateProgress();
        this.updateListeningIndicator();
        this.showFeedback('Recitation reset. Ready to start from the beginning.', 'waiting');
    }

    skipCurrentName() {
        if (this.currentPosition < 99) {
            // Record as skipped in history
            this.addToHistory(this.currentPosition + 1, false, 'Skipped');
            
            this.moveToNextName();
            this.showFeedback('Name skipped. Now recite name #' + (this.currentPosition + 1), 'waiting');
            
            if (this.isReciting && !this.isPaused) {
                this.startListening();
            }
        }
    }

    startListening() {
        if (this.recognition && !this.isListening && this.currentPosition < 99) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.handleRecognitionError('network');
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    processRecognitionResult(recognizedText) {
        const currentName = this.allNames[this.currentPosition];
        const accuracy = this.calculateAccuracy(currentName, recognizedText);
        
        if (accuracy >= 70) { // Success threshold
            this.handleSuccessfulRecognition(recognizedText, accuracy);
        } else {
            this.handleIncorrectRecognition(recognizedText, accuracy);
        }
    }

    calculateAccuracy(expectedName, recognizedText) {
        // Check against both Arabic and simple forms
        const targets = [expectedName.arabic, expectedName.simple];
        let bestAccuracy = 0;
        
        for (const target of targets) {
            const similarity = this.calculateSimilarity(target, recognizedText);
            bestAccuracy = Math.max(bestAccuracy, similarity);
        }
        
        return bestAccuracy;
    }

    calculateSimilarity(str1, str2) {
        // Simple similarity calculation using Levenshtein distance
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 100;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return Math.round((1 - distance / longer.length) * 100);
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    handleSuccessfulRecognition(recognizedText, accuracy) {
        const nameNumber = this.currentPosition + 1;
        
        // Add to history
        this.addToHistory(nameNumber, true, `Correct (${accuracy}% accuracy)`);
        
        // Show success feedback
        this.showFeedback(`✅ Correct! "${this.allNames[this.currentPosition].transliteration}" - Moving to next name...`, 'success');
        
        // Hide mistake indicator if showing
        this.elements.mistakeIndicator.classList.remove('show');
        
        // Move to next name and update grid
        setTimeout(() => {
            this.moveToNextName();
            
            if (this.currentPosition < 99) {
                this.showFeedback(`🎤 Now recite name #${this.currentPosition + 1}`, 'waiting');
                if (this.isReciting && !this.isPaused) {
                    this.startListening();
                }
            } else {
                this.completeRecitation();
            }
        }, 1500);
    }

    handleIncorrectRecognition(recognizedText, accuracy) {
        const nameNumber = this.currentPosition + 1;
        const currentName = this.allNames[this.currentPosition];
        
        // Increment mistake count
        this.totalMistakes++;
        
        // Add to history
        this.addToHistory(nameNumber, false, `Incorrect (${accuracy}% accuracy)`);
        
        // Show mistake feedback
        this.showFeedback(`❌ Incorrect. Expected: "${currentName.transliteration}". Please try again.`, 'error');
        
        // Show mistake indicator with details
        this.showMistakeDetails(currentName.arabic, recognizedText);
        
        // Update mistake count display
        this.elements.mistakeCount.textContent = this.totalMistakes;
        
        // Continue listening for another attempt
        if (this.isReciting && !this.isPaused) {
            setTimeout(() => {
                this.startListening();
            }, 2000);
        }
    }

    showMistakeDetails(expected, received) {
        this.elements.mistakeIndicator.innerHTML = `
            <div class="mistake-details">
                <div class="mistake-expected">
                    <div class="mistake-label">Expected:</div>
                    <div class="mistake-text">${expected}</div>
                </div>
                <div class="mistake-received">
                    <div class="mistake-label">You said:</div>
                    <div class="mistake-text">${received}</div>
                </div>
            </div>
        `;
        this.elements.mistakeIndicator.classList.add('show');
    }

    moveToNextName() {
        this.currentPosition++;
        this.generateNamesGrid();
        this.updateProgress();
        this.updateListeningIndicator();
    }

    completeRecitation() {
        this.isReciting = false;
        this.isPaused = false;
        this.stopListening();
        
        // Reset buttons
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.skipBtn.disabled = true;
        this.elements.startBtn.textContent = '🎤 Start New Recitation';
        
        this.updateListeningIndicator();
        
        // Show completion message
        const completionTime = new Date().toLocaleString();
        const successRate = Math.round(((99 - this.totalMistakes) / 99) * 100);
        
        this.showFeedback(
            `🎉 Congratulations! You've completed all 99 names! 
            Success rate: ${successRate}% | Total mistakes: ${this.totalMistakes}`, 
            'success'
        );
        
        // Save completion record to localStorage
        this.saveCompletionRecord(successRate);
    }

    addToHistory(nameNumber, isCorrect, status) {
        const historyItem = {
            nameNumber,
            name: this.allNames[nameNumber - 1],
            isCorrect,
            status,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.recitationHistory.unshift(historyItem);
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyHTML = this.recitationHistory.map(item => `
            <div class="history-item ${item.isCorrect ? 'success' : 'error'}">
                <div class="history-number">${item.nameNumber}</div>
                <div class="history-content">
                    <div class="history-name">${item.name.transliteration} - ${item.name.arabic}</div>
                    <div class="history-status">${item.status} at ${item.timestamp}</div>
                </div>
            </div>
        `).join('');
        
        this.elements.historyList.innerHTML = historyHTML;
    }

    updateDisplay() {
        if (this.currentPosition < 99) {
            const currentName = this.allNames[this.currentPosition];
            this.elements.nameCounter.textContent = this.currentPosition + 1;
            this.elements.expectedArabic.textContent = currentName.arabic;
            this.elements.expectedTransliteration.textContent = currentName.transliteration;
            this.elements.expectedMeaning.textContent = currentName.meaning;
        }
    }

    updateProgress() {
        const progressPercentage = Math.round((this.currentPosition / 99) * 100);
        this.elements.currentPosition.textContent = this.currentPosition;
        this.elements.progressPercentage.textContent = progressPercentage;
        this.elements.recitationProgress.style.width = progressPercentage + '%';
        this.elements.mistakeCount.textContent = this.totalMistakes;
    }

    updateRecognitionStatus(message, type) {
        this.elements.recognitionStatus.className = `recognition-status ${type}`;
        this.elements.recognitionStatus.querySelector('.status-text').textContent = message;
    }

    showFeedback(message, type) {
        const feedbackElement = this.elements.recognitionFeedback.querySelector('.feedback-text') || 
                               document.createElement('div');
        feedbackElement.className = `feedback-text ${type}`;
        feedbackElement.textContent = message;
        
        if (!feedbackElement.parentNode) {
            this.elements.recognitionFeedback.appendChild(feedbackElement);
        }
    }

    handleRecognitionError(error) {
        let errorMessage = 'Recognition error occurred. ';
        
        switch (error) {
            case 'network':
                errorMessage += 'Please check your internet connection.';
                break;
            case 'not-allowed':
                errorMessage += 'Please allow microphone access.';
                break;
            case 'no-speech':
                errorMessage += 'No speech detected. Please try again.';
                break;
            default:
                errorMessage += 'Please try again.';
        }
        
        this.showFeedback(errorMessage, 'error');
        
        // Try to restart recognition after error
        if (this.isReciting && !this.isPaused) {
            setTimeout(() => {
                this.startListening();
            }, 2000);
        }
    }

    saveCompletionRecord(successRate) {
        const completionRecord = {
            date: new Date().toISOString(),
            successRate,
            totalMistakes: this.totalMistakes,
            completionTime: Date.now()
        };
        
        const records = JSON.parse(localStorage.getItem('recitationRecords') || '[]');
        records.push(completionRecord);
        localStorage.setItem('recitationRecords', JSON.stringify(records));
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.sequentialApp = new SequentialRecitationApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.sequentialApp && window.sequentialApp.isListening) {
        window.sequentialApp.stopListening();
    }
});