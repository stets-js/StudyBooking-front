import Modal from '../../Modal/Modal';
import React, {useEffect, useState} from 'react';
import {getCourses} from '../../../helpers/course/course';
import FormInput from '../../FormInput/FormInput';
import Form from '../../Form/Form';
import Select from 'react-select';
import styles from '../../../styles/FormInput.module.scss';
import {postSubGroup} from '../../../helpers/subgroup/subgroup';
import {useTranslation} from 'react-i18next';

const NewSubgroup = ({isOpen, handleClose}) => {
  const {t} = useTranslation('global');

  const [courses, setCourses] = useState([]);
  const [subgroup, setSubgroup] = useState({name: '', description: '', CourseId: null});
  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(
        res.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      {isOpen && (
        <Modal
          open={isOpen}
          onClose={() => {
            setSubgroup({name: '', description: '', CourseId: null});

            handleClose();
          }}>
          <Form
            onSubmit={() => {
              setSubgroup({name: '', description: '', CourseId: null});
              handleClose();
            }}
            type={{type: 'post'}}
            requests={{
              post: postSubGroup
            }}
            status={{
              successMessage: 'Successfully created subgroup',
              failMessage: 'Failed to create subgroup'
            }}
            subgroup={JSON.stringify(subgroup)}
            title={t('modals.newSub.title')}>
            <FormInput
              title={t('modals.newSub.name') + ':'}
              type="text"
              name="name"
              value={subgroup.name}
              placeholder={t('modals.newSub.name')}
              isRequired={true}
              handler={e => {
                setSubgroup({...subgroup, name: e});
              }}
            />

            <label htmlFor="Courses" className={styles.input__label}>
              <p className={styles.input__title}>{t('modals.newSub.course')}: </p>
            </label>
            <Select
              defaultValue={courses.filter(course => course.value === subgroup.CourseId)}
              className={styles.selector}
              options={courses}
              name="Courses"
              required
              onChange={choice => setSubgroup({...subgroup, CourseId: choice.value})}
            />
            <FormInput
              title={t('modals.newSub.desc')}
              type="text"
              name="description"
              value={subgroup.description}
              textArea={true}
              placeholder="Description"
              handler={e => {
                setSubgroup({...subgroup, description: e});
              }}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewSubgroup;
