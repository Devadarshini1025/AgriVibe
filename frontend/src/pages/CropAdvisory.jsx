import { useState } from "react";
import axios from "axios";

import { useLanguage } from "../context/LanguageContext";

function CropAdvisory() {
    const { t, tCrop, language } = useLanguage();

    const [form, setForm] = useState({
        cropName: "",
        soilType: "",
        weather: "",
        temperature: "",
        humidity: "",
        precipitation: "",
        windSpeed: "",
        waterAvailability: "",
        cropProblem: ""
    });

    const [advisory, setAdvisory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /*
     * ============================================================
     * MULTILINGUAL ADVISORY TRANSLATIONS
     * 22 SUPPORTED INDIAN LANGUAGES
     * ============================================================
     */

    const advisoryTranslations = {
        en: {
            crop: "For {crop}, monitor plant health regularly and maintain appropriate irrigation, nutrition and pest control.",
            soil: "For {soil} soil, manage drainage, irrigation and nutrients according to crop needs.",
            weather: "Weather conditions should be monitored closely and irrigation should be adjusted according to field conditions.",
            temperature: "Temperature conditions should be monitored closely and crop care should be adjusted when necessary.",
            moisture: "Humidity and rainfall conditions should be monitored and irrigation should be adjusted according to soil moisture.",
            wind: "Wind conditions should be monitored and young or weak plants should be protected.",
            water: "Water availability is {water}. Use efficient irrigation and avoid unnecessary watering.",
            problem: "For the reported crop problem, {problem}, inspect affected plants early and consult a local agricultural expert if the problem spreads.",
            general: "Maintain regular crop monitoring, balanced irrigation, soil nutrition and pest observation."
        },

        hi: {
            crop: "फसल {crop} के लिए पौधों के स्वास्थ्य की नियमित निगरानी करें और उचित सिंचाई, पोषण तथा कीट प्रबंधन बनाए रखें।",
            soil: "{soil} मिट्टी के लिए फसल की आवश्यकता के अनुसार जल निकासी, सिंचाई और पोषक तत्वों का प्रबंधन करें।",
            weather: "मौसम की स्थिति पर ध्यान से निगरानी रखें और खेत की स्थिति के अनुसार सिंचाई समायोजित करें।",
            temperature: "तापमान की स्थिति पर निगरानी रखें और आवश्यकता के अनुसार फसल की देखभाल में बदलाव करें।",
            moisture: "नमी और वर्षा की स्थिति की निगरानी करें तथा मिट्टी की नमी के अनुसार सिंचाई समायोजित करें।",
            wind: "हवा की स्थिति पर निगरानी रखें और कमजोर या नई पौधों की सुरक्षा करें।",
            water: "पानी की उपलब्धता {water} है। कुशल सिंचाई अपनाएँ और अनावश्यक पानी देने से बचें।",
            problem: "बताई गई फसल समस्या {problem} के लिए प्रभावित पौधों की जल्दी जाँच करें और समस्या फैलने पर स्थानीय कृषि विशेषज्ञ से सलाह लें।",
            general: "फसल की नियमित निगरानी, संतुलित सिंचाई, मिट्टी के पोषण और कीटों की निगरानी बनाए रखें।"
        },

        bn: {
            crop: "ফসল {crop}-এর জন্য গাছের স্বাস্থ্য নিয়মিত পর্যবেক্ষণ করুন এবং উপযুক্ত সেচ, পুষ্টি ও কীটপতঙ্গ নিয়ন্ত্রণ বজায় রাখুন।",
            soil: "{soil} মাটির জন্য ফসলের প্রয়োজন অনুযায়ী নিষ্কাশন, সেচ ও পুষ্টি ব্যবস্থাপনা করুন।",
            weather: "আবহাওয়ার অবস্থা ভালোভাবে পর্যবেক্ষণ করুন এবং জমির অবস্থার অনুযায়ী সেচ সামঞ্জস্য করুন।",
            temperature: "তাপমাত্রার অবস্থা পর্যবেক্ষণ করুন এবং প্রয়োজন অনুযায়ী ফসলের পরিচর্যায় পরিবর্তন করুন।",
            moisture: "আর্দ্রতা ও বৃষ্টির অবস্থা পর্যবেক্ষণ করুন এবং মাটির আর্দ্রতা অনুযায়ী সেচ সামঞ্জস্য করুন।",
            wind: "বাতাসের অবস্থা পর্যবেক্ষণ করুন এবং দুর্বল বা নতুন গাছকে সুরক্ষা দিন।",
            water: "পানির প্রাপ্যতা {water}। দক্ষ সেচ ব্যবহার করুন এবং অপ্রয়োজনীয় পানি দেওয়া এড়িয়ে চলুন।",
            problem: "জানানো ফসল সমস্যা {problem}-এর জন্য আক্রান্ত গাছ দ্রুত পরীক্ষা করুন এবং সমস্যা ছড়ালে স্থানীয় কৃষি বিশেষজ্ঞের পরামর্শ নিন।",
            general: "নিয়মিত ফসল পর্যবেক্ষণ, সুষম সেচ, মাটির পুষ্টি এবং কীটপতঙ্গ পর্যবেক্ষণ বজায় রাখুন।"
        },

        mr: {
            crop: "पीक {crop} साठी झाडांच्या आरोग्याची नियमित पाहणी करा आणि योग्य सिंचन, पोषण व कीड व्यवस्थापन ठेवा.",
            soil: "{soil} मातीसाठी पिकाच्या गरजेनुसार निचरा, सिंचन आणि पोषक व्यवस्थापन करा.",
            weather: "हवामानाची स्थिती काळजीपूर्वक तपासा आणि शेताच्या परिस्थितीनुसार सिंचन समायोजित करा.",
            temperature: "तापमानाची स्थिती तपासा आणि गरजेनुसार पिकाच्या देखभालीत बदल करा.",
            moisture: "आर्द्रता आणि पावसाची स्थिती तपासा आणि मातीतील ओलाव्यानुसार सिंचन समायोजित करा.",
            wind: "वाऱ्याची स्थिती तपासा आणि कमकुवत किंवा नवीन झाडांचे संरक्षण करा.",
            water: "पाण्याची उपलब्धता {water} आहे. कार्यक्षम सिंचन करा आणि अनावश्यक पाणी देणे टाळा.",
            problem: "नोंदवलेल्या पिकाच्या समस्येसाठी {problem}, बाधित झाडांची लवकर तपासणी करा आणि समस्या वाढल्यास स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या.",
            general: "पिकांचे नियमित निरीक्षण, संतुलित सिंचन, मातीचे पोषण आणि कीड निरीक्षण राखा."
        },

        te: {
            crop: "పంట {crop} కోసం మొక్కల ఆరోగ్యాన్ని క్రమం తప్పకుండా పరిశీలించి, తగిన నీటిపారుదల, పోషణ మరియు పురుగు నియంత్రణను పాటించండి.",
            soil: "{soil} నేలలో పంట అవసరానికి అనుగుణంగా నీటి పారుదల, నీటిపారుదల మరియు పోషక నిర్వహణ చేయండి.",
            weather: "వాతావరణ పరిస్థితులను జాగ్రత్తగా పరిశీలించి, పొలం పరిస్థితికి అనుగుణంగా నీటిపారుదలను మార్చండి.",
            temperature: "ఉష్ణోగ్రత పరిస్థితులను పరిశీలించి, అవసరానికి అనుగుణంగా పంట సంరక్షణను మార్చండి.",
            moisture: "తేమ మరియు వర్షపాత పరిస్థితులను పరిశీలించి, నేల తేమకు అనుగుణంగా నీటిపారుదలను మార్చండి.",
            wind: "గాలి పరిస్థితులను పరిశీలించి, బలహీనమైన లేదా కొత్త మొక్కలను రక్షించండి.",
            water: "నీటి లభ్యత {water}గా ఉంది. సమర్థవంతమైన నీటిపారుదలను ఉపయోగించి అవసరం లేని నీరు ఇవ్వడం నివారించండి.",
            problem: "తెలిపిన పంట సమస్య {problem} కోసం ప్రభావిత మొక్కలను ముందుగానే పరిశీలించి, సమస్య వ్యాపిస్తే స్థానిక వ్యవసాయ నిపుణుడిని సంప్రదించండి.",
            general: "పంటను క్రమం తప్పకుండా పరిశీలిస్తూ, సమతుల్య నీటిపారుదల, నేల పోషణ మరియు పురుగు నియంత్రణను పాటించండి."
        },

        ta: {
            crop: "பயிர் {crop}க்கு தாவர ஆரோக்கியத்தை தொடர்ந்து கண்காணித்து, சரியான நீர்ப்பாசனம், ஊட்டச்சத்து மற்றும் பூச்சி மேலாண்மையை பராமரிக்கவும்.",
            soil: "{soil} மண்ணில் பயிரின் தேவைக்கேற்ப வடிகால், நீர்ப்பாசனம் மற்றும் ஊட்டச்சத்து மேலாண்மையை செய்யவும்.",
            weather: "வானிலை நிலையை கவனமாக கண்காணித்து, வயல் நிலைக்கு ஏற்ப நீர்ப்பாசனத்தை மாற்றவும்.",
            temperature: "வெப்பநிலையை கண்காணித்து, தேவைக்கேற்ப பயிர் பராமரிப்பில் மாற்றம் செய்யவும்.",
            moisture: "ஈரப்பதம் மற்றும் மழை நிலையை கண்காணித்து, மண் ஈரப்பதத்திற்கு ஏற்ப நீர்ப்பாசனத்தை மாற்றவும்.",
            wind: "காற்றின் நிலையை கண்காணித்து, பலவீனமான அல்லது புதிய செடிகளை பாதுகாக்கவும்.",
            water: "நீர் கிடைப்பது {water}. திறமையான நீர்ப்பாசனத்தை பயன்படுத்தி தேவையற்ற நீர்ப்பாசனத்தை தவிர்க்கவும்.",
            problem: "தெரிவிக்கப்பட்ட பயிர் பிரச்சனை {problem}க்கு பாதிக்கப்பட்ட செடிகளை விரைவில் பரிசோதித்து, பிரச்சனை பரவினால் உள்ளூர் வேளாண் நிபுணரை அணுகவும்.",
            general: "பயிர்களை தொடர்ந்து கண்காணித்து, சமநிலையான நீர்ப்பாசனம், மண் ஊட்டச்சத்து மற்றும் பூச்சி மேலாண்மையை பராமரிக்கவும்."
        },

        gu: {
            crop: "પાક {crop} માટે છોડના સ્વાસ્થ્યનું નિયમિત નિરીક્ષણ કરો અને યોગ્ય સિંચાઈ, પોષણ તથા જીવાત નિયંત્રણ જાળવો.",
            soil: "{soil} જમીન માટે પાકની જરૂરિયાત મુજબ નિકાસ, સિંચાઈ અને પોષક વ્યવસ્થાપન કરો.",
            weather: "હવામાનની સ્થિતિનું ધ્યાનપૂર્વક નિરીક્ષણ કરો અને ખેતરની સ્થિતિ મુજબ સિંચાઈમાં ફેરફાર કરો.",
            temperature: "તાપમાનની સ્થિતિનું નિરીક્ષણ કરો અને જરૂર મુજબ પાકની સંભાળમાં ફેરફાર કરો.",
            moisture: "ભેજ અને વરસાદની સ્થિતિનું નિરીક્ષણ કરો અને જમીનની ભેજ મુજબ સિંચાઈમાં ફેરફાર કરો.",
            wind: "પવનની સ્થિતિનું નિરીક્ષણ કરો અને નબળા અથવા નવા છોડનું રક્ષણ કરો.",
            water: "પાણીની ઉપલબ્ધતા {water} છે. કાર્યક્ષમ સિંચાઈ કરો અને બિનજરૂરી પાણી આપવાનું ટાળો.",
            problem: "જણાવેલી પાક સમસ્યા {problem} માટે અસરગ્રસ્ત છોડની વહેલી તપાસ કરો અને સમસ્યા ફેલાય તો સ્થાનિક કૃષિ નિષ્ણાતની સલાહ લો.",
            general: "પાકનું નિયમિત નિરીક્ષણ, સંતુલિત સિંચાઈ, જમીનનું પોષણ અને જીવાત નિયંત્રણ જાળવો."
        },

        ur: {
            crop: "فصل {crop} کے لیے پودوں کی صحت کی باقاعدگی سے نگرانی کریں اور مناسب آبپاشی، غذائیت اور کیڑوں کا انتظام برقرار رکھیں۔",
            soil: "{soil} مٹی میں فصل کی ضرورت کے مطابق نکاسی، آبپاشی اور غذائی انتظام کریں۔",
            weather: "موسم کی صورتحال پر قریب سے نظر رکھیں اور کھیت کی حالت کے مطابق آبپاشی کو ایڈجسٹ کریں۔",
            temperature: "درجہ حرارت کی صورتحال کی نگرانی کریں اور ضرورت کے مطابق فصل کی دیکھ بھال تبدیل کریں۔",
            moisture: "نمی اور بارش کی صورتحال کی نگرانی کریں اور مٹی کی نمی کے مطابق آبپاشی ایڈجسٹ کریں۔",
            wind: "ہوا کی صورتحال کی نگرانی کریں اور کمزور یا نئے پودوں کی حفاظت کریں۔",
            water: "پانی کی دستیابی {water} ہے۔ مؤثر آبپاشی استعمال کریں اور غیر ضروری پانی دینے سے گریز کریں۔",
            problem: "بتائی گئی فصل کی مشکل {problem} کے لیے متاثرہ پودوں کا جلد معائنہ کریں اور مسئلہ پھیلنے پر مقامی زرعی ماہر سے مشورہ کریں۔",
            general: "فصل کی باقاعدہ نگرانی، متوازن آبپاشی، مٹی کی غذائیت اور کیڑوں کی نگرانی برقرار رکھیں۔"
        },

        kn: {
            crop: "ಬೆಳೆ {crop}ಗಾಗಿ ಸಸ್ಯಗಳ ಆರೋಗ್ಯವನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ, ಸೂಕ್ತ ನೀರಾವರಿ, ಪೋಷಕಾಂಶ ಮತ್ತು ಕೀಟ ನಿರ್ವಹಣೆಯನ್ನು ಕಾಪಾಡಿ.",
            soil: "{soil} ಮಣ್ಣಿನಲ್ಲಿ ಬೆಳೆ ಅಗತ್ಯಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಒಳಚರಂಡಿ, ನೀರಾವರಿ ಮತ್ತು ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆ ಮಾಡಿ.",
            weather: "ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಗಮನದಿಂದ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಹೊಲದ ಪರಿಸ್ಥಿತಿಗೆ ಅನುಗುಣವಾಗಿ ನೀರಾವರಿಯನ್ನು ಹೊಂದಿಸಿ.",
            temperature: "ತಾಪಮಾನ ಪರಿಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಅಗತ್ಯಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಬೆಳೆ ಆರೈಕೆಯನ್ನು ಬದಲಾಯಿಸಿ.",
            moisture: "ತೇವಾಂಶ ಮತ್ತು ಮಳೆಯ ಪರಿಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮಣ್ಣಿನ ತೇವಾಂಶಕ್ಕೆ ಅನುಗುಣವಾಗಿ ನೀರಾವರಿಯನ್ನು ಹೊಂದಿಸಿ.",
            wind: "ಗಾಳಿಯ ಪರಿಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ದುರ್ಬಲ ಅಥವಾ ಹೊಸ ಸಸ್ಯಗಳನ್ನು ರಕ್ಷಿಸಿ.",
            water: "ನೀರಿನ ಲಭ್ಯತೆ {water} ಆಗಿದೆ. ಪರಿಣಾಮಕಾರಿ ನೀರಾವರಿ ಬಳಸಿ ಮತ್ತು ಅನಗತ್ಯ ನೀರು ನೀಡುವುದನ್ನು ತಪ್ಪಿಸಿ.",
            problem: "ತಿಳಿಸಿದ ಬೆಳೆ ಸಮಸ್ಯೆ {problem}ಗಾಗಿ ಬಾಧಿತ ಸಸ್ಯಗಳನ್ನು ಬೇಗ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಮಸ್ಯೆ ಹರಡಿದರೆ ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
            general: "ಬೆಳೆಗಳ ನಿಯಮಿತ ಮೇಲ್ವಿಚಾರಣೆ, ಸಮತೋಲಿತ ನೀರಾವರಿ, ಮಣ್ಣಿನ ಪೋಷಣೆ ಮತ್ತು ಕೀಟ ನಿರ್ವಹಣೆಯನ್ನು ಕಾಪಾಡಿ."
        },

        or: {
            crop: "ଫସଲ {crop} ପାଇଁ ଗଛର ସ୍ୱାସ୍ଥ୍ୟକୁ ନିୟମିତ ନିରୀକ୍ଷଣ କରନ୍ତୁ ଏବଂ ଉପଯୁକ୍ତ ଜଳସେଚନ, ପୋଷଣ ଓ କୀଟ ନିୟନ୍ତ୍ରଣ ରଖନ୍ତୁ।",
            soil: "{soil} ମାଟି ପାଇଁ ଫସଲର ଆବଶ୍ୟକତା ଅନୁସାରେ ନିଷ୍କାସନ, ଜଳସେଚନ ଓ ପୋଷକ ପରିଚାଳନା କରନ୍ତୁ।",
            weather: "ପାଣିପାଗ ପରିସ୍ଥିତିକୁ ଧ୍ୟାନରେ ରଖି ନିରୀକ୍ଷଣ କରନ୍ତୁ ଏବଂ କ୍ଷେତର ସ୍ଥିତି ଅନୁସାରେ ଜଳସେଚନ ବଦଳାନ୍ତୁ।",
            temperature: "ତାପମାତ୍ରା ସ୍ଥିତିକୁ ନିରୀକ୍ଷଣ କରନ୍ତୁ ଏବଂ ଆବଶ୍ୟକତା ଅନୁସାରେ ଫସଲର ଯତ୍ନ ବଦଳାନ୍ତୁ।",
            moisture: "ଆର୍ଦ୍ରତା ଓ ବର୍ଷାର ସ୍ଥିତିକୁ ନିରୀକ୍ଷଣ କରନ୍ତୁ ଏବଂ ମାଟିର ଆର୍ଦ୍ରତା ଅନୁସାରେ ଜଳସେଚନ ବଦଳାନ୍ତୁ।",
            wind: "ପବନର ସ୍ଥିତିକୁ ନିରୀକ୍ଷଣ କରନ୍ତୁ ଏବଂ ଦୁର୍ବଳ କିମ୍ବା ନୂଆ ଗଛଗୁଡ଼ିକୁ ସୁରକ୍ଷା ଦିଅନ୍ତୁ।",
            water: "ଜଳ ଉପଲବ୍ଧତା {water}। କାର୍ଯ୍ୟକ୍ଷମ ଜଳସେଚନ କରନ୍ତୁ ଏବଂ ଅନାବଶ୍ୟକ ଜଳ ଦେବା ଏଡ଼ାନ୍ତୁ।",
            problem: "ଜଣାଇଥିବା ଫସଲ ସମସ୍ୟା {problem} ପାଇଁ ପ୍ରଭାବିତ ଗଛକୁ ଶୀଘ୍ର ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ସମସ୍ୟା ବଢ଼ିଲେ ସ୍ଥାନୀୟ କୃଷି ବିଶେଷଜ୍ଞଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।",
            general: "ଫସଲର ନିୟମିତ ନିରୀକ୍ଷଣ, ସନ୍ତୁଳିତ ଜଳସେଚନ, ମାଟିର ପୋଷଣ ଓ କୀଟ ନିରୀକ୍ଷଣ ରଖନ୍ତୁ।"
        },

        ml: {
            crop: "വിള {crop} ന്റെ സസ്യാരോഗ്യം പതിവായി നിരീക്ഷിക്കുകയും ശരിയായ ജലസേചനം, പോഷണം, കീടനിയന്ത്രണം എന്നിവ പാലിക്കുകയും ചെയ്യുക.",
            soil: "{soil} മണ്ണിൽ വിളയുടെ ആവശ്യത്തിന് അനുസരിച്ച് നീർവാർച്ച, ജലസേചനം, പോഷകപരിപാലനം എന്നിവ നടത്തുക.",
            weather: "കാലാവസ്ഥാ സാഹചര്യം ശ്രദ്ധാപൂർവ്വം നിരീക്ഷിക്കുകയും വയലിന്റെ അവസ്ഥ അനുസരിച്ച് ജലസേചനം ക്രമീകരിക്കുകയും ചെയ്യുക.",
            temperature: "താപനില നിരീക്ഷിക്കുകയും ആവശ്യത്തിന് വിള പരിപാലനത്തിൽ മാറ്റം വരുത്തുകയും ചെയ്യുക.",
            moisture: "ഈർപ്പവും മഴയും നിരീക്ഷിച്ച് മണ്ണിലെ ഈർപ്പത്തിന് അനുസരിച്ച് ജലസേചനം ക്രമീകരിക്കുക.",
            wind: "കാറ്റിന്റെ സാഹചര്യം നിരീക്ഷിക്കുകയും ദുർബലമായതോ പുതിയതോ ആയ ചെടികളെ സംരക്ഷിക്കുകയും ചെയ്യുക.",
            water: "ജലലഭ്യത {water} ആണ്. കാര്യക്ഷമമായ ജലസേചനം ഉപയോഗിക്കുകയും അനാവശ്യമായി വെള്ളം നൽകുന്നത് ഒഴിവാക്കുകയും ചെയ്യുക.",
            problem: "റിപ്പോർട്ട് ചെയ്ത വിളപ്രശ്നം {problem} സംബന്ധിച്ച് ബാധിച്ച ചെടികൾ നേരത്തെ പരിശോധിക്കുകയും പ്രശ്നം പടർന്നാൽ പ്രാദേശിക കാർഷിക വിദഗ്ധന്റെ ഉപദേശം തേടുകയും ചെയ്യുക.",
            general: "വിളകളെ പതിവായി നിരീക്ഷിച്ച് സമതുലിതമായ ജലസേചനം, മണ്ണിന്റെ പോഷണം, കീടനിയന്ത്രണം എന്നിവ നിലനിർത്തുക."
        },

        pa: {
            crop: "ਫਸਲ {crop} ਲਈ ਪੌਦਿਆਂ ਦੀ ਸਿਹਤ ਦੀ ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਢੁਕਵੀਂ ਸਿੰਚਾਈ, ਪੋਸ਼ਣ ਅਤੇ ਕੀਟ ਪ੍ਰਬੰਧਨ ਬਣਾਈ ਰੱਖੋ।",
            soil: "{soil} ਮਿੱਟੀ ਲਈ ਫਸਲ ਦੀ ਲੋੜ ਅਨੁਸਾਰ ਨਿਕਾਸ, ਸਿੰਚਾਈ ਅਤੇ ਪੋਸ਼ਕ ਪ੍ਰਬੰਧਨ ਕਰੋ।",
            weather: "ਮੌਸਮ ਦੀ ਸਥਿਤੀ ਦੀ ਧਿਆਨ ਨਾਲ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਖੇਤ ਦੀ ਸਥਿਤੀ ਅਨੁਸਾਰ ਸਿੰਚਾਈ ਬਦਲੋ।",
            temperature: "ਤਾਪਮਾਨ ਦੀ ਸਥਿਤੀ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਲੋੜ ਅਨੁਸਾਰ ਫਸਲ ਦੀ ਦੇਖਭਾਲ ਬਦਲੋ।",
            moisture: "ਨਮੀ ਅਤੇ ਮੀਂਹ ਦੀ ਸਥਿਤੀ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਮਿੱਟੀ ਦੀ ਨਮੀ ਅਨੁਸਾਰ ਸਿੰਚਾਈ ਬਦਲੋ।",
            wind: "ਹਵਾ ਦੀ ਸਥਿਤੀ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਕਮਜ਼ੋਰ ਜਾਂ ਨਵੇਂ ਪੌਦਿਆਂ ਦੀ ਸੁਰੱਖਿਆ ਕਰੋ।",
            water: "ਪਾਣੀ ਦੀ ਉਪਲਬਧਤਾ {water} ਹੈ। ਕੁਸ਼ਲ ਸਿੰਚਾਈ ਵਰਤੋ ਅਤੇ ਬੇਲੋੜਾ ਪਾਣੀ ਦੇਣ ਤੋਂ ਬਚੋ।",
            problem: "ਦੱਸੀ ਗਈ ਫਸਲ ਸਮੱਸਿਆ {problem} ਲਈ ਪ੍ਰਭਾਵਿਤ ਪੌਦਿਆਂ ਦੀ ਜਲਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਸਮੱਸਿਆ ਫੈਲਣ 'ਤੇ ਸਥਾਨਕ ਖੇਤੀ ਮਾਹਿਰ ਦੀ ਸਲਾਹ ਲਓ।",
            general: "ਫਸਲਾਂ ਦੀ ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ, ਸੰਤੁਲਿਤ ਸਿੰਚਾਈ, ਮਿੱਟੀ ਦਾ ਪੋਸ਼ਣ ਅਤੇ ਕੀਟ ਨਿਗਰਾਨੀ ਬਣਾਈ ਰੱਖੋ।"
        },

        as: {
            crop: "শস্য {crop}ৰ বাবে গছৰ স্বাস্থ্য নিয়মীয়াকৈ নিৰীক্ষণ কৰক আৰু উপযুক্ত জলসিঞ্চন, পুষ্টি আৰু কীট নিয়ন্ত্ৰণ বজাই ৰাখক।",
            soil: "{soil} মাটিৰ বাবে শস্যৰ প্ৰয়োজন অনুসৰি নিষ্কাশন, জলসিঞ্চন আৰু পুষ্টি ব্যৱস্থাপনা কৰক।",
            weather: "বতৰৰ পৰিস্থিতি সাৱধানে নিৰীক্ষণ কৰক আৰু পথাৰৰ অৱস্থা অনুসৰি জলসিঞ্চন সলনি কৰক।",
            temperature: "উষ্ণতাৰ পৰিস্থিতি নিৰীক্ষণ কৰক আৰু প্ৰয়োজন অনুসৰি শস্যৰ যত্ন সলনি কৰক।",
            moisture: "আৰ্দ্ৰতা আৰু বৰষুণৰ পৰিস্থিতি নিৰীক্ষণ কৰক আৰু মাটিৰ আৰ্দ্ৰতা অনুসৰি জলসিঞ্চন সলনি কৰক।",
            wind: "বতাহৰ পৰিস্থিতি নিৰীক্ষণ কৰক আৰু দুৰ্বল বা নতুন গছ সুৰক্ষিত কৰক।",
            water: "পানীৰ উপলব্ধতা {water}। দক্ষ জলসিঞ্চন ব্যৱহাৰ কৰক আৰু অপ্ৰয়োজনীয় পানী দিয়া এৰাই চলক।",
            problem: "জনোৱা শস্য সমস্যাৰ {problem} বাবে আক্ৰান্ত গছ সোনকালে পৰীক্ষা কৰক আৰু সমস্যা বিয়পিলে স্থানীয় কৃষি বিশেষজ্ঞৰ পৰামৰ্শ লওক।",
            general: "শস্যৰ নিয়মীয়া নিৰীক্ষণ, সুষম জলসিঞ্চন, মাটিৰ পুষ্টি আৰু কীট নিৰীক্ষণ বজাই ৰাখক।"
        },

        mai: {
            crop: "फसल {crop} लेल पौधाक स्वास्थ्यक नियमित निगरानी करू आ उचित सिंचाइ, पोषण आ कीट प्रबंधन कायम राखू।",
            soil: "{soil} माटिक लेल फसलक जरूरत अनुसार जल निकासी, सिंचाइ आ पोषक प्रबंधन करू।",
            weather: "मौसमक स्थिति पर ध्यान सँ निगरानी करू आ खेतक स्थिति अनुसार सिंचाइ समायोजित करू।",
            temperature: "तापमानक स्थिति पर निगरानी करू आ जरूरत अनुसार फसलक देखभाल मे बदलाव करू।",
            moisture: "नमी आ वर्षाक स्थिति पर निगरानी करू आ माटिक नमी अनुसार सिंचाइ समायोजित करू।",
            wind: "हावाक स्थिति पर निगरानी करू आ कमजोर वा नव पौधाक सुरक्षा करू।",
            water: "पानीक उपलब्धता {water} अछि। कुशल सिंचाइ अपनाउ आ अनावश्यक पानी देब सँ बचू।",
            problem: "बताओल फसल समस्या {problem} लेल प्रभावित पौधाक शीघ्र जाँच करू आ समस्या बढ़ला पर स्थानीय कृषि विशेषज्ञ सँ सलाह लिअ।",
            general: "फसलक नियमित निगरानी, संतुलित सिंचाइ, माटिक पोषण आ कीट निगरानी कायम राखू।"
        },

        sa: {
            crop: "फसलस्य {crop} आरोग्यं नियमितं निरीक्षत तथा उचितं सिञ्चनं, पोषणं, कीटप्रबन्धनं च धारयत।",
            soil: "{soil} मृत्तिकायां फसलस्य आवश्यकतानुसार जलनिकासं, सिञ्चनं, पोषकद्रव्यप्रबन्धनं च कुरुत।",
            weather: "वायुमण्डलीयस्थितिं सावधानतया निरीक्षत तथा क्षेत्रस्य स्थित्यानुसारं सिञ्चनं परिवर्तयत।",
            temperature: "तापमानस्य स्थितिं निरीक्षत तथा आवश्यकतानुसारं फसलस्य संरक्षणं परिवर्तयत।",
            moisture: "आर्द्रतां वर्षां च निरीक्षत तथा मृत्तिकायाः आर्द्रतानुसारं सिञ्चनं समायोजयत।",
            wind: "वायोः स्थितिं निरीक्षत तथा दुर्बलान् नवपादपान् च रक्षत।",
            water: "जलस्य उपलब्धता {water} अस्ति। कार्यक्षमं सिञ्चनं प्रयुञ्जत तथा अनावश्यकं जलदानं मा कुरुत।",
            problem: "उक्तफसलसमस्यायाः {problem} कृते प्रभावितानां पादपानां शीघ्रं परीक्षणं कुरुत तथा समस्या प्रसरेत् चेत् स्थानीयकृषिविशेषज्ञस्य परामर्शं गृह्णीत।",
            general: "फसलस्य नियमितं निरीक्षणं, संतुलितं सिञ्चनं, मृत्तिकापोषणं, कीटनिरीक्षणं च धारयत।"
        },

        ne: {
            crop: "बाली {crop} का लागि बिरुवाको स्वास्थ्य नियमित रूपमा निगरानी गर्नुहोस् र उचित सिँचाइ, पोषण तथा कीरा व्यवस्थापन कायम राख्नुहोस्।",
            soil: "{soil} माटोका लागि बालीको आवश्यकताअनुसार निकास, सिँचाइ र पोषक व्यवस्थापन गर्नुहोस्।",
            weather: "मौसमको अवस्थालाई ध्यानपूर्वक निगरानी गर्नुहोस् र खेतको अवस्थाअनुसार सिँचाइ समायोजन गर्नुहोस्।",
            temperature: "तापक्रमको अवस्था निगरानी गर्नुहोस् र आवश्यकताअनुसार बालीको हेरचाह परिवर्तन गर्नुहोस्।",
            moisture: "आर्द्रता र वर्षाको अवस्था निगरानी गर्नुहोस् र माटोको आर्द्रताअनुसार सिँचाइ समायोजन गर्नुहोस्।",
            wind: "हावाको अवस्था निगरानी गर्नुहोस् र कमजोर वा नयाँ बिरुवाहरूलाई सुरक्षित राख्नुहोस्।",
            water: "पानीको उपलब्धता {water} छ। प्रभावकारी सिँचाइ प्रयोग गर्नुहोस् र अनावश्यक पानी नदिनुहोस्।",
            problem: "उल्लेख गरिएको बाली समस्या {problem} का लागि प्रभावित बिरुवा छिटो जाँच गर्नुहोस् र समस्या फैलियो भने स्थानीय कृषि विशेषज्ञसँग सल्लाह लिनुहोस्।",
            general: "बालीको नियमित निगरानी, सन्तुलित सिँचाइ, माटोको पोषण र कीरा निगरानी कायम राख्नुहोस्।"
        },

        kok: {
            crop: "पिक {crop} खातीर झाडांचें आरोग्य नियमित तपासात आनी योग्य सिंचन, पोषण आनी किड व्यवस्थापन दवरात।",
            soil: "{soil} मातये खातीर पिकाच्या गरजे प्रमाणें निचरा, सिंचन आनी पोषक व्यवस्थापन करात।",
            weather: "हवामानाची स्थिती नीट तपासात आनी शेताच्या स्थिती प्रमाणें सिंचन बदलात।",
            temperature: "तापमानाची स्थिती तपासात आनी गरजे प्रमाणें पिकाची काळजी बदलात।",
            moisture: "ओलावो आनी पावसाची स्थिती तपासात आनी मातयेच्या ओलाव्या प्रमाणें सिंचन बदलात।",
            wind: "वाऱ्याची स्थिती तपासात आनी दुबळ्या वा नव्या झाडांचें संरक्षण करात।",
            water: "उदकाची उपलब्धता {water} आसा. कार्यक्षम सिंचन वापरात आनी अनावश्यक उदक दिवप टाळात।",
            problem: "कळयल्ल्या पिकाच्या समस्या {problem} खातीर बाधीत झाडांची लवकर तपासणी करात आनी समस्या वाडली जाल्यार स्थानिक कृषी तज्ञाचो सल्लो घेवात।",
            general: "पिकांचें नियमित निरीक्षण, संतुलित सिंचन, मातयेचें पोषण आनी किड निरीक्षण दवरात।"
        },

        mni: {
            crop: "ꯈꯨꯠꯂꯥꯏ {crop} ꯒꯤ ꯁꯤꯅꯥꯏꯒꯤ ꯐꯤꯕꯝ ꯅꯤꯌꯃꯤꯠ ꯌꯦꯡꯕꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯆꯥꯅꯥ ꯅꯨꯡꯁꯤꯠ, ꯄꯣꯁꯅ ꯑꯃꯁꯨꯡ ꯄꯨꯟꯁꯤ ꯅꯤꯌꯟꯇ꯭ꯔꯣꯜ ꯇꯧꯕꯤꯌꯨ।",
            soil: "{soil} ꯃꯇꯝꯒꯤ ꯈꯨꯠꯂꯥꯏ ꯒꯤ ꯅꯨꯡꯁꯤꯠ, ꯆꯥꯅꯥ ꯑꯃꯁꯨꯡ ꯄꯣꯁꯅ ꯃꯇꯝ ꯆꯥꯅꯥ ꯇꯧꯕꯤꯌꯨ।",
            weather: "ꯍꯧꯖꯤꯛꯀꯤ ꯃꯇꯝꯒꯤ ꯐꯤꯕꯝ ꯌꯦꯡꯕꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯂꯥꯏꯁꯤꯡꯒꯤ ꯐꯤꯕꯝꯒꯤ ꯃꯊꯛꯇꯥ ꯅꯨꯡꯁꯤꯠ ꯁꯣꯡꯒꯠꯄꯤꯌꯨ।",
            temperature: "ꯊꯥꯡꯖꯤꯟꯒꯤ ꯐꯤꯕꯝ ꯌꯦꯡꯕꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯃꯇꯝ ꯆꯥꯅꯥ ꯈꯨꯠꯂꯥꯏ ꯂꯥꯏꯁꯤꯡ ꯂꯩꯍꯧ।",
            moisture: "ꯅꯨꯡꯁꯤꯠ ꯑꯃꯁꯨꯡ ꯃꯇꯝꯒꯤ ꯐꯤꯕꯝ ꯌꯦꯡꯕꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯃꯇꯝꯒꯤ ꯅꯨꯡꯁꯤꯠ ꯒꯤ ꯃꯊꯛꯇꯥ ꯅꯨꯡꯁꯤꯠ ꯁꯣꯡꯒꯠꯄꯤꯌꯨ।",
            wind: "ꯋꯥꯏꯅꯒꯤ ꯐꯤꯕꯝ ꯌꯦꯡꯕꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯂꯩꯍꯧꯕꯥ ꯑꯃꯁꯨꯡ ꯅꯨꯄꯤ ꯁꯤꯅꯥꯏꯁꯤꯡꯗꯥ ꯑꯀꯣꯏꯕꯥ ꯄꯤꯔꯤꯌꯨ।",
            water: "ꯅꯨꯡꯁꯤꯠ ꯂꯩꯕꯒꯤ ꯐꯤꯕꯝ {water} ꯑꯣꯏ। ꯅꯨꯡꯁꯤꯠ ꯇꯥꯡꯊꯣꯛꯄ ꯑꯃꯁꯨꯡ ꯑꯅꯥꯏꯕ ꯅꯨꯡꯁꯤꯠ ꯄꯤꯕ ꯇꯥꯖꯕꯤꯌꯨ।",
            problem: "ꯄꯤꯔꯤꯕ ꯈꯨꯠꯂꯥꯏ ꯁꯝꯁ꯭ꯌꯥ {problem} ꯒꯤ ꯃꯊꯛꯇꯥ ꯄꯨꯟꯁꯤꯡ ꯌꯦꯡꯕꯥ ꯊꯣꯛꯄꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯁꯝꯁ꯭ꯌꯥ ꯍꯦꯟꯅꯥ ꯆꯥꯡꯕꯗꯤ ꯂꯣꯀꯜ ꯀ꯭ꯔꯤꯁꯤ ꯑꯦꯛꯁꯄꯔꯠꯇꯥ ꯅꯥꯀꯟꯅꯕꯤꯌꯨ।",
            general: "ꯈꯨꯠꯂꯥꯏ ꯅꯤꯌꯃꯤꯠ ꯌꯦꯡꯕꯥ, ꯁꯣꯝꯁꯤꯠ ꯅꯥꯡꯁꯤꯠ, ꯃꯇꯝꯒꯤ ꯄꯣꯁꯅ ꯑꯃꯁꯨꯡ ꯄꯨꯟꯁꯤ ꯌꯦꯡꯕꯥ ꯂꯩꯍꯧ।"
        },

        doi: {
            crop: "फसल {crop} आस्तै पौधें दी सेहत दी नियमित निगरानी करो ते उचित सिंचाई, पोषण ते कीड़ प्रबंधन बनाए रखो।",
            soil: "{soil} मिट्टी आस्तै फसल दी लोड़ मताबक निकास, सिंचाई ते पोषक प्रबंधन करो।",
            weather: "मौजूदा मौसम दी स्थिति दी निगरानी करो ते खेत दी हालत मताबक सिंचाई च बदलाव करो।",
            temperature: "तापमान दी स्थिति दी निगरानी करो ते लोड़ मताबक फसल दी देखभाल बदलो।",
            moisture: "नमी ते बरसात दी स्थिति दी निगरानी करो ते मिट्टी दी नमी मताबक सिंचाई बदलो।",
            wind: "हवा दी स्थिति दी निगरानी करो ते कमजोर जां नमें पौधें दी सुरक्षा करो।",
            water: "पानी दी उपलब्धता {water} ऐ। कुशल सिंचाई बरतो ते गैर-जरूरी पानी देना छड्डो।",
            problem: "दस्सी गेई फसल समस्या {problem} आस्तै प्रभावित पौधें दी जल्दी जांच करो ते समस्या फैलने पर स्थानीय कृषि माहिर दी सलाह लैओ।",
            general: "फसल दी नियमित निगरानी, संतुलित सिंचाई, मिट्टी दा पोषण ते कीड़ निगरानी बनाए रखो।"
        },

        brx: {
            crop: "फसल {crop} नि गोरलायनायखौ नेयामित गोरलायनाय माव आरो थिग सिञ्चन, पुस्टि आरो फिसा दमन थायो।",
            soil: "{soil} हाग्रा नि फसलनि गोनांथिखौ नायबिजिरनाय सिञ्चन आरो पुस्टि माव।",
            weather: "हावानि थाखोखौ गोरलायनाय माव आरो हाग्रानि थाखो अनुसार सिञ्चन सोलाय।",
            temperature: "थांखोनि थाखोखौ गोरलायनाय माव आरो गोनांथिआव फसलनि नायनाय सोलाय।",
            moisture: "नोनो आरो बरसुनि थाखोखौ गोरलायनाय माव आरो हाग्रानि नोनो अनुसार सिञ्चन सोलाय।",
            wind: "सांनि थाखोखौ गोरलायनाय माव आरो दुबल फसलखौ रैखाथि हो।",
            water: "दैनि फिसा {water}। गोरलायनाय सिञ्चन बाहाय आरो नांगौ नङा दै होनायखौ थां।",
            problem: "फसलनि समस्या {problem} थाखाय गोसो गोनां फसलखौ गोरलायनाय आरो समस्या जाबायब्ला स्थानिय कृषि एक्सपर्टनि सोलाय।",
            general: "फसलनि गोरलायनाय, संतुलित सिञ्चन, हाग्रानि पुस्टि आरो फिसा गोरलायनायखौ थायो।"
        },

        sat: {
            crop: "फसल {crop} रे गाछ रोयाक् आरोग्य रे नेयामित नजर राखाव आं ठिक जलसिंचन, पुस्टि आर कीट नियंत्रण कायम राखाव।",
            soil: "{soil} माटी लागित फसल रे जोनोड़ाक् अनुसार जल निकासी, जलसिंचन आर पुस्टि प्रबंधन मे।",
            weather: "हावायाक् अवस्था रे नेयामित नजर राखाव आर खेत रे अवस्था अनुसार जलसिंचन बदलाव।",
            temperature: "तापमान अवस्था रे नजर राखाव आर दारकार अनुसार फसल रे देखभाल बदलाव।",
            moisture: "आर्द्रता आर गाजाक् अवस्था रे नजर राखाव आर माटी रे आर्द्रता अनुसार जलसिंचन बदलाव।",
            wind: "हावा अवस्था रे नजर राखाव आर दुबुल गाछ को राकाब।",
            water: "दा उपलब्धता {water}। कुसल जलसिंचन बेभाराव आर बानावटी दा देनाय बाचाव।",
            problem: "काथा काना फसल समस्या {problem} लागित आक्रान्त गाछ को चेक कराव आर समस्या बाड़ले स्थानीय कृषि बिसेसग्य रे सलाह लाव।",
            general: "फसल रे नेयामित नजर, संतुलित जलसिंचन, माटी पुस्टि आर कीट नजर कायम राखाव।"
        },

        ks: {
            crop: "فصل {crop} خٲطرٕ پودن ہٕند صحت باقاعدٕ نگرٲنی کٔرِو تہٕ مناسب آبپاشی، غذا تہٕ کیٖڑٕ انتظام برقرار تھاوِو۔",
            soil: "{soil} مٹی خٲطرٕ فصلہِ ضرورت مُطابق نکاسی، آبپاشی تہٕ غذٲی انتظام کٔرِو۔",
            weather: "موسمی حالتہِ نزدیٖک نگرٲنی کٔرِو تہٕ کھیتہِ حالت مُطابق آبپاشی بدلٲوِو۔",
            temperature: "درجہ حرارتہِ نگرٲنی کٔرِو تہٕ ضرورت مُطابق فصلہِ دیکھ بھال بدلٲوِو۔",
            moisture: "نمی تہٕ بارش ہُنٛد حال چیک کٔرِو تہٕ مٹی ہٕند نمی مُطابق آبپاشی بدلٲوِو۔",
            wind: "ہوا ہٕند حال چیک کٔرِو تہٕ کمزور یا نوٕ پودن ہٕند حفاظت کٔرِو۔",
            water: "پٲنۍ ہُنٛد دستیٲبی {water} چھِ۔ مؤثر آبپاشی کٔرِو تہٕ غیر ضروری پٲنۍ دِنہٕ پٲٹھۍ بچٲوِو۔",
            problem: "بیان کٔرِمُت فصلہِ مسئلہٕ {problem} خٲطرٕ متاثر پودن ہٕند جلد معائنہ کٔرِو تہٕ مسئلہٕ پھیلِ تہٕ مقامی زرعی ماہرَس سۭتۍ مشورٕ کٔرِو۔",
            general: "فصلہِ باقاعدٕ نگرٲنی، متوازن آبپاشی، مٹی ہُنٛد غذٲی انتظام تہٕ کیٖڑٕ نگرٲنی برقرار تھاوِو۔"
        }
    };

    const cropProblemPlaceholders = {
        en: "Example: yellow leaves, fungal spots, insects...",
        hi: "उदाहरण: पीले पत्ते, फंगल समस्या, कीड़े...",
        bn: "উদাহরণ: হলুদ পাতা, ছত্রাকের সমস্যা, পোকা...",
        mr: "उदाहरण: पिवळी पाने, बुरशीची समस्या, कीड...",
        te: "ఉదాహరణ: పసుపు ఆకులు, శిలీంధ్ర సమస్య, పురుగులు...",
        ta: "உதாரணம்: மஞ்சள் இலைகள், பூஞ்சை பிரச்சனை, பூச்சிகள்...",
        gu: "ઉદાહરણ: પીળા પાંદડા, ફૂગની સમસ્યા, જીવાત...",
        ur: "مثال: پیلے پتے، فنگس، کیڑے...",
        kn: "ಉದಾಹರಣೆ: ಹಳದಿ ಎಲೆಗಳು, ಶಿಲೀಂಧ್ರ ಸಮಸ್ಯೆ, ಕೀಟಗಳು...",
        or: "ଉଦାହରଣ: ହଳଦିଆ ପତ୍ର, ଫଙ୍ଗସ୍ ସମସ୍ୟା, କୀଟ...",
        ml: "ഉദാഹരണം: മഞ്ഞ ഇലകൾ, ഫംഗസ് പ്രശ്നം, കീടങ്ങൾ...",
        pa: "ਉਦਾਹਰਨ: ਪੀਲੇ ਪੱਤੇ, ਫੰਗਸ ਸਮੱਸਿਆ, ਕੀੜੇ...",
        as: "উদাহৰণ: হালধীয়া পাত, ভেঁকুৰৰ সমস্যা, পোক-পৰুৱা...",
        mai: "उदाहरण: पीयर पात, फंगस समस्या, कीड़ा...",
        sa: "उदाहरणम्: पीतानि पत्राणि, कवकसमस्या, कीटाः...",
        ne: "उदाहरण: पहेँला पात, ढुसी समस्या, कीरा...",
        kok: "उदाहरण: पिवळी पानां, फंगस समस्या, किडे...",
        mni: "ꯑꯣꯏꯅ: ꯂꯣꯏ ꯄꯥꯠ, ꯐꯨꯡꯒꯁ ꯁꯝꯁ꯭ꯌꯥ, ꯄꯨꯟꯁꯤ...",
        doi: "मिसाल: पीले पत्ते, फंगस समस्या, कीड़...",
        brx: "जेरै: गोजोन पाता, फंगस समस्या, फिसा...",
        sat: "उदाहरण: सार्दी पात, फंगस समस्या, कीट...",
        ks: "مثال: زرد پَتہٕ، فنگس مسئلہٕ، کیٖڑٕ..."
    };

    const getText = (key, fallback) => {
        const value = t(key);

        if (!value || value === key) {
            return fallback;
        }

        return value;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setAdvisory(null);

        if (!form.cropName.trim() || !form.soilType.trim()) {
            setError(
                getText(
                    "cropAndSoilRequired",
                    "Please enter crop name and soil type."
                )
            );
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/advisory",
                {
                    cropName: form.cropName.trim(),
                    soilType: form.soilType.trim(),
                    weather: form.weather,
                    temperature: form.temperature,
                    humidity: form.humidity,
                    precipitation: form.precipitation,
                    windSpeed: form.windSpeed,
                    waterAvailability: form.waterAvailability,
                    cropProblem: form.cropProblem
                }
            );

            if (response.data?.success) {
                setAdvisory(response.data.advisory);
            } else {
                setError(
                    getText(
                        "advisoryFailed",
                        "Unable to generate advisory."
                    )
                );
            }
        } catch (err) {
            console.error(err);

            setError(
                getText(
                    "advisoryServerError",
                    "Unable to connect to the advisory server."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const getRecommendationType = (code) => {
        if (
            [
                "tomato",
                "rice",
                "potato",
                "onion",
                "carrot"
            ].includes(code)
        ) {
            return "crop";
        }

        if (code.startsWith("soil")) {
            return "soil";
        }

        if (code.startsWith("weather")) {
            return "weather";
        }

        if (code.startsWith("temperature")) {
            return "temperature";
        }

        if (
            code.startsWith("humidity") ||
            code.startsWith("rain")
        ) {
            return "moisture";
        }

        if (code.startsWith("wind")) {
            return "wind";
        }

        if (code.startsWith("water")) {
            return "water";
        }

        if (code === "cropProblem") {
            return "problem";
        }

        return "general";
    };

    const getLocalizedValue = (type, value) => {
        if (!value) {
            return getText(
                "notProvided",
                "Not provided"
            );
        }

        const keyMap = {
            sandy: "soilSandy",
            clay: "soilClay",
            loamy: "soilLoamy",
            black: "soilBlack",
            red: "soilRed",

            Sunny: "weatherSunny",
            Cloudy: "weatherCloudy",
            Rainy: "weatherRainy",

            Good: "waterGood",
            High: "waterGood",
            Limited: "waterLimited",
            Low: "waterLow"
        };

        if (type === "soil") {
            const key = keyMap[value.toLowerCase()];

            if (key) {
                return cleanTranslation(t(key), value);
            }
        }

        if (type === "weather") {
            const key = keyMap[value];

            if (key) {
                return cleanTranslation(t(key), value);
            }
        }

        if (type === "water") {
            const key = keyMap[value];

            if (key) {
                return cleanTranslation(t(key), value);
            }
        }

        return value;
    };

    const cleanTranslation = (value, fallback) => {
        if (!value || value.startsWith("soil")) {
            return fallback;
        }

        return value
            .replace(/\s*\([^)]*\)/g, "")
            .trim();
    };

    const getLocalizedCropName = (crop) => {
        if (!crop) return "";

        try {
            const translated = tCrop(crop);

            if (
                translated &&
                translated !== crop
            ) {
                return translated;
            }
        } catch {
            // Keep original crop name if tCrop is unavailable.
        }

        return crop;
    };

    const getRecommendationText = (code) => {
        const translations =
            advisoryTranslations[language] ||
            advisoryTranslations.en;

        const type = getRecommendationType(code);

        let template = translations[type];

        if (!template) {
            template =
                advisoryTranslations.en[type];
        }

        if (type === "crop") {
            return template.replace(
                "{crop}",
                getLocalizedCropName(
                    advisory?.cropName
                )
            );
        }

        if (type === "soil") {
            return template.replace(
                "{soil}",
                getLocalizedValue(
                    "soil",
                    advisory?.soilType
                )
            );
        }

        if (type === "water") {
            return template.replace(
                "{water}",
                getLocalizedValue(
                    "water",
                    advisory?.waterAvailability
                )
            );
        }

        if (type === "problem") {
            return template.replace(
                "{problem}",
                advisory?.cropProblem ||
                    getText(
                        "none",
                        "None"
                    )
            );
        }

        return template;
    };

    const getRecommendationCodes = () => {
        if (
            advisory?.recommendationCodes &&
            Array.isArray(
                advisory.recommendationCodes
            )
        ) {
            return advisory.recommendationCodes;
        }

        if (
            advisory?.recommendations &&
            Array.isArray(advisory.recommendations)
        ) {
            return advisory.recommendations.map(
                () => "general"
            );
        }

        return [];
    };

    return (
        <div className="container py-5">

            {/* PAGE HEADER */}
            <div className="text-center mb-5">

                <div
                    className="display-5 fw-bold"
                    style={{
                        color: "#198754"
                    }}
                >
                    🌱{" "}
                    {getText(
                        "cropAdvisory",
                        "Crop Advisory"
                    )}
                </div>

                <p className="text-muted mt-2">
                    {getText(
                        "cropAdvisoryDescription",
                        "Get simple crop guidance based on your crop, soil, weather and water conditions."
                    )}
                </p>

            </div>

            {/* ERROR */}
            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* FORM */}
            <div className="card border-0 shadow-sm mb-5">

                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                        🌾{" "}
                        {getText(
                            "advisoryInput",
                            "Crop Information"
                        )}
                    </h4>

                    <form onSubmit={handleSubmit}>

                        <div className="row g-4">

                            {/* CROP NAME - TEXT INPUT */}
                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "cropName",
                                        "Crop Name"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="cropName"
                                    value={form.cropName}
                                    onChange={handleChange}
                                    placeholder={getText(
                                        "enterCropName",
                                        "Enter crop name"
                                    )}
                                    required
                                />

                            </div>

                            {/* SOIL TYPE - TEXT INPUT */}
                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "soilType",
                                        "Soil Type"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="soilType"
                                    value={form.soilType}
                                    onChange={handleChange}
                                    placeholder={getText(
                                        "enterSoilType",
                                        "Enter soil type"
                                    )}
                                    required
                                />

                            </div>

                            {/* WEATHER */}
                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "weather",
                                        "Weather"
                                    )}
                                </label>

                                <select
                                    className="form-select"
                                    name="weather"
                                    value={form.weather}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        {getText(
                                            "selectWeather",
                                            "Select Weather"
                                        )}
                                    </option>

                                    <option value="Sunny">
                                        ☀️{" "}
                                        {getText(
                                            "weatherSunny",
                                            "Sunny"
                                        )}
                                    </option>

                                    <option value="Cloudy">
                                        ☁️{" "}
                                        {getText(
                                            "weatherCloudy",
                                            "Cloudy"
                                        )}
                                    </option>

                                    <option value="Rainy">
                                        🌧️{" "}
                                        {getText(
                                            "weatherRainy",
                                            "Rainy"
                                        )}
                                    </option>

                                </select>

                            </div>

                            {/* TEMPERATURE */}
                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "temperature",
                                        "Temperature (°C)"
                                    )}
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="temperature"
                                    value={
                                        form.temperature
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. 32"
                                />

                            </div>

                            {/* HUMIDITY */}
                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "humidity",
                                        "Humidity (%)"
                                    )}
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="humidity"
                                    value={form.humidity}
                                    onChange={handleChange}
                                    placeholder="e.g. 70"
                                />

                            </div>

                            {/* RAINFALL */}
                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "precipitation",
                                        "Rainfall (mm)"
                                    )}
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="precipitation"
                                    value={
                                        form.precipitation
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. 5"
                                />

                            </div>

                            {/* WIND */}
                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "windSpeed",
                                        "Wind Speed (km/h)"
                                    )}
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="windSpeed"
                                    value={
                                        form.windSpeed
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. 12"
                                />

                            </div>

                            {/* WATER */}
                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "waterAvailability",
                                        "Water Availability"
                                    )}
                                </label>

                                <select
                                    className="form-select"
                                    name="waterAvailability"
                                    value={
                                        form.waterAvailability
                                    }
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        {getText(
                                            "selectWaterAvailability",
                                            "Select Water Availability"
                                        )}
                                    </option>

                                    <option value="Good">
                                        💧{" "}
                                        {getText(
                                            "waterGood",
                                            "Good"
                                        )}
                                    </option>

                                    <option value="Limited">
                                        💧{" "}
                                        {getText(
                                            "waterLimited",
                                            "Limited"
                                        )}
                                    </option>

                                    <option value="Low">
                                        💧{" "}
                                        {getText(
                                            "waterLow",
                                            "Low"
                                        )}
                                    </option>

                                </select>

                            </div>

                            {/* CROP PROBLEM */}
                            <div className="col-12">

                                <label className="form-label fw-semibold">
                                    {getText(
                                        "cropProblem",
                                        "Crop Problem"
                                    )}
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="cropProblem"
                                    value={
                                        form.cropProblem
                                    }
                                    onChange={handleChange}
                                    placeholder={
                                        cropProblemPlaceholders[
                                            language
                                        ] ||
                                        cropProblemPlaceholders.en
                                    }
                                />

                            </div>

                            {/* SUBMIT */}
                            <div className="col-12 text-center">

                                <button
                                    type="submit"
                                    className="btn btn-success px-5 py-2"
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            />

                                            {getText(
                                                "generatingAdvisory",
                                                "Generating Advisory..."
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            🌱{" "}
                                            {getText(
                                                "getAdvisory",
                                                "Get Crop Advisory"
                                            )}
                                        </>
                                    )}

                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

            {/* RESULT */}
            {advisory && (
                <div className="card border-0 shadow-sm">

                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

                            <div>

                                <h3 className="fw-bold mb-1">
                                    🌱{" "}
                                    {getText(
                                        "advisoryResults",
                                        "Advisory Results"
                                    )}
                                </h3>

                                <p className="text-muted mb-0">
                                    {getText(
                                        "personalizedGuidance",
                                        "Personalized guidance for your crop"
                                    )}
                                </p>

                            </div>

                            <span className="badge bg-success fs-6 px-3 py-2">
                                {getLocalizedCropName(
                                    advisory.cropName
                                )}
                            </span>

                        </div>

                        {/* SUMMARY */}
                        <div className="row g-3 mb-4">

                            <div className="col-md-3">

                                <div className="bg-light rounded p-3 h-100">

                                    <small className="text-muted">
                                        {getText(
                                            "cropName",
                                            "Crop"
                                        )}
                                    </small>

                                    <div className="fw-bold mt-1">
                                        {getLocalizedCropName(
                                            advisory.cropName
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-3">

                                <div className="bg-light rounded p-3 h-100">

                                    <small className="text-muted">
                                        {getText(
                                            "soilType",
                                            "Soil"
                                        )}
                                    </small>

                                    <div className="fw-bold mt-1">
                                        {getLocalizedValue(
                                            "soil",
                                            advisory.soilType
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-3">

                                <div className="bg-light rounded p-3 h-100">

                                    <small className="text-muted">
                                        {getText(
                                            "weather",
                                            "Weather"
                                        )}
                                    </small>

                                    <div className="fw-bold mt-1">
                                        {getLocalizedValue(
                                            "weather",
                                            advisory.weather
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-3">

                                <div className="bg-light rounded p-3 h-100">

                                    <small className="text-muted">
                                        {getText(
                                            "waterAvailability",
                                            "Water"
                                        )}
                                    </small>

                                    <div className="fw-bold mt-1">
                                        {getLocalizedValue(
                                            "water",
                                            advisory.waterAvailability
                                        )}
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RECOMMENDATIONS */}
                        <h5 className="fw-bold mb-3">
                            💡{" "}
                            {getText(
                                "recommendations",
                                "Recommendations"
                            )}
                        </h5>

                        <div className="row g-3">

                            {getRecommendationCodes().length >
                            0 ? (
                                getRecommendationCodes().map(
                                    (code, index) => (
                                        <div
                                            className="col-12"
                                            key={`${code}-${index}`}
                                        >

                                            <div className="alert alert-success border-0 mb-0">

                                                <div className="d-flex align-items-start">

                                                    <span
                                                        className="fs-4 me-3"
                                                        aria-hidden="true"
                                                    >
                                                        🌿
                                                    </span>

                                                    <div>
                                                        {getRecommendationText(
                                                            code
                                                        )}
                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    )
                                )
                            ) : (
                                <div className="col-12">

                                    <div className="alert alert-info">
                                        {getText(
                                            "noRecommendations",
                                            "No recommendations available."
                                        )}
                                    </div>

                                </div>
                            )}

                        </div>

                        {/* EXTRA VALUES */}
                        <div className="row g-3 mt-3">

                            {advisory.temperature !==
                                undefined &&
                                advisory.temperature !==
                                    null &&
                                advisory.temperature !==
                                    "" && (

                                    <div className="col-md-4">

                                        <div className="border rounded p-3">

                                            <small className="text-muted">
                                                {getText(
                                                    "temperature",
                                                    "Temperature"
                                                )}
                                            </small>

                                            <div className="fw-bold">
                                                {
                                                    advisory.temperature
                                                }{" "}
                                                °C
                                            </div>

                                        </div>

                                    </div>
                                )}

                            {advisory.humidity !==
                                undefined &&
                                advisory.humidity !==
                                    null &&
                                advisory.humidity !==
                                    "" && (

                                    <div className="col-md-4">

                                        <div className="border rounded p-3">

                                            <small className="text-muted">
                                                {getText(
                                                    "humidity",
                                                    "Humidity"
                                                )}
                                            </small>

                                            <div className="fw-bold">
                                                {
                                                    advisory.humidity
                                                }{" "}
                                                %
                                            </div>

                                        </div>

                                    </div>
                                )}

                            {advisory.precipitation !==
                                undefined &&
                                advisory.precipitation !==
                                    null &&
                                advisory.precipitation !==
                                    "" && (

                                    <div className="col-md-4">

                                        <div className="border rounded p-3">

                                            <small className="text-muted">
                                                {getText(
                                                    "precipitation",
                                                    "Rainfall"
                                                )}
                                            </small>

                                            <div className="fw-bold">
                                                {
                                                    advisory.precipitation
                                                }{" "}
                                                mm
                                            </div>

                                        </div>

                                    </div>
                                )}

                        </div>

                        {/* NOTE */}
                        <div className="alert alert-light border mt-4 mb-0">

                            ℹ️{" "}

                            {getText(
                                "advisoryPrototypeNote",
                                "This advisory is a prototype and should be combined with local agricultural expert advice."
                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default CropAdvisory;