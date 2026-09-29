import { useLanguage } from "../context/LanguageContext";

function LanguageSelector() {
    const { language, changeLanguage } = useLanguage();

    const languages = [
        { code: "en", label: "English" },
        { code: "as", label: "অসমীয়া (Assamese)" },
        { code: "bn", label: "বাংলা (Bengali)" },
        { code: "brx", label: "बड़ो (Bodo)" },
        { code: "doi", label: "डोगरी (Dogri)" },
        { code: "gu", label: "ગુજરાતી (Gujarati)" },
        { code: "hi", label: "हिन्दी (Hindi)" },
        { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
        { code: "ks", label: "कॉशुर / کٲشُر (Kashmiri)" },
        { code: "kok", label: "कोंकणी (Konkani)" },
        { code: "mai", label: "मैथिली (Maithili)" },
        { code: "ml", label: "മലയാളം (Malayalam)" },
        { code: "mni", label: "মৈতৈলোন্ (Manipuri)" },
        { code: "mr", label: "मराठी (Marathi)" },
        { code: "ne", label: "नेपाली (Nepali)" },
        { code: "or", label: "ଓଡ଼ିଆ (Odia)" },
        { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
        { code: "sa", label: "संस्कृतम् (Sanskrit)" },
        { code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" },
        { code: "sd", label: "سنڌي / सिन्धी (Sindhi)" },
        { code: "ta", label: "தமிழ் (Tamil)" },
        { code: "te", label: "తెలుగు (Telugu)" },
        { code: "ur", label: "اردو (Urdu)" }
    ];

    return (
        <select
            className="form-select form-select-sm ms-2"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
                width: "auto",
                minWidth: "180px",
                maxWidth: "240px",
                cursor: "pointer"
            }}
            aria-label="Select language"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    🌐 {lang.label}
                </option>
            ))}
        </select>
    );
}

export default LanguageSelector;