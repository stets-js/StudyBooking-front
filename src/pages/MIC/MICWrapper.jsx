import React from 'react';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const MICWrapper = ({hideLogo = false, hideLogin = false, bottom_padding = false}) => {
  return (
    <>
      <Header
        MIC
        hideLogo={hideLogo}
        hideLogin={hideLogin}
        endpoints={[
          {
            text: '',
            path: path.teacher
          }
        ]}
        bottom_padding={bottom_padding}
      />
      <section>
        <Outlet />
      </section>
    </>
  );
};

export default MICWrapper;
