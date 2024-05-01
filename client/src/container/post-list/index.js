import Grid from "../../component/grid";
import Box from "../../component/box";
import Title from "../../component/title";
import "./index.css";
import PostCreate from "../post-create";
import { Fragment, useState } from "react";
import { LOAD_STATUS, Skeleton, Alert, Loader } from "../../component/load";
import PostItem from "../post-item";

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

  if (status === null) getData();

  return (
    <Grid>
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
