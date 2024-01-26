import styles from "./SignUp.module.scss";
import Modal from "../../Modal/Modal";
import FormInput from "../../FormInput/FormInput";
import React, { useState } from "react";
import { postManager } from "../../../helpers/manager/manager";
import { getRoles, postUser } from "../../../helpers/user/user";
import Form from "../../Form/Form";
import Select from "../../Select/Select";

const SignUp = ({ isOpen, handleClose }) => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(2);
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{ type: role === 2 ? "post" : "user", button: "signup" }}
            text={
              <p className={styles.exit}>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Log in
                </span>
              </p>
            }
            onSubmit={() => {
              handleClose();
              setRole(2);
              setPassword("");
              setLogin("");
              setName("");
            }}
            requests={{ post: postUser, user:  postManager}}
            // setValue={setData}
            // data={data}
            name={name}
            rating={0}
            login={login}
            password={password}
            role={role}
            title="Sign Up"
            signUp={true}
          >
            <FormInput
              title="Name, Surname:"
              type="text"
              name="username"
              value={name}
              placeholder="Name, Surname"
              isRequired={true}
              handler={setName}
            />
            <FormInput
                classname={styles.title}
                title="Login:"
                type="text"
                name="login"
                value={login}
                placeholder="Login"
                isRequired={true}
                handler={setLogin}
              />

            <FormInput
              title="Password:"
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              isRequired={true}
              handler={setPassword}
            />
            <Select
              title="Role:"
              request={getRoles}
              setValue={setRole}
              value={role}
              manager={true}
              defaultValue="manager/caller/confirmator"
              signUp={true}
            ></Select>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default SignUp;
