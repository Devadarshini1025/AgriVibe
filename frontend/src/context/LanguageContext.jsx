import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import translations from "../translations/translations";

import {
    getLocalizedCropName,
    formatCropTitle,
    normalizeCrop
} from "../utils/cropTranslations";

const LanguageContext = createContext(null);

const DEFAULT_LANGUAGE = "en";

export function LanguageProvider({ children }) {
    // --------------------------------------------------
    // Get saved language
    // --------------------------------------------------

    const getSavedLanguage = () => {
        try {
            const savedLanguage =
                localStorage.getItem("agriVibeLanguage");

            // Make sure the saved language actually exists
            if (
                savedLanguage &&
                translations[savedLanguage]
            ) {
                return savedLanguage;
            }

            return DEFAULT_LANGUAGE;
        } catch (error) {
            console.error(
                "Unable to read saved language:",
                error
            );

            return DEFAULT_LANGUAGE;
        }
    };

    const [language, setLanguage] = useState(
        getSavedLanguage
    );

    // --------------------------------------------------
    // Change language
    // --------------------------------------------------

    const changeLanguage = (newLanguage) => {
        if (!newLanguage) {
            return;
        }

        // Prevent invalid language codes
        if (!translations[newLanguage]) {
            console.warn(
                `Language "${newLanguage}" does not exist.`
            );

            return;
        }

        setLanguage(newLanguage);

        try {
            localStorage.setItem(
                "agriVibeLanguage",
                newLanguage
            );
        } catch (error) {
            console.error(
                "Unable to save language:",
                error
            );
        }
    };

    // --------------------------------------------------
    // Update browser language and text direction
    // --------------------------------------------------

    useEffect(() => {
        const htmlElement =
            document.documentElement;

        // Set browser language
        htmlElement.lang = language;

        // Urdu is written RTL
        if (language === "ur") {
            htmlElement.dir = "rtl";
        } else {
            htmlElement.dir = "ltr";
        }

        // Save again whenever language changes
        try {
            localStorage.setItem(
                "agriVibeLanguage",
                language
            );
        } catch (error) {
            console.error(
                "Unable to save language:",
                error
            );
        }
    }, [language]);

    // --------------------------------------------------
    // Normal text translation
    // --------------------------------------------------

    const t = (key) => {
        if (!key) {
            return "";
        }

        // Selected language
        const selectedTranslation =
            translations[language]?.[key];

        if (
            selectedTranslation !== undefined &&
            selectedTranslation !== null &&
            selectedTranslation !== ""
        ) {
            return selectedTranslation;
        }

        // English fallback
        const englishTranslation =
            translations[DEFAULT_LANGUAGE]?.[key];

        if (
            englishTranslation !== undefined &&
            englishTranslation !== null &&
            englishTranslation !== ""
        ) {
            return englishTranslation;
        }

        // If translation doesn't exist anywhere,
        // return the key itself.
        return key;
    };

    // --------------------------------------------------
    // Crop translation
    // --------------------------------------------------

    const tCrop = (cropName) => {
        if (!cropName) {
            return "";
        }

        try {
            return getLocalizedCropName(
                cropName,
                language
            );
        } catch (error) {
            console.error(
                "Crop translation error:",
                error
            );

            return cropName;
        }
    };

    // --------------------------------------------------
    // Crop title formatting
    // --------------------------------------------------

    const formatCrop = (cropName) => {
        if (!cropName) {
            return "";
        }

        try {
            return formatCropTitle(
                cropName,
                language
            );
        } catch (error) {
            console.error(
                "Crop formatting error:",
                error
            );

            return cropName;
        }
    };

    // --------------------------------------------------
    // Context value
    // --------------------------------------------------

    const contextValue = {
        language,
        changeLanguage,
        t,
        tCrop,
        formatCrop,
        normalizeCrop
    };

    return (
        <LanguageContext.Provider
            value={contextValue}
        >
            {children}
        </LanguageContext.Provider>
    );
}

// --------------------------------------------------
// Custom hook
// --------------------------------------------------

export function useLanguage() {
    const context = useContext(
        LanguageContext
    );

    if (!context) {
        throw new Error(
            "useLanguage must be used inside a LanguageProvider"
        );
    }

    return context;
}

export default LanguageContext;