import {defaults, error, success} from '@pnotify/core';
import React, {useState} from 'react';
import {Fade} from 'react-awesome-reveal';

import InputDelete from '../InputDelete/InputDelete';
import InputSubmit from '../InputSubmit/InputSubmit';
import OpenChangeManagerCourses from '../OpenChangeManagerCourses/OpenChangeManagerCourses';
import ChangeManagerCourses from '../modals/ChangeManagerCourses/ChangeManagerCourses';
import styles from './Form.module.scss';
import {updateSubGroup} from '../../helpers/subgroup/subgroup';
import {bulkUpdate} from '../../helpers/slot/slot';
import {getAppointmentTypes} from '../../helpers/teacher/appointment-type';
import {createReplacement, updateReplacement} from '../../helpers/replacement/replacement';
import {cleanTeacherCourses} from '../../redux/action/course.action';
import {useDispatch} from 'react-redux';

defaults.delay = 1000;

const Form = ({
  onClose,
  type,
  postpone,
  postponeClick,
  onSubmit,
  SetNeedToRender,
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
  isSetAppointment = false,
  edit,
  ...formData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChangeManagerCoursesOpen, setIsChangeManagerCoursesOpen] = useState(false);
  const [errorsuccessMessage, setError] = useState(false);
  const [inputCancelClicked, setInputCancelClicked] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async event => {
    event.preventDefault();
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
        return await updateSubGroup(id, jsonData)
          .then(() => {
            success({text: status.successMessage || 'Success', delay: 1000});
            return !errorsuccessMessage && onSubmit && onSubmit();
          })
          .catch(e => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }
      if (type.type === 'replacement') {
        return await updateReplacement(jsonData, id)
          .then(() => {
            success({text: status.successMessage || 'Success', delay: 1000});
            return !errorsuccessMessage && onSubmit && onSubmit();
          })
          .catch(e => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }
      if (type.type === 'appointment') {
        jsonData.slots = JSON.parse(jsonData.slots);
        console.log(jsonData.slots, userId);
        // 0 - group, 1 - private, 2 - junior_group
        const searchQuery = `name=${
          JSON.parse(jsonData.isReplacement) ? 'replacement' : 'appointed'
        }_${
          Number(jsonData.appointmentType) === 0
            ? 'group'
            : Number(jsonData.appointmentType) === 1
            ? 'private'
            : 'junior_group'
        }`;
        const appointmentType = await getAppointmentTypes(searchQuery);
        return await (jsonData?.isReplacement && JSON.parse(jsonData.isReplacement)
          ? createReplacement(jsonData, userId)
          : updateSubGroup({id: jsonData.subgroupId, body: jsonData, userId})
        )
          .then(async data => {
            success({text: status.successMessage || 'Success', delay: 1000});
            for (let i = 0; i <= 6; i++) {
              // week itterating
              if (jsonData.slots[i].length > 0) {
                const body = {
                  weekDay: i,
                  time: jsonData.slots[i].map(el => el.time),
                  appointmentTypeId: appointmentType.data[0]['id'],
                  userId: jsonData.mentorId,
                  startDate: jsonData.startDate,
                  endDate: jsonData.endDate
                };
                body[JSON.parse(jsonData.isReplacement) ? 'replacementId' : 'subgroupId'] =
                  jsonData.subgroupId;
                await bulkUpdate(body);
              }
            }

            return !errorsuccessMessage && onSubmit && onSubmit();
          })
          .catch(e => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }

      if (type.type === 'put') {
        return await requests
          .put(jsonData, requests.additional)
          .then(() => {
            success({text: status.successMessage, delay: 1000});
            // SetNeedToRender(true);
            return !errorsuccessMessage && onSubmit && onSubmit();
          })
          .catch(e => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }

      if (type.type === 'login') {
        onSubmit();
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
        onSubmit();
        const newUser = await requests.user(user);
        SetNeedToRender(true);
        success({text: 'Created/edited user', delay: 1000});
        return newUser;
      }

      if (type.type === 'post') {
        return await requests
          .post({credentials: data, jsonData})
          .catch(e => {
            return error(`${e.response.data.message ? e.response.data.message : e.message}`);
          })
          .then(() => {
            success({text: status.successMessage, delay: 1000});
            if (SetNeedToRender) SetNeedToRender(true);
            return !errorsuccessMessage && onSubmit && onSubmit();
          })
          .catch(e => {});
      }

      await requests[type.type](data, requests.additional)
        .catch(e => {
          return error(`${e.response.data.message ? e.response.data.message : e.message}`);
        })
        .then(() => {
          success(status.successMessage);
          return !errorsuccessMessage && onSubmit && onSubmit();
        });
    } catch (e) {
      setError(!errorsuccessMessage);
      error(`${e?.response?.data?.message ? e?.response?.data?.message : e?.message}`);
      console.error(e);
    }
  };

  const handleDelete = async () => {
    await requests
      .delete(requests.additional)
      .catch(e => {
        return error(`${status.failMessageDelete}, ${e.message}`);
      })
      .then(() => {
        return success({delay: 1000, text: status.successMessageDelete});
      });

    !errorsuccessMessage && onSubmit && onSubmit();
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

          {!type.button && <InputSubmit buttonTitle={buttonTitle ? buttonTitle : 'Save'} />}
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
          {!isSetAppointment && edit ? (
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
      {type.type !== 'no-request-test' && <p className={styles.exit}>Click outside to exit</p>}
    </div>
  );
};

export default Form;
