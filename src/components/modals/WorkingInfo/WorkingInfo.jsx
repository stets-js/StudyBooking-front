import styles from "./WorkingInfo.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";
import InputSubmit from "../../InputSubmit/InputSubmit";
import { getSlot, updateSlotComment } from "../../../helpers/slot/slot";

const WorkingInfo = ({ slotId, isOpen, handleClose }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      const get = async () => await getSlot({ id: slotId });
      get().then((data) => setMessage(data.comments));
    }
  }, [slotId, isOpen]);

  const updateCommentOnBackend = () => {
    try {
        const data = new FormData();
        data.append("id", slotId);
        data.append("message", message);
        return updateSlotComment(data).finally(() => {
          setMessage("");
          handleClose();
        });
    } catch (error) {
      console.error("Error updating comment on the backend", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    updateCommentOnBackend();
  };

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <h3 className={styles.title}>Working slot info</h3>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className={styles.form}
          >
            <label className={styles.input__label}>
              <p className={styles.input__label}>Comment</p>
              <textarea
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </label>
            <div className={styles.button__wrapper}>
              <InputSubmit buttonTitle={"Save"} />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default WorkingInfo;
