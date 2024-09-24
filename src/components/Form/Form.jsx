import {defaults, error, success} from '@pnotify/core';
import React, {useState} from 'react';
import {Fade} from 'react-awesome-reveal';

import InputDelete from '../InputDelete/InputDelete';
import InputSubmit from '../InputSubmit/InputSubmit';
import OpenChangeManagerCourses from '../OpenChangeManagerCourses/OpenChangeManagerCourses';
import ChangeManagerCourses from '../modals/ChangeManagerCourses/ChangeManagerCourses';
import styles from './Form.module.scss';
import {
  postSubGroup,
  updateSubGroup,
  updateSubGroupAndAddMentor
} from '../../helpers/subgroup/subgroup';
import {bulkUpdate} from '../../helpers/slot/slot';
import {getAppointmentTypes} from '../../helpers/teacher/appointment-type';
import {createReplacement, updateReplacement} from '../../helpers/replacement/replacement';
import {cleanTeacherCourses} from '../../redux/action/course.action';
import {useDispatch} from 'react-redux';
import {deleteOneLesson, patchLesson} from '../../helpers/lessons/lesson';
import {addMinutes, format} from 'date-fns';
import {useTranslation} from 'react-i18next';
const root = document.querySelector('#root');

defaults.delay = 1000;

const Form = ({
  onClose,
  type,
  postpone,
  postponeClick,
  onSubmit,
  title,
  id,
  requests,
  children,
  width,
  text,
  role,
  startName,
  handleClose,
  isDelete,
  isCancel,
  isDescription,
  manager,
  buttonTitle,
  data,
  status,
  slotId,
  cancelConfConsultOnClickFn,
  isCancelConfConsult,
  signUp,
  userId,
  removeMessage,
  edit, // flag for edit flow
  editButton, // flag for button
  changeCourses = false,
  ...formData
}) => {
  const {t} = useTranslation('global');

  const [isOpen, setIsOpen] = useState(false);
  const [isChangeManagerCoursesOpen, setIsChangeManagerCoursesOpen] = useState(false);
  const [errorsuccessMessage, setError] = useState(false);
  const [inputCancelClicked, setInputCancelClicked] = useState(false);
  const dispatch = useDispatch();
  const onSubmitModified = () => {
    console.log('submiting');
    onSubmit();
    document.body.style.overflow = 'auto';
    root.style.overflow = 'auto';
    console.log('submited');
  };
  const handleSubmit = async event => {
    event.preventDefault();
    document.body.style.overflow = 'auto';
    root.style.overflow = 'auto';
    if (type.type === 'no-request-test') {
      return onSubmit();
    }
    if (type.type === 'no-request') {
      if (onSubmit && !inputCancelClicked) {
        return onSubmit();
      }
      setInputCancelClicked(false);
      return;
    }
    try {
      event.preventDefault();
      const data = new FormData();

      for (const i in formData) {
        if (formData[i] === undefined) {
          continue;
        }

        data.append(i, formData[i]);
      }
      let jsonData = {};
      for (var pair of data.entries()) jsonData[pair[0]] = pair[1];

      if (type.type === 'subGroup') {
        return await updateSubGroup({id, body: jsonData})
          .then(() => {
            success({text: status.successMessage || 'Success', delay: 1000});
            return !errorsuccessMessage && onSubmit && onSubmitModified();
          })
          .catch(e => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }
      if (type.type === 'replacement') {
        return await updateReplacement(jsonData, id)
          .then(() => {
            success({text: status.successMessage || 'Success', delay: 1000});
            return !errorsuccessMessage && onSubmit && onSubmitModified();
          })
          .catch(e => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }
      if (type.type.includes('appointment')) {
        jsonData.slots = JSON.parse(jsonData.slots);
        // 0 - group, 1 - private, 2 - junior_group
        const isReplacement = JSON.parse(jsonData.isReplacement);
        const appointmentType = Number(jsonData.appointmentType);
        console.log(appointmentType);
        const appointmentTypeId =
          appointmentType === 1
            ? isReplacement // group
              ? 9
              : 7
            : appointmentType === 2 // private
            ? isReplacement
              ? 10
              : 8
            : isReplacement // kids group
            ? 12
            : 11;
        // const appointmentType = await getAppointmentTypes(searchQuery);
        if (isReplacement) {
          await patchLesson(jsonData.lessonId, {status: 'replaced'});
          // await deleteOneLesson(jsonData.lessonId); //delete lesson that is replaced
        }
        if (JSON.parse(jsonData.MIC_flag)) {
          const subgroup = await postSubGroup({
            name: jsonData.subgroupId,
            CourseId: jsonData.selectedCourse
          }); // in this case inside subgroupId is string with name
          jsonData = {...jsonData, subgroupId: +subgroup.data.id};
        }
        // return console.log(jsonData.slots);
        return await (isReplacement
          ? createReplacement(jsonData, userId)
          : updateSubGroupAndAddMentor({id: jsonData.subgroupId, body: jsonData, userId})
        )
          .then(async data => {
            console.log(data);
            const replacementId = isReplacement ? data.data.id : undefined;
            // console.log(data, newDocId);
            success({text: status.successMessage || 'Success', delay: 1000});
            for (let i = 0; i <= 6; i++) {
              // week itterating
              if (jsonData.slots[i].length > 0) {
                console.log(jsonData.slots[i]);
                jsonData.slots[i].forEach(async slot => {
                  if (slot.schedule && slot.schedule.weekDayOrigin === i) {
                    const time = [];
                    for (let j = 0; j < slot.rowSpan; j++) {
                      time.push(
                        format(addMinutes(new Date(`1970 ${slot.schedule.start}`), 30 * j), 'HH:mm')
                      );
                    }
                    const body = {
                      weekDay: i,
                      time: time,
                      rowSpan: slot.rowSpan,
                      appointmentTypeId: appointmentTypeId,
                      userId: jsonData.mentorId,
                      startDate: jsonData.startDate,
                      endDate: jsonData.endDate,
                      subgroupId: +jsonData.subgroupId,
                      ReplacementId: replacementId
                    };

                    // body[isReplacement ? 'ReplacementId' : 'subgroupId'] = newDocId;
                    await bulkUpdate(body);
                  }
                  // console.log(body);
                });
              }
            }
            return !errorsuccessMessage && onSubmit && onSubmitModified();
          })
          .catch(e => {
            console.log(e);
            return error(`${status.failMessage}, ${e.message}`);
          });
      }
      if (type.type === 'put') {
        return await requests
          .put(jsonData, requests.additional)
          .then(() => {
            success({text: status.successMessage, delay: 1000});
            // SetNeedToRender(true);
            return !errorsuccessMessage && onSubmit && onSubmitModified();
          })
          .catch(e => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }

      if (type.type === 'login') {
        onSubmitModified();
        return await requests.login(data);
      }
      if (type.type === 'user') {
        const user = {
          name: jsonData.name,
          email: jsonData.email,
          password: jsonData.password,
          RoleId: role,
          rating: jsonData.rating,
          id: userId,
          city: jsonData.city,
          phone: jsonData.phone
        };
        onSubmitModified();
        const newUser = await requests.user(user);
        success({text: 'Created/edited user', delay: 1000});
        return newUser;
      }

      if (type.type === 'post') {
        try {
          const res = await requests.post({credentials: data, jsonData});
          success({text: status.successMessage, delay: 1000});
          return !errorsuccessMessage && onSubmit && onSubmitModified();
        } catch (e) {
          console.log(e);
          return error('Something went wrong :(');
        }
      }

      await requests[type.type](data, requests.additional)
        .catch(e => {
          return error(`${e.response.data.message ? e.response.data.message : e.message}`);
        })
        .then(() => {
          success(status.successMessage);
          return !errorsuccessMessage && onSubmit && onSubmitModified();
        });
    } catch (e) {
      setError(!errorsuccessMessage);
      error(`${e?.response?.data?.message ? e?.response?.data?.message : e?.message}`);
      console.error(e);
    }
  };

  const handleDelete = async () => {
    console.log(requests.delete);
    try {
      await requests.delete(requests.additional);
      success({delay: 1000, text: status.successMessageDelete});
    } catch (e) {
      return error(`${status.failMessageDelete}, ${e.message}`);
    }

    !errorsuccessMessage && onSubmit && onSubmitModified();
  };

  return (
    <div className={styles.modal} style={{width: width}}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <form
        onSubmit={e => {
          handleSubmit(e);
        }}
        className={styles.form}>
        {children}
        <div className={styles.button__wrapper}>
          {type.button === 'login' && (
            <button
              type="button"
              onClick={e => {
                handleSubmit(e);
              }}
              className={styles.login}>
              Log in
            </button>
          )}

          {!type.button && !editButton && (
            <InputSubmit buttonTitle={buttonTitle ? buttonTitle : t('buttons.save')} />
          )}
          {isCancelConfConsult && <InputDelete handleDelete={cancelConfConsultOnClickFn} />}
          {postpone && (
            <button
              className={styles.input__submit}
              type="button"
              onClick={() => {
                postponeClick();
                handleClose();
              }}>
              Postpone
            </button>
          )}
          {isCancel ? <></> : ''}
          {changeCourses && edit ? (
            <>
              <OpenChangeManagerCourses
                OpenChangeManagerCoursesFunc={setIsChangeManagerCoursesOpen}
                curState={isChangeManagerCoursesOpen}
              />

              {isChangeManagerCoursesOpen ? (
                <ChangeManagerCourses
                  teacherId={userId}
                  handleClose={() => {
                    dispatch(cleanTeacherCourses([]));
                    setIsChangeManagerCoursesOpen(!isChangeManagerCoursesOpen);
                  }}
                />
              ) : null}
            </>
          ) : (
            ''
          )}
          {type.additionalType && <InputDelete handleDelete={handleDelete} />}
        </div>
      </form>
      {type.type === 'no-request-test' && data.length > 0 && data[0] !== 0 && data[0] !== undefined
        ? data.map((item, i) => {
            return (
              <React.Fragment key={i}>
                <Fade cascade triggerOnce duration={300} direction="up">
                  <></>
                  <div className={styles.appointment} onClick={() => setIsOpen(!isOpen)}>
                    <p className={styles.appointment__data}>
                      {item.date.slice(0, 11)}, {item.hour > 9 ? item.hour : '0' + item.hour}:00{' '}
                      {item.course}, {item.manager_name}, {item.phone}{' '}
                    </p>
                  </div>
                </Fade>
              </React.Fragment>
            );
          })
        : type.type === 'no-request-test' &&
          data[0] === undefined && (
            <p className={styles.appointment__data}>
              There are no scheduled appointments for this CRM link
            </p>
          )}
      {text}
      {type.type !== 'no-request-test' && (
        <p
          className={styles.exit}
          onClick={() => {
            onSubmitModified();
          }}>
          {t('modals.ex')}
        </p>
      )}
    </div>
  );
};

export default Form;
