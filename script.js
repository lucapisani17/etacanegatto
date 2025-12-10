document.addEventListener('DOMContentLoaded', function() {
    // Elementi DOM per il toggle sezioni
    const dogBtn = document.getElementById('dogBtn');
    const catBtn = document.getElementById('catBtn');
    const dogSection = document.getElementById('dogSection');
    const catSection = document.getElementById('catSection');
    
    // Elementi per i cani
    const dogAgeInput = document.getElementById('dogAge');
    const calculateDogBtn = document.getElementById('calculateDogBtn');
    const dogResultElement = document.getElementById('dogResult');
    const dogAgeTableBody = document.querySelector('#dogAgeTable tbody');
    
    // Elementi per i gatti
    const catAgeInput = document.getElementById('catAge');
    const calculateCatBtn = document.getElementById('calculateCatBtn');
    const catResultElement = document.getElementById('catResult');
    const catAgeTableBody = document.querySelector('#catAgeTable tbody');
    
    // Elementi per cambio lingua
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Stato attuale
    let currentLang = 'it'; // Lingua di default
    let detectedLang = 'it'; // Lingua rilevata dal browser
    
    // Tabella di conversione per gatti
    const catAgeChart = {
        1: 15,
        2: 24,
        3: 28,
        4: 32,
        5: 36,
        6: 40,
        7: 44,
        8: 48,
        9: 52,
        10: 56,
        11: 60,
        12: 64,
        13: 68,
        14: 72,
        15: 76,
        16: 80,
        17: 84,
        18: 88
    };
    
    // Rileva la lingua del browser
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        // Se la lingua del browser è inglese (en, en-US, en-GB, ecc.)
        if (browserLang.startsWith('en')) {
            return 'en';
        }
        return 'it';
    }
    
    // Funzione per cambiare lingua
    function changeLanguage(lang) {
        // Aggiorna lo stato
        currentLang = lang;
        
        // Aggiorna i pulsanti della lingua
        langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Mostra/nascondi gli elementi per la lingua corrente
        document.querySelectorAll('[data-lang]').forEach(element => {
            if (element.dataset.lang === lang) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Aggiorna i placeholder
        if (lang === 'it') {
            dogAgeInput.placeholder = 'Es. 5';
            catAgeInput.placeholder = 'Es. 3';
        } else {
            dogAgeInput.placeholder = 'E.g. 5';
            catAgeInput.placeholder = 'E.g. 3';
        }
        
        // Rigenera le tabelle con la nuova lingua
        generateDogAgeTable();
        generateCatAgeTable();
    }
    
    // Funzione per calcolare l'età umana del cane
    function calculateDogHumanAge(dogAge) {
        if (dogAge <= 0 || isNaN(dogAge)) {
            return null;
        }
        // Formula: 16 × ln(anni cane) + 31
        return Math.round((16 * Math.log(dogAge) + 31) * 10) / 10;
    }
    
    // Funzione per calcolare l'età umana del gatto
    function calculateCatHumanAge(catAge) {
        if (catAge <= 0 || isNaN(catAge)) {
            return null;
        }
        
        // Se l'età è nella tabella, usa il valore
        if (catAgeChart[catAge]) {
            return catAgeChart[catAge];
        }
        
        // Per età oltre 18, aggiungi 4 anni per ogni anno felino
        if (catAge > 18) {
            return 88 + ((catAge - 18) * 4);
        }
        
        // Per età intermedie non in tabella, calcola approssimazione
        const lowerAge = Math.floor(catAge);
        const higherAge = Math.ceil(catAge);
        
        if (catAgeChart[lowerAge] && catAgeChart[higherAge]) {
            const lowerValue = catAgeChart[lowerAge];
            const higherValue = catAgeChart[higherAge];
            // Interpolazione lineare
            return Math.round(lowerValue + (catAge - lowerAge) * (higherValue - lowerValue));
        }
        
        return null;
    }
    
    // Funzione per aggiornare il risultato del cane
    function updateDogResult() {
        const dogAge = parseFloat(dogAgeInput.value);
        
        if (!dogAge || dogAge < 1) {
            dogResultElement.textContent = '--';
            return;
        }
        
        const humanAge = calculateDogHumanAge(dogAge);
        dogResultElement.textContent = humanAge;
    }
    
    // Funzione per aggiornare il risultato del gatto
    function updateCatResult() {
        const catAge = parseFloat(catAgeInput.value);
        
        if (!catAge || catAge < 1) {
            catResultElement.textContent = '--';
            return;
        }
        
        const humanAge = calculateCatHumanAge(catAge);
        catResultElement.textContent = humanAge;
    }
    
    // Funzione per generare la tabella dei cani
    function generateDogAgeTable() {
        const ages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20];
        let tableHTML = '';
        
        ages.forEach(age => {
            const humanAge = calculateDogHumanAge(age);
            const yearText = currentLang === 'it' 
                ? (age === 1 ? 'anno' : 'anni') 
                : (age === 1 ? 'year' : 'years');
            const humanYearText = currentLang === 'it' 
                ? 'anni umani' 
                : 'human years';
            
            tableHTML += `
                <tr>
                    <td>${age} ${yearText}</td>
                    <td><strong>${humanAge}</strong> ${humanYearText}</td>
                </tr>
            `;
        });
        
        dogAgeTableBody.innerHTML = tableHTML;
    }
    
    // Funzione per generare la tabella dei gatti
    function generateCatAgeTable() {
        let tableHTML = '';
        
        // Aggiungi tutte le età dalla tabella
        for (let age = 1; age <= 18; age++) {
            const humanAge = catAgeChart[age];
            const yearText = currentLang === 'it' 
                ? (age === 1 ? 'anno' : 'anni') 
                : (age === 1 ? 'year' : 'years');
            const humanYearText = currentLang === 'it' 
                ? 'anni umani' 
                : 'human years';
            
            tableHTML += `
                <tr>
                    <td>${age} ${yearText}</td>
                    <td><strong>${humanAge}</strong> ${humanYearText}</td>
                </tr>
            `;
        }
        
        // Aggiungi un esempio per età oltre 18
        tableHTML += `
            <tr>
                <td>20 ${currentLang === 'it' ? 'anni' : 'years'}</td>
                <td><strong>96</strong> ${currentLang === 'it' ? 'anni umani' : 'human years'}</td>
            </tr>
        `;
        
        catAgeTableBody.innerHTML = tableHTML;
    }
    
    // Funzione per cambiare sezione (cane/gatto)
    function switchToDog() {
        dogBtn.classList.add('active');
        catBtn.classList.remove('active');
        dogSection.classList.add('active');
        catSection.classList.remove('active');
        updateDogResult();
    }
    
    function switchToCat() {
        catBtn.classList.add('active');
        dogBtn.classList.remove('active');
        catSection.classList.add('active');
        dogSection.classList.remove('active');
        updateCatResult();
    }
    // ===== SEO & ANALYTICS FUNCTIONS =====
    
    // Track user interactions (privacy-friendly)
    function trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        
        // Local tracking for stats
        const stats = JSON.parse(localStorage.getItem('petCalculatorStats') || '{}');
        stats[category] = (stats[category] || 0) + 1;
        stats.lastInteraction = new Date().toISOString();
        localStorage.setItem('petCalculatorStats', JSON.stringify(stats));
    }
    
    // Update page title based on language and section
    function updatePageTitle() {
        const dogAge = dogAgeInput.value;
        const catAge = catAgeInput.value;
        
        if (currentLang === 'it') {
            if (currentSection === 'dog') {
                document.title = `Cane di ${dogAge} anni = ${dogResultElement.textContent} anni umani | Calcolatore`;
            } else {
                document.title = `Gatto di ${catAge} anni = ${catResultElement.textContent} anni umani | Calcolatore`;
            }
        } else {
            if (currentSection === 'dog') {
                document.title = `${dogAge} Year Old Dog = ${dogResultElement.textContent} Human Years | Calculator`;
            } else {
                document.title = `${catAge} Year Old Cat = ${catResultElement.textContent} Human Years | Calculator`;
            }
        }
    }
    
    // Generate meta description dynamically
    function updateMetaDescription() {
        const metaDescription = document.querySelector('meta[name="description"]');
        const dogResult = dogResultElement.textContent;
        const catResult = catResultElement.textContent;
        
        if (currentLang === 'it') {
            if (currentSection === 'dog') {
                metaDescription.content = `Un cane di ${dogAgeInput.value} anni ha circa ${dogResult} anni umani. Calcola gratis l'età del tuo animale!`;
            } else {
                metaDescription.content = `Un gatto di ${catAgeInput.value} anni ha circa ${catResult} anni umani. Calcola gratis l'età del tuo animale!`;
            }
        } else {
            if (currentSection === 'dog') {
                metaDescription.content = `A ${dogAgeInput.value} year old dog is about ${dogResult} human years. Calculate your pet's age for free!`;
            } else {
                metaDescription.content = `A ${catAgeInput.value} year old cat is about ${catResult} human years. Calculate your pet's age for free!`;
            }
        }
    }
    
    // Update URL without reloading (for sharing)
    function updateURL() {
        const params = new URLSearchParams();
        params.set('lang', currentLang);
        params.set('type', currentSection);
        params.set('dogAge', dogAgeInput.value);
        params.set('catAge', catAgeInput.value);
        
        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newURL);
    }
    
    // Parse URL parameters on load
    function parseURLParameters() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('lang')) {
            const urlLang = params.get('lang');
            if (urlLang === 'it' || urlLang === 'en') {
                detectedLang = urlLang;
            }
        }
        
        if (params.has('type')) {
            const type = params.get('type');
            if (type === 'cat') {
                setTimeout(switchToCat, 100);
            }
        }
        
        if (params.has('dogAge')) {
            const age = parseInt(params.get('dogAge'));
            if (age >= 1 && age <= 30) {
                dogAgeInput.value = age;
            }
        }
        
        if (params.has('catAge')) {
            const age = parseInt(params.get('catAge'));
            if (age >= 1 && age <= 25) {
                catAgeInput.value = age;
            }
        }
    }
    
    // Share functionality
    function setupSharing() {
        if (navigator.share) {
            // Add share buttons if Web Share API is supported
            const shareData = {
                title: document.title,
                text: currentLang === 'it' 
                    ? `Scopri l'età umana del tuo animale! Un cane di ${dogAgeInput.value} anni ha ${dogResultElement.textContent} anni umani.`
                    : `Discover your pet's human age! A ${dogAgeInput.value} year old dog is ${dogResultElement.textContent} human years.`,
                url: window.location.href
            };
            
            // You could add share buttons here
        }
    }
    
    // Inizializzazione
    function init() {
        // Rileva la lingua del browser
        detectedLang = detectBrowserLanguage();
        
        // Imposta la lingua iniziale
        changeLanguage(detectedLang);
        
        // Genera le tabelle
        generateDogAgeTable();
        generateCatAgeTable();
        
        // Calcola i risultati iniziali
        updateDogResult();
        updateCatResult();
    }
    
    // Event Listeners per cambio lingua
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            changeLanguage(this.dataset.lang);
        });
    });
    
    // Event Listeners per toggle sezioni
    dogBtn.addEventListener('click', switchToDog);
    catBtn.addEventListener('click', switchToCat);
    
    // Event Listeners per i cani
    calculateDogBtn.addEventListener('click', updateDogResult);
    
    dogAgeInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            updateDogResult();
        }
    });
    
    dogAgeInput.addEventListener('input', function() {
        if (this.value > 30) {
            this.value = 30;
        }
        updateDogResult();
    });
    
    // Event Listeners per i gatti
    calculateCatBtn.addEventListener('click', updateCatResult);
    
    catAgeInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            updateCatResult();
        }
    });
    
    catAgeInput.addEventListener('input', function() {
        if (this.value > 25) {
            this.value = 25;
        }
        updateCatResult();
    });
    
    // Avvia l'applicazione
    init();
});