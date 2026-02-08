# 指南 (Jinam) - Project Blueprint

## Overview

指南 (Jinam) is a modern, multilingual web application designed to be clean, responsive, and user-friendly. The initial version provides a simple, elegant user interface with language switching capabilities between Traditional Chinese and Korean.

## Design and Features

*   **Visuals:** A modern aesthetic with a clean layout, balanced spacing, a professional color palette, and readable typography.
*   **Responsiveness:** The layout is fully responsive, ensuring a seamless experience on both mobile devices and desktop browsers.
*   **Languages:** The UI supports both Traditional Chinese (繁體中文) and Korean (한국어), with dynamic switching.
*   **Core Functionality:** A language switcher allows users to dynamically change the site's language without reloading the page.
*   **Initial Content:** Placeholder welcome message and introductory text in both languages.

## Implemented Features

*   **HTML Structure:** `index.html` is set up with a header, navigation for language selection, and a main content area. Content elements are marked with `data-key` attributes for internationalization.
*   **CSS Styling:** `style.css` provides a modern and responsive design, including styles for the header, buttons, and main content, with media queries for different screen sizes.
*   **JavaScript Logic:** `main.js` handles the dynamic language switching. It contains translation objects for "zh-Hant" and "ko", updates text content based on `data-key` attributes, manages active button states, and sets the `html lang` attribute. The default language on load is Traditional Chinese.
