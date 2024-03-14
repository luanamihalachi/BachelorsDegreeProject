import React, { useState } from "react";
import { IntlProvider } from "react-intl";
import Romanian from "../../locales/ro.json";
import AmericanEnglish from "../../locales/en.json";

export const Context = React.createContext();

const local = navigator.language;

let lang;
if (local === "ro-RO") {
  lang = Romanian;
} else {
  lang = AmericanEnglish;
}

const Wrapper = (props) => {
  const [locale, setLocale] = useState(local);
  const [messages, setMessages] = useState(lang);

  function selectLang(e) {
    const newLocale = e.target.value;
    setLocale(newLocale);
    if (newLocale === "ro-RO") {
      setMessages(Romanian);
    } else {
      setMessages(AmericanEnglish);
    }
  }

  return (
    <Context.Provider value={{ locale, selectLang }}>
      <IntlProvider messages={messages} locale={locale}>
        {props.children}
      </IntlProvider>
    </Context.Provider>
  );
};

export default Wrapper;
