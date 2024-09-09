import React, {useEffect, useState} from 'react';
import Modal from '../Modal/Modal';
import styles from './survey.module.scss';
import {getSurvey, getUserAnswered, sendAnswers} from '../../helpers/survey/survey';
import {useSelector} from 'react-redux';

const SurveyModal = () => {
  let userId = useSelector(state => state.auth.user.id);
  const SurveyId = 1;
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnswered, setIsAnswered] = useState(true);
  const [isFullyAnsw, setIsFullyAnsw] = useState(false);
  const [survey, setSurvey] = useState(null);

  const fetchIsAnswered = async () => {
    const res = await getUserAnswered(SurveyId);
    setIsAnswered(res.isAnswered);
  };

  const fetchSurvey = async () => {
    const res = await getSurvey(SurveyId);
    setQuestions(res.Questions);
    setSurvey({...res, Question: undefined});
    setIsOpen(true);
  };

  useEffect(() => {
    fetchIsAnswered();
  }, []);

  useEffect(() => {
    if (!isAnswered) {
      fetchSurvey();
    }
  }, [isAnswered]);

  useEffect(() => {
    setSelectedAnswers(
      questions.reduce((acc, question) => {
        acc[question.id] = question.type === 'yes_no' ? null : '';
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

  const handleTextAnswerChange = (questionId, event) => {
    const answer = event.target.value;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

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
      {isOpen && survey && (
        <Modal open={isOpen} classname_box={'survey'} onClose={() => {}}>
          <h1>{survey.description}</h1>
          {questions.map(question => (
            <div key={question.id} className={styles.survey__question}>
              <p>{question.text}</p>
              <div className={styles.survey__button__wrapper}>
                {question.type === 'yes_no' ? (
                  question.answers.map(answ => (
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
                  ))
                ) : (
                  <textarea
                    value={selectedAnswers[question.id] || ''}
                    onChange={e => handleTextAnswerChange(question.id, e)}
                    className={styles.survey__textarea}
                  />
                )}
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
