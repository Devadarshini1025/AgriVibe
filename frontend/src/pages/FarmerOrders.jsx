import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

function FarmerOrders() {
    const { t, tCrop, language } = useLanguage();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    /*
     * =========================================================
     * EXTRA TRANSLATIONS USED ONLY ON THIS PAGE
     * =========================================================
     */

    const extraTranslations = {
        en: {
            kg: "kg",
            pricePerKg: "Price / kg",
            deliveryLocation: "Delivery Location",
            address: "Address",
            city: "City",
            state: "State",
            pincode: "Pincode",
            locationType: "Location Type",
            currentLocation: "Current Location",
            manualAddress: "Manual Address",
            coordinates: "Coordinates",
            latitude: "Latitude",
            longitude: "Longitude",
            notAvailable: "N/A",
            unableToUpdateOrder: "Unable to update order"
        },

        as: {
            kg: "কেজি",
            pricePerKg: "প্ৰতি কেজিৰ মূল্য",
            deliveryLocation: "ডেলিভাৰী স্থান",
            address: "ঠিকনা",
            city: "চহৰ",
            state: "ৰাজ্য",
            pincode: "পিনকোড",
            locationType: "স্থানৰ ধৰণ",
            currentLocation: "বৰ্তমান স্থান",
            manualAddress: "ঠিকনা নিজে দিয়া",
            coordinates: "স্থানাংক",
            latitude: "অক্ষাংশ",
            longitude: "দ্ৰাঘিমাংশ",
            notAvailable: "উপলব্ধ নহয়",
            unableToUpdateOrder: "অৰ্ডাৰ আপডেট কৰিব পৰা নগ'ল"
        },

        bn: {
            kg: "কেজি",
            pricePerKg: "প্রতি কেজির মূল্য",
            deliveryLocation: "ডেলিভারি অবস্থান",
            address: "ঠিকানা",
            city: "শহর",
            state: "রাজ্য",
            pincode: "পিনকোড",
            locationType: "অবস্থানের ধরন",
            currentLocation: "বর্তমান অবস্থান",
            manualAddress: "ম্যানুয়াল ঠিকানা",
            coordinates: "স্থানাঙ্ক",
            latitude: "অক্ষাংশ",
            longitude: "দ্রাঘিমাংশ",
            notAvailable: "উপলব্ধ নয়",
            unableToUpdateOrder: "অর্ডার আপডেট করা যায়নি"
        },

        brx: {
            kg: "केजी",
            pricePerKg: "केजी प्रति मुल्य",
            deliveryLocation: "डेलिभारी जायगा",
            address: "ठिकाना",
            city: "सहर",
            state: "राज्य",
            pincode: "पिनकोड",
            locationType: "जायगानि रोखोम",
            currentLocation: "दानि जायगा",
            manualAddress: "मेनुअल ठिकाना",
            coordinates: "स्थानांक",
            latitude: "अक्षांश",
            longitude: "देशान्तर",
            notAvailable: "मोनसे नङा",
            unableToUpdateOrder: "अर्डार अपडेट खालामनो हायाखै"
        },

        doi: {
            kg: "किलो",
            pricePerKg: "प्रति किलो कीमत",
            deliveryLocation: "डिलीवरी स्थान",
            address: "पता",
            city: "शहर",
            state: "राज्य",
            pincode: "पिनकोड",
            locationType: "स्थान प्रकार",
            currentLocation: "मौजूदा स्थान",
            manualAddress: "मैनुअल पता",
            coordinates: "निर्देशांक",
            latitude: "अक्षांश",
            longitude: "देशांतर",
            notAvailable: "उपलब्ध नेई",
            unableToUpdateOrder: "ऑर्डर अपडेट नेई होई सकेआ"
        },

        gu: {
            kg: "કિગ્રા",
            pricePerKg: "કિલો દીઠ કિંમત",
            deliveryLocation: "ડિલિવરી સ્થાન",
            address: "સરનામું",
            city: "શહેર",
            state: "રાજ્ય",
            pincode: "પિનકોડ",
            locationType: "સ્થાનનો પ્રકાર",
            currentLocation: "વર્તમાન સ્થાન",
            manualAddress: "મેન્યુઅલ સરનામું",
            coordinates: "સ્થાનાંક",
            latitude: "અક્ષાંશ",
            longitude: "રેખાંશ",
            notAvailable: "ઉપલબ્ધ નથી",
            unableToUpdateOrder: "ઓર્ડર અપડેટ કરી શકાયો નથી"
        },

        hi: {
            kg: "किग्रा",
            pricePerKg: "प्रति किलो कीमत",
            deliveryLocation: "डिलीवरी स्थान",
            address: "पता",
            city: "शहर",
            state: "राज्य",
            pincode: "पिनकोड",
            locationType: "स्थान का प्रकार",
            currentLocation: "वर्तमान स्थान",
            manualAddress: "मैन्युअल पता",
            coordinates: "निर्देशांक",
            latitude: "अक्षांश",
            longitude: "देशांतर",
            notAvailable: "उपलब्ध नहीं",
            unableToUpdateOrder: "ऑर्डर अपडेट नहीं किया जा सका"
        },

        kn: {
            kg: "ಕೆಜಿ",
            pricePerKg: "ಪ್ರತಿ ಕೆಜಿಯ ಬೆಲೆ",
            deliveryLocation: "ವಿತರಣಾ ಸ್ಥಳ",
            address: "ವಿಳಾಸ",
            city: "ನಗರ",
            state: "ರಾಜ್ಯ",
            pincode: "ಪಿನ್‌ಕೋಡ್",
            locationType: "ಸ್ಥಳದ ಪ್ರಕಾರ",
            currentLocation: "ಪ್ರಸ್ತುತ ಸ್ಥಳ",
            manualAddress: "ಹಸ್ತಚಾಲಿತ ವಿಳಾಸ",
            coordinates: "ನಿರ್ದೇಶಾಂಕಗಳು",
            latitude: "ಅಕ್ಷಾಂಶ",
            longitude: "ರೇಖಾಂಶ",
            notAvailable: "ಲಭ್ಯವಿಲ್ಲ",
            unableToUpdateOrder: "ಆರ್ಡರ್ ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ"
        },

        ks: {
            kg: "کلو",
            pricePerKg: "فی کلو قیمت",
            deliveryLocation: "ڈیلیوری جاے",
            address: "پتہ",
            city: "شہر",
            state: "ریاست",
            pincode: "پن کوڈ",
            locationType: "جاے ہند قسم",
            currentLocation: "موجودہ جاے",
            manualAddress: "دستی پتہ",
            coordinates: "نقشہ جات",
            latitude: "عرض البلد",
            longitude: "طول البلد",
            notAvailable: "دستیاب نہ چھ",
            unableToUpdateOrder: "آرڈر اپڈیٹ نہ آو"
        },

        kok: {
            kg: "किलो",
            pricePerKg: "दर किलो किंमत",
            deliveryLocation: "डिलिवरी सुवात",
            address: "पत्तो",
            city: "शार",
            state: "राज्य",
            pincode: "पिनकोड",
            locationType: "सुवातीचो प्रकार",
            currentLocation: "सद्य सुवात",
            manualAddress: "मॅन्युअल पत्तो",
            coordinates: "स्थानांक",
            latitude: "अक्षांश",
            longitude: "रेखांश",
            notAvailable: "उपलब्ध ना",
            unableToUpdateOrder: "ऑर्डर अपडेट जावंक ना"
        },

        mai: {
            kg: "किलो",
            pricePerKg: "प्रति किलो मूल्य",
            deliveryLocation: "डिलीवरी स्थान",
            address: "पता",
            city: "शहर",
            state: "राज्य",
            pincode: "पिनकोड",
            locationType: "स्थान प्रकार",
            currentLocation: "वर्तमान स्थान",
            manualAddress: "मैनुअल पता",
            coordinates: "निर्देशांक",
            latitude: "अक्षांश",
            longitude: "देशांतर",
            notAvailable: "उपलब्ध नहि",
            unableToUpdateOrder: "ऑर्डर अपडेट नहि भ सकल"
        },

        ml: {
            kg: "കിലോ",
            pricePerKg: "കിലോയ്ക്ക് വില",
            deliveryLocation: "ഡെലിവറി സ്ഥലം",
            address: "വിലാസം",
            city: "നഗരം",
            state: "സംസ്ഥാനം",
            pincode: "പിൻകോഡ്",
            locationType: "സ്ഥലത്തിന്റെ തരം",
            currentLocation: "നിലവിലെ സ്ഥലം",
            manualAddress: "മാനുവൽ വിലാസം",
            coordinates: "കോർഡിനേറ്റുകൾ",
            latitude: "അക്ഷാംശം",
            longitude: "രേഖാംശം",
            notAvailable: "ലഭ്യമല്ല",
            unableToUpdateOrder: "ഓർഡർ അപ്ഡേറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല"
        },

        mni: {
            kg: "কেজি",
            pricePerKg: "প্রতি কেজি মমল",
            deliveryLocation: "ডেলিভরি লৈফম",
            address: "ঠিকানা",
            city: "শহর",
            state: "রাজ্য",
            pincode: "পিনকোড",
            locationType: "লৈফমগী মওং",
            currentLocation: "হৌজিক লৈফম",
            manualAddress: "ম্যানুয়েল ঠিকানা",
            coordinates: "কোঅর্ডিনেট",
            latitude: "অক্ষাংশ",
            longitude: "দ্রাঘিমাংশ",
            notAvailable: "ফংদে",
            unableToUpdateOrder: "অর্ডর আপডেট তৌবা য়ারোই"
        },

        mr: {
            kg: "किलो",
            pricePerKg: "प्रति किलो किंमत",
            deliveryLocation: "डिलिव्हरी ठिकाण",
            address: "पत्ता",
            city: "शहर",
            state: "राज्य",
            pincode: "पिनकोड",
            locationType: "ठिकाणाचा प्रकार",
            currentLocation: "सध्याचे ठिकाण",
            manualAddress: "मॅन्युअल पत्ता",
            coordinates: "निर्देशांक",
            latitude: "अक्षांश",
            longitude: "रेखांश",
            notAvailable: "उपलब्ध नाही",
            unableToUpdateOrder: "ऑर्डर अपडेट करता आली नाही"
        },

        ne: {
            kg: "केजी",
            pricePerKg: "प्रति केजी मूल्य",
            deliveryLocation: "डेलिभरी स्थान",
            address: "ठेगाना",
            city: "शहर",
            state: "राज्य",
            pincode: "पिनकोड",
            locationType: "स्थानको प्रकार",
            currentLocation: "हालको स्थान",
            manualAddress: "म्यानुअल ठेगाना",
            coordinates: "निर्देशांक",
            latitude: "अक्षांश",
            longitude: "देशान्तर",
            notAvailable: "उपलब्ध छैन",
            unableToUpdateOrder: "अर्डर अपडेट गर्न सकिएन"
        },

        or: {
            kg: "କିଲୋ",
            pricePerKg: "ପ୍ରତି କିଲୋ ମୂଲ୍ୟ",
            deliveryLocation: "ଡେଲିଭରି ସ୍ଥାନ",
            address: "ଠିକଣା",
            city: "ସହର",
            state: "ରାଜ୍ୟ",
            pincode: "ପିନକୋଡ",
            locationType: "ସ୍ଥାନର ପ୍ରକାର",
            currentLocation: "ବର୍ତ୍ତମାନ ସ୍ଥାନ",
            manualAddress: "ମାନୁଆଲ ଠିକଣା",
            coordinates: "ସ୍ଥାନାଙ୍କ",
            latitude: "ଅକ୍ଷାଂଶ",
            longitude: "ଦ୍ରାଘିମା",
            notAvailable: "ଉପଲବ୍ଧ ନାହିଁ",
            unableToUpdateOrder: "ଅର୍ଡର ଅପଡେଟ ହୋଇପାରିଲା ନାହିଁ"
        },

        pa: {
            kg: "ਕਿਲੋ",
            pricePerKg: "ਪ੍ਰਤੀ ਕਿਲੋ ਕੀਮਤ",
            deliveryLocation: "ਡਿਲਿਵਰੀ ਸਥਾਨ",
            address: "ਪਤਾ",
            city: "ਸ਼ਹਿਰ",
            state: "ਰਾਜ",
            pincode: "ਪਿਨਕੋਡ",
            locationType: "ਸਥਾਨ ਦੀ ਕਿਸਮ",
            currentLocation: "ਮੌਜੂਦਾ ਸਥਾਨ",
            manualAddress: "ਮੈਨੂਅਲ ਪਤਾ",
            coordinates: "ਨਿਰਦੇਸ਼ਾਂਕ",
            latitude: "ਅਕਸ਼ਾਂਸ਼",
            longitude: "ਦੇਸ਼ਾਂਤਰ",
            notAvailable: "ਉਪਲਬਧ ਨਹੀਂ",
            unableToUpdateOrder: "ਆਰਡਰ ਅਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕਿਆ"
        },

        sa: {
            kg: "किलोग्राम",
            pricePerKg: "प्रति किलोग्राम मूल्यम्",
            deliveryLocation: "वितरणस्थानम्",
            address: "सङ्केतः",
            city: "नगरम्",
            state: "राज्यम्",
            pincode: "पिनकोड",
            locationType: "स्थानप्रकारः",
            currentLocation: "वर्तमानस्थानम्",
            manualAddress: "हस्तनिर्मितसङ्केतः",
            coordinates: "निर्देशाङ्काः",
            latitude: "अक्षांशः",
            longitude: "देशान्तरम्",
            notAvailable: "उपलब्धं नास्ति",
            unableToUpdateOrder: "आदेशस्य अद्यतनीकरणं न शक्यते"
        },

        sat: {
            kg: "ᱠᱤᱞᱳ",
            pricePerKg: "ᱢᱤᱫ ᱠᱤᱞᱳ ᱨᱮ ᱫᱟᱢ",
            deliveryLocation: "ᱰᱤᱞᱤᱵᱷᱟᱨᱤ ᱴᱷᱟᱶ",
            address: "ᱴᱷᱤᱠᱟᱱᱟ",
            city: "ᱥᱟᱦᱟᱨ",
            state: "ᱨᱟᱡᱽᱭᱚ",
            pincode: "ᱯᱤᱱᱠᱳᱰ",
            locationType: "ᱴᱷᱟᱶ ᱨᱮᱭᱟᱜ ᱯᱨᱚᱠᱟᱨ",
            currentLocation: "ᱱᱤᱛᱚᱜ ᱴᱷᱟᱶ",
            manualAddress: "ᱢᱮᱱᱩᱣᱟᱞ ᱴᱷᱤᱠᱟᱱᱟ",
            coordinates: "ᱠᱳᱣᱚᱨᱰᱤᱱᱮᱴ",
            latitude: "ᱞᱮᱴᱤᱴᱩᱰ",
            longitude: "ᱞᱳᱝᱜᱤᱴᱩᱰ",
            notAvailable: "ᱧᱟᱢᱚᱜ ᱵᱟᱝ",
            unableToUpdateOrder: "ᱚᱨᱰᱟᱨ ᱟᱯᱰᱮᱴ ᱵᱟᱝ ᱦᱚᱭ ᱞᱮᱱᱟ"
        },

        sd: {
            kg: "ڪلو",
            pricePerKg: "في ڪلو قيمت",
            deliveryLocation: "پهچائڻ جي جڳهه",
            address: "پتو",
            city: "شهر",
            state: "رياست",
            pincode: "پن ڪوڊ",
            locationType: "جڳهه جو قسم",
            currentLocation: "موجوده جڳهه",
            manualAddress: "دستي پتو",
            coordinates: "هم آهنگ",
            latitude: "ويڪرائي ڦاڪ",
            longitude: "ڊگهائي ڦاڪ",
            notAvailable: "دستياب ناهي",
            unableToUpdateOrder: "آرڊر اپڊيٽ نه ٿي سگهيو"
        },

        ta: {
            kg: "கிலோ",
            pricePerKg: "கிலோவிற்கு விலை",
            deliveryLocation: "டெலிவரி இடம்",
            address: "முகவரி",
            city: "நகரம்",
            state: "மாநிலம்",
            pincode: "அஞ்சல் குறியீடு",
            locationType: "இடத்தின் வகை",
            currentLocation: "தற்போதைய இடம்",
            manualAddress: "கைமுறை முகவரி",
            coordinates: "ஆயத்தொலைவுகள்",
            latitude: "அட்சரேகை",
            longitude: "தீர்க்கரேகை",
            notAvailable: "கிடைக்கவில்லை",
            unableToUpdateOrder: "ஆர்டரை புதுப்பிக்க முடியவில்லை"
        },

        te: {
            kg: "కిలోలు",
            pricePerKg: "కిలో ధర",
            deliveryLocation: "డెలివరీ స్థానం",
            address: "చిరునామా",
            city: "నగరం",
            state: "రాష్ట్రం",
            pincode: "పిన్‌కోడ్",
            locationType: "స్థానం రకం",
            currentLocation: "ప్రస్తుత స్థానం",
            manualAddress: "మాన్యువల్ చిరునామా",
            coordinates: "కోఆర్డినేట్లు",
            latitude: "అక్షాంశం",
            longitude: "రేఖాంశం",
            notAvailable: "అందుబాటులో లేదు",
            unableToUpdateOrder: "ఆర్డర్‌ను అప్‌డేట్ చేయలేకపోయాము"
        },

        ur: {
            kg: "کلو",
            pricePerKg: "فی کلو قیمت",
            deliveryLocation: "ڈیلیوری کا مقام",
            address: "پتہ",
            city: "شہر",
            state: "ریاست",
            pincode: "پن کوڈ",
            locationType: "مقام کی قسم",
            currentLocation: "موجودہ مقام",
            manualAddress: "دستی پتہ",
            coordinates: "نقاط",
            latitude: "عرض البلد",
            longitude: "طول البلد",
            notAvailable: "دستیاب نہیں",
            unableToUpdateOrder: "آرڈر اپ ڈیٹ نہیں ہو سکا"
        }
    };

    const extraT = (key) => {
        return (
            extraTranslations[language]?.[key] ||
            extraTranslations.en[key] ||
            key
        );
    };

    /*
     * =========================================================
     * FETCH ORDERS
     * =========================================================
     */

    const fetchOrders = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                "http://localhost:5000/api/orders",
                {
                    params: {
                        farmerName: user.name
                    }
                }
            );

            setOrders(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "Fetch Farmer Orders Error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    /*
     * =========================================================
     * UPDATE ORDER
     * =========================================================
     */

    const updateOrder = async (id, action) => {
        try {
            const orderUrl =
                "http://localhost:5000/api/orders/" +
                id +
                "/" +
                action;

            await axios.put(orderUrl);

            fetchOrders();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                extraT("unableToUpdateOrder")
            );
        }
    };

    /*
     * =========================================================
     * NOT LOGGED IN
     * =========================================================
     */

    if (!user) {
        return (
            <div className="container py-5">

                <div className="alert alert-warning text-center">

                    {t("farmerLoginMessage")}

                    <br />

                    <Link
                        to="/login"
                        className="btn btn-success mt-3"
                    >
                        {t("login")}
                    </Link>

                </div>

            </div>
        );
    }

    /*
     * =========================================================
     * NOT A FARMER
     * =========================================================
     */

    if (user.role !== "farmer") {
        return (
            <div className="container py-5">

                <div className="alert alert-danger">

                    {t("farmerLoginRequired")}

                </div>

            </div>
        );
    }

    /*
     * =========================================================
     * MAIN PAGE
     * =========================================================
     */

    return (
        <div className="container py-5">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="page-title">
                        📦 {t("farmerOrders")}
                    </h2>

                    <p className="text-muted">
                        {t("manageOrders")}
                    </p>

                </div>

                <Link
                    to="/farmer-dashboard"
                    className="btn btn-outline-success"
                >
                    ← {t("back")}
                </Link>

            </div>

            {/* LOADING */}

            {loading ? (

                <p>
                    {t("loadingFarmerOrders")}
                </p>

            ) : orders.length === 0 ? (

                <div className="alert alert-light border">

                    {t("noFarmerOrders")}

                </div>

            ) : (

                <div className="row g-4">

                    {orders.map((order) => (

                        <div
                            className="col-md-6 col-lg-4"
                            key={order._id}
                        >

                            <div className="card h-100 shadow-sm border-0">

                                <div className="card-body">

                                    {/* CROP + STATUS */}

                                    <div className="d-flex justify-content-between mb-3">

                                        <h5 className="fw-bold">

                                            🌾{" "}

                                            {language === "en" ? (
                                                order.cropName
                                            ) : (
                                                <span>

                                                    {tCrop(
                                                        order.cropName
                                                    )}

                                                    {tCrop(
                                                        order.cropName
                                                    ) !==
                                                        order.cropName && (
                                                        <span className="text-muted fs-6 ms-2 fw-normal">

                                                            (
                                                            {
                                                                order.cropName
                                                            }
                                                            )

                                                        </span>
                                                    )}

                                                </span>
                                            )}

                                        </h5>

                                        <span
                                            className={`badge ${
                                                order.status ===
                                                "Accepted"
                                                    ? "bg-success"
                                                    : order.status ===
                                                      "Rejected"
                                                    ? "bg-danger"
                                                    : "bg-warning text-dark"
                                            }`}
                                        >

                                            {order.status ===
                                            "Accepted"
                                                ? t("accepted")
                                                : order.status ===
                                                  "Rejected"
                                                ? t("rejected")
                                                : t("pending")}

                                        </span>

                                    </div>

                                    {/* BUYER */}

                                    <p>

                                        <strong>
                                            {t("buyer")}:
                                        </strong>{" "}

                                        {order.buyerName}

                                    </p>

                                    {/* EMAIL */}

                                    <p>

                                        <strong>
                                            {t("email")}:
                                        </strong>{" "}

                                        {order.buyerEmail}

                                    </p>

                                    {/* QUANTITY */}

                                    <p>

                                        <strong>
                                            {t("quantity")}:
                                        </strong>{" "}

                                        {order.quantity}{" "}
                                        {extraT("kg")}

                                    </p>

                                    {/* TOTAL PRICE */}

                                    <p>

                                        <strong>
                                            {t("totalPrice")}:
                                        </strong>{" "}

                                        ₹
                                        {Number(
                                            order.totalPrice
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </p>

                                    {/* PRICE PER KG */}

                                    {order.pricePerKg !==
                                        undefined && (

                                        <p>

                                            <strong>
                                                {extraT(
                                                    "pricePerKg"
                                                )}:
                                            </strong>{" "}

                                            ₹
                                            {order.pricePerKg}

                                        </p>

                                    )}

                                    {/* DELIVERY LOCATION */}

                                    {order.deliveryLocation && (

                                        <div className="mt-3 mb-3">

                                            <h6 className="fw-bold">

                                                📍{" "}

                                                {extraT(
                                                    "deliveryLocation"
                                                )}

                                            </h6>

                                            <div className="border rounded p-3 bg-light">

                                                {/* ADDRESS */}

                                                {order
                                                    .deliveryLocation
                                                    .address && (

                                                    <p className="mb-2">

                                                        <strong>
                                                            {extraT(
                                                                "address"
                                                            )}:
                                                        </strong>{" "}

                                                        {
                                                            order
                                                                .deliveryLocation
                                                                .address
                                                        }

                                                    </p>
                                                )}

                                                {/* CITY */}

                                                {order
                                                    .deliveryLocation
                                                    .city && (

                                                    <p className="mb-2">

                                                        <strong>
                                                            {extraT(
                                                                "city"
                                                            )}:
                                                        </strong>{" "}

                                                        {
                                                            order
                                                                .deliveryLocation
                                                                .city
                                                        }

                                                    </p>
                                                )}

                                                {/* STATE */}

                                                {order
                                                    .deliveryLocation
                                                    .state && (

                                                    <p className="mb-2">

                                                        <strong>
                                                            {extraT(
                                                                "state"
                                                            )}:
                                                        </strong>{" "}

                                                        {
                                                            order
                                                                .deliveryLocation
                                                                .state
                                                        }

                                                    </p>
                                                )}

                                                {/* PINCODE */}

                                                {order
                                                    .deliveryLocation
                                                    .pincode && (

                                                    <p className="mb-2">

                                                        <strong>
                                                            {extraT(
                                                                "pincode"
                                                            )}:
                                                        </strong>{" "}

                                                        {
                                                            order
                                                                .deliveryLocation
                                                                .pincode
                                                        }

                                                    </p>
                                                )}

                                                {/* LOCATION TYPE */}

                                                {order
                                                    .deliveryLocation
                                                    .method && (

                                                    <p className="mb-2">

                                                        <strong>
                                                            {extraT(
                                                                "locationType"
                                                            )}:
                                                        </strong>{" "}

                                                        {order
                                                            .deliveryLocation
                                                            .method ===
                                                        "current"
                                                            ? `📍 ${extraT(
                                                                  "currentLocation"
                                                              )}`
                                                            : `✍️ ${extraT(
                                                                  "manualAddress"
                                                              )}`}

                                                    </p>
                                                )}

                                                {/* COORDINATES */}

                                                {order
                                                    .deliveryLocation
                                                    .latitude !==
                                                    null &&
                                                    order
                                                        .deliveryLocation
                                                        .latitude !==
                                                    undefined &&
                                                    order
                                                        .deliveryLocation
                                                        .longitude !==
                                                    null &&
                                                    order
                                                        .deliveryLocation
                                                        .longitude !==
                                                    undefined && (

                                                        <div className="mt-2">

                                                            <small className="text-muted">

                                                                {extraT(
                                                                    "coordinates"
                                                                )}
                                                                :

                                                                <br />

                                                                {extraT(
                                                                    "latitude"
                                                                )}
                                                                :{" "}

                                                                {
                                                                    order
                                                                        .deliveryLocation
                                                                        .latitude
                                                                }

                                                                <br />

                                                                {extraT(
                                                                    "longitude"
                                                                )}
                                                                :{" "}

                                                                {
                                                                    order
                                                                        .deliveryLocation
                                                                        .longitude
                                                                }

                                                            </small>

                                                        </div>

                                                    )}

                                            </div>

                                        </div>

                                    )}

                                    {/* ORDER DATE */}

                                    <p className="text-muted small">

                                        {t("orderedOn")}:{" "}

                                        {order.createdAt
                                            ? new Date(
                                                  order.createdAt
                                              ).toLocaleString(
                                                  language ===
                                                      "en"
                                                      ? "en-IN"
                                                      : language
                                              )
                                            : extraT(
                                                  "notAvailable"
                                              )}

                                    </p>

                                    {/* ACCEPT / REJECT */}

                                    {order.status ===
                                        "Pending" && (

                                        <div className="d-flex gap-2">

                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() =>
                                                    updateOrder(
                                                        order._id,
                                                        "accept"
                                                    )
                                                }
                                            >

                                                ✓{" "}

                                                {t("accept")}

                                            </button>

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => {

                                                    if (
                                                        window.confirm(
                                                            t(
                                                                "confirmReject"
                                                            )
                                                        )
                                                    ) {

                                                        updateOrder(
                                                            order._id,
                                                            "reject"
                                                        );

                                                    }

                                                }}
                                            >

                                                ✕{" "}

                                                {t("reject")}

                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default FarmerOrders;