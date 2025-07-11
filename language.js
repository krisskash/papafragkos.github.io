// Language switching functionality - uses HTML data attributes instead of JS translation dictionaries
let currentLanguage = 'en';
let isLanguageDropdownOpen = false;

// Make functions globally available
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.changeLanguage = changeLanguage;

function toggleLanguageDropdown() {
    console.log('Toggling language dropdown...');
    const dropdown = document.getElementById('languageDropdown');
    const btn = document.getElementById('languageBtn');
    
    if (!dropdown || !btn) {
        console.error('Language dropdown elements not found');
        return;
    }
    
    isLanguageDropdownOpen = !isLanguageDropdownOpen;
    
    if (isLanguageDropdownOpen) {
        dropdown.style.display = 'block';
        btn.classList.add('active');
        console.log('Language dropdown opened');
    } else {
        dropdown.style.display = 'none';
        btn.classList.remove('active');
        console.log('Language dropdown closed');
    }
}

function changeLanguage(language) {
    console.log('Changing language to:', language);
    
    if (language !== 'en' && language !== 'gr') {
        console.error('Invalid language:', language);
        return;
    }
    
    currentLanguage = language;
    
    // Update all elements with data-en and data-gr attributes
    const translatableElements = document.querySelectorAll('[data-en][data-gr]');
    console.log('Found translatable elements:', translatableElements.length);
    
    translatableElements.forEach(element => {
        const translation = element.getAttribute('data-' + language);
        if (translation) {
            element.textContent = translation;
            console.log('Updated element:', element.tagName, 'to:', translation);
        }
    });
    
    // Update language selector button text
    const languageBtn = document.getElementById('languageBtn');
    const languageText = languageBtn.querySelector('.language-text');
    if (languageText) {
        languageText.textContent = language.toUpperCase();
        console.log('Updated language button to:', language.toUpperCase());
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = language === 'gr' ? 'el' : 'en';
    console.log('Updated HTML lang attribute to:', document.documentElement.lang);
    
    // Close dropdown only if it's currently open
    if (isLanguageDropdownOpen) {
        toggleLanguageDropdown();
    }
    
    // Save preference
    localStorage.setItem('preferredLanguage', language);
    console.log('Language preference saved:', language);
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Language script loaded');
    
    // Ensure dropdown is initially closed
    const dropdown = document.getElementById('languageDropdown');
    const btn = document.getElementById('languageBtn');
    if (dropdown && btn) {
        dropdown.style.display = 'none';
        btn.classList.remove('active');
        isLanguageDropdownOpen = false;
        console.log('Language dropdown initialized as closed');
    }
    
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'gr')) {
        console.log('Loading saved language preference:', savedLanguage);
        changeLanguage(savedLanguage);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('languageDropdown');
        const btn = document.getElementById('languageBtn');
        
        if (dropdown && btn && isLanguageDropdownOpen) {
            if (!btn.contains(event.target) && !dropdown.contains(event.target)) {
                toggleLanguageDropdown();
            }
        }
    });
});

console.log('Language switching script loaded - using data attributes approach');
