import React, {createContext, useRef, useContext, useEffect, useState} from 'react';

const FooterContext = createContext();

export function FooterProvider({children}) {
  const footerRef = useRef(null);
  const [isFooterReady, setIsFooterReady] = useState(false);

  useEffect(() => {
    if (footerRef.current) {
      setIsFooterReady(true);
    }
  }, [footerRef]);

  return (
    <FooterContext.Provider value={{footerRef, isFooterReady}}>
      {children}
      <footer ref={footerRef} className="footer">
        {/* Содержимое футера */}
      </footer>
    </FooterContext.Provider>
  );
}

export function useFooterRef() {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('useFooterRef must be used within a FooterProvider');
  }
  return context;
}
