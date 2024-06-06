import Grid from "../../component/grid";
import Box from "../../component/box";
import Title from "../../component/title";
import PostCreate from "../post-create";
import "./index.css";
import {
  Fragment,
  useState,
  useEffect,
  useReducer,
  lazy,
  Suspense,
  useCallback,
} from "react";
import { Skeleton, Alert, Loader } from "../../component/load";
import { useWindowListener } from "../../util/useWindowListener";
import {
  requestReducer,
  requestInitialState,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

const PostItem = lazy(() => import("../post-item"));

export default function PostList() {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const getData = useCallback(async () => {
    dispatch({ type: REQUEST_ACTION_TYPE.LOADING });

    try {
      const res = await fetch("http://localhost:4000/post-list");

      const data = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(data),
        });
      } else {
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: data.message,
        });
      }
    } catch (err) {
      dispatch({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: err.message,
      });
    }
  }, []);
  const convertData = (data) => ({
    list: data.list.reverse().map(({ id, username, text, date }) => ({
      id,
      username,
      text,
      date,
    })),
    isEmpty: data.list.length === 0,
  });

  useEffect(() => {
    getData();

    // const intervalId = setInterval(() => getData(), 5000);
    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);

  const [position, setPosition] = useState({ x: 20, y: 20 });

  useWindowListener("pointermove", (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  const [location, setLocalion] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalion({ latitude, longitude });
        },
        (error) => {
          console.error("Помилка отримання локації", error.message);
        }
      );
    } else {
      console.error("Ваш браузер не дозволяє отримати геолокацію.");
    }
  }, []);

  return (
    <Grid>
      {location ? (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 0,
            zIndex: "100000",
          }}
        >
          <p>
            Location: Lat - {location.latitude} Long - {location.longitude}
          </p>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 0,
            zIndex: "100000",
          }}
        >
          <p>Loading location...</p>
        </div>
      )}

      {/* <div
        style={{
          position: "absolute",
          backgroundColor: "yellow",
          borderRadius: "50%",
          opacity: 0.4,
          transform: `translate(${position.x}px, ${position.y}px)`,
          pointerEvents: "none",
          left: -20,
          top: -20,
          width: 40,
          height: 40,
        }}
      ></div> */}

      <Box>
        <Grid>
          <Title>Home</Title>
          <PostCreate
            onCreate={getData}
            placeholder="What is happening?!"
            button="Post"
          />
        </Grid>
      </Box>
      {state.status === REQUEST_ACTION_TYPE.LOADING && (
        <>
          <Box>
            <Skeleton />
          </Box>
          <Box>
            <Skeleton />
          </Box>
        </>
      )}
      {state.status === REQUEST_ACTION_TYPE.ERROR && (
        <Alert status={state.status} message={state.message} />
      )}
      {state.status === REQUEST_ACTION_TYPE.LOADING && <Loader />}
      {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
        <>
          {state.data.isEmpty ? (
            <Alert
              status={REQUEST_ACTION_TYPE.SUCCESS}
              message="No posts yet!"
            />
          ) : (
            state.data.list.map((post) => (
              <Fragment key={post.id}>
                <Suspense
                  fallback={
                    <Box>
                      <Skeleton />
                    </Box>
                  }
                >
                  <PostItem {...post} />
                </Suspense>
              </Fragment>
            ))
          )}
        </>
      )}
    </Grid>
  );
}
