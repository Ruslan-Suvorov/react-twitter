import "./index.css";

import Grid from "../../component/grid";
import Field from "../../component/field";
import { useReducer } from "react";
import { Alert, Loader } from "../../component/load";
import {
  requestReducer,
  requestInitialState,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

export default function PostCreate({
  onCreate,
  placeholder,
  button,
  id = null,
}) {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const handleSubmit = (value) => {
    return sendData({ value });
  };

  const sendData = async (dataToSend) => {
    dispatch({ type: REQUEST_ACTION_TYPE.LOADING });

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
        dispatch({ type: REQUEST_ACTION_TYPE.RESET });
        if (onCreate) onCreate();
      } else {
        dispatch({ type: REQUEST_ACTION_TYPE.ERROR, message: data.message });
      }
    } catch (err) {
      dispatch({ type: REQUEST_ACTION_TYPE.ERROR, message: err.message });
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
          state.status === REQUEST_ACTION_TYPE.LOADING
            ? "Sending..."
            : placeholder
        }
        button={button}
        onSubmit={handleSubmit}
      />
      {state.status === REQUEST_ACTION_TYPE.ERROR && (
        <Alert status={state.status} message={state.message} />
      )}
      {state.status === REQUEST_ACTION_TYPE.LOADING && <Loader />}
    </Grid>
  );
}
