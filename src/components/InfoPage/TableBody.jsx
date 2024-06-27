import React from 'react';
import {useParams} from 'react-router-dom';

import tableStyles from '../../styles/table.module.scss';
import EditButton from '../Buttons/Edit';
import InfoButton from '../Buttons/Info';
import DeleteButton from '../Buttons/Delete';
import {addUserDocument} from '../../helpers/document/user-document';
import {useSelector} from 'react-redux';
import {useState} from 'react';

export default function InfoTableBody({documents, userDocuments, setUserDocuments}) {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId;
  const [edit, setEdit] = useState(false);
  const [duplicatedDocs, setDuplicatedDocs] = useState(userDocuments);

  const addClick = async documentId => {
    const url = prompt('New url');

    const res = await addUserDocument({
      userId,
      documentId,
      document: url
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
                        if (!doc) return 'No documents found';
                        const docList = doc.documents;
                        return docList.map((eachUrl, index) => {
                          return (
                            <>
                              <span> {eachUrl}</span>
                              {edit && (
                                <button
                                  className={tableStyles.delete_icon}
                                  onClick={() => {
                                    console.log(index);
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
                  </td>
                  {!edit && (
                    <td>
                      <div className={`${tableStyles.cell} ${tableStyles.cell__outer}`}>
                        <InfoButton text="Add" onClick={() => addClick(document.id)}></InfoButton>
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
          <EditButton text={'Update'} onClick={() => setEdit(!edit)}></EditButton>
        </>
      )}
      {!edit && (
        <EditButton
          onClick={() => {
            setDuplicatedDocs(userDocuments);
            setEdit(true);
          }}></EditButton>
      )}
    </div>
  );
}
