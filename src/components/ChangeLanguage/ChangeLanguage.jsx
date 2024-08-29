import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch'

export default function ChangeLanguage() {
  const {t,i18n} = useTranslation('global')
  const [isEnLang, setIsEnLang] = useState(true)
  
  return (
    <>
<label>
        <span>ua</span>
        <Switch
          uncheckedIcon={false}
          checkedIcon={false}
          onChange={() => {
            i18n.changeLanguage(isEnLang ? 'ua' : 'en');
            setIsEnLang(!isEnLang);

          }}
          checked={isEnLang}
        />
        <span>en</span>
      </label>
    </>
  );
}
