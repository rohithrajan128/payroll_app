import en from './en.json'
import es from './es.json'
import it from './it.json'
import ar from './ar.json'

export const defaultLocale = localStorage.getItem('selected') || 'en';
// document.documentElement.defaultLocale = defaultLocale;
export const languages = {
    en: en,
    es: es,
    it: it,
    ar: ar

}