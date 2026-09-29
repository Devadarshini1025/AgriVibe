import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { useLanguage } from "../context/LanguageContext";

function ImpactDashboard() {
    const { t, language } = useLanguage();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    /*
     * Additional Impact Dashboard translations
     */
    const impactTranslations = {
        en: {
            orders: "Orders",
            impactTitle: "AgriVibe Impact",
            impactDescription:
                "AgriVibe connects farmers directly with buyers, helping create a more transparent digital marketplace for agricultural produce.",
            flow: "Farmer → AgriVibe → Buyer",
            unableToLoad: "Unable to load dashboard.",
            tryAgain: "Try Again",
            refresh: "Refresh dashboard"
        },

        hi: {
            orders: "ऑर्डर",
            impactTitle: "एग्रीवाइब का प्रभाव",
            impactDescription:
                "एग्रीवाइब किसानों को सीधे खरीदारों से जोड़ता है और कृषि उत्पादों के लिए एक अधिक पारदर्शी डिजिटल बाज़ार बनाने में मदद करता है।",
            flow: "किसान → एग्रीवाइब → खरीदार",
            unableToLoad: "डैशबोर्ड लोड नहीं हो सका।",
            tryAgain: "पुनः प्रयास करें",
            refresh: "डैशबोर्ड रीफ्रेश करें"
        },

        bn: {
            orders: "অর্ডার",
            impactTitle: "AgriVibe-এর প্রভাব",
            impactDescription:
                "AgriVibe কৃষকদের সরাসরি ক্রেতাদের সঙ্গে সংযুক্ত করে এবং কৃষি পণ্যের জন্য আরও স্বচ্ছ ডিজিটাল বাজার তৈরি করতে সাহায্য করে।",
            flow: "কৃষক → AgriVibe → ক্রেতা",
            unableToLoad: "ড্যাশবোর্ড লোড করা যায়নি।",
            tryAgain: "আবার চেষ্টা করুন",
            refresh: "ড্যাশবোর্ড রিফ্রেশ করুন"
        },

        mr: {
            orders: "ऑर्डर्स",
            impactTitle: "AgriVibe प्रभाव",
            impactDescription:
                "AgriVibe शेतकऱ्यांना थेट खरेदीदारांशी जोडते आणि कृषी उत्पादनांसाठी अधिक पारदर्शक डिजिटल बाजारपेठ तयार करण्यास मदत करते.",
            flow: "शेतकरी → AgriVibe → खरेदीदार",
            unableToLoad: "डॅशबोर्ड लोड करता आला नाही.",
            tryAgain: "पुन्हा प्रयत्न करा",
            refresh: "डॅशबोर्ड रिफ्रेश करा"
        },

        te: {
            orders: "ఆర్డర్లు",
            impactTitle: "AgriVibe ప్రభావం",
            impactDescription:
                "AgriVibe రైతులను నేరుగా కొనుగోలుదారులతో అనుసంధానించి వ్యవసాయ ఉత్పత్తులకు మరింత పారదర్శకమైన డిజిటల్ మార్కెట్‌ను రూపొందించడంలో సహాయపడుతుంది.",
            flow: "రైతు → AgriVibe → కొనుగోలుదారు",
            unableToLoad: "డ్యాష్‌బోర్డ్‌ను లోడ్ చేయలేకపోయాము.",
            tryAgain: "మళ్లీ ప్రయత్నించండి",
            refresh: "డ్యాష్‌బోర్డ్ రిఫ్రెష్ చేయండి"
        },

        ta: {
            orders: "ஆர்டர்கள்",
            impactTitle: "AgriVibe தாக்கம்",
            impactDescription:
                "AgriVibe விவசாயிகளை நேரடியாக வாங்குபவர்களுடன் இணைத்து, விவசாயப் பொருட்களுக்கு மிகவும் வெளிப்படையான டிஜிட்டல் சந்தையை உருவாக்க உதவுகிறது.",
            flow: "விவசாயி → AgriVibe → வாங்குபவர்",
            unableToLoad: "டாஷ்போர்டை ஏற்ற முடியவில்லை.",
            tryAgain: "மீண்டும் முயற்சிக்கவும்",
            refresh: "டாஷ்போர்டை புதுப்பிக்கவும்"
        },

        gu: {
            orders: "ઓર્ડર",
            impactTitle: "AgriVibe ની અસર",
            impactDescription:
                "AgriVibe ખેડૂતોને સીધા ખરીદદારો સાથે જોડે છે અને કૃષિ પેદાશો માટે વધુ પારદર્શક ડિજિટલ બજાર બનાવવામાં મદદ કરે છે.",
            flow: "ખેડૂત → AgriVibe → ખરીદદાર",
            unableToLoad: "ડેશબોર્ડ લોડ કરી શકાયું નથી.",
            tryAgain: "ફરી પ્રયાસ કરો",
            refresh: "ડેશબોર્ડ રિફ્રેશ કરો"
        },

        ur: {
            orders: "آرڈرز",
            impactTitle: "AgriVibe کا اثر",
            impactDescription:
                "AgriVibe کسانوں کو براہ راست خریداروں سے جوڑتا ہے اور زرعی پیداوار کے لیے زیادہ شفاف ڈیجیٹل مارکیٹ بنانے میں مدد کرتا ہے۔",
            flow: "کسان → AgriVibe → خریدار",
            unableToLoad: "ڈیش بورڈ لوڈ نہیں ہو سکا۔",
            tryAgain: "دوبارہ کوشش کریں",
            refresh: "ڈیش بورڈ ریفریش کریں"
        },

        kn: {
            orders: "ಆರ್ಡರ್‌ಗಳು",
            impactTitle: "AgriVibe ಪರಿಣಾಮ",
            impactDescription:
                "AgriVibe ರೈತರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ ಕೃಷಿ ಉತ್ಪನ್ನಗಳಿಗೆ ಹೆಚ್ಚು ಪಾರದರ್ಶಕ ಡಿಜಿಟಲ್ ಮಾರುಕಟ್ಟೆಯನ್ನು ನಿರ್ಮಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
            flow: "ರೈತ → AgriVibe → ಖರೀದಿದಾರ",
            unableToLoad: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
            tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
            refresh: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ರಿಫ್ರೆಶ್ ಮಾಡಿ"
        },

        or: {
            orders: "ଅର୍ଡର",
            impactTitle: "AgriVibe ପ୍ରଭାବ",
            impactDescription:
                "AgriVibe କୃଷକମାନଙ୍କୁ ସିଧାସଳଖ କ୍ରେତାମାନଙ୍କ ସହିତ ଯୋଡ଼ିଥାଏ ଏବଂ କୃଷି ଉତ୍ପାଦ ପାଇଁ ଅଧିକ ସ୍ୱଚ୍ଛ ଡିଜିଟାଲ ବଜାର ତିଆରି କରିବାରେ ସାହାଯ୍ୟ କରେ।",
            flow: "କୃଷକ → AgriVibe → କ୍ରେତା",
            unableToLoad: "ଡ୍ୟାସବୋର୍ଡ ଲୋଡ୍ କରିହେଲା ନାହିଁ।",
            tryAgain: "ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ",
            refresh: "ଡ୍ୟାସବୋର୍ଡ ରିଫ୍ରେଶ କରନ୍ତୁ"
        },

        ml: {
            orders: "ഓർഡറുകൾ",
            impactTitle: "AgriVibe സ്വാധീനം",
            impactDescription:
                "AgriVibe കർഷകരെ നേരിട്ട് വാങ്ങുന്നവരുമായി ബന്ധിപ്പിക്കുകയും കാർഷിക ഉൽപ്പന്നങ്ങൾക്ക് കൂടുതൽ സുതാര്യമായ ഡിജിറ്റൽ വിപണി സൃഷ്ടിക്കാൻ സഹായിക്കുകയും ചെയ്യുന്നു.",
            flow: "കർഷകൻ → AgriVibe → വാങ്ങുന്നയാൾ",
            unableToLoad: "ഡാഷ്ബോർഡ് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.",
            tryAgain: "വീണ്ടും ശ്രമിക്കുക",
            refresh: "ഡാഷ്ബോർഡ് പുതുക്കുക"
        },

        pa: {
            orders: "ਆਰਡਰ",
            impactTitle: "AgriVibe ਦਾ ਪ੍ਰਭਾਵ",
            impactDescription:
                "AgriVibe ਕਿਸਾਨਾਂ ਨੂੰ ਸਿੱਧੇ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਜੋੜਦਾ ਹੈ ਅਤੇ ਖੇਤੀਬਾੜੀ ਉਤਪਾਦਾਂ ਲਈ ਵਧੇਰੇ ਪਾਰਦਰਸ਼ੀ ਡਿਜ਼ੀਟਲ ਬਾਜ਼ਾਰ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
            flow: "ਕਿਸਾਨ → AgriVibe → ਖਰੀਦਦਾਰ",
            unableToLoad: "ਡੈਸ਼ਬੋਰਡ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕਿਆ।",
            tryAgain: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
            refresh: "ਡੈਸ਼ਬੋਰਡ ਰਿਫ੍ਰੈਸ਼ ਕਰੋ"
        },

        as: {
            orders: "অৰ্ডাৰ",
            impactTitle: "AgriVibe-ৰ প্ৰভাৱ",
            impactDescription:
                "AgriVibe-এ কৃষকসকলক পোনপটীয়াকৈ ক্ৰেতাৰ সৈতে সংযোগ কৰে আৰু কৃষিজাত সামগ্ৰীৰ বাবে অধিক স্বচ্ছ ডিজিটেল বজাৰ গঢ়ি তোলাত সহায় কৰে।",
            flow: "কৃষক → AgriVibe → ক্ৰেতা",
            unableToLoad: "ডেশ্বব'ৰ্ড লোড কৰিব পৰা নগ'ল।",
            tryAgain: "পুনৰ চেষ্টা কৰক",
            refresh: "ডেশ্বব'ৰ্ড ৰিফ্ৰেছ কৰক"
        },

        mai: {
            orders: "ऑर्डर",
            impactTitle: "AgriVibe प्रभाव",
            impactDescription:
                "AgriVibe किसानकेँ सीधे खरीददारसँ जोड़ैत अछि आ कृषि उत्पादक लेल अधिक पारदर्शी डिजिटल बाजार बनाबयमे सहायता करैत अछि।",
            flow: "किसान → AgriVibe → खरीददार",
            unableToLoad: "डैशबोर्ड लोड नहि भ' सकल।",
            tryAgain: "फेर प्रयास करू",
            refresh: "डैशबोर्ड रिफ्रेश करू"
        },

        sa: {
            orders: "आदेशाः",
            impactTitle: "AgriVibe प्रभावः",
            impactDescription:
                "AgriVibe कृषकान् प्रत्यक्षं क्रेतृभिः सह संयोजयति तथा कृषिउत्पादानां कृते अधिकं पारदर्शकं डिजिटल-विपणिं निर्मातुं साहाय्यं करोति।",
            flow: "कृषकः → AgriVibe → क्रेता",
            unableToLoad: "डैशबोर्डं लोडितुं न शक्यते।",
            tryAgain: "पुनः प्रयतताम्",
            refresh: "डैशबोर्डं नवीकुरुत"
        },

        ne: {
            orders: "अर्डरहरू",
            impactTitle: "AgriVibe प्रभाव",
            impactDescription:
                "AgriVibe ले किसानहरूलाई सिधै खरिदकर्ताहरूसँग जोडेर कृषि उत्पादनका लागि अझ पारदर्शी डिजिटल बजार निर्माण गर्न मद्दत गर्छ।",
            flow: "किसान → AgriVibe → खरिदकर्ता",
            unableToLoad: "ड्यासबोर्ड लोड गर्न सकिएन।",
            tryAgain: "फेरि प्रयास गर्नुहोस्",
            refresh: "ड्यासबोर्ड रिफ्रेस गर्नुहोस्"
        },

        kok: {
            orders: "ऑर्डर्स",
            impactTitle: "AgriVibe चो परिणाम",
            impactDescription:
                "AgriVibe शेतकऱ्यांक थेट खरेदीदारांक जोडटा आनी शेती उत्पादनां खातीर चड पारदर्शक डिजिटल बाजार तयार करपाक मदत करता.",
            flow: "शेतकरी → AgriVibe → खरेदीदार",
            unableToLoad: "डॅशबोर्ड लोड जावंक ना.",
            tryAgain: "परत प्रयत्न करात",
            refresh: "डॅशबोर्ड रिफ्रेश करात"
        },

        mni: {
            orders: "ꯑꯥꯔꯗꯔꯁꯤꯡ",
            impactTitle: "AgriVibe ꯃꯥꯍꯧꯁꯤ",
            impactDescription:
                "AgriVibe ꯈꯦꯠꯅꯥꯡꯕꯁꯤꯡꯗꯨ ꯅꯣꯡꯃꯥ ꯁꯤꯡꯗꯥ ꯀ꯭ꯔꯤꯇꯥꯔꯁꯤꯡꯒꯥ ꯁꯝꯅꯗꯨꯅꯥ ꯊꯥꯗꯣꯛ ꯁꯦꯜ꯫",
            flow: "ꯈꯦꯠꯅꯥꯡꯕ → AgriVibe → ꯀ꯭ꯔꯤꯇꯥꯔ",
            unableToLoad: "ꯗꯦꯁꯕꯣꯔꯗ ꯂꯣꯗ ꯇꯧꯕ ꯉꯝꯗꯦ",
            tryAgain: "ꯑꯃꯨꯛ ꯍꯥꯅꯕ",
            refresh: "ꯗꯦꯁꯕꯣꯔꯗ ꯔꯤꯐ꯭ꯔꯦꯁ"
        },

        doi: {
            orders: "ऑर्डर",
            impactTitle: "AgriVibe प्रभाव",
            impactDescription:
                "AgriVibe किसानें गी सीधे खरीददारें कन्नै जोड़दा ऐ ते खेतीबाड़ी उत्पादें लेई होर पारदर्शी डिजिटल बाजार बनाने च मदद करदा ऐ।",
            flow: "किसान → AgriVibe → खरीददार",
            unableToLoad: "डैशबोर्ड लोड नेईं होई सकेया।",
            tryAgain: "परतियै कोशिश करो",
            refresh: "डैशबोर्ड रिफ्रेश करो"
        },

        brx: {
            orders: "अर्डार",
            impactTitle: "AgriVibe नि गोहोना",
            impactDescription:
                "AgriVibe हा किसानफोरखौ खौराफोरजों सिधा जोबोदनानै फसलनि थाखाय गोहोना डिजिटल बाजार दिहुनो हायो।",
            flow: "किसान → AgriVibe → खौराफोर",
            unableToLoad: "डैशबोर्ड लोड खालामनो हायाखै।",
            tryAgain: "फिन नाजा",
            refresh: "डैशबोर्ड रिफ्रेश खालाम"
        },

        sat: {
            orders: "ᱚᱨᱰᱟᱨ",
            impactTitle: "AgriVibe ᱨᱮᱭᱟᱜ ᱯᱨᱚᱵᱷᱟᱵ",
            impactDescription:
                "AgriVibe ᱠᱤᱥᱟᱹᱱ ᱠᱚ ᱠᱨᱮᱛᱟ ᱠᱚ ᱥᱟᱶ ᱥᱤᱫᱷᱟ ᱡᱩᱲᱟᱹᱣ ᱟ ᱟᱹᱫᱤ ᱯᱟᱹᱱᱛᱤ ᱠᱟᱹᱹᱛᱮ ᱰᱤᱡᱤᱴᱟᱞ ᱵᱟᱡᱟᱨ ᱵᱟᱹᱱᱟᱹᱣ ᱛᱮ ᱜᱚᱲᱚ ᱦᱚᱪᱚᱭᱟ᱾",
            flow: "ᱠᱤᱥᱟᱹᱱ → AgriVibe → ᱠᱨᱮᱛᱟ",
            unableToLoad: "ᱰᱟᱥᱵᱚᱨᱰ ᱞᱳᱰ ᱵᱟᱝ ᱦᱚᱪᱚ ᱞᱮᱱᱟ᱾",
            tryAgain: "ᱫᱚᱦᱲᱟ ᱪᱮᱥᱴᱟ ᱢᱮ",
            refresh: "ᱰᱟᱥᱵᱚᱨᱰ ᱨᱤᱯᱷᱨᱮᱥ ᱢᱮ"
        },

        ks: {
            orders: "آرڈر",
            impactTitle: "AgriVibe ہٕنٛد اثر",
            impactDescription:
                "AgriVibe کسانن ہٕنٛد براہ راست خریدارن سٕتۍ رٕبطہٕ کران چھُ تہٕ زرعی پیداوارن خٲطرٕ شفاف ڈیجیٹل بازار بناونہٕ منز مدد کران۔",
            flow: "کسان → AgriVibe → خریدار",
            unableToLoad: "ڈیش بورڈ لوڈ کرنہٕ منز ناکام۔",
            tryAgain: "دوبارہ کوشش",
            refresh: "ڈیش بورڈ ریفریش"
        },

        sd: {
            orders: "آرڊر",
            impactTitle: "AgriVibe جو اثر",
            impactDescription:
                "AgriVibe هارين کي سڌو خريدارن سان ڳنڍي ٿو ۽ زرعي شين لاءِ وڌيڪ شفاف ڊجيٽل مارڪيٽ ٺاهڻ ۾ مدد ڪري ٿو.",
            flow: "هاري → AgriVibe → خريدار",
            unableToLoad: "ڊيش بورڊ لوڊ نه ٿي سگهيو.",
            tryAgain: "ٻيهر ڪوشش ڪريو",
            refresh: "ڊيش بورڊ ريفريش ڪريو"
        }
    };

    const currentLanguage =
        impactTranslations[language] ||
        impactTranslations.en;

    /*
     * Load dashboard statistics.
     *
     * IMPORTANT:
     * Backend route is /api/dashboard
     * NOT /api/dashboard/stats
     */
    const fetchStats = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response =
                    await axios.get(
                        "http://localhost:5000/api/dashboard"
                    );

                /*
                 * Backend returns:
                 *
                 * {
                 *   success: true,
                 *   summary: {...},
                 *   cropAnalytics: [...],
                 *   topCrops: [...],
                 *   monthlyAnalytics: [...]
                 * }
                 *
                 * The existing dashboard UI expects
                 * these values directly inside stats.
                 */

                const data = response.data || {};

                const summary =
                    data.summary || data;

                setStats({
                    ...summary,

                    cropAnalytics:
                        data.cropAnalytics || [],

                    topCrops:
                        data.topCrops || [],

                    monthlyAnalytics:
                        data.monthlyAnalytics || []
                });

            } catch (err) {
                console.error(
                    "Dashboard Error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                        currentLanguage.unableToLoad
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [currentLanguage.unableToLoad]
    );

    useEffect(() => {
        fetchStats();

        const interval =
            setInterval(() => {
                fetchStats(true);
            }, 30000);

        return () =>
            clearInterval(interval);
    }, [fetchStats]);

    /*
     * LOADING
     */

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div
                    className="spinner-border text-success"
                    role="status"
                />

                <p className="mt-3 text-muted">
                    {t("loading") ||
                        "Loading..."}
                </p>
            </div>
        );
    }

    /*
     * ERROR
     */

    if (error && !stats) {
        return (
            <div className="container py-5">
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center p-5">

                        <div className="display-3">
                            ⚠️
                        </div>

                        <h4 className="fw-bold mt-3">
                            {
                                currentLanguage.unableToLoad
                            }
                        </h4>

                        <p className="text-muted">
                            {error}
                        </p>

                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() =>
                                fetchStats()
                            }
                        >
                            🔄{" "}
                            {
                                currentLanguage.tryAgain
                            }
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    /*
     * STAT CARDS
     */

    const cards = [
        {
            icon: "👨‍🌾",
            title:
                t("totalFarmers") ||
                "Total Farmers",
            value:
                stats.totalFarmers ?? 0
        },

        {
            icon: "🛒",
            title:
                t("totalBuyers") ||
                "Total Buyers",
            value:
                stats.totalBuyers ?? 0
        },

        {
            icon: "🌾",
            title:
                t("totalCrops") ||
                "Total Crops",
            value:
                stats.totalCrops ?? 0
        },

        {
            icon: "📦",
            title:
                t("availableProduce") ||
                "Available Produce",
            value: `${
                stats.availableProduce ?? 0
            } kg`
        },

        {
            icon: "🧾",
            title:
                t("totalOrders") ||
                "Total Orders",
            value:
                stats.totalOrders ?? 0
        },

        {
            icon: "💰",
            title:
                t("marketplaceValue") ||
                "Marketplace Value",
            value: `₹${Number(
                stats.marketplaceValue ?? 0
            ).toLocaleString("en-IN")}`
        },

        {
            icon: "📈",
            title:
                t(
                    "averageFarmerBenefit"
                ) ||
                "Average Farmer Benefit",
            value: `${
                stats.averageFarmerBenefit ?? 0
            }%`
        },

        {
            icon: "💵",
            title:
                t(
                    "averageConsumerSaving"
                ) ||
                "Average Consumer Saving",
            value: `${
                stats.averageConsumerSaving ?? 0
            }%`
        }
    ];

    return (
        <div className="container py-5">

            {/* HEADER */}

            <div className="text-center mb-5">

                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">

                    <h2 className="page-title mb-0">
                        📊{" "}
                        {t(
                            "impactDashboardTitle"
                        ) ||
                            "Impact Dashboard"}
                    </h2>

                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm rounded-circle"
                        onClick={() =>
                            fetchStats(true)
                        }
                        disabled={refreshing}
                        title={
                            currentLanguage.refresh
                        }
                        aria-label={
                            currentLanguage.refresh
                        }
                    >
                        {refreshing
                            ? "⏳"
                            : "🔄"}
                    </button>

                </div>

                <p className="text-muted">
                    {t(
                        "platformDescription"
                    ) ||
                        currentLanguage.impactDescription}
                </p>

            </div>

            {/* ERROR BANNER */}

            {error && (
                <div className="alert alert-warning d-flex justify-content-between align-items-center">

                    <span>
                        ⚠️ {error}
                    </span>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() =>
                            fetchStats(true)
                        }
                        title={
                            currentLanguage.refresh
                        }
                    >
                        🔄
                    </button>

                </div>
            )}

            {/* MAIN STATISTICS */}

            <div className="row g-4">

                {cards.map((card) => (
                    <div
                        className="col-sm-6 col-lg-3"
                        key={card.title}
                    >
                        <div className="card stat-card h-100 border-0 shadow-sm">

                            <div className="card-body text-center p-4">

                                <div className="fs-1 mb-3">
                                    {card.icon}
                                </div>

                                <h6 className="text-muted mb-2">
                                    {card.title}
                                </h6>

                                <h3 className="fw-bold text-success mb-0">
                                    {card.value}
                                </h3>

                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* ORDER STATUS */}

            <div className="mt-5">

                <h4 className="fw-bold text-center mb-4">
                    📦{" "}
                    {currentLanguage.orders}
                </h4>

                <div className="row g-4">

                    {/* PENDING */}

                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center p-4">

                                <div className="display-5">
                                    🟡
                                </div>

                                <h6 className="text-muted mt-3">
                                    {t(
                                        "pendingOrders"
                                    ) ||
                                        "Pending Orders"}
                                </h6>

                                <h2 className="fw-bold text-warning">
                                    {
                                        stats.pendingOrders ??
                                            0
                                    }
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* ACCEPTED */}

                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center p-4">

                                <div className="display-5">
                                    🟢
                                </div>

                                <h6 className="text-muted mt-3">
                                    {t(
                                        "acceptedOrders"
                                    ) ||
                                        "Accepted Orders"}
                                </h6>

                                <h2 className="fw-bold text-success">
                                    {
                                        stats.acceptedOrders ??
                                            0
                                    }
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* REJECTED */}

                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center p-4">

                                <div className="display-5">
                                    🔴
                                </div>

                                <h6 className="text-muted mt-3">
                                    {t(
                                        "rejectedOrders"
                                    ) ||
                                        "Rejected Orders"}
                                </h6>

                                <h2 className="fw-bold text-danger">
                                    {
                                        stats.rejectedOrders ??
                                            0
                                    }
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* AGRIVIBE IMPACT */}

            <div className="card border-0 shadow-sm mt-5">

                <div className="card-body p-4">

                    <div className="row align-items-center">

                        <div className="col-md-8">

                            <h4 className="fw-bold mb-2">
                                🌱{" "}
                                {
                                    currentLanguage.impactTitle
                                }
                            </h4>

                            <p className="text-muted mb-0">
                                {
                                    currentLanguage.impactDescription
                                }
                            </p>

                        </div>

                        <div className="col-md-4 text-center mt-4 mt-md-0">

                            <div className="display-4">
                                🌾
                            </div>

                            <div className="fw-bold text-success">
                                {
                                    currentLanguage.flow
                                }
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ImpactDashboard;