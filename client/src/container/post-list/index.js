import Grid from "../../component/grid";
import Box from "../../component/box";
import Title from "../../component/title";
import "./index.css";
import PostCreate from "../post-create";
import { Fragment, useState, useEffect } from "react";
import { LOAD_STATUS, Skeleton, Alert, Loader } from "../../component/load";
import PostItem from "../post-item";
import { useWindowListener } from "../../util/useWindowListener";

export default function PostList() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);

  const getData = async () => {
    setStatus(LOAD_STATUS.LOADING);

    try {
      const res = await fetch("http://localhost:4000/post-list");

      const data = await res.json();

      if (res.ok) {
        setData(convertData(data));
        setStatus(LOAD_STATUS.SUCCESS);
      } else {
        setMessage(data.message);
        setStatus(LOAD_STATUS.ERROR);
      }
    } catch (err) {
      setMessage(err.message);
      setStatus(LOAD_STATUS.ERROR);
    }
  };
  const convertData = (data) => ({
    list: data.list.reverse().map(({ id, username, text, date }) => ({
      id,
      username,
      text,
      date,
    })),
    isEmpty: data.list.length === 0,
  });

  // if (status === null) getData();

  useEffect(() => {
    getData();

    const intervalId = setInterval(() => getData(), 5000);
    return () => {
      clearInterval(intervalId);
    };
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

      <div
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
      ></div>

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
      {status === LOAD_STATUS.LOADING && (
        <>
          <Box>
            <Skeleton />
          </Box>
          <Box>
            <Skeleton />
          </Box>
        </>
      )}
      {status === LOAD_STATUS.ERROR && (
        <Alert status={status} message={message} />
      )}
      {status === LOAD_STATUS.LOADING && <Loader />}
      {status === LOAD_STATUS.SUCCESS && (
        <>
          {data.isEmpty ? (
            <Alert status={LOAD_STATUS.SUCCESS} message="No posts yet!" />
          ) : (
            data.list.map((post) => (
              <Fragment key={post.id}>
                <PostItem {...post} />
              </Fragment>
            ))
          )}
        </>
      )}
    </Grid>
  );
}
