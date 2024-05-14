import React from 'react';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';

const MICWrapper = ({hideLogo = false, hideLogin = false, bottom_padding = false}) => {
  return (
    <>
      <Header
        MIC_flag
        hideLogo={hideLogo}
        hideLogin={hideLogin}
        endpoints={[
          {
            text: 'Appointment',
            path: path.appointments
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
