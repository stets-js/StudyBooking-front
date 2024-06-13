import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';

import Form from '../../Form/Form';
import FormInput from '../../FormInput/FormInput';
import InfoButton from '../../Buttons/Info';
import {postFeedback} from '../../../helpers/feedback/feedback';

const WriteFeedback = ({isOpen, handleClose, id}) => {
  const [feedback, setFeedback] = useState({
    report: null
  });

  const onSubmit = async () => {
    const res = await postFeedback({...feedback, lessonId: id});
    if (res) {
      handleClose();
      feedback.report = null;
      feedback.lessonId = null;
    }
  };
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <FormInput
            title="Report"
            value={feedback?.report}
            placeholder={'Report..'}
            textArea
            handler={e =>
              setFeedback(prevFeedback => ({
                ...prevFeedback,
                report: e
              }))
            }></FormInput>
          <InfoButton
            text="Save"
            onClick={() => {
              onSubmit();
            }}></InfoButton>
        </Modal>
      )}
    </>
  );
};

export default WriteFeedback;
