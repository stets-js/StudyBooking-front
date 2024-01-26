import styles from "./ChangeUser.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";

import { putUser, deleteUser, getRoles } from "../../../helpers/user/user";
import {
  putManager,
  postManager,
  deleteManager,
  getManagerByName,
} from "../../../helpers/manager/manager";
import FormInput from "../../FormInput/FormInput";
import Select from "../../Select/Select";
import Form from "../../Form/Form";
const ChangeUser = ({
  isOpen,
  handleClose,
  id,
  dataName,
  dataDesc,
  dataRole,
  // manager,
  dataLogin,
  // dataPassword,
  administrator,
  dataTeam,
  dataSlack
}) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(2);
  const [team, setTeam] = useState("");
  const [slack, setSlack] = useState("");
  
  useEffect(() => {
    setName(dataName);
    setDesc(dataDesc);
    setRole(dataRole);
    setLogin(dataLogin);
    setSlack(dataSlack);
    setTeam(dataTeam);
    // setPassword(dataPassword);
  }, [isOpen, dataDesc, dataLogin, dataRole, dataName, dataSlack, dataTeam]);

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{ type: "put", additionalType: "delete" }}
            requests={{
              put: putUser,
              additional: id,
              delete: deleteUser,
              user: putManager,
              post: postManager,
              getByName: getManagerByName,
              managerDelete: deleteManager,
            }}
            startRole={dataRole}
            role={role}
            startName={dataName}
            name={name}
            id={id}
            onSubmit={() => {
              handleClose();
              setRole("");
              setDesc("");
              setPassword("");
              setLogin("");
              setName("");
              setSlack("");
              setTeam("");
            }}
            rating={desc}
            slack={slack}
            team={team}
            login={login}
            status={{
              successMessage: "Successfully changed user",
              failMessage: "Failed to change user",
              successMessageDelete: "Successfully deleted user",
              failMessageDelete: "Failed to delete user",
            }}
            password={password}
            role_id={role}
            title="Change user's info"
          >
            <FormInput
              title="Name:"
              type="text"
              name="name"
              max={50}
              value={name}
              placeholder="Name"
              isRequired={true}
              handler={setName}
            />
            {dataRole === 2 && <FormInput
              title="Rating:"
              type="text"
              max={50}
              name="rating"
              value={desc}
              placeholder="Rating"
              isRequired={true}
              handler={setDesc}
            />}
            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Login:"
                type="text"
                name="login"
                max={50}
                value={login}
                placeholder="Login"
                isRequired={true}
                handler={setLogin}
              />
              <FormInput
                classname="input__bottom"
                title="Password:"
                type="password"
                name="password"
                value={password}
                max={50}
                isRequired={true}
                placeholder="Password"
                handler={setPassword}
              />
            </div>{" "}
            {dataRole === 2 &&  <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Slack:"
                type="text"
                name="slack"
                max={50}
                value={slack}
                placeholder="Slack"
                // isRequired={true}
                handler={setSlack}
              />
              <FormInput
                classname="input__bottom"
                title="Team:"
                type="text"
                name="team"
                value={team}
                max={2}
                placeholder="Team"
                //isRequired={true}
                handler={setTeam}
              />
            </div>}
            <Select
              title="Role:"
              request={getRoles}
              setValue={setRole}
              value={role}
              administrator={administrator}
              manager={true}
              defaultValue="manager/caller/confirmator"
            ></Select>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeUser;
