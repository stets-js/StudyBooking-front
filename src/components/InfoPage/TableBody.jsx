import React from 'react';
import {useParams} from 'react-router-dom';

import tableStyles from '../../styles/table.module.scss';
import formInput from '../../styles/FormInput.module.scss';

import EditButton from '../Buttons/Edit';
import InfoButton from '../Buttons/Info';
import DeleteButton from '../Buttons/Delete';
import {addUserDocument, updateUserDocument} from '../../helpers/document/user-document';
import {useSelector} from 'react-redux';
import {useState} from 'react';

export default function InfoTableBody({documents, userDocuments, setUserDocuments}) {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId;
  const [edit, setEdit] = useState(false);
  const [addFlag, setAddFlag] = useState(-1); // -1 for inactive add functional, and numbers for indexing rows
  const [duplicatedDocs, setDuplicatedDocs] = useState(userDocuments);
  const [inputUrl, setInputUrl] = useState('');
  const submitDocument = async documentId => {
    console.log(inputUrl);
    const res = await addUserDocument({
      userId,
      documentId,
      document: inputUrl
    });
    console.log(res);
    if (res && !res.message.includes('added'))
      setUserDocuments(prev => {
        return prev.map(oneDoc => {
          if (oneDoc.DocumentTypeId === documentId) return res.userDocument[1][0];
          return oneDoc;
        });
      });
    else setUserDocuments(prev => [...prev, res.userDocument]);
  };

  return (
    <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
      <table className={tableStyles.tableBody}>
        <tbody>
          {documents.length > 0 &&
            documents.map((document, index) => {
              return (
                <tr key={document.id}>
                  <td>
                    <div className={`${tableStyles.cell} ${tableStyles.cell__outer}`}>
                      {document.name}
                    </div>
                  </td>
                  <td>
                    {addFlag !== index ? (
                      <div
                        className={`${tableStyles.cell} ${tableStyles.cell__break} ${
                          edit
                            ? tableStyles.cell__outer
                            : index === 0 || index === documents.length - 1
                            ? tableStyles.cell__outer
                            : tableStyles.cell__inner
                        }`}>
                        {(() => {
                          const doc = (edit ? duplicatedDocs : userDocuments || []).find(
                            userDocument => userDocument.DocumentTypeId === document.id
                          );
                          if (!doc || doc.documents.length === 0) return 'No documents found';
                          const docList = doc.documents;
                          return docList.map((eachUrl, index) => {
                            return (
                              <>
                                <span> {eachUrl}</span>
                                {edit && (
                                  <button
                                    className={tableStyles.delete_icon}
                                    onClick={() => {
                                      setDuplicatedDocs(prev => {
                                        return prev.map(element => {
                                          if (element.DocumentTypeId === doc.DocumentTypeId) {
                                            return {
                                              ...element,
                                              documents: element.documents.filter(
                                                (url, i) => i !== index
                                              )
                                            };
                                          }
                                          return element;
                                        });
                                      });
                                    }}></button>
                                )}
                                {index !== docList.length - 1 && <span>{', '}</span>}
                              </>
                            );
                          });
                        })()}
                      </div>
                    ) : (
                      <div
                        className={`${tableStyles.cell} ${tableStyles.cell__break} ${
                          edit
                            ? tableStyles.cell__outer
                            : index === 0 || index === documents.length - 1
                            ? tableStyles.cell__outer
                            : tableStyles.cell__inner
                        }`}>
                        <input
                          className={formInput.input}
                          placeholder="Place url here"
                          value={inputUrl}
                          onChange={e => {
                            setInputUrl(e.currentTarget.value);
                          }}
                          type="text"></input>
                      </div>
                    )}
                  </td>
                  {!edit && (
                    <td>
                      <div className={`${tableStyles.cell} ${tableStyles.cell__outer}`}>
                        {addFlag !== index ? (
                          <InfoButton
                            text={'Add'}
                            onClick={() => {
                              setAddFlag(index);
                            }}></InfoButton>
                        ) : (
                          <EditButton
                            text="Save"
                            onClick={async () => {
                              const res = await submitDocument(document.id);
                              console.log(123);
                              setAddFlag(-1);
                              setInputUrl('');
                            }}></EditButton>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
      {edit && (
        <>
          <DeleteButton text={'Cancel'} onClick={() => setEdit(!edit)}></DeleteButton>
          <EditButton
            text={'Update'}
            onClick={async () => {
              duplicatedDocs.forEach(async (duplicatedDoc, index) => {
                if (
                  JSON.stringify(duplicatedDoc.documents) !==
                  JSON.stringify(userDocuments[index].documents)
                ) {
                  try {
                    const {data} = await updateUserDocument(duplicatedDoc);
                    if (data?.documents) {
                      console.log('here?');
                      setUserDocuments(prev => {
                        return prev.map(oneDoc => {
                          if (oneDoc.DocumentTypeId === data.DocumentTypeId) return data;
                          return oneDoc;
                        });
                      });
                    } else {
                      console.log('here');
                      setUserDocuments(prev => {
                        return prev.filter(
                          item => item.DocumentTypeId !== duplicatedDoc.DocumentTypeId
                        );
                      });
                    }
                  } catch (e) {
                    console.log(e);
                  }
                }
              });
              setEdit(!edit);
            }}></EditButton>
        </>
      )}
      {addFlag !== -1 && <DeleteButton text="Cancel" onClick={() => setAddFlag(-1)}></DeleteButton>}{' '}
      {!edit && addFlag === -1 && (
        <EditButton
          onClick={() => {
            setAddFlag(-1);
            setDuplicatedDocs(userDocuments);
            setEdit(true);
          }}></EditButton>
      )}
    </div>
  );
}
