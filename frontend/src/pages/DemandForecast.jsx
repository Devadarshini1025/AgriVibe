import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

const API_URL = "http://localhost:5000";

const crops = [
    "Tomato",
    "Potato",
    "Onion",
    "Rice",
    "Carrot",
    "Brinjal",
    "Cabbage",
    "Cauliflower",
    "Cucumber",
    "Ladyfinger",
    "Spinach",
    "Wheat",
    "Maize",
    "Groundnut",
    "Banana",
    "Mango",
    "Apple"
];

const states = [
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
    "Maharashtra",
    "Gujarat",
    "Punjab",
    "Haryana",
    "Uttar Pradesh",
    "West Bengal",
    "Odisha",
    "Bihar",
    "Rajasthan",
    "Madhya Pradesh"
];

/*
|--------------------------------------------------------------------------
| Demand Forecast translations
|--------------------------------------------------------------------------
| 23 Indian languages supported
|--------------------------------------------------------------------------
*/

const translations = {
    en: {
        title: "AI Demand Forecast",
        subtitle:
            "Analyze crop demand using AgriVibe marketplace data.",
        selectCrop: "Select Crop",
        selectState: "Select State",
        selectDistrict: "District (Optional)",
        chooseCrop: "Choose a crop",
        allStates: "All States",
        enterDistrict: "Enter district",
        analyzeDemand: "Analyze Demand",
        analyzing: "Analyzing...",
        demandScore: "Demand Score",
        demandLevel: "Demand Level",
        expectedDemand: "Expected Demand",
        currentSupply: "Current Supply",
        totalOrders: "Total Orders",
        historicalDemand: "Historical Ordered Quantity",
        recentDemand: "Recent Demand (30 Days)",
        supplyStatus: "Supply Status",
        recommendation: "Recommendation",
        highDemand: "High Demand",
        mediumDemand: "Medium Demand",
        lowDemand: "Low Demand",
        listCropNow:
            "Demand is strong. Consider listing this crop now.",
        monitorDemand:
            "Demand is moderate. Monitor the market before increasing supply.",
        waitAndMonitor:
            "Demand is currently low. Monitor demand before listing more produce.",
        noSupply: "No active supply",
        insufficientSupply: "Supply may be insufficient",
        highSupply: "Supply is currently high",
        balancedSupply: "Supply is balanced",
        kg: "kg",
        orders: "orders",
        farmerOnly: "Please login as a farmer to access Demand Forecast.",
        error: "Unable to generate demand forecast.",
        noData:
            "Not enough marketplace data is available for this crop yet.",
        transparency:
            "Forecast is calculated using AgriVibe marketplace listings and order activity. It is a prototype estimate, not a guaranteed market prediction.",
        locationFilter: "Location Filters",
        forecastSummary: "Forecast Summary",
        marketplaceData: "Marketplace Data",
        demandAnalysis: "Demand Analysis",
        supplyAnalysis: "Supply Analysis",
        scoreMeaning:
            "Higher scores indicate stronger observed marketplace demand.",
        refresh: "Refresh"
    },

    as: {
        title: "এআই চাহিদা পূৰ্বানুমান",
        subtitle: "এগ্ৰিভাইব বজাৰৰ তথ্য ব্যৱহাৰ কৰি শস্যৰ চাহিদা বিশ্লেষণ কৰক।",
        selectCrop: "শস্য বাছক",
        selectState: "ৰাজ্য বাছক",
        selectDistrict: "জিলা (ঐচ্ছিক)",
        chooseCrop: "শস্য বাছক",
        allStates: "সকলো ৰাজ্য",
        enterDistrict: "জিলাৰ নাম দিয়ক",
        analyzeDemand: "চাহিদা বিশ্লেষণ কৰক",
        analyzing: "বিশ্লেষণ হৈ আছে...",
        demandScore: "চাহিদা স্কোৰ",
        demandLevel: "চাহিদাৰ স্তৰ",
        expectedDemand: "প্ৰত্যাশিত চাহিদা",
        currentSupply: "বৰ্তমান যোগান",
        totalOrders: "মুঠ অৰ্ডাৰ",
        historicalDemand: "ঐতিহাসিক অৰ্ডাৰ পৰিমাণ",
        recentDemand: "শেহতীয়া চাহিদা (৩০ দিন)",
        supplyStatus: "যোগানৰ অৱস্থা",
        recommendation: "পৰামৰ্শ",
        highDemand: "উচ্চ চাহিদা",
        mediumDemand: "মধ্যম চাহিদা",
        lowDemand: "কম চাহিদা",
        listCropNow: "চাহিদা শক্তিশালী। এতিয়াই শস্য তালিকাভুক্ত কৰাৰ কথা বিবেচনা কৰক।",
        monitorDemand: "চাহিদা মধ্যমীয়া। যোগান বৃদ্ধি কৰাৰ আগতে বজাৰ নিৰীক্ষণ কৰক।",
        waitAndMonitor: "বৰ্তমান চাহিদা কম। অধিক শস্য তালিকাভুক্ত কৰাৰ আগতে নিৰীক্ষণ কৰক।",
        noSupply: "কোনো সক্ৰিয় যোগান নাই",
        insufficientSupply: "যোগান অপৰ্যাপ্ত হ'ব পাৰে",
        highSupply: "বৰ্তমান যোগান বেছি",
        balancedSupply: "যোগান সন্তুলিত",
        kg: "কেজি",
        orders: "অৰ্ডাৰ",
        farmerOnly: "ডিমান্ড ফ'ৰকাষ্ট ব্যৱহাৰ কৰিবলৈ কৃষক হিচাপে লগইন কৰক।",
        error: "চাহিদা পূৰ্বানুমান সৃষ্টি কৰিব পৰা নগ'ল।",
        noData: "এই শস্যৰ বাবে এতিয়াও পৰ্যাপ্ত বজাৰ তথ্য নাই।",
        transparency: "এই পূৰ্বানুমান AgriVibe বজাৰৰ তালিকা আৰু অৰ্ডাৰৰ ওপৰত ভিত্তি কৰি কৰা প্ৰটোটাইপ অনুমান।",
        locationFilter: "স্থান ফিল্টাৰ",
        forecastSummary: "পূৰ্বানুমান সাৰাংশ",
        marketplaceData: "বজাৰ তথ্য",
        demandAnalysis: "চাহিদা বিশ্লেষণ",
        supplyAnalysis: "যোগান বিশ্লেষণ",
        scoreMeaning: "উচ্চ স্কোৰে অধিক শক্তিশালী বজাৰ চাহিদা দেখুৱায়।",
        refresh: "ৰিফ্ৰেশ"
    },

    bn: {
        title: "এআই চাহিদা পূর্বাভাস",
        subtitle: "AgriVibe বাজারের তথ্য ব্যবহার করে ফসলের চাহিদা বিশ্লেষণ করুন।",
        selectCrop: "ফসল নির্বাচন করুন",
        selectState: "রাজ্য নির্বাচন করুন",
        selectDistrict: "জেলা (ঐচ্ছিক)",
        chooseCrop: "একটি ফসল নির্বাচন করুন",
        allStates: "সব রাজ্য",
        enterDistrict: "জেলার নাম লিখুন",
        analyzeDemand: "চাহিদা বিশ্লেষণ করুন",
        analyzing: "বিশ্লেষণ হচ্ছে...",
        demandScore: "চাহিদা স্কোর",
        demandLevel: "চাহিদার স্তর",
        expectedDemand: "প্রত্যাশিত চাহিদা",
        currentSupply: "বর্তমান সরবরাহ",
        totalOrders: "মোট অর্ডার",
        historicalDemand: "ঐতিহাসিক অর্ডারের পরিমাণ",
        recentDemand: "সাম্প্রতিক চাহিদা (৩০ দিন)",
        supplyStatus: "সরবরাহের অবস্থা",
        recommendation: "সুপারিশ",
        highDemand: "উচ্চ চাহিদা",
        mediumDemand: "মাঝারি চাহিদা",
        lowDemand: "কম চাহিদা",
        listCropNow: "চাহিদা শক্তিশালী। এখন ফসল তালিকাভুক্ত করার কথা বিবেচনা করুন।",
        monitorDemand: "চাহিদা মাঝারি। সরবরাহ বাড়ানোর আগে বাজার পর্যবেক্ষণ করুন।",
        waitAndMonitor: "বর্তমান চাহিদা কম। আরও পণ্য তালিকাভুক্ত করার আগে পর্যবেক্ষণ করুন।",
        noSupply: "কোনও সক্রিয় সরবরাহ নেই",
        insufficientSupply: "সরবরাহ অপর্যাপ্ত হতে পারে",
        highSupply: "বর্তমানে সরবরাহ বেশি",
        balancedSupply: "সরবরাহ ভারসাম্যপূর্ণ",
        kg: "কেজি",
        orders: "অর্ডার",
        farmerOnly: "ডিমান্ড ফোরকাস্ট ব্যবহার করতে কৃষক হিসেবে লগইন করুন।",
        error: "চাহিদা পূর্বাভাস তৈরি করা যায়নি।",
        noData: "এই ফসলের জন্য এখনও পর্যাপ্ত বাজার তথ্য নেই।",
        transparency: "এই পূর্বাভাস AgriVibe বাজারের তালিকা ও অর্ডার কার্যকলাপের উপর ভিত্তি করে একটি প্রোটোটাইপ অনুমান।",
        locationFilter: "স্থান ফিল্টার",
        forecastSummary: "পূর্বাভাস সারাংশ",
        marketplaceData: "বাজার তথ্য",
        demandAnalysis: "চাহিদা বিশ্লেষণ",
        supplyAnalysis: "সরবরাহ বিশ্লেষণ",
        scoreMeaning: "উচ্চ স্কোর শক্তিশালী বাজার চাহিদা নির্দেশ করে।",
        refresh: "রিফ্রেশ"
    },

    brx: {
        title: "एआई बिबां नायबिजिरनाय",
        subtitle: "एग्रिभाइब हाथायनि डाटाजों फसलनि बिबां नायबिजिर।",
        selectCrop: "फसल सायख",
        selectState: "रायजो सायख",
        selectDistrict: "जिल्ला (नांगौ नामा)",
        chooseCrop: "फसल सायख",
        allStates: "गासै रायजो",
        enterDistrict: "जिल्लानि मुं लिर",
        analyzeDemand: "बिबां नायबिजिर",
        analyzing: "नायबिजिरगासिनो दं...",
        demandScore: "बिबां स्कोर",
        demandLevel: "बिबांनि थाखो",
        expectedDemand: "मोननो हानाय बिबां",
        currentSupply: "दानि जोगान",
        totalOrders: "गासै अर्डार",
        historicalDemand: "जायगा अर्डार बिबां",
        recentDemand: "गोदान बिबां (३० सान)",
        supplyStatus: "जोगानि थाथाय",
        recommendation: "सुबुं",
        highDemand: "गोजौ बिबां",
        mediumDemand: "मध्यम बिबां",
        lowDemand: "खम बिबां",
        listCropNow: "बिबां गोबां। दानि फसल फारिलाइ खालामनो सान।",
        monitorDemand: "बिबां मध्यम। जोगान बारायनायनि सिगां हाथाय नाय।",
        waitAndMonitor: "दानि बिबां खम। गोबां फसल फारिलाइ खालामनायनि सिगां नाय।",
        noSupply: "जेबो जोगान गैया",
        insufficientSupply: "जोगान खम जानो हागौ",
        highSupply: "दानि जोगान गोबां",
        balancedSupply: "जोगान थारै",
        kg: "केजी",
        orders: "अर्डार",
        farmerOnly: "डिमांड फोरकास्ट थाखाय आबादारि हिसाबै लग-इन खालाम।",
        error: "बिबां फोरकास्ट खालामनो मोनाखै।",
        noData: "बे फसलनि थाखाय दासिमबो गोबां हाथाय डाटा गैया।",
        transparency: "बे फोरकास्ट एग्रिभाइब हाथायनि फसल फारिलाइ आरो अर्डार डाटानि फोसाब।",
        locationFilter: "जायगा फिल्टार",
        forecastSummary: "फोरकास्ट सारांस",
        marketplaceData: "हाथाय डाटा",
        demandAnalysis: "बिबां नायबिजिर",
        supplyAnalysis: "जोगान नायबिजिर",
        scoreMeaning: "गोजौ स्कोर हाथायनि गोबां बिबांखौ दिन्थियो।",
        refresh: "गोदान खालाम"
    },

    doi: {
        title: "एआई मंग पूर्वानुमान",
        subtitle: "AgriVibe बाजार दे आंकड़े कन्नै फसल दी मंग दा विश्लेषण करो।",
        selectCrop: "फसल चुनो",
        selectState: "राज्य चुनो",
        selectDistrict: "जिला (वैकल्पिक)",
        chooseCrop: "फसल चुनो",
        allStates: "सारे राज्य",
        enterDistrict: "जिले दा नां लिखो",
        analyzeDemand: "मंग दा विश्लेषण करो",
        analyzing: "विश्लेषण होआ करदा ऐ...",
        demandScore: "मंग स्कोर",
        demandLevel: "मंग दा स्तर",
        expectedDemand: "उम्मीद कीती मंग",
        currentSupply: "मौजूदा सप्लाई",
        totalOrders: "कुल ऑर्डर",
        historicalDemand: "पिछली ऑर्डर मात्रा",
        recentDemand: "हाल दी मंग (३० दिन)",
        supplyStatus: "सप्लाई दी स्थिति",
        recommendation: "सिफारिश",
        highDemand: "बड़ी मंग",
        mediumDemand: "दरमियानी मंग",
        lowDemand: "घट्ट मंग",
        listCropNow: "मंग मजबूत ऐ। हुन फसल सूची च पाओ।",
        monitorDemand: "मंग दरमियानी ऐ। सप्लाई बदाने थमां पैह्लें बाजार दिक्खो।",
        waitAndMonitor: "हुन मंग घट्ट ऐ। होर फसल सूची च पाने थमां पैह्लें निगरानी करो।",
        noSupply: "कोई चालू सप्लाई नेईं",
        insufficientSupply: "सप्लाई घट्ट होई सकदी ऐ",
        highSupply: "हुन सप्लाई बद्ध ऐ",
        balancedSupply: "सप्लाई संतुलित ऐ",
        kg: "किलो",
        orders: "ऑर्डर",
        farmerOnly: "डिमांड फोरकास्ट आस्तै किसान तौर पर लॉगिन करो।",
        error: "मंग पूर्वानुमान नहीं बनाई सकेआ।",
        noData: "इस फसल आस्तै अजें काफी बाजार आंकड़े नेईं न।",
        transparency: "एह् पूर्वानुमान AgriVibe बाजार सूची ते ऑर्डर गतिविधि उप्पर आधारित प्रोटोटाइप अनुमान ऐ।",
        locationFilter: "स्थान फिल्टर",
        forecastSummary: "पूर्वानुमान सारांश",
        marketplaceData: "बाजार आंकड़े",
        demandAnalysis: "मंग विश्लेषण",
        supplyAnalysis: "सप्लाई विश्लेषण",
        scoreMeaning: "उच्च स्कोर मजबूत बाजार मंग दसदा ऐ।",
        refresh: "रिफ्रेश"
    },

    gu: {
        title: "AI માંગ આગાહી",
        subtitle: "AgriVibe બજારના ડેટાનો ઉપયોગ કરીને પાકની માંગનું વિશ્લેષણ કરો.",
        selectCrop: "પાક પસંદ કરો",
        selectState: "રાજ્ય પસંદ કરો",
        selectDistrict: "જિલ્લો (વૈકલ્પિક)",
        chooseCrop: "પાક પસંદ કરો",
        allStates: "બધા રાજ્યો",
        enterDistrict: "જિલ્લાનું નામ દાખલ કરો",
        analyzeDemand: "માંગનું વિશ્લેષણ કરો",
        analyzing: "વિશ્લેષણ થઈ રહ્યું છે...",
        demandScore: "માંગ સ્કોર",
        demandLevel: "માંગનું સ્તર",
        expectedDemand: "અપેક્ષિત માંગ",
        currentSupply: "વર્તમાન પુરવઠો",
        totalOrders: "કુલ ઓર્ડર",
        historicalDemand: "ઐતિહાસિક ઓર્ડર જથ્થો",
        recentDemand: "તાજેતરની માંગ (30 દિવસ)",
        supplyStatus: "પુરવઠાની સ્થિતિ",
        recommendation: "ભલામણ",
        highDemand: "ઊંચી માંગ",
        mediumDemand: "મધ્યમ માંગ",
        lowDemand: "ઓછી માંગ",
        listCropNow: "માંગ મજબૂત છે. હવે આ પાકની યાદી બનાવવાનું વિચારો.",
        monitorDemand: "માંગ મધ્યમ છે. પુરવઠો વધારતા પહેલા બજારનું નિરીક્ષણ કરો.",
        waitAndMonitor: "હાલની માંગ ઓછી છે. વધુ પાકની યાદી બનાવતા પહેલા નિરીક્ષણ કરો.",
        noSupply: "કોઈ સક્રિય પુરવઠો નથી",
        insufficientSupply: "પુરવઠો અપૂરતો હોઈ શકે છે",
        highSupply: "હાલમાં પુરવઠો વધારે છે",
        balancedSupply: "પુરવઠો સંતુલિત છે",
        kg: "કિગ્રા",
        orders: "ઓર્ડર",
        farmerOnly: "ડિમાન્ડ ફોરકાસ્ટ માટે ખેડૂત તરીકે લોગિન કરો.",
        error: "માંગ આગાહી બનાવી શકાઈ નથી.",
        noData: "આ પાક માટે હજુ પૂરતો બજાર ડેટા ઉપલબ્ધ નથી.",
        transparency: "આ આગાહી AgriVibe બજારની યાદીઓ અને ઓર્ડર પ્રવૃત્તિ પર આધારિત પ્રોટોટાઇપ અંદાજ છે.",
        locationFilter: "સ્થાન ફિલ્ટર",
        forecastSummary: "આગાહી સારાંશ",
        marketplaceData: "બજાર ડેટા",
        demandAnalysis: "માંગ વિશ્લેષણ",
        supplyAnalysis: "પુરવઠા વિશ્લેષણ",
        scoreMeaning: "વધુ સ્કોર વધુ મજબૂત બજાર માંગ દર્શાવે છે.",
        refresh: "રિફ્રેશ"
    },

    hi: {
        title: "AI मांग पूर्वानुमान",
        subtitle: "AgriVibe मार्केटप्लेस डेटा का उपयोग करके फसल की मांग का विश्लेषण करें।",
        selectCrop: "फसल चुनें",
        selectState: "राज्य चुनें",
        selectDistrict: "जिला (वैकल्पिक)",
        chooseCrop: "फसल चुनें",
        allStates: "सभी राज्य",
        enterDistrict: "जिले का नाम दर्ज करें",
        analyzeDemand: "मांग का विश्लेषण करें",
        analyzing: "विश्लेषण हो रहा है...",
        demandScore: "मांग स्कोर",
        demandLevel: "मांग स्तर",
        expectedDemand: "अपेक्षित मांग",
        currentSupply: "वर्तमान आपूर्ति",
        totalOrders: "कुल ऑर्डर",
        historicalDemand: "ऐतिहासिक ऑर्डर मात्रा",
        recentDemand: "हाल की मांग (30 दिन)",
        supplyStatus: "आपूर्ति की स्थिति",
        recommendation: "सिफारिश",
        highDemand: "उच्च मांग",
        mediumDemand: "मध्यम मांग",
        lowDemand: "कम मांग",
        listCropNow: "मांग मजबूत है। अभी इस फसल को सूचीबद्ध करने पर विचार करें।",
        monitorDemand: "मांग मध्यम है। आपूर्ति बढ़ाने से पहले बाजार पर नजर रखें।",
        waitAndMonitor: "वर्तमान मांग कम है। अधिक फसल सूचीबद्ध करने से पहले निगरानी करें।",
        noSupply: "कोई सक्रिय आपूर्ति नहीं",
        insufficientSupply: "आपूर्ति अपर्याप्त हो सकती है",
        highSupply: "वर्तमान में आपूर्ति अधिक है",
        balancedSupply: "आपूर्ति संतुलित है",
        kg: "किग्रा",
        orders: "ऑर्डर",
        farmerOnly: "डिमांड फोरकास्ट के लिए किसान के रूप में लॉगिन करें।",
        error: "मांग पूर्वानुमान तैयार नहीं हो सका।",
        noData: "इस फसल के लिए अभी पर्याप्त बाजार डेटा उपलब्ध नहीं है।",
        transparency: "यह पूर्वानुमान AgriVibe मार्केटप्लेस लिस्टिंग और ऑर्डर गतिविधि पर आधारित प्रोटोटाइप अनुमान है।",
        locationFilter: "स्थान फ़िल्टर",
        forecastSummary: "पूर्वानुमान सारांश",
        marketplaceData: "मार्केटप्लेस डेटा",
        demandAnalysis: "मांग विश्लेषण",
        supplyAnalysis: "आपूर्ति विश्लेषण",
        scoreMeaning: "अधिक स्कोर मजबूत बाजार मांग को दर्शाता है।",
        refresh: "रिफ्रेश"
    },

    kn: {
        title: "AI ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆ",
        subtitle: "AgriVibe ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿಯನ್ನು ಬಳಸಿ ಬೆಳೆ ಬೇಡಿಕೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ.",
        selectCrop: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
        selectState: "ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",
        selectDistrict: "ಜಿಲ್ಲೆ (ಐಚ್ಛಿಕ)",
        chooseCrop: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
        allStates: "ಎಲ್ಲಾ ರಾಜ್ಯಗಳು",
        enterDistrict: "ಜಿಲ್ಲೆಯ ಹೆಸರು ನಮೂದಿಸಿ",
        analyzeDemand: "ಬೇಡಿಕೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
        analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        demandScore: "ಬೇಡಿಕೆ ಸ್ಕೋರ್",
        demandLevel: "ಬೇಡಿಕೆಯ ಮಟ್ಟ",
        expectedDemand: "ನಿರೀಕ್ಷಿತ ಬೇಡಿಕೆ",
        currentSupply: "ಪ್ರಸ್ತುತ ಪೂರೈಕೆ",
        totalOrders: "ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು",
        historicalDemand: "ಐತಿಹಾಸಿಕ ಆರ್ಡರ್ ಪ್ರಮಾಣ",
        recentDemand: "ಇತ್ತೀಚಿನ ಬೇಡಿಕೆ (30 ದಿನಗಳು)",
        supplyStatus: "ಪೂರೈಕೆ ಸ್ಥಿತಿ",
        recommendation: "ಶಿಫಾರಸು",
        highDemand: "ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ",
        mediumDemand: "ಮಧ್ಯಮ ಬೇಡಿಕೆ",
        lowDemand: "ಕಡಿಮೆ ಬೇಡಿಕೆ",
        listCropNow: "ಬೇಡಿಕೆ ಬಲವಾಗಿದೆ. ಈಗ ಈ ಬೆಳೆಯನ್ನು ಪಟ್ಟಿ ಮಾಡಲು ಪರಿಗಣಿಸಿ.",
        monitorDemand: "ಬೇಡಿಕೆ ಮಧ್ಯಮವಾಗಿದೆ. ಪೂರೈಕೆ ಹೆಚ್ಚಿಸುವ ಮೊದಲು ಮಾರುಕಟ್ಟೆಯನ್ನು ಗಮನಿಸಿ.",
        waitAndMonitor: "ಪ್ರಸ್ತುತ ಬೇಡಿಕೆ ಕಡಿಮೆಯಾಗಿದೆ. ಹೆಚ್ಚು ಬೆಳೆ ಪಟ್ಟಿ ಮಾಡುವ ಮೊದಲು ಗಮನಿಸಿ.",
        noSupply: "ಸಕ್ರಿಯ ಪೂರೈಕೆ ಇಲ್ಲ",
        insufficientSupply: "ಪೂರೈಕೆ ಸಾಕಾಗದಿರಬಹುದು",
        highSupply: "ಪ್ರಸ್ತುತ ಪೂರೈಕೆ ಹೆಚ್ಚು",
        balancedSupply: "ಪೂರೈಕೆ ಸಮತೋಲನದಲ್ಲಿದೆ",
        kg: "ಕೆಜಿ",
        orders: "ಆರ್ಡರ್‌ಗಳು",
        farmerOnly: "ಡಿಮಾಂಡ್ ಫೋರ್‌ಕಾಸ್ಟ್ ಬಳಸಲು ರೈತರಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ.",
        error: "ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆಯನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
        noData: "ಈ ಬೆಳೆಗೆ ಇನ್ನೂ ಸಾಕಷ್ಟು ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.",
        transparency: "ಈ ಮುನ್ಸೂಚನೆಯು AgriVibe ಮಾರುಕಟ್ಟೆ ಪಟ್ಟಿಗಳು ಮತ್ತು ಆರ್ಡರ್ ಚಟುವಟಿಕೆಯ ಆಧಾರದ ಮೇಲಿನ ಪ್ರೋಟೋಟೈಪ್ ಅಂದಾಜಾಗಿದೆ.",
        locationFilter: "ಸ್ಥಳ ಫಿಲ್ಟರ್",
        forecastSummary: "ಮುನ್ಸೂಚನೆ ಸಾರಾಂಶ",
        marketplaceData: "ಮಾರುಕಟ್ಟೆ ಡೇಟಾ",
        demandAnalysis: "ಬೇಡಿಕೆ ವಿಶ್ಲೇಷಣೆ",
        supplyAnalysis: "ಪೂರೈಕೆ ವಿಶ್ಲೇಷಣೆ",
        scoreMeaning: "ಹೆಚ್ಚಿನ ಸ್ಕೋರ್ ಹೆಚ್ಚು ಬಲವಾದ ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
        refresh: "ರಿಫ್ರೆಶ್"
    },

    ks: {
        title: "AI طلب پیشگوئی",
        subtitle: "AgriVibe مارکیٹ ڈیٹا استعمال کر کے فصل کی طلب کا تجزیہ کریں۔",
        selectCrop: "فصل منتخب کریں",
        selectState: "ریاست منتخب کریں",
        selectDistrict: "ضلع (اختیاری)",
        chooseCrop: "فصل منتخب کریں",
        allStates: "تمام ریاستیں",
        enterDistrict: "ضلع کا نام درج کریں",
        analyzeDemand: "طلب کا تجزیہ کریں",
        analyzing: "تجزیہ ہو رہا ہے...",
        demandScore: "طلب اسکور",
        demandLevel: "طلب کی سطح",
        expectedDemand: "متوقع طلب",
        currentSupply: "موجودہ رسد",
        totalOrders: "کل آرڈرز",
        historicalDemand: "تاریخی آرڈر مقدار",
        recentDemand: "حالیہ طلب (30 دن)",
        supplyStatus: "رسد کی حالت",
        recommendation: "تجویز",
        highDemand: "زیادہ طلب",
        mediumDemand: "درمیانی طلب",
        lowDemand: "کم طلب",
        listCropNow: "طلب مضبوط ہے۔ ابھی اس فصل کو درج کرنے پر غور کریں۔",
        monitorDemand: "طلب درمیانی ہے۔ رسد بڑھانے سے پہلے مارکیٹ پر نظر رکھیں۔",
        waitAndMonitor: "موجودہ طلب کم ہے۔ مزید فصل درج کرنے سے پہلے نگرانی کریں۔",
        noSupply: "کوئی فعال رسد نہیں",
        insufficientSupply: "رسد ناکافی ہو سکتی ہے",
        highSupply: "موجودہ رسد زیادہ ہے",
        balancedSupply: "رسد متوازن ہے",
        kg: "کلو",
        orders: "آرڈرز",
        farmerOnly: "ڈیمانڈ فورکاسٹ کے لیے کسان کے طور پر لاگ ان کریں۔",
        error: "طلب کی پیشگوئی تیار نہیں ہو سکی۔",
        noData: "اس فصل کے لیے ابھی کافی مارکیٹ ڈیٹا دستیاب نہیں ہے۔",
        transparency: "یہ پیشگوئی AgriVibe مارکیٹ لسٹنگ اور آرڈر سرگرمی پر مبنی پروٹوٹائپ اندازہ ہے۔",
        locationFilter: "مقام فلٹر",
        forecastSummary: "پیشگوئی خلاصہ",
        marketplaceData: "مارکیٹ ڈیٹا",
        demandAnalysis: "طلب تجزیہ",
        supplyAnalysis: "رسد تجزیہ",
        scoreMeaning: "زیادہ اسکور مضبوط مارکیٹ طلب کو ظاہر کرتا ہے۔",
        refresh: "ریفریش"
    },

    kok: {
        title: "AI मागणी अंदाज",
        subtitle: "AgriVibe बाजाराची माहिती वापरून पिकाची मागणी तपासा.",
        selectCrop: "पीक निवडा",
        selectState: "राज्य निवडा",
        selectDistrict: "जिल्हो (पर्यायी)",
        chooseCrop: "पीक निवडा",
        allStates: "सगळे राज्य",
        enterDistrict: "जिल्ह्याचें नांव घाला",
        analyzeDemand: "मागणी विश्लेषण करात",
        analyzing: "विश्लेषण चालू आसा...",
        demandScore: "मागणी स्कोर",
        demandLevel: "मागणी पातळी",
        expectedDemand: "अपेक्षित मागणी",
        currentSupply: "सध्याचो पुरवठो",
        totalOrders: "एकूण ऑर्डर",
        historicalDemand: "इतिहासातली ऑर्डर मात्रा",
        recentDemand: "अलीकडची मागणी (३० दिस)",
        supplyStatus: "पुरवठ्याची स्थिती",
        recommendation: "शिफारस",
        highDemand: "जास्त मागणी",
        mediumDemand: "मध्यम मागणी",
        lowDemand: "कमी मागणी",
        listCropNow: "मागणी मजबूत आसा. आतां पीक सूचींत घालपाचो विचार करात.",
        monitorDemand: "मागणी मध्यम आसा. पुरवठो वाढोवपाच्या आदल्या बाजार पळयात.",
        waitAndMonitor: "सध्याची मागणी कमी आसा. अधिक पीक सूचींत घालचे आदल्या निरीक्षण करात.",
        noSupply: "सक्रिय पुरवठो ना",
        insufficientSupply: "पुरवठो कमी पडूंक शकता",
        highSupply: "सध्याचो पुरवठो जास्त आसा",
        balancedSupply: "पुरवठो संतुलित आसा",
        kg: "किलो",
        orders: "ऑर्डर",
        farmerOnly: "डिमांड फोरकास्ट वापरपाखातीर शेतकरी म्हणून लॉगिन करात.",
        error: "मागणी अंदाज तयार जावंक ना.",
        noData: "ह्या पिकाखातीर अजून पुरेशी बाजार माहिती ना.",
        transparency: "हो अंदाज AgriVibe बाजार सूची आनी ऑर्डर क्रियाकलापाचेर आधारित प्रोटोटाइप अंदाज आसा.",
        locationFilter: "स्थान फिल्टर",
        forecastSummary: "अंदाज सारांश",
        marketplaceData: "बाजार माहिती",
        demandAnalysis: "मागणी विश्लेषण",
        supplyAnalysis: "पुरवठा विश्लेषण",
        scoreMeaning: "जास्त स्कोर मजबूत बाजार मागणी दाखयता.",
        refresh: "रिफ्रेश"
    },

    mai: {
        title: "AI मांग पूर्वानुमान",
        subtitle: "AgriVibe बाजारक जानकारीसँ फसलक मांगक विश्लेषण करू।",
        selectCrop: "फसल चुनू",
        selectState: "राज्य चुनू",
        selectDistrict: "जिला (वैकल्पिक)",
        chooseCrop: "फसल चुनू",
        allStates: "सभ राज्य",
        enterDistrict: "जिलाक नाम लिखू",
        analyzeDemand: "मांगक विश्लेषण करू",
        analyzing: "विश्लेषण भऽ रहल अछि...",
        demandScore: "मांग स्कोर",
        demandLevel: "मांग स्तर",
        expectedDemand: "अपेक्षित मांग",
        currentSupply: "वर्तमान आपूर्ति",
        totalOrders: "कुल ऑर्डर",
        historicalDemand: "ऐतिहासिक ऑर्डर मात्रा",
        recentDemand: "हालक मांग (30 दिन)",
        supplyStatus: "आपूर्तिक स्थिति",
        recommendation: "सिफारिश",
        highDemand: "बेसी मांग",
        mediumDemand: "मध्यम मांग",
        lowDemand: "कम मांग",
        listCropNow: "मांग मजबूत अछि। आब एहि फसलके सूचीबद्ध करबाक विचार करू।",
        monitorDemand: "मांग मध्यम अछि। आपूर्ति बढ़ेबाक पहिने बाजारक निगरानी करू।",
        waitAndMonitor: "वर्तमान मांग कम अछि। बेसी फसल सूचीबद्ध करबाक पहिने निगरानी करू।",
        noSupply: "कोनो सक्रिय आपूर्ति नहि",
        insufficientSupply: "आपूर्ति कम भऽ सकैत अछि",
        highSupply: "वर्तमान आपूर्ति बेसी अछि",
        balancedSupply: "आपूर्ति संतुलित अछि",
        kg: "किलो",
        orders: "ऑर्डर",
        farmerOnly: "डिमांड फोरकास्ट लेल किसानक रूपमे लॉगिन करू।",
        error: "मांग पूर्वानुमान नहि बनि सकल।",
        noData: "एहि फसल लेल एखन पर्याप्त बाजार जानकारी नहि अछि।",
        transparency: "ई पूर्वानुमान AgriVibe बाजार सूची आ ऑर्डर गतिविधि पर आधारित प्रोटोटाइप अनुमान अछि।",
        locationFilter: "स्थान फिल्टर",
        forecastSummary: "पूर्वानुमान सारांश",
        marketplaceData: "बाजार जानकारी",
        demandAnalysis: "मांग विश्लेषण",
        supplyAnalysis: "आपूर्ति विश्लेषण",
        scoreMeaning: "बेसी स्कोर मजबूत बाजार मांग देखबैत अछि।",
        refresh: "रिफ्रेश"
    },

    ml: {
        title: "AI ഡിമാൻഡ് പ്രവചനം",
        subtitle: "AgriVibe വിപണി ഡാറ്റ ഉപയോഗിച്ച് വിളയുടെ ഡിമാൻഡ് വിശകലനം ചെയ്യുക.",
        selectCrop: "വിള തിരഞ്ഞെടുക്കുക",
        selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
        selectDistrict: "ജില്ല (ഓപ്ഷണൽ)",
        chooseCrop: "ഒരു വിള തിരഞ്ഞെടുക്കുക",
        allStates: "എല്ലാ സംസ്ഥാനങ്ങളും",
        enterDistrict: "ജില്ലയുടെ പേര് നൽകുക",
        analyzeDemand: "ഡിമാൻഡ് വിശകലനം ചെയ്യുക",
        analyzing: "വിശകലനം ചെയ്യുന്നു...",
        demandScore: "ഡിമാൻഡ് സ്കോർ",
        demandLevel: "ഡിമാൻഡ് നില",
        expectedDemand: "പ്രതീക്ഷിക്കുന്ന ഡിമാൻഡ്",
        currentSupply: "നിലവിലെ വിതരണം",
        totalOrders: "ആകെ ഓർഡറുകൾ",
        historicalDemand: "ചരിത്രപരമായ ഓർഡർ അളവ്",
        recentDemand: "സമീപകാല ഡിമാൻഡ് (30 ദിവസം)",
        supplyStatus: "വിതരണ നില",
        recommendation: "ശുപാർശ",
        highDemand: "ഉയർന്ന ഡിമാൻഡ്",
        mediumDemand: "ഇടത്തരം ഡിമാൻഡ്",
        lowDemand: "കുറഞ്ഞ ഡിമാൻഡ്",
        listCropNow: "ഡിമാൻഡ് ശക്തമാണ്. ഈ വിള ഇപ്പോൾ ലിസ്റ്റ് ചെയ്യുന്നത് പരിഗണിക്കുക.",
        monitorDemand: "ഡിമാൻഡ് മിതമാണ്. വിതരണം വർധിപ്പിക്കുന്നതിന് മുമ്പ് വിപണി നിരീക്ഷിക്കുക.",
        waitAndMonitor: "നിലവിലെ ഡിമാൻഡ് കുറവാണ്. കൂടുതൽ വിളകൾ ലിസ്റ്റ് ചെയ്യുന്നതിന് മുമ്പ് നിരീക്ഷിക്കുക.",
        noSupply: "സജീവമായ വിതരണം ഇല്ല",
        insufficientSupply: "വിതരണം അപര്യാപ്തമായേക്കാം",
        highSupply: "നിലവിലെ വിതരണം കൂടുതലാണ്",
        balancedSupply: "വിതരണം സമതുലിതമാണ്",
        kg: "കിലോ",
        orders: "ഓർഡറുകൾ",
        farmerOnly: "ഡിമാൻഡ് ഫോർകാസ്റ്റ് ഉപയോഗിക്കാൻ കർഷകനായി ലോഗിൻ ചെയ്യുക.",
        error: "ഡിമാൻഡ് പ്രവചനം സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല.",
        noData: "ഈ വിളയ്ക്ക് മതിയായ വിപണി ഡാറ്റ ഇതുവരെ ലഭ്യമല്ല.",
        transparency: "AgriVibe വിപണി ലിസ്റ്റിംഗുകളും ഓർഡർ പ്രവർത്തനവും അടിസ്ഥാനമാക്കിയുള്ള പ്രോട്ടോടൈപ്പ് കണക്കാണ് ഈ പ്രവചനം.",
        locationFilter: "സ്ഥല ഫിൽട്ടർ",
        forecastSummary: "പ്രവചന സംഗ്രഹം",
        marketplaceData: "വിപണി ഡാറ്റ",
        demandAnalysis: "ഡിമാൻഡ് വിശകലനം",
        supplyAnalysis: "വിതരണ വിശകലനം",
        scoreMeaning: "ഉയർന്ന സ്കോർ ശക്തമായ വിപണി ഡിമാൻഡ് സൂചിപ്പിക്കുന്നു.",
        refresh: "റിഫ്രെഷ്"
    },

    mni: {
        title: "AI মাংদা ফোরকাস্ট",
        subtitle: "AgriVibe মার্কেট ডাটাগী ফসলগী মাংদা বিশ্লেষণ তৌরো।",
        selectCrop: "ফসল শিজিনবা",
        selectState: "স্টেট শিজিনবা",
        selectDistrict: "জিলা (অপশেনেল)",
        chooseCrop: "ফসল অমা শিজিনবা",
        allStates: "স্টেট পুম্নমক",
        enterDistrict: "জিলাগী মিং হাপচিল্লু",
        analyzeDemand: "মাংদা বিশ্লেষণ তৌরো",
        analyzing: "বিশ্লেষণ তৌরিবা...",
        demandScore: "মাংদা স্কোর",
        demandLevel: "মাংদাগী লেভেল",
        expectedDemand: "অশাদগী মাংদা",
        currentSupply: "হৌজিক্কী সাপ্লাই",
        totalOrders: "অর্ডর পুম্নমক",
        historicalDemand: "হিস্টোরিকেল অর্ডর কোয়ান্টিটি",
        recentDemand: "নুংঙাইদগী মাংদা (নুমিত ৩০)",
        supplyStatus: "সাপ্লাই স্টেটাস",
        recommendation: "রিকমেন্ডেশন",
        highDemand: "যামদগী মাংদা",
        mediumDemand: "মিডিয়ম মাংদা",
        lowDemand: "কনা মাংদা",
        listCropNow: "মাংদা যাম্না লৈ। ফসল হৌজিক লিস্ট তৌরো।",
        monitorDemand: "মাংদা মিডিয়ম লৈ। সাপ্লাই হেনগৎহনবগী মমাংদা মার্কেট নুপা।",
        waitAndMonitor: "হৌজিক্কী মাংদা কনা লৈ। মখা তানা লিস্ট তৌরিবা মমাংদা নুপা।",
        noSupply: "অ্যাক্টিভ সাপ্লাই লৈতে",
        insufficientSupply: "সাপ্লাই কনা ওইবা য়াই",
        highSupply: "হৌজিক সাপ্লাই যাম্না লৈ",
        balancedSupply: "সাপ্লাই ব্যালেন্স লৈ",
        kg: "কেজি",
        orders: "অর্ডর",
        farmerOnly: "ডিমান্ড ফোরকাস্ট শিজিনবগীদমক ফার্মর ওইনা লগইন তৌরো।",
        error: "মাংদা ফোরকাস্ট তৌবা য়ারোই।",
        noData: "মসিগী ফসল অসিগীদমক মখাদা মার্কেট ডাটা লৈতে।",
        transparency: "মসি AgriVibe মার্কেট লিস্টিং অমসুং অর্ডর এক্টিভিটিগী প্রোটোটাইপ এস্টিমেটনি।",
        locationFilter: "লোকেশন ফিল্টর",
        forecastSummary: "ফোরকাস্ট সারাংশ",
        marketplaceData: "মার্কেট ডাটা",
        demandAnalysis: "মাংদা এনালাইসিস",
        supplyAnalysis: "সাপ্লাই এনালাইসিস",
        scoreMeaning: "স্কোর হেনবা মানে মার্কেট মাংদা হেনবা।",
        refresh: "রিফ্রেশ"
    },

    mr: {
        title: "AI मागणी अंदाज",
        subtitle: "AgriVibe बाजारातील डेटाचा वापर करून पिकाची मागणी विश्लेषित करा.",
        selectCrop: "पीक निवडा",
        selectState: "राज्य निवडा",
        selectDistrict: "जिल्हा (पर्यायी)",
        chooseCrop: "पीक निवडा",
        allStates: "सर्व राज्ये",
        enterDistrict: "जिल्ह्याचे नाव टाका",
        analyzeDemand: "मागणीचे विश्लेषण करा",
        analyzing: "विश्लेषण सुरू आहे...",
        demandScore: "मागणी स्कोअर",
        demandLevel: "मागणी पातळी",
        expectedDemand: "अपेक्षित मागणी",
        currentSupply: "सध्याचा पुरवठा",
        totalOrders: "एकूण ऑर्डर",
        historicalDemand: "ऐतिहासिक ऑर्डर प्रमाण",
        recentDemand: "अलीकडील मागणी (30 दिवस)",
        supplyStatus: "पुरवठ्याची स्थिती",
        recommendation: "शिफारस",
        highDemand: "जास्त मागणी",
        mediumDemand: "मध्यम मागणी",
        lowDemand: "कमी मागणी",
        listCropNow: "मागणी मजबूत आहे. आता हे पीक सूचीबद्ध करण्याचा विचार करा.",
        monitorDemand: "मागणी मध्यम आहे. पुरवठा वाढवण्यापूर्वी बाजाराचे निरीक्षण करा.",
        waitAndMonitor: "सध्याची मागणी कमी आहे. अधिक पीक सूचीबद्ध करण्यापूर्वी निरीक्षण करा.",
        noSupply: "सक्रिय पुरवठा नाही",
        insufficientSupply: "पुरवठा अपुरा असू शकतो",
        highSupply: "सध्या पुरवठा जास्त आहे",
        balancedSupply: "पुरवठा संतुलित आहे",
        kg: "किलो",
        orders: "ऑर्डर",
        farmerOnly: "डिमांड फोरकास्टसाठी शेतकरी म्हणून लॉगिन करा.",
        error: "मागणी अंदाज तयार करता आला नाही.",
        noData: "या पिकासाठी अद्याप पुरेसा बाजार डेटा उपलब्ध नाही.",
        transparency: "हा अंदाज AgriVibe बाजारातील सूची आणि ऑर्डर क्रियाकलापावर आधारित प्रोटोटाइप अंदाज आहे.",
        locationFilter: "स्थान फिल्टर",
        forecastSummary: "अंदाज सारांश",
        marketplaceData: "बाजार डेटा",
        demandAnalysis: "मागणी विश्लेषण",
        supplyAnalysis: "पुरवठा विश्लेषण",
        scoreMeaning: "जास्त स्कोअर मजबूत बाजारातील मागणी दर्शवतो.",
        refresh: "रिफ्रेश"
    },

    ne: {
        title: "AI माग पूर्वानुमान",
        subtitle: "AgriVibe बजारको डाटा प्रयोग गरेर बालीको माग विश्लेषण गर्नुहोस्।",
        selectCrop: "बाली छान्नुहोस्",
        selectState: "राज्य छान्नुहोस्",
        selectDistrict: "जिल्ला (वैकल्पिक)",
        chooseCrop: "बाली छान्नुहोस्",
        allStates: "सबै राज्य",
        enterDistrict: "जिल्लाको नाम लेख्नुहोस्",
        analyzeDemand: "माग विश्लेषण गर्नुहोस्",
        analyzing: "विश्लेषण हुँदैछ...",
        demandScore: "माग स्कोर",
        demandLevel: "माग स्तर",
        expectedDemand: "अपेक्षित माग",
        currentSupply: "हालको आपूर्ति",
        totalOrders: "कुल अर्डर",
        historicalDemand: "ऐतिहासिक अर्डर मात्रा",
        recentDemand: "हालको माग (३० दिन)",
        supplyStatus: "आपूर्ति स्थिति",
        recommendation: "सिफारिस",
        highDemand: "उच्च माग",
        mediumDemand: "मध्यम माग",
        lowDemand: "कम माग",
        listCropNow: "माग बलियो छ। अहिले यो बाली सूचीबद्ध गर्ने विचार गर्नुहोस्।",
        monitorDemand: "माग मध्यम छ। आपूर्ति बढाउनु अघि बजार निगरानी गर्नुहोस्।",
        waitAndMonitor: "हालको माग कम छ। थप बाली सूचीबद्ध गर्नु अघि निगरानी गर्नुहोस्।",
        noSupply: "कुनै सक्रिय आपूर्ति छैन",
        insufficientSupply: "आपूर्ति अपर्याप्त हुन सक्छ",
        highSupply: "हाल आपूर्ति धेरै छ",
        balancedSupply: "आपूर्ति सन्तुलित छ",
        kg: "केजी",
        orders: "अर्डर",
        farmerOnly: "डिमान्ड फोरकास्ट प्रयोग गर्न किसानको रूपमा लगइन गर्नुहोस्।",
        error: "माग पूर्वानुमान बनाउन सकिएन।",
        noData: "यस बालीका लागि पर्याप्त बजार डाटा अझै उपलब्ध छैन।",
        transparency: "यो पूर्वानुमान AgriVibe बजार सूची र अर्डर गतिविधिमा आधारित प्रोटोटाइप अनुमान हो।",
        locationFilter: "स्थान फिल्टर",
        forecastSummary: "पूर्वानुमान सारांश",
        marketplaceData: "बजार डाटा",
        demandAnalysis: "माग विश्लेषण",
        supplyAnalysis: "आपूर्ति विश्लेषण",
        scoreMeaning: "उच्च स्कोरले बलियो बजार माग देखाउँछ।",
        refresh: "रिफ्रेस"
    },

    or: {
        title: "AI ଚାହିଦା ପୂର୍ବାନୁମାନ",
        subtitle: "AgriVibe ବଜାର ତଥ୍ୟ ବ୍ୟବହାର କରି ଫସଲର ଚାହିଦା ବିଶ୍ଳେଷଣ କରନ୍ତୁ।",
        selectCrop: "ଫସଲ ବାଛନ୍ତୁ",
        selectState: "ରାଜ୍ୟ ବାଛନ୍ତୁ",
        selectDistrict: "ଜିଲ୍ଲା (ଇଚ୍ଛାଧୀନ)",
        chooseCrop: "ଫସଲ ବାଛନ୍ତୁ",
        allStates: "ସମସ୍ତ ରାଜ୍ୟ",
        enterDistrict: "ଜିଲ୍ଲା ନାମ ଲେଖନ୍ତୁ",
        analyzeDemand: "ଚାହିଦା ବିଶ୍ଳେଷଣ କରନ୍ତୁ",
        analyzing: "ବିଶ୍ଳେଷଣ ହେଉଛି...",
        demandScore: "ଚାହିଦା ସ୍କୋର",
        demandLevel: "ଚାହିଦା ସ୍ତର",
        expectedDemand: "ଆଶାକରାଯାଇଥିବା ଚାହିଦା",
        currentSupply: "ବର୍ତ୍ତମାନ ଯୋଗାଣ",
        totalOrders: "ମୋଟ ଅର୍ଡର",
        historicalDemand: "ଇତିହାସିକ ଅର୍ଡର ପରିମାଣ",
        recentDemand: "ସମ୍ପ୍ରତି ଚାହିଦା (୩୦ ଦିନ)",
        supplyStatus: "ଯୋଗାଣ ସ୍ଥିତି",
        recommendation: "ସୁପାରିଶ",
        highDemand: "ଅଧିକ ଚାହିଦା",
        mediumDemand: "ମଧ୍ୟମ ଚାହିଦା",
        lowDemand: "କମ ଚାହିଦା",
        listCropNow: "ଚାହିଦା ଶକ୍ତିଶାଳୀ। ବର୍ତ୍ତମାନ ଏହି ଫସଲକୁ ତାଲିକାଭୁକ୍ତ କରନ୍ତୁ।",
        monitorDemand: "ଚାହିଦା ମଧ୍ୟମ। ଯୋଗାଣ ବଢ଼ାଇବା ପୂର୍ବରୁ ବଜାର ନିରୀକ୍ଷଣ କରନ୍ତୁ।",
        waitAndMonitor: "ବର୍ତ୍ତମାନ ଚାହିଦା କମ। ଅଧିକ ଫସଲ ତାଲିକାଭୁକ୍ତ କରିବା ପୂର୍ବରୁ ନିରୀକ୍ଷଣ କରନ୍ତୁ।",
        noSupply: "କୌଣସି ସକ୍ରିୟ ଯୋଗାଣ ନାହିଁ",
        insufficientSupply: "ଯୋଗାଣ ଅପର୍ଯ୍ୟାପ୍ତ ହୋଇପାରେ",
        highSupply: "ବର୍ତ୍ତମାନ ଯୋଗାଣ ଅଧିକ",
        balancedSupply: "ଯୋଗାଣ ସନ୍ତୁଳିତ",
        kg: "କିଲୋ",
        orders: "ଅର୍ଡର",
        farmerOnly: "ଡିମାଣ୍ଡ ଫୋରକାଷ୍ଟ ପାଇଁ କୃଷକ ଭାବେ ଲଗଇନ କରନ୍ତୁ।",
        error: "ଚାହିଦା ପୂର୍ବାନୁମାନ ତିଆରି ହୋଇପାରିଲା ନାହିଁ।",
        noData: "ଏହି ଫସଲ ପାଇଁ ଏପର୍ଯ୍ୟନ୍ତ ପର୍ଯ୍ୟାପ୍ତ ବଜାର ତଥ୍ୟ ନାହିଁ।",
        transparency: "ଏହି ପୂର୍ବାନୁମାନ AgriVibe ବଜାର ତାଲିକା ଏବଂ ଅର୍ଡର କାର୍ଯ୍ୟକଳାପ ଉପରେ ଆଧାରିତ ପ୍ରୋଟୋଟାଇପ ଅନୁମାନ।",
        locationFilter: "ସ୍ଥାନ ଫିଲ୍ଟର",
        forecastSummary: "ପୂର୍ବାନୁମାନ ସାରାଂଶ",
        marketplaceData: "ବଜାର ତଥ୍ୟ",
        demandAnalysis: "ଚାହିଦା ବିଶ୍ଳେଷଣ",
        supplyAnalysis: "ଯୋଗାଣ ବିଶ୍ଳେଷଣ",
        scoreMeaning: "ଅଧିକ ସ୍କୋର ଶକ୍ତିଶାଳୀ ବଜାର ଚାହିଦାକୁ ଦର୍ଶାଏ।",
        refresh: "ରିଫ୍ରେଶ"
    },

    pa: {
        title: "AI ਮੰਗ ਪੂਰਵ ਅਨੁਮਾਨ",
        subtitle: "AgriVibe ਮਾਰਕੀਟ ਡੇਟਾ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਫਸਲ ਦੀ ਮੰਗ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ।",
        selectCrop: "ਫਸਲ ਚੁਣੋ",
        selectState: "ਰਾਜ ਚੁਣੋ",
        selectDistrict: "ਜ਼ਿਲ੍ਹਾ (ਵਿਕਲਪਿਕ)",
        chooseCrop: "ਫਸਲ ਚੁਣੋ",
        allStates: "ਸਾਰੇ ਰਾਜ",
        enterDistrict: "ਜ਼ਿਲ੍ਹੇ ਦਾ ਨਾਮ ਲਿਖੋ",
        analyzeDemand: "ਮੰਗ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
        analyzing: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
        demandScore: "ਮੰਗ ਸਕੋਰ",
        demandLevel: "ਮੰਗ ਪੱਧਰ",
        expectedDemand: "ਉਮੀਦ ਕੀਤੀ ਮੰਗ",
        currentSupply: "ਮੌਜੂਦਾ ਸਪਲਾਈ",
        totalOrders: "ਕੁੱਲ ਆਰਡਰ",
        historicalDemand: "ਇਤਿਹਾਸਕ ਆਰਡਰ ਮਾਤਰਾ",
        recentDemand: "ਹਾਲੀਆ ਮੰਗ (30 ਦਿਨ)",
        supplyStatus: "ਸਪਲਾਈ ਸਥਿਤੀ",
        recommendation: "ਸਿਫਾਰਸ਼",
        highDemand: "ਉੱਚ ਮੰਗ",
        mediumDemand: "ਦਰਮਿਆਨੀ ਮੰਗ",
        lowDemand: "ਘੱਟ ਮੰਗ",
        listCropNow: "ਮੰਗ ਮਜ਼ਬੂਤ ਹੈ। ਹੁਣ ਇਸ ਫਸਲ ਨੂੰ ਸੂਚੀਬੱਧ ਕਰਨ ਬਾਰੇ ਸੋਚੋ।",
        monitorDemand: "ਮੰਗ ਦਰਮਿਆਨੀ ਹੈ। ਸਪਲਾਈ ਵਧਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਮਾਰਕੀਟ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।",
        waitAndMonitor: "ਮੌਜੂਦਾ ਮੰਗ ਘੱਟ ਹੈ। ਹੋਰ ਫਸਲ ਸੂਚੀਬੱਧ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਨਿਗਰਾਨੀ ਕਰੋ।",
        noSupply: "ਕੋਈ ਸਰਗਰਮ ਸਪਲਾਈ ਨਹੀਂ",
        insufficientSupply: "ਸਪਲਾਈ ਘੱਟ ਹੋ ਸਕਦੀ ਹੈ",
        highSupply: "ਮੌਜੂਦਾ ਸਪਲਾਈ ਜ਼ਿਆਦਾ ਹੈ",
        balancedSupply: "ਸਪਲਾਈ ਸੰਤੁਲਿਤ ਹੈ",
        kg: "ਕਿਲੋ",
        orders: "ਆਰਡਰ",
        farmerOnly: "ਡਿਮਾਂਡ ਫੋਰਕਾਸਟ ਲਈ ਕਿਸਾਨ ਵਜੋਂ ਲਾਗਇਨ ਕਰੋ।",
        error: "ਮੰਗ ਪੂਰਵ ਅਨੁਮਾਨ ਨਹੀਂ ਬਣ ਸਕਿਆ।",
        noData: "ਇਸ ਫਸਲ ਲਈ ਹਾਲੇ ਕਾਫ਼ੀ ਮਾਰਕੀਟ ਡੇਟਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
        transparency: "ਇਹ ਪੂਰਵ ਅਨੁਮਾਨ AgriVibe ਮਾਰਕੀਟ ਸੂਚੀਆਂ ਅਤੇ ਆਰਡਰ ਗਤੀਵਿਧੀ 'ਤੇ ਆਧਾਰਿਤ ਪ੍ਰੋਟੋਟਾਈਪ ਅਨੁਮਾਨ ਹੈ।",
        locationFilter: "ਸਥਾਨ ਫਿਲਟਰ",
        forecastSummary: "ਪੂਰਵ ਅਨੁਮਾਨ ਸਾਰ",
        marketplaceData: "ਮਾਰਕੀਟ ਡੇਟਾ",
        demandAnalysis: "ਮੰਗ ਵਿਸ਼ਲੇਸ਼ਣ",
        supplyAnalysis: "ਸਪਲਾਈ ਵਿਸ਼ਲੇਸ਼ਣ",
        scoreMeaning: "ਵੱਧ ਸਕੋਰ ਮਜ਼ਬੂਤ ਮਾਰਕੀਟ ਮੰਗ ਦਰਸਾਉਂਦਾ ਹੈ।",
        refresh: "ਰਿਫ੍ਰੈਸ਼"
    },

    sa: {
        title: "AI माग पूर्वानुमानम्",
        subtitle: "AgriVibe विपणिदत्तांशेन सस्यस्य मागं विश्लेषयन्तु।",
        selectCrop: "सस्यं चिनुत",
        selectState: "राज्यं चिनुत",
        selectDistrict: "जनपदः (वैकल्पिकम्)",
        chooseCrop: "सस्यं चिनुत",
        allStates: "सर्वाणि राज्यानि",
        enterDistrict: "जनपदस्य नाम लिखन्तु",
        analyzeDemand: "मागं विश्लेषयन्तु",
        analyzing: "विश्लेषणं क्रियते...",
        demandScore: "माग अङ्कः",
        demandLevel: "माग स्तरः",
        expectedDemand: "अपेक्षितः मागः",
        currentSupply: "वर्तमान आपूर्तिः",
        totalOrders: "कुल आदेशाः",
        historicalDemand: "ऐतिहासिक आदेशमात्रा",
        recentDemand: "अद्यतन मागः (३० दिनानि)",
        supplyStatus: "आपूर्ति स्थितिः",
        recommendation: "परामर्शः",
        highDemand: "उच्च मागः",
        mediumDemand: "मध्यम मागः",
        lowDemand: "न्यून मागः",
        listCropNow: "मागः दृढः अस्ति। इदानीं सस्यं सूचीकर्तुं विचारयन्तु।",
        monitorDemand: "मागः मध्यमः अस्ति। आपूर्तिवर्धनात् पूर्वं विपणिं निरीक्षन्तु।",
        waitAndMonitor: "वर्तमान मागः न्यूनः अस्ति। अधिकसस्यसूचनात् पूर्वं निरीक्षन्तु।",
        noSupply: "सक्रिया आपूर्तिः नास्ति",
        insufficientSupply: "आपूर्तिः अपर्याप्ता भवितुमर्हति",
        highSupply: "वर्तमान आपूर्तिः अधिका अस्ति",
        balancedSupply: "आपूर्तिः संतुलिता अस्ति",
        kg: "किलोग्राम",
        orders: "आदेशाः",
        farmerOnly: "डिमाण्ड फोरकास्ट उपयोगाय कृषकरूपेण लॉगिन कुर्वन्तु।",
        error: "माग पूर्वानुमानं निर्मातुं न शक्यते।",
        noData: "अस्य सस्यस्य कृते पर्याप्तः विपणिदत्तांशः नास्ति।",
        transparency: "एतत् पूर्वानुमानम् AgriVibe विपणिसूची तथा आदेशक्रियायाः आधारेण प्रोटोटाइप अनुमानम् अस्ति।",
        locationFilter: "स्थान छनकः",
        forecastSummary: "पूर्वानुमान सारांशः",
        marketplaceData: "विपणिदत्तांशः",
        demandAnalysis: "माग विश्लेषणम्",
        supplyAnalysis: "आपूर्ति विश्लेषणम्",
        scoreMeaning: "उच्चः अङ्कः दृढं विपणिमागं दर्शयति।",
        refresh: "पुनः ताजा"
    },

    sat: {
        title: "AI मांग फोरकास्ट",
        subtitle: "AgriVibe बाजार डेटा ते फसल रेन मांग बिचार मे।",
        selectCrop: "फसल बेसे",
        selectState: "राज्य बेसे",
        selectDistrict: "जिला (वैकल्पिक)",
        chooseCrop: "फसल बेसे",
        allStates: "सभी राज्य",
        enterDistrict: "जिला नाम ओल मे",
        analyzeDemand: "मांग बिचार मे",
        analyzing: "बिचार होन ताहे...",
        demandScore: "मांग स्कोर",
        demandLevel: "मांग स्तर",
        expectedDemand: "आसा मांग",
        currentSupply: "हाल सप्लाई",
        totalOrders: "कुल ऑर्डर",
        historicalDemand: "पुराना ऑर्डर मात्रा",
        recentDemand: "नया मांग (30 दिन)",
        supplyStatus: "सप्लाई स्थिति",
        recommendation: "सलाह",
        highDemand: "जादा मांग",
        mediumDemand: "मध्यम मांग",
        lowDemand: "कम मांग",
        listCropNow: "मांग मजबूत हे। अब फसल सूची मे देवे।",
        monitorDemand: "मांग मध्यम हे। सप्लाई बढ़ावे से पहले बाजार देखे।",
        waitAndMonitor: "हाल मांग कम हे। ज्यादा फसल सूची मे देवे से पहले देखे।",
        noSupply: "सक्रिय सप्लाई नई हे",
        insufficientSupply: "सप्लाई कम हो सकत हे",
        highSupply: "हाल सप्लाई जादा हे",
        balancedSupply: "सप्लाई बराबर हे",
        kg: "किलो",
        orders: "ऑर्डर",
        farmerOnly: "डिमांड फोरकास्ट खातिर किसान रूप मे लॉगिन करे।",
        error: "मांग फोरकास्ट बन नई सकल।",
        noData: "ए फसल खातिर अभी पर्याप्त बाजार डेटा नई हे।",
        transparency: "ए फोरकास्ट AgriVibe बाजार सूची अउ ऑर्डर काम पर आधारित प्रोटोटाइप अनुमान हे।",
        locationFilter: "जगह फिल्टर",
        forecastSummary: "फोरकास्ट सार",
        marketplaceData: "बाजार डेटा",
        demandAnalysis: "मांग बिचार",
        supplyAnalysis: "सप्लाई बिचार",
        scoreMeaning: "जादा स्कोर मजबूत बाजार मांग देखाय।",
        refresh: "फिर से लोड"
    },

    sd: {
        title: "AI طلب جو اندازو",
        subtitle: "AgriVibe مارڪيٽ ڊيٽا سان فصل جي طلب جو تجزيو ڪريو.",
        selectCrop: "فصل چونڊيو",
        selectState: "رياست چونڊيو",
        selectDistrict: "ضلعو (اختياري)",
        chooseCrop: "فصل چونڊيو",
        allStates: "سڀ رياستون",
        enterDistrict: "ضلعي جو نالو لکو",
        analyzeDemand: "طلب جو تجزيو ڪريو",
        analyzing: "تجزيو ٿي رهيو آهي...",
        demandScore: "طلب اسڪور",
        demandLevel: "طلب جي سطح",
        expectedDemand: "متوقع طلب",
        currentSupply: "موجوده فراهمي",
        totalOrders: "ڪل آرڊر",
        historicalDemand: "تاريخي آرڊر مقدار",
        recentDemand: "تازو طلب (30 ڏينهن)",
        supplyStatus: "فراهمي جي حالت",
        recommendation: "سفارش",
        highDemand: "وڏي طلب",
        mediumDemand: "وچولي طلب",
        lowDemand: "گهٽ طلب",
        listCropNow: "طلب مضبوط آهي. هاڻي فصل کي لسٽ ڪرڻ تي غور ڪريو.",
        monitorDemand: "طلب وچولي آهي. فراهمي وڌائڻ کان اڳ مارڪيٽ ڏسو.",
        waitAndMonitor: "موجوده طلب گهٽ آهي. وڌيڪ فصل لسٽ ڪرڻ کان اڳ نگراني ڪريو.",
        noSupply: "ڪا فعال فراهمي ناهي",
        insufficientSupply: "فراهمي گهٽ ٿي سگهي ٿي",
        highSupply: "موجوده فراهمي وڌيڪ آهي",
        balancedSupply: "فراهمي متوازن آهي",
        kg: "ڪلو",
        orders: "آرڊر",
        farmerOnly: "ڊيمانڊ فورڪاسٽ لاءِ هاري طور لاگ ان ٿيو.",
        error: "طلب جو اندازو ٺاهي نه سگهيو.",
        noData: "هن فصل لاءِ اڃا ڪافي مارڪيٽ ڊيٽا موجود ناهي.",
        transparency: "هي اڳڪٿي AgriVibe مارڪيٽ لسٽنگ ۽ آرڊر سرگرمي تي ٻڌل پروٽوٽائپ اندازو آهي.",
        locationFilter: "جڳهه فلٽر",
        forecastSummary: "اڳڪٿي خلاصو",
        marketplaceData: "مارڪيٽ ڊيٽا",
        demandAnalysis: "طلب جو تجزيو",
        supplyAnalysis: "فراهمي جو تجزيو",
        scoreMeaning: "وڌيڪ اسڪور مضبوط مارڪيٽ طلب ڏيکاري ٿو.",
        refresh: "ريفريش"
    },

    ta: {
        title: "AI தேவை முன்னறிவிப்பு",
        subtitle:
            "AgriVibe சந்தை தரவைப் பயன்படுத்தி பயிரின் தேவையை பகுப்பாய்வு செய்யுங்கள்.",
        selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
        selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
        selectDistrict: "மாவட்டம் (விருப்பம்)",
        chooseCrop: "ஒரு பயிரைத் தேர்ந்தெடுக்கவும்",
        allStates: "அனைத்து மாநிலங்கள்",
        enterDistrict: "மாவட்டத்தின் பெயரை உள்ளிடவும்",
        analyzeDemand: "தேவையை பகுப்பாய்வு செய்யவும்",
        analyzing: "பகுப்பாய்வு செய்கிறது...",
        demandScore: "தேவை மதிப்பெண்",
        demandLevel: "தேவை நிலை",
        expectedDemand: "எதிர்பார்க்கப்படும் தேவை",
        currentSupply: "தற்போதைய வழங்கல்",
        totalOrders: "மொத்த ஆர்டர்கள்",
        historicalDemand: "வரலாற்று ஆர்டர் அளவு",
        recentDemand: "சமீபத்திய தேவை (30 நாட்கள்)",
        supplyStatus: "வழங்கல் நிலை",
        recommendation: "பரிந்துரை",
        highDemand: "அதிக தேவை",
        mediumDemand: "மிதமான தேவை",
        lowDemand: "குறைந்த தேவை",
        listCropNow:
            "தேவை அதிகமாக உள்ளது. இந்த பயிரை இப்போது பட்டியலிடலாம்.",
        monitorDemand:
            "தேவை மிதமாக உள்ளது. வழங்கலை அதிகரிப்பதற்கு முன் சந்தையை கண்காணிக்கவும்.",
        waitAndMonitor:
            "தற்போதைய தேவை குறைவாக உள்ளது. மேலும் பயிர்களை பட்டியலிடுவதற்கு முன் கண்காணிக்கவும்.",
        noSupply: "செயலில் உள்ள வழங்கல் இல்லை",
        insufficientSupply: "வழங்கல் போதுமானதாக இல்லாமல் இருக்கலாம்",
        highSupply: "தற்போது வழங்கல் அதிகமாக உள்ளது",
        balancedSupply: "வழங்கல் சமநிலையில் உள்ளது",
        kg: "கிலோ",
        orders: "ஆர்டர்கள்",
        farmerOnly:
            "Demand Forecast பயன்படுத்த விவசாயியாக உள்நுழையவும்.",
        error: "தேவை முன்னறிவிப்பை உருவாக்க முடியவில்லை.",
        noData:
            "இந்த பயிருக்கு இன்னும் போதுமான சந்தை தரவு இல்லை.",
        transparency:
            "இந்த முன்னறிவிப்பு AgriVibe சந்தை பட்டியல்கள் மற்றும் ஆர்டர் செயல்பாடுகளின் அடிப்படையிலான prototype மதிப்பீடு ஆகும்.",
        locationFilter: "இட வடிகட்டி",
        forecastSummary: "முன்னறிவிப்பு சுருக்கம்",
        marketplaceData: "சந்தை தரவு",
        demandAnalysis: "தேவை பகுப்பாய்வு",
        supplyAnalysis: "வழங்கல் பகுப்பாய்வு",
        scoreMeaning:
            "அதிக மதிப்பெண் வலுவான சந்தை தேவையை குறிக்கிறது.",
        refresh: "புதுப்பிக்கவும்"
    },

    te: {
        title: "AI డిమాండ్ అంచనా",
        subtitle:
            "AgriVibe మార్కెట్ డేటాను ఉపయోగించి పంట డిమాండ్‌ను విశ్లేషించండి.",
        selectCrop: "పంటను ఎంచుకోండి",
        selectState: "రాష్ట్రాన్ని ఎంచుకోండి",
        selectDistrict: "జిల్లా (ఐచ్ఛికం)",
        chooseCrop: "పంటను ఎంచుకోండి",
        allStates: "అన్ని రాష్ట్రాలు",
        enterDistrict: "జిల్లా పేరును నమోదు చేయండి",
        analyzeDemand: "డిమాండ్‌ను విశ్లేషించండి",
        analyzing: "విశ్లేషిస్తోంది...",
        demandScore: "డిమాండ్ స్కోర్",
        demandLevel: "డిమాండ్ స్థాయి",
        expectedDemand: "అంచనా డిమాండ్",
        currentSupply: "ప్రస్తుత సరఫరా",
        totalOrders: "మొత్తం ఆర్డర్లు",
        historicalDemand: "చారిత్రక ఆర్డర్ పరిమాణం",
        recentDemand: "ఇటీవలి డిమాండ్ (30 రోజులు)",
        supplyStatus: "సరఫరా స్థితి",
        recommendation: "సిఫార్సు",
        highDemand: "అధిక డిమాండ్",
        mediumDemand: "మధ్యస్థ డిమాండ్",
        lowDemand: "తక్కువ డిమాండ్",
        listCropNow:
            "డిమాండ్ బలంగా ఉంది. ఈ పంటను ఇప్పుడు జాబితా చేయండి.",
        monitorDemand:
            "డిమాండ్ మధ్యస్థంగా ఉంది. సరఫరాను పెంచే ముందు మార్కెట్‌ను గమనించండి.",
        waitAndMonitor:
            "ప్రస్తుత డిమాండ్ తక్కువగా ఉంది. మరిన్ని పంటలను జాబితా చేయడానికి ముందు గమనించండి.",
        noSupply: "క్రియాశీల సరఫరా లేదు",
        insufficientSupply: "సరఫరా తగినంతగా ఉండకపోవచ్చు",
        highSupply: "ప్రస్తుతం సరఫరా ఎక్కువగా ఉంది",
        balancedSupply: "సరఫరా సమతుల్యంగా ఉంది",
        kg: "కిలో",
        orders: "ఆర్డర్లు",
        farmerOnly:
            "డిమాండ్ ఫోర్‌కాస్ట్ ఉపయోగించడానికి రైతుగా లాగిన్ అవ్వండి.",
        error: "డిమాండ్ అంచనాను రూపొందించలేకపోయాము.",
        noData:
            "ఈ పంటకు ఇంకా తగినంత మార్కెట్ డేటా అందుబాటులో లేదు.",
        transparency:
            "ఈ అంచనా AgriVibe మార్కెట్ జాబితాలు మరియు ఆర్డర్ కార్యకలాపాల ఆధారంగా రూపొందించిన ప్రోటోటైప్ అంచనా.",
        locationFilter: "స్థాన ఫిల్టర్",
        forecastSummary: "అంచనా సారాంశం",
        marketplaceData: "మార్కెట్ డేటా",
        demandAnalysis: "డిమాండ్ విశ్లేషణ",
        supplyAnalysis: "సరఫరా విశ్లేషణ",
        scoreMeaning:
            "అధిక స్కోర్ బలమైన మార్కెట్ డిమాండ్‌ను సూచిస్తుంది.",
        refresh: "రిఫ్రెష్"
    },

    ur: {
        title: "AI طلب کی پیش گوئی",
        subtitle:
            "AgriVibe مارکیٹ ڈیٹا استعمال کرتے ہوئے فصل کی طلب کا تجزیہ کریں۔",
        selectCrop: "فصل منتخب کریں",
        selectState: "ریاست منتخب کریں",
        selectDistrict: "ضلع (اختیاری)",
        chooseCrop: "فصل منتخب کریں",
        allStates: "تمام ریاستیں",
        enterDistrict: "ضلع کا نام درج کریں",
        analyzeDemand: "طلب کا تجزیہ کریں",
        analyzing: "تجزیہ ہو رہا ہے...",
        demandScore: "طلب اسکور",
        demandLevel: "طلب کی سطح",
        expectedDemand: "متوقع طلب",
        currentSupply: "موجودہ رسد",
        totalOrders: "کل آرڈرز",
        historicalDemand: "تاریخی آرڈر مقدار",
        recentDemand: "حالیہ طلب (30 دن)",
        supplyStatus: "رسد کی حالت",
        recommendation: "سفارش",
        highDemand: "زیادہ طلب",
        mediumDemand: "درمیانی طلب",
        lowDemand: "کم طلب",
        listCropNow:
            "طلب مضبوط ہے۔ ابھی اس فصل کو فہرست میں شامل کرنے پر غور کریں۔",
        monitorDemand:
            "طلب درمیانی ہے۔ رسد بڑھانے سے پہلے مارکیٹ کی نگرانی کریں۔",
        waitAndMonitor:
            "موجودہ طلب کم ہے۔ مزید فصل شامل کرنے سے پہلے نگرانی کریں۔",
        noSupply: "کوئی فعال رسد نہیں",
        insufficientSupply: "رسد ناکافی ہو سکتی ہے",
        highSupply: "موجودہ رسد زیادہ ہے",
        balancedSupply: "رسد متوازن ہے",
        kg: "کلو",
        orders: "آرڈرز",
        farmerOnly:
            "ڈیمانڈ فورکاسٹ استعمال کرنے کے لیے کسان کے طور پر لاگ ان کریں۔",
        error: "طلب کی پیش گوئی تیار نہیں ہو سکی۔",
        noData:
            "اس فصل کے لیے ابھی کافی مارکیٹ ڈیٹا دستیاب نہیں ہے۔",
        transparency:
            "یہ پیش گوئی AgriVibe مارکیٹ لسٹنگ اور آرڈر سرگرمی کی بنیاد پر ایک پروٹوٹائپ اندازہ ہے۔",
        locationFilter: "مقام فلٹر",
        forecastSummary: "پیش گوئی خلاصہ",
        marketplaceData: "مارکیٹ ڈیٹا",
        demandAnalysis: "طلب کا تجزیہ",
        supplyAnalysis: "رسد کا تجزیہ",
        scoreMeaning:
            "زیادہ اسکور مضبوط مارکیٹ طلب کو ظاہر کرتا ہے۔",
        refresh: "ریفریش"
    }
};

/*
|--------------------------------------------------------------------------
| Missing languages
|--------------------------------------------------------------------------
| These inherit the English structure but are displayed according to the
| selected language through the existing AgriVibe language system.
|--------------------------------------------------------------------------
*/

const fallbackLanguages = {
    as: translations.as,
    bn: translations.bn,
    brx: translations.brx,
    doi: translations.doi,
    gu: translations.gu,
    hi: translations.hi,
    kn: translations.kn,
    ks: translations.ks,
    kok: translations.kok,
    mai: translations.mai,
    ml: translations.ml,
    mni: translations.mni,
    mr: translations.mr,
    ne: translations.ne,
    or: translations.or,
    pa: translations.pa,
    sa: translations.sa,
    sat: translations.sat,
    sd: translations.sd,
    ta: translations.ta,
    te: translations.te,
    ur: translations.ur
};

const getTexts = (language) => {
    return translations[language] || translations.en;
};

export default function DemandForecast() {
    const { language, tCrop } = useLanguage();

    const text = useMemo(
        () => getTexts(language),
        [language]
    );

    const [user, setUser] = useState(null);

    const [cropName, setCropName] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");

    const [forecast, setForecast] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Unable to read user:", err);
        }
    }, []);

    const handleAnalyze = async () => {
        if (!cropName) {
            setError(text.selectCrop);
            return;
        }

        setLoading(true);
        setError("");
        setForecast(null);

        try {
            const response = await axios.post(
                `${API_URL}/api/advisory/demand-forecast`,
                {
                    cropName,
                    state,
                    district
                }
            );

            setForecast(response.data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                text.error
            );
        } finally {
            setLoading(false);
        }
    };

    const getDemandLabel = (level) => {
        if (level === "High") return text.highDemand;
        if (level === "Medium") return text.mediumDemand;
        return text.lowDemand;
    };

    const getRecommendation = (code) => {
        if (code === "listCropNow") {
            return text.listCropNow;
        }

        if (code === "monitorDemand") {
            return text.monitorDemand;
        }

        return text.waitAndMonitor;
    };

    const getSupplyStatus = (status) => {
        if (status === "No active supply") {
            return text.noSupply;
        }

        if (status === "Supply may be insufficient") {
            return text.insufficientSupply;
        }

        if (status === "Supply is currently high") {
            return text.highSupply;
        }

        return text.balancedSupply;
    };

    if (!user || user.role !== "farmer") {
        return (
            <div className="container py-5">
                <div className="card shadow-sm border-0">
                    <div className="card-body text-center py-5">
                        <div
                            style={{
                                fontSize: "60px"
                            }}
                        >
                            🔒
                        </div>

                        <h3 className="fw-bold mt-3">
                            {text.title}
                        </h3>

                        <p className="text-muted mb-0">
                            {text.farmerOnly}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">

            {/* Header */}
            <div className="text-center mb-5">

                <div
                    className="mb-3"
                    style={{
                        fontSize: "55px"
                    }}
                >
                    📈
                </div>

                <h1 className="fw-bold">
                    {text.title}
                </h1>

                <p className="text-muted">
                    {text.subtitle}
                </p>

            </div>

            {/* Filter Card */}
            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body p-4">

                    <h5 className="fw-bold mb-4">
                        🔎 {text.locationFilter}
                    </h5>

                    <div className="row g-3">

                        {/* Crop */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                🌾 {text.selectCrop}
                            </label>

                            <select
                                className="form-select"
                                value={cropName}
                                onChange={(e) =>
                                    setCropName(e.target.value)
                                }
                            >
                                <option value="">
                                    {text.chooseCrop}
                                </option>

                                {crops.map((crop) => (
                                    <option
                                        key={crop}
                                        value={crop}
                                    >
                                        {tCrop
                                            ? tCrop(crop)
                                            : crop}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* State */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                📍 {text.selectState}
                            </label>

                            <select
                                className="form-select"
                                value={state}
                                onChange={(e) =>
                                    setState(e.target.value)
                                }
                            >
                                <option value="">
                                    {text.allStates}
                                </option>

                                {states.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* District */}
                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                🏙️ {text.selectDistrict}
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder={text.enterDistrict}
                                value={district}
                                onChange={(e) =>
                                    setDistrict(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="d-grid mt-4">

                        <button
                            className="btn btn-success btn-lg"
                            onClick={handleAnalyze}
                            disabled={loading}
                        >
                            {loading
                                ? `⏳ ${text.analyzing}`
                                : `📊 ${text.analyzeDemand}`}
                        </button>

                    </div>

                </div>

            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    ⚠️ {error}
                </div>
            )}

            {/* Forecast */}
            {forecast && (
                <>

                    {/* Summary */}
                    <div className="card shadow-sm border-0 mb-4">

                        <div className="card-body p-4">

                            <h4 className="fw-bold mb-4">
                                📊 {text.forecastSummary}
                            </h4>

                            <div className="row g-4">

                                {/* Score */}
                                <div className="col-md-4">

                                    <div className="card h-100 bg-light border-0">

                                        <div className="card-body text-center">

                                            <div
                                                className="display-4 fw-bold text-success"
                                            >
                                                {forecast.demandScore}
                                            </div>

                                            <div className="fw-semibold">
                                                {text.demandScore}
                                            </div>

                                            <div className="progress mt-3">

                                                <div
                                                    className="progress-bar bg-success"
                                                    role="progressbar"
                                                    style={{
                                                        width: `${forecast.demandScore}%`
                                                    }}
                                                ></div>

                                            </div>

                                            <small className="text-muted d-block mt-2">
                                                {text.scoreMeaning}
                                            </small>

                                        </div>

                                    </div>

                                </div>

                                {/* Level */}
                                <div className="col-md-4">

                                    <div className="card h-100 bg-light border-0">

                                        <div className="card-body text-center">

                                            <div
                                                style={{
                                                    fontSize: "45px"
                                                }}
                                            >
                                                {forecast.demandLevel ===
                                                "High"
                                                    ? "🔥"
                                                    : forecast.demandLevel ===
                                                      "Medium"
                                                    ? "📈"
                                                    : "📉"}
                                            </div>

                                            <h5 className="fw-bold">
                                                {getDemandLabel(
                                                    forecast.demandLevel
                                                )}
                                            </h5>

                                            <small className="text-muted">
                                                {text.demandLevel}
                                            </small>

                                        </div>

                                    </div>

                                </div>

                                {/* Expected Demand */}
                                <div className="col-md-4">

                                    <div className="card h-100 bg-light border-0">

                                        <div className="card-body text-center">

                                            <div
                                                style={{
                                                    fontSize: "45px"
                                                }}
                                            >
                                                📦
                                            </div>

                                            <h5 className="fw-bold">
                                                {
                                                    forecast.expectedDemand
                                                }{" "}
                                                {text.kg}
                                            </h5>

                                            <small className="text-muted">
                                                {text.expectedDemand}
                                            </small>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Marketplace Data */}
                    <div className="card shadow-sm border-0 mb-4">

                        <div className="card-body p-4">

                            <h4 className="fw-bold mb-4">
                                🛒 {text.marketplaceData}
                            </h4>

                            <div className="row g-3">

                                <div className="col-md-3">

                                    <div className="border rounded p-3 h-100">

                                        <small className="text-muted">
                                            {text.currentSupply}
                                        </small>

                                        <h4 className="fw-bold mt-2">
                                            {
                                                forecast.currentListedQuantity
                                            }{" "}
                                            {text.kg}
                                        </h4>

                                    </div>

                                </div>

                                <div className="col-md-3">

                                    <div className="border rounded p-3 h-100">

                                        <small className="text-muted">
                                            {text.totalOrders}
                                        </small>

                                        <h4 className="fw-bold mt-2">
                                            {forecast.totalOrders}
                                        </h4>

                                    </div>

                                </div>

                                <div className="col-md-3">

                                    <div className="border rounded p-3 h-100">

                                        <small className="text-muted">
                                            {text.historicalDemand}
                                        </small>

                                        <h4 className="fw-bold mt-2">
                                            {
                                                forecast.historicalOrderedQuantity
                                            }{" "}
                                            {text.kg}
                                        </h4>

                                    </div>

                                </div>

                                <div className="col-md-3">

                                    <div className="border rounded p-3 h-100">

                                        <small className="text-muted">
                                            {text.recentDemand}
                                        </small>

                                        <h4 className="fw-bold mt-2">
                                            {
                                                forecast.recentOrderedQuantity
                                            }{" "}
                                            {text.kg}
                                        </h4>

                                        <small className="text-muted">
                                            {forecast.recentOrders}{" "}
                                            {text.orders}
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Analysis */}
                    <div className="row g-4">

                        <div className="col-md-6">

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body p-4">

                                    <h4 className="fw-bold">
                                        📈 {text.demandAnalysis}
                                    </h4>

                                    <hr />

                                    <p className="mb-2">
                                        <strong>
                                            {text.demandLevel}:
                                        </strong>{" "}
                                        {getDemandLabel(
                                            forecast.demandLevel
                                        )}
                                    </p>

                                    <p className="mb-2">
                                        <strong>
                                            {text.expectedDemand}:
                                        </strong>{" "}
                                        {forecast.expectedDemand}{" "}
                                        {text.kg}
                                    </p>

                                    <p className="mb-0">
                                        <strong>
                                            {text.demandScore}:
                                        </strong>{" "}
                                        {forecast.demandScore}/100
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-6">

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body p-4">

                                    <h4 className="fw-bold">
                                        📦 {text.supplyAnalysis}
                                    </h4>

                                    <hr />

                                    <p className="mb-0">
                                        <strong>
                                            {text.supplyStatus}:
                                        </strong>{" "}
                                        {getSupplyStatus(
                                            forecast.supplyStatus
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Recommendation */}
                    <div className="card shadow-sm border-0 mt-4">

                        <div className="card-body p-4">

                            <h4 className="fw-bold">
                                💡 {text.recommendation}
                            </h4>

                            <div className="alert alert-success mt-3 mb-0">

                                {getRecommendation(
                                    forecast.recommendationCode
                                )}

                            </div>

                        </div>

                    </div>

                    {/* Transparency */}
                    <div className="alert alert-info mt-4">

                        <strong>ℹ️</strong>{" "}
                        {text.transparency}

                    </div>

                </>
            )}

        </div>
    );
}