import React, {useEffect, useState} from 'react';
import Modal from '../Modal/Modal';
import styles from './survey.module.scss';
import {getSurvey, sendAnswers} from '../../helpers/survey/survey';
import {useSelector} from 'react-redux';

const SurveyModal = () => {
  let userId = useSelector(state => state.auth.user.id);
  const SurveyId = 1;
  const [isOpen, setIsOpen] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const fetchSurvey = async () => {
    const res = await getSurvey(SurveyId);
    console.log(res);
    setQuestions(res.Questions);
  };

  useEffect(() => {
    fetchSurvey();
  }, []);
  useEffect(() => {
    setSelectedAnswers(
      questions.reduce((acc, question) => {
        acc[question.id] = null;
        return acc;
      }, {})
    );
  }, [questions]);
  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };
  const [isFullyAnsw, setIsFullyAnsw] = useState(false);
  useEffect(() => {
    if (Object.values(selectedAnswers).every(answer => answer !== null)) {
      setIsFullyAnsw(true);
    } else {
      setIsFullyAnsw(false);
    }
  }, [selectedAnswers]);

  const handleConfirm = async () => {
    const res = await sendAnswers(userId, selectedAnswers, SurveyId);
    console.log(res);
    setIsOpen(false);
  };
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} classname_box={'survey'}>
          <h1>Вітаю! Це обов'язкове опитування опитування!</h1>
          {questions.map(question => (
            <div key={question.id} className={styles.survey__question}>
              <p>{question.text}</p>
              <div className={styles.survey__button__wrapper}>
                {question.answers.map(answ => (
                  <div
                    key={answ}
                    className={`${styles.survey__button} ${
                      selectedAnswers[question.id] === answ ? styles.selected : ''
                    }`}
                    onClick={() => handleAnswerSelect(question.id, answ)}>
                    <input
                      type="radio"
                      id={`${question.id}${answ}`}
                      name={question.id}
                      value={answ}
                      className={styles.survey__button__input}
                      checked={selectedAnswers[question.id] === answ}
                      onChange={() => handleAnswerSelect(question.id, answ)}
                    />
                    <label htmlFor={`${question.id}${answ}`}>{answ}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div>
            <button
              className={styles.survey__complete__button}
              disabled={!isFullyAnsw}
              onClick={e => {
                e.preventDefault();
                handleConfirm();
              }}>
              Підтвердити!
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SurveyModal;
