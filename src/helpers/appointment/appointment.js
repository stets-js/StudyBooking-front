import axios from "../axios-config";

axios.create({
  withCredentials: true,
});

const postAppointment = (credentials) => {
  return axios
    .post("/register_appointment", credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getAppointment = ({ id }) => {
  return axios
    .get(`/appointment/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getAppointmentByCrm = (credentials) => {
  return axios
    .post(`/search`, credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const putAppointment = (credentials) => {
  const token = localStorage.getItem("booking");
  return axios
    .post(`/update_superad_appointment`, credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "rescheduled",
      };

      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      );

      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

const createAppointment = (
  link,
  managerId,
  weekId,
  dayIndex,
  time,
  courseId,
  phone,
  age,
  message,
  callerName,
  appointmentType
) => {
  const authToken = localStorage.getItem("booking");

  return axios
    .post(
      `/create_appointment/${weekId}/${dayIndex}/${time}/${courseId}/${phone ? phone : "0"}/${age}/${managerId}/${
        message ? message : "0"
      }/${callerName}/${appointmentType}`,
      link, 
      {
        // Set the Authorization header with the retrieved token
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "created",
      };

      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      );

      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

const swapAppointmentManagers = (credentials) => {
  const token = localStorage.getItem("booking");
  return axios
    .post(`/swap_appointments`, credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "swapped",
      };

      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      );

      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

export {
  getAppointment,
  postAppointment,
  createAppointment,
  putAppointment,
  getAppointmentByCrm,
  swapAppointmentManagers,
};
