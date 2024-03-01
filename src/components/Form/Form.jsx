import {defaults, error, success} from '@pnotify/core';
import React, {useState} from 'react';
import {Fade} from 'react-awesome-reveal';

import InputDelete from '../InputDelete/InputDelete';
import InputSubmit from '../InputSubmit/InputSubmit';
import OpenChangeManagerCourses from '../OpenChangeManagerCourses/OpenChangeManagerCourses';
import ChangeManagerCourses from '../modals/ChangeManagerCourses/ChangeManagerCourses';
import styles from './Form.module.scss';
import {postSubGroup} from '../../helpers/subgroup/subgroup';
import {bulkUpdate} from '../../helpers/slot/slot';
import {getAppointmentTypes} from '../../helpers/teacher/appointment-type';
import {createReplacement} from '../../helpers/replacement/replacement';

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
  startRole,
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

  const handleSubmit = async event => {
    event.preventDefault();
    if (type.type === 'no-request-test') {
      return onSubmit();
    }
    if (type.type === 'no-request') {
      if (onSubmit && !inputCancelClicked) {
        return onSubmit();
        // .catch((e) => {
        //   error(`${status.failMessage}, ${e.message}`);
        // })
        // .then(() => {
        //   // success(status.successMessage);
        // });
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
      for (var pair of data.entries()) {
        jsonData[pair[0]] = pair[1];
      }

      if (type.type === 'appointment') {
        jsonData.slots = JSON.parse(jsonData.slots);
        // 0 - group, 1 - private
        const searchQuery = `name=${
          JSON.parse(jsonData.isReplacement) ? 'replacement' : 'appointed'
        }_${Number(jsonData.appointmentType) === 0 ? 'group' : 'private'}`;
        const appointmentType = await getAppointmentTypes(searchQuery);
        return await (jsonData?.isReplacement && JSON.parse(jsonData.isReplacement)
          ? createReplacement(jsonData)
          : postSubGroup(jsonData)
        )
          .then(async data => {
            success({text: status.successMessage || 'Success', delay: 1000});
            for (let i = 0; i <= 6; i++) {
              // week itterating
              if (jsonData.slots[i].length > 0) {
                const body = {
                  weekDay: i,
                  time: jsonData.slots[i],
                  appointmentTypeId: appointmentType.data[0]['id'],
                  userId: userId,
                  startDate: jsonData.startDate,
                  endDate: jsonData.endDate
                };
                body[JSON.parse(jsonData.isReplacement) ? 'replacementId' : 'subgroupId'] =
                  data.data.id;

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

      // if (+role === 2 && type.type === 'post') {
      //   onSubmit();
      //   return await requests.post(data);
      // }
      if (type.type === 'login') {
        onSubmit();
        return await requests.login(data);
      }
      if (type.type === 'user') {
        const user = {
          name: data.get('name'),
          email: data.get('email'),
          password: data.get('password'),
          RoleId: role,
          rating: data.get('rating'),
          id: userId
        };
        onSubmit();
        const newUser = await requests.user(user);
        SetNeedToRender(true);
        success({text: 'Created/edited user', delay: 1000});
        return newUser;
      }
      if (manager) {
        console.log('123');
        const res = await requests.getByName(startName.trim());
        onSubmit();
        return await requests.user(data, res.data.id).catch(() => {
          return error(status.failMessage);
        });
      }
      if (type.type === 'post') {
        console.log(data);
        return await requests
          .post(data)
          .catch(e => {
            return error(`${e.response.data.message ? e.response.data.message : e.message}`);
          })
          .then(() => {
            success(status.successMessage || 'Success');
            SetNeedToRender(true);
            return !errorsuccessMessage && onSubmit && onSubmit();
          });
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
      error(`${e.response.data.message ? e.response.data.message : e.message}`);
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (role === 2) {
      const res = await requests.getByName(startName.trim());
      onSubmit();
      return await requests
        .managerDelete(res.data.id)
        .catch(() => {
          return error(status.failMessageDelete);
        })
        .then(() => {
          return success(status.successMessageDelete);
        });
    }

    await requests
      .delete(requests.additional)
      .catch(e => {
        return error(`${status.failMessageDelete}, ${e.message}`);
      })
      .then(() => {
        return success(status.successMessageDelete);
      });
    if (+role === 2 && type.additionalType === 'delete') {
      const res = await requests.getByName(startName.trim());
      await requests.userDelete(res.data.id).catch(e => {
        return error(`${status.failMessageDelete}, ${e.message}`);
      });
    }
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
          {type.additionalType && <InputDelete handleDelete={handleDelete} />}
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
          {/* {isCancel ? (
            <InputCancel
              InputCancelFunc={reason => {
                setInputCancelClicked(true);
                removeSlot(slotId, reason, removeMessage);
                onClose();
              }}
            />
          ) : (
            ''
          )} */}
          {!isSetAppointment && edit ? (
            <>
              <OpenChangeManagerCourses
                OpenChangeManagerCoursesFunc={setIsChangeManagerCoursesOpen}
                curState={isChangeManagerCoursesOpen}
              />

              {isChangeManagerCoursesOpen ? (
                <ChangeManagerCourses
                  teacherId={id}
                  handleClose={() => {
                    setIsChangeManagerCoursesOpen(!isChangeManagerCoursesOpen);
                  }}
                />
              ) : null}
            </>
          ) : (
            ''
          )}
        </div>
      </form>
      {type.type === 'no-request-test' && data.length > 0 && data[0] !== 0 && data[0] !== undefined
        ? data.map((item, i) => {
            return (
              <React.Fragment key={i}>
                <Fade cascade triggerOnce duration={300} direction="up">
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
