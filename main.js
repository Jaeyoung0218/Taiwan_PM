const translations = {
    "zh-Hant": {
        "welcome_title": "歡迎來到 指南 (Jinam)",
        "welcome_message": "我們致力於提供最精準、最實用的指引，幫助您探索世界的每個角落。無論您是尋找旅行建議、學習資源，還是日常生活的小訣竅，指南 (Jinam) 都將是您的最佳夥伴。",
        "explore_invitation": "點擊上方按鈕切換語言，或繼續閱讀探索更多。"
    },
    "ko": {
        "welcome_title": "指南 (Jinam) 에 오신 것을 환영합니다",
        "welcome_message": "저희는 가장 정확하고 실용적인 가이드를 제공하여 세상의 모든 곳을 탐험할 수 있도록 돕습니다. 여행 조언, 학습 자료 또는 일상생활의 작은 팁을 찾고 계시다면, 指南 (Jinam) 이 최고의 파트너가 될 것입니다.",
        "explore_invitation": "상단의 버튼을 클릭하여 언어를 전환하거나 계속 읽고 더 많은 것을 탐색하십시오."
    }
};

const languageButtons = document.querySelectorAll('.language-switcher button');
const translatableElements = document.querySelectorAll('[data-key]');
const htmlTag = document.querySelector('html');

function setLanguage(lang) {
    // Update content
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update active button state
    languageButtons.forEach(button => {
        if (button.getAttribute('data-lang-switcher') === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Update HTML lang attribute
    htmlTag.setAttribute('lang', lang);
}

// Add event listeners to buttons
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang-switcher');
        setLanguage(lang);
    });
});

// Set default language on load (Traditional Chinese)
setLanguage('zh-Hant');
