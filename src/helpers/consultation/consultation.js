import axios from "../axios-config";

const postConsultationResult = (slotId, result, groupId, message, unsuccessfulMessage) => {
  const formattedMessage = message || "no text";  // Замінюємо відсутній message на пустий рядок
  const formattedUnsuccessfulMessage = unsuccessfulMessage || "no text";  // Замінюємо відсутній unsuccessfulMessage на пустий рядок

  const endpointPath = `/consultation_result/${slotId}/${result}/${groupId}/${formattedMessage}/${formattedUnsuccessfulMessage}`;
  return axios
    .post(
      endpointPath
    )
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "attended",
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

const postStartConsultation = (weekId, dayIndex, slotHour, managerId) => {
  return axios
    .post(`/start_consultation/${weekId}/${dayIndex}/${slotHour}/${managerId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export { postConsultationResult, postStartConsultation };
