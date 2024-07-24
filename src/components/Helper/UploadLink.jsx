import React, {useRef} from 'react';
import {useSelector} from 'react-redux';

import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';

import styles from './Helper.module.scss';
import {storage} from '../../helpers/firebase';

export default function UploadLink({data, setData}) {
  const userName = useSelector(state => state.auth.user.name);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const uploadImage = async files => {
    if (files === null || files === undefined) return;

    //
    const links = await Promise.all(
      Object.values(files).map(async (file, index) => {
        const storageRef = ref(storage, 'bugOrIdea/' + (userName || 'noneName') + file.name);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      })
    );
    console.log(links);
    setData(prev => {
      return {...prev, links: links};
    });
    // const res = await updateBlockProject(marathon._id, blockId, myProject._id, {files: links});
    // setMyProject(res);
  };

  const handleFileChange = event => {
    const files = event.target.files;
    if (files.length > 0) {
      // Логика загрузки файла
      uploadImage(files);
    }
  };

  return (
    <>
      {data.links.map((link, index) => (
        <div>
          <a href={link} alt="link">
            link {index + 1}
          </a>
        </div>
      ))}
      <button className={styles.form__add} onClick={handleButtonClick}>
        Додати скріншот
      </button>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
    </>
  );
}
