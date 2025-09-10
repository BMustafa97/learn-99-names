// Learn 99 Names of Allah - Complete Learning System

class NamesLearningApp {
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
        
        this.recognition = null;
        this.isListening = false;
        this.currentTarget = '';
        this.currentButton = null;
        this.currentFilter = 'all';
        this.attempts = JSON.parse(localStorage.getItem('namesAttempts')) || [];
        this.masteredNames = JSON.parse(localStorage.getItem('masteredNames')) || [];
        
        // Mastery thresholds
        this.masteryThresholds = {
            beginner: 70,
            intermediate: 75,
            advanced: 80
        };
        
        this.achievements = [
            { id: 'first_attempt', title: 'First Steps', description: 'Made your first attempt', icon: '🎯', unlocked: false },
            { id: 'first_master', title: 'First Master', description: 'Mastered your first name', icon: '🌟', unlocked: false },
            { id: 'beginner_complete', title: 'Beginner Graduate', description: 'Mastered all beginner names', icon: '🏆', unlocked: false },
            { id: 'intermediate_complete', title: 'Intermediate Scholar', description: 'Mastered all intermediate names', icon: '🎓', unlocked: false },
            { id: 'advanced_complete', title: 'Advanced Master', description: 'Mastered all advanced names', icon: '👑', unlocked: false },
            { id: 'perfect_score', title: 'Perfect Pronunciation', description: 'Achieved 100% accuracy', icon: '💯', unlocked: false },
            { id: 'streak_10', title: 'Consistent Learner', description: '10 successful attempts in a row', icon: '🔥', unlocked: false },
            { id: 'all_complete', title: 'Grand Master', description: 'Mastered all 99 names', icon: '🕌', unlocked: false }
        ];
        
        this.initializeApp();
    }
    
    initializeApp() {
        console.log('Initializing app...');
        // Get DOM elements
        this.status = document.getElementById('status');
        this.recognizedText = document.getElementById('recognizedText');
        this.namesGrid = document.getElementById('namesGrid');
        
        console.log('DOM elements:', {
            status: this.status,
            recognizedText: this.recognizedText,
            namesGrid: this.namesGrid
        });
        
        // Progress elements
        this.totalAttemptsEl = document.getElementById('totalAttempts');
        this.averageAccuracyEl = document.getElementById('averageAccuracy');
        this.bestScoreEl = document.getElementById('bestScore');
        this.currentStreakEl = document.getElementById('currentStreak');
        
        // Progress bars
        this.overallProgressEl = document.getElementById('overallProgress');
        this.completedNamesEl = document.getElementById('completedNames');
        this.progressPercentageEl = document.getElementById('progressPercentage');
        this.beginnerProgressEl = document.getElementById('beginnerProgress');
        this.intermediateProgressEl = document.getElementById('intermediateProgress');
        this.advancedProgressEl = document.getElementById('advancedProgress');
        this.beginnerCountEl = document.getElementById('beginnerCount');
        this.intermediateCountEl = document.getElementById('intermediateCount');
        this.advancedCountEl = document.getElementById('advancedCount');
        
        // Achievement elements
        this.achievementsGridEl = document.getElementById('achievementsGrid');
        
        this.generateNamesGrid();
        this.initializeSpeechRecognition();
        this.setupEventListeners();
        this.updateProgress();
        this.updateStatistics();
        this.updateAchievements();
    }
    
    generateNamesGrid() {
        console.log('Generating names grid...');
        this.namesGrid.innerHTML = '';
        
        this.allNames.forEach((name, index) => {
            const level = this.getNameLevel(index);
            const isMastered = this.masteredNames.includes(index);
            
            const nameCard = document.createElement('div');
            nameCard.className = `name-card ${level} ${isMastered ? 'mastered' : ''}`;
            nameCard.setAttribute('data-name-index', index);
            nameCard.setAttribute('data-level', level);
            
            nameCard.innerHTML = `
                <div class="name-number">${index + 1}</div>
                <div class="name-arabic">${name.arabic}</div>
                <div class="name-transliteration">${name.transliteration}</div>
                <div class="name-meaning">${name.meaning}</div>
                <button class="practice-btn" data-target="${name.simple}" data-index="${index}">
                    🎤 Practice
                </button>
                <div class="accuracy-display"></div>
            `;
            
            this.namesGrid.appendChild(nameCard);
        });
        
        this.updateVisibleNames();
    }
    
    getNameLevel(index) {
        if (index < 33) return 'beginner';
        if (index < 66) return 'intermediate';
        return 'advanced';
    }
    

    initializeSpeechRecognition() {
        // Check if browser supports speech recognition
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.updateStatus('Speech recognition not supported in this browser.', 'error');
            return;
        }
        
        // Create recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition settings
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'ar-SA';
        this.recognition.maxAlternatives = 1;
        
        // Set up event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateStatus(`Listening for: ${this.currentTarget}`, 'listening');
            this.recognizedText.textContent = '';
            
            if (this.currentButton) {
                this.currentButton.disabled = true;
                this.currentButton.classList.add('listening');
                this.currentButton.textContent = '🔴 Listening...';
            }
        };
        
        this.recognition.onresult = (event) => {
            const result = event.results[0][0].transcript.trim();
            this.recognizedText.textContent = result;
            this.processRecognitionResult(result);
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            let errorMessage = 'Recognition error: ';
            
            switch (event.error) {
                case 'no-speech':
                    errorMessage += 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage += 'No microphone found.';
                    break;
                case 'not-allowed':
                    errorMessage += 'Microphone permission denied.';
                    break;
                case 'network':
                    errorMessage += 'Network error. Please check your connection.';
                    break;
                default:
                    errorMessage += event.error;
            }
            
            this.updateStatus(errorMessage, 'error');
            this.resetCurrentButton();
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.resetCurrentButton();
        };
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        // Practice button listeners
        this.namesGrid.addEventListener('click', (e) => {
            console.log('Grid clicked:', e.target);
            if (e.target.classList.contains('practice-btn')) {
                console.log('Practice button clicked!');
                if (this.isListening) {
                    this.stopRecognition();
                    return;
                }
                
                this.currentTarget = e.target.getAttribute('data-target');
                this.currentButton = e.target;
                this.startRecognition();
            }
        });
        
        // Filter button listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-filter');
                this.updateVisibleNames();
            });
        });
        
        // Option button listeners
        document.getElementById('practiceMode')?.addEventListener('click', () => this.enablePracticeMode());
        document.getElementById('testMode')?.addEventListener('click', () => this.enableTestMode());
        document.getElementById('resetProgress')?.addEventListener('click', () => this.resetProgress());
    }
    
    startRecognition() {
        if (!this.recognition) {
            this.updateStatus('Speech recognition not available.', 'error');
            return;
        }
        
        try {
            this.recognition.start();
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
    
    processRecognitionResult(recognizedText) {
        const nameIndex = parseInt(this.currentButton.getAttribute('data-index'));
        const accuracy = this.calculateAccuracy(this.currentTarget, recognizedText);
        
        // Store the attempt
        const attempt = {
            nameIndex: nameIndex,
            target: this.currentTarget,
            recognized: recognizedText,
            accuracy: accuracy,
            timestamp: new Date().toISOString(),
            level: this.getNameLevel(nameIndex)
        };
        
        this.attempts.push(attempt);
        localStorage.setItem('namesAttempts', JSON.stringify(this.attempts));
        
        // Check if name is mastered
        const requiredAccuracy = this.masteryThresholds[attempt.level];
        if (accuracy >= requiredAccuracy && !this.masteredNames.includes(nameIndex)) {
            this.masteredNames.push(nameIndex);
            localStorage.setItem('masteredNames', JSON.stringify(this.masteredNames));
            this.updateNameCardMastery(nameIndex);
        }
        
        // Display results
        this.displayAccuracy(accuracy, this.currentButton);
        this.updateProgress();
        this.updateStatistics();
        this.updateAchievements();
        
        // Update status
        let statusMessage = `Accuracy: ${accuracy}% `;
        if (accuracy >= 85) {
            statusMessage += '🎉 Excellent pronunciation!';
            this.updateStatus(statusMessage, 'success');
        } else if (accuracy >= 65) {
            statusMessage += '👍 Good! Keep practicing.';
            this.updateStatus(statusMessage, 'success');
        } else {
            statusMessage += '📚 Try again. Listen carefully to the pronunciation.';
            this.updateStatus(statusMessage, 'error');
        }
    }
    
    calculateAccuracy(target, recognized) {
        const normalizeArabic = (text) => {
            return text
                .replace(/[ً-\u065F\u0670-\u06D6-\u06ED]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();
        };
        
        const normalizedTarget = normalizeArabic(target);
        const normalizedRecognized = normalizeArabic(recognized);
        
        if (normalizedTarget === normalizedRecognized) {
            return 100;
        }
        
        const similarity = this.calculateSimilarity(normalizedTarget, normalizedRecognized);
        return Math.round(similarity * 100);
    }
    
    calculateSimilarity(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        
        if (len1 === 0) return len2 === 0 ? 1 : 0;
        if (len2 === 0) return 0;
        
        const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));
        
        for (let i = 0; i <= len1; i++) matrix[0][i] = i;
        for (let j = 0; j <= len2; j++) matrix[j][0] = j;
        
        for (let j = 1; j <= len2; j++) {
            for (let i = 1; i <= len1; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j - 1][i] + 1,
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i - 1] + cost
                );
            }
        }
        
        const maxLength = Math.max(len1, len2);
        return (maxLength - matrix[len2][len1]) / maxLength;
    }
    
    displayAccuracy(accuracy, button) {
        const card = button.closest('.name-card');
        const accuracyDisplay = card.querySelector('.accuracy-display');
        
        let className = '';
        let emoji = '';
        
        if (accuracy >= 85) {
            className = 'accuracy-excellent';
            emoji = '🎉';
        } else if (accuracy >= 65) {
            className = 'accuracy-good';
            emoji = '👍';
        } else {
            className = 'accuracy-poor';
            emoji = '📚';
        }
        
        accuracyDisplay.className = `accuracy-display ${className}`;
        accuracyDisplay.textContent = `${emoji} ${accuracy}% Accuracy`;
    }
    
    updateProgress() {
        const totalMastered = this.masteredNames.length;
        const progressPercentage = Math.round((totalMastered / 99) * 100);
        
        // Update overall progress
        this.overallProgressEl.style.width = `${progressPercentage}%`;
        this.completedNamesEl.textContent = totalMastered;
        this.progressPercentageEl.textContent = progressPercentage;
        
        // Update level progress
        const beginnerMastered = this.masteredNames.filter(i => i < 33).length;
        const intermediateMastered = this.masteredNames.filter(i => i >= 33 && i < 66).length;
        const advancedMastered = this.masteredNames.filter(i => i >= 66).length;
        
        this.beginnerProgressEl.style.width = `${(beginnerMastered / 33) * 100}%`;
        this.intermediateProgressEl.style.width = `${(intermediateMastered / 33) * 100}%`;
        this.advancedProgressEl.style.width = `${(advancedMastered / 33) * 100}%`;
        
        this.beginnerCountEl.textContent = `${beginnerMastered}/33`;
        this.intermediateCountEl.textContent = `${intermediateMastered}/33`;
        this.advancedCountEl.textContent = `${advancedMastered}/33`;
    }
    
    updateStatistics() {
        if (this.attempts.length === 0) {
            this.totalAttemptsEl.textContent = '0';
            this.averageAccuracyEl.textContent = '0%';
            this.bestScoreEl.textContent = '0%';
            this.currentStreakEl.textContent = '0';
            return;
        }
        
        const totalAttempts = this.attempts.length;
        const averageAccuracy = Math.round(
            this.attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0) / totalAttempts
        );
        const bestScore = Math.max(...this.attempts.map(attempt => attempt.accuracy));
        const currentStreak = this.calculateCurrentStreak();
        
        this.totalAttemptsEl.textContent = totalAttempts.toString();
        this.averageAccuracyEl.textContent = `${averageAccuracy}%`;
        this.bestScoreEl.textContent = `${bestScore}%`;
        this.currentStreakEl.textContent = currentStreak.toString();
    }
    
    calculateCurrentStreak() {
        let streak = 0;
        for (let i = this.attempts.length - 1; i >= 0; i--) {
            if (this.attempts[i].accuracy >= 70) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
    
    updateAchievements() {
        const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
        
        // Check each achievement
        this.achievements.forEach(achievement => {
            if (!unlockedAchievements.includes(achievement.id)) {
                if (this.checkAchievement(achievement.id)) {
                    unlockedAchievements.push(achievement.id);
                    achievement.unlocked = true;
                    this.showAchievementNotification(achievement);
                }
            } else {
                achievement.unlocked = true;
            }
        });
        
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
        this.renderAchievements();
    }
    
    checkAchievement(achievementId) {
        switch (achievementId) {
            case 'first_attempt':
                return this.attempts.length >= 1;
            case 'first_master':
                return this.masteredNames.length >= 1;
            case 'beginner_complete':
                return this.masteredNames.filter(i => i < 33).length === 33;
            case 'intermediate_complete':
                return this.masteredNames.filter(i => i >= 33 && i < 66).length === 33;
            case 'advanced_complete':
                return this.masteredNames.filter(i => i >= 66).length === 33;
            case 'perfect_score':
                return this.attempts.some(attempt => attempt.accuracy === 100);
            case 'streak_10':
                return this.calculateCurrentStreak() >= 10;
            case 'all_complete':
                return this.masteredNames.length === 99;
            default:
                return false;
        }
    }
    
    renderAchievements() {
        this.achievementsGridEl.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            
            achievementItem.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.description}</div>
            `;
            
            this.achievementsGridEl.appendChild(achievementItem);
        });
    }
    
    showAchievementNotification(achievement) {
        // Create a notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #8b4513;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-weight: bold;
            animation: slideIn 0.5s ease;
        `;
        
        notification.innerHTML = `
            🏆 Achievement Unlocked!<br>
            <strong>${achievement.title}</strong><br>
            <small>${achievement.description}</small>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
    
    updateNameCardMastery(nameIndex) {
        const card = this.namesGrid.querySelector(`[data-name-index="${nameIndex}"]`);
        if (card) {
            card.classList.add('mastered');
        }
    }
    
    updateVisibleNames() {
        const nameCards = document.querySelectorAll('.name-card');
        
        nameCards.forEach(card => {
            const level = card.getAttribute('data-level');
            const nameIndex = parseInt(card.getAttribute('data-name-index'));
            const isMastered = this.masteredNames.includes(nameIndex);
            
            let shouldShow = false;
            
            switch (this.currentFilter) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'beginner':
                    shouldShow = level === 'beginner';
                    break;
                case 'intermediate':
                    shouldShow = level === 'intermediate';
                    break;
                case 'advanced':
                    shouldShow = level === 'advanced';
                    break;
                case 'mastered':
                    shouldShow = isMastered;
                    break;
                case 'not-mastered':
                    shouldShow = !isMastered;
                    break;
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }
    
    enablePracticeMode() {
        this.updateStatus('Practice mode enabled. Take your time to learn each name.', 'success');
    }
    
    enableTestMode() {
        // Filter to show only non-mastered names
        document.querySelector('.filter-btn[data-filter="not-mastered"]').click();
        this.updateStatus('Test mode enabled. Practice the names you have not mastered yet.', 'success');
    }
    
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('namesAttempts');
            localStorage.removeItem('masteredNames');
            localStorage.removeItem('unlockedAchievements');
            
            this.attempts = [];
            this.masteredNames = [];
            this.achievements.forEach(a => a.unlocked = false);
            
            this.generateNamesGrid();
            this.updateProgress();
            this.updateStatistics();
            this.updateAchievements();
            
            this.updateStatus('Progress reset successfully.', 'success');
        }
    }
    
    resetCurrentButton() {
        if (this.currentButton) {
            this.currentButton.disabled = false;
            this.currentButton.classList.remove('listening');
            this.currentButton.textContent = '🎤 Practice';
        }
        this.currentButton = null;
        this.currentTarget = '';
    }
    
    updateStatus(message, type = '') {
        this.status.textContent = message;
        this.status.className = type ? `status-${type}` : '';
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NamesLearningApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.namesApp && window.namesApp.isListening) {
        window.namesApp.stopRecognition();
    }
});
