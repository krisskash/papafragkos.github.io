# Christos Papafragkos - Personal Website

A modern, interactive personal website featuring a **Frutiger Aero** aesthetic with **Apple-inspired glassmorphism** design elements and dynamic animations.

## Design Philosophy & Inspirations

This website draws inspiration from several iconic design movements and technologies:

### **Frutiger Aero** (2004-2013)
- **Color Palette**: Vibrant blues, cyan, and aqua tones that evoke the early 2000s tech aesthetic
- **Visual Elements**: Glossy surfaces, liquid-like animations, and flowing particle effects
- **Philosophy**: Clean, optimistic design that represents the intersection of nature and technology

### **Apple Glassmorphism** (2020-Present)
- **Visual Style**: Translucent surfaces with subtle blur effects and frosted glass appearance
- **Design Elements**: Soft shadows, rounded corners, and layered transparency
- **User Experience**: Intuitive navigation with smooth transitions and micro-interactions

### **PlayStation 3 XMB Interface** (2006-2013)
- **Wave Animation**: Dynamic background waves inspired by the PS3's Cross Media Bar
- **Fluid Motion**: Smooth, rippling effects that respond to user interaction
- **Atmospheric Feel**: Immersive background elements that create depth

## Features

- **Dynamic PS3 XMB-style wave animation** using Three.js and custom shaders
- **Glassmorphic design elements** with backdrop filters and translucent surfaces
- **Bilingual support** (English/Greek) with smooth language switching
- **Fully responsive** design that works on all devices
- **Interactive particles** floating in Frutiger Aero colors
- **Modern CSS animations** with liquid-like effects
- **Clean, maintainable code** structure

## Technologies Used

- **HTML5** - Semantic structure with data attributes for translations
- **CSS3** - Advanced features including backdrop-filter, custom properties, and animations
- **JavaScript (ES6+)** - Modern syntax with modules and async/await
- **Three.js** - 3D graphics library for wave animation
- **GLSL Shaders** - Custom vertex and fragment shaders for wave effects
- **Google Fonts** - Segoe UI font family for clean typography

## Sections

- **Home**: Hero section with animated introduction and call-to-action buttons
- **About**: Personal information with skills showcase and placeholder for profile photo
- **Projects**: Portfolio showcase with glassmorphic project cards
- **Contact**: Get in touch section with social media links

## Credits & Acknowledgments

This project incorporates code and techniques from various sources:

### **External Libraries**
- **[Three.js](https://threejs.org/)** - 3D graphics library (v0.124.0, MIT License)
  - Source: https://cdn.skypack.dev/three@0.124.0

### **Shader Code**
- **Noise Functions** by Patricio Gonzalez Vivo
  - Source: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  - Used in: `ps3waves.js` for wave animation vertex shader
  - License: Public Domain

### **Design Inspirations**
- **Frutiger Aero** aesthetic (2004-2013) - Color schemes and visual philosophy
- **Apple Design Language** (2020-Present) - Glassmorphism techniques
- **Sony PlayStation 3 XMB Interface** (2006-2013) - Wave animation concept

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/papafragkos/papafragkos.github.io.git
   cd papafragkos.github.io
   ```

2. **Open in browser**
   - Simply open `index.html` in your browser
   - Or use a local server: `python -m http.server 8000`

3. **Customize content**
   - Update personal information in `index.html`
   - Modify colors in `styles.css` (Frutiger Aero color variables)
   - Add your own project images and descriptions

## Customization

### **Color Scheme (Frutiger Aero Palette)**

```css
/* Primary Colors */
--primary-blue: #1e40af;
--cyan-bright: #00aaff;
--aqua-glow: #4bd2e6;
--turquoise: #00bebe;
--glass-white: rgba(255, 255, 255, 0.1);
```

### **Language Support**

The website supports bilingual content using HTML data attributes:

```html
<element data-en="English text" data-gr="Greek text">Default text</element>
```

### **Wave Animation**

Customize the PS3-style wave animation by modifying parameters in `ps3waves.js`:

- Wave frequency and amplitude
- Color transitions
- Animation speed
- Shader uniforms

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari  
- Edge
- Internet Explorer (limited support for modern CSS features)

## Development

### **File Structure**

```text
papafragkos.github.io/
├── index.html          # Main HTML structure
├── styles.css          # Main stylesheet with Frutiger Aero theme
├── ps3waves.css        # Wave animation styles
├── ps3waves.js         # Three.js wave animation with shaders
├── script.js           # Main JavaScript functionality
├── language.js         # Language switching functionality
├── profile-picture.jpg # Profile image
└── README.md          # This file
```

### **Key Features Implementation**

- **Glassmorphism**: Achieved through `backdrop-filter` and `rgba()` backgrounds
- **Wave Animation**: Three.js with custom GLSL shaders
- **Responsive Design**: CSS Grid and Flexbox with mobile-first approach
- **Language Switching**: JavaScript DOM manipulation with data attributes

## License

This project is open source and available under the **MIT License**.

### **Third-party Licenses**

- Three.js: MIT License
- Noise shader functions: Public Domain
- Google Fonts: SIL Open Font License

## Contributing

Feel free to:

- Report issues or bugs
- Suggest new features
- Submit pull requests
- Share design feedback

## Contact

- **Email**: [ChristosPapafragkos@gmail.com](mailto:ChristosPapafragkos@gmail.com)
- **GitHub**: [krisskash](https://github.com/krisskash)
- **LinkedIn**: [christos-papafragkos-454663292](https://www.linkedin.com/in/christos-papafragkos-454663292/)

---

*Built with love and inspired by the beauty of early 2000s design aesthetics and modern web technologies.*
