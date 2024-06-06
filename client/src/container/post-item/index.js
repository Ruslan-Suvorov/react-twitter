import {
  Fragment,
  useEffect,
  useState,
  useReducer,
  useCallback,
  lazy,
  memo,
} from "react";
import PostContent from "../../component/post-content";
import Box from "../../component/box";
import "./index.css";
import Grid from "../../component/grid";
import { Alert, Loader } from "../../component/load";
import {
  requestReducer,
  requestInitialState,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

const PostCreate = lazy(() => import("../post-create"));

function PostItem({ id, username, text, date }) {
  const [state, dispatch] = useReducer(
    requestReducer,
    requestInitialState,
    (state) => ({
      ...state,
      data: {
        id,
        username,
        text,
        date,
        reply: [],
      },
    })
  );

  const getData = useCallback(async () => {
    dispatch({ type: REQUEST_ACTION_TYPE.LOADING });

    try {
      const res = await fetch(
        `http://localhost:4000/post-item?id=${state.data.id}`
      );

      const resData = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(resData),
        });
      } else {
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: resData.message,
        });
      }
    } catch (err) {
      dispatch({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: err.message,
      });
    }
  }, [state.data.id]);

  const convertData = ({ post }) => ({
    id: post.id,
    username: post.username,
    text: post.text,
    date: post.date,
    reply: post.reply.reverse().map(({ id, username, text, date }) => ({
      id,
      username,
      text,
      date,
    })),
    isEmpty: post.reply.length === 0,
  });

  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      getData();
    }
  }, [isOpen]);

  return (
    <Box>
      <div
        style={{
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        <PostContent
          username={state.data.username}
          text={state.data.text}
          date={state.data.date}
        />
      </div>

      {isOpen && (
        <Grid style={{ "padding-right": "40px", "margin-top": "20px" }}>
          <Box>
            <PostCreate
              placeholder="Post your reply!"
              button="Reply"
              id={state.data.id}
              onCreate={getData}
            />
          </Box>
          {state.status === REQUEST_ACTION_TYPE.LOADING && (
            <>
              <Alert status={state.status} message="Loading..." />
              <Loader />
            </>
          )}
          {state.status === REQUEST_ACTION_TYPE.ERROR && (
            <Alert status={state.status} message={state.message} />
          )}
          {state.status === REQUEST_ACTION_TYPE.SUCCESS &&
            state.data.reply.length !== 0 &&
            state.data.reply.map((item) => (
              <Fragment key={item.id}>
                <Box>
                  <PostContent {...item} />
                </Box>
              </Fragment>
            ))}
        </Grid>
      )}
    </Box>
  );
}

export default memo(PostItem, (prev, next) => {
  return true;
});
