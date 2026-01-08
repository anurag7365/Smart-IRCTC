import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
    'EN': {
        'Train Search': 'TRAIN SEARCH',
        'Book Ticket': 'BOOK TICKET',
        'PNR Status': 'PNR STATUS',
        'Charts / Vacancy': 'CHARTS / VACANCY',
        'From': 'From',
        'To': 'To',
        'Date': 'DD/MM/YYYY *',
        'All Classes': 'All Classes',
        'General': 'General',
        'Search': 'Search',
        'Welcome': 'Welcome',
        'Login': 'LOGIN',
        'Register': 'REGISTER',
        'Agent Login': 'AGENT LOGIN',
        'Logout': 'LOGOUT',
        'Trains': 'TRAINS',
        'Contact Us': 'CONTACT US',
        'Safety': 'Safety | Security | Punctuality',
        'Indian Railways': 'INDIAN RAILWAYS',
        'Enter PNR': 'Enter PNR No.',
        'Check Status': 'Check Status',
        'Person With Disability Concession': 'Person With Disability Concession',
        'Flexible With Date': 'Flexible With Date',
        'Train with Available Berth': 'Train with Available Berth',
        'Railway Pass Concession': 'Railway Pass Concession',
        'Language': 'हिंदी'
    },
    'HI': {
        'Train Search': 'ट्रेन खोजें',
        'Book Ticket': 'टिकट बुक करें',
        'PNR Status': 'पीएनआर स्थिति',
        'Charts / Vacancy': 'चार्ट / रिक्ति',
        'From': 'से',
        'To': 'तक',
        'Date': 'दिनांक *',
        'All Classes': 'सभी श्रेणियां',
        'General': 'सामान्य',
        'Search': 'खोजें',
        'Welcome': 'स्वागत है',
        'Login': 'लॉग इन',
        'Register': 'पंजीकरण',
        'Agent Login': 'एजेंट लॉग इन',
        'Logout': 'लॉग आउट',
        'Trains': 'ट्रेनें',
        'Contact Us': 'संपर्क करें',
        'Safety': 'सुरक्षा | संरक्षा | समयपालन',
        'Indian Railways': 'भारतीय रेलवे',
        'Enter PNR': 'पीएनआर नंबर दर्ज करें',
        'Check Status': 'स्थिति देखें',
        'Person With Disability Concession': 'दिव्यांगजन रियायत',
        'Flexible With Date': 'वैकल्पिक तिथियों के साथ',
        'Train with Available Berth': 'उपलब्ध बर्थ वाली ट्रेन',
        'Railway Pass Concession': 'रेलवे पास रियायत',
        'Language': 'English'
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('EN'); // EN or HI

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'EN' ? 'HI' : 'EN');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
