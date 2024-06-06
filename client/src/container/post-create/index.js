import "./index.css";

import Grid from "../../component/grid";
import Field from "../../component/field";
import { useReducer, memo, useCallback } from "react";
import { Alert, Loader } from "../../component/load";
import {
  requestReducer,
  requestInitialState,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

function PostCreate({ onCreate, placeholder, button, id = null }) {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const convertData = useCallback(
    ({ value }) =>
      JSON.stringify({
        text: value,
        username: "user",
        postId: id,
      }),
    [id]
  );

  const sendData = useCallback(
    async (dataToSend) => {
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
    },
    [convertData, onCreate]
  );

  const handleSubmit = useCallback(
    (value) => {
      return sendData({ value });
    },
    [sendData]
  );

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

export default memo(PostCreate, (prev, next) => {
  return true;
});
