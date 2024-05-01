import "./index.css";

import Grid from "../../component/grid";
import Field from "../../component/field";
import { useState } from "react";
import { Alert, Loader, LOAD_STATUS } from "../../component/load";

export default function PostCreate({
  onCreate,
  placeholder,
  button,
  id = null,
}) {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (value) => {
    return sendData({ value });
  };

  const sendData = async (dataToSend) => {
    setStatus(LOAD_STATUS.LOADING);

    try {
      const res = await fetch("http://localhost:4000/post-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: convertData(dataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(LOAD_STATUS.SUCCESS);
        if (onCreate) onCreate();
      } else {
        setMessage(data.message);
        setStatus(LOAD_STATUS.ERROR);
      }
    } catch (err) {
      setMessage(err.message);
      setStatus(LOAD_STATUS.ERROR);
    }
  };

  const convertData = ({ value }) =>
    JSON.stringify({
      text: value,
      username: "user",
      postId: id,
    });

  return (
    <Grid>
      <Field
        placeholder={
          status === LOAD_STATUS.LOADING ? "Sending..." : placeholder
        }
        button={button}
        onSubmit={handleSubmit}
      />
      {status === LOAD_STATUS.ERROR && (
        <Alert status={status} message={message} />
      )}
      {status === LOAD_STATUS.LOADING && <Loader />}
    </Grid>
  );
}
