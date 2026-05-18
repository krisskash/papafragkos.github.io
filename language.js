// Language switching functionality - uses HTML data attributes instead of JS translation dictionaries
let currentLanguage = 'en';
let isLanguageDropdownOpen = false;

// Make functions globally available
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.changeLanguage = changeLanguage;

function toggleLanguageDropdown() {
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
    } else {
        dropdown.style.display = 'none';
        btn.classList.remove('active');
    }
}

function changeLanguage(language) {
    if (language !== 'en' && language !== 'gr') {
        console.error('Invalid language:', language);
        return;
    }
    
    currentLanguage = language;
    
    // Update all elements with data-en and data-gr attributes
    const translatableElements = document.querySelectorAll('[data-en][data-gr]');
    
    translatableElements.forEach(element => {
        const translation = element.getAttribute('data-' + language);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update language selector button text
    const languageBtn = document.getElementById('languageBtn');
    const languageText = languageBtn.querySelector('.language-text');
    if (languageText) {
        languageText.textContent = language.toUpperCase();
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = language === 'gr' ? 'el' : 'en';
    
    // Close dropdown only if it's currently open
    if (isLanguageDropdownOpen) {
        toggleLanguageDropdown();
    }
    
    // Save preference
    localStorage.setItem('preferredLanguage', language);
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure dropdown is initially closed
    const dropdown = document.getElementById('languageDropdown');
    const btn = document.getElementById('languageBtn');
    if (dropdown && btn) {
        dropdown.style.display = 'none';
        btn.classList.remove('active');
        isLanguageDropdownOpen = false;
    }
    
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'gr')) {
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
