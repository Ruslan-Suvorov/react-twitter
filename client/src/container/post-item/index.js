import { Fragment, useEffect, useState } from "react";
import PostContent from "../../component/post-content";
import Box from "../../component/box";
import "./index.css";
import Grid from "../../component/grid";
import PostCreate from "../post-create";
import { Alert, LOAD_STATUS, Loader } from "../../component/load";

export default function PostItem({ id, username, text, date }) {
  const [data, setData] = useState({
    id,
    username,
    text,
    date,
    reply: [],
  });
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    //if (status === null) getData();
    setOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      getData();
    }
  }, [isOpen]);

  const getData = async () => {
    setStatus(LOAD_STATUS.LOADING);

    try {
      const res = await fetch(`http://localhost:4000/post-item?id=${data.id}`);

      const resData = await res.json();

      if (res.ok) {
        setData(convertData(resData));
        setStatus(LOAD_STATUS.SUCCESS);
      } else {
        setMessage(resData.message);
        setStatus(LOAD_STATUS.ERROR);
      }
    } catch (err) {
      setMessage(err.message);
      setStatus(LOAD_STATUS.ERROR);
    }
  };

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

  return (
    <Box>
      <div
        style={{
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        <PostContent
          username={data.username}
          text={data.text}
          date={data.date}
        />
      </div>

      {isOpen && (
        <Grid style={{ "padding-right": "40px", "margin-top": "20px" }}>
          <Box>
            <PostCreate
              placeholder="Post your reply!"
              button="Reply"
              id={data.id}
              onCreate={getData}
            />
          </Box>
          {status === LOAD_STATUS.LOADING && (
            <>
              <Alert status={status} message="Loading..." />
              <Loader />
            </>
          )}
          {status === LOAD_STATUS.ERROR && (
            <Alert status={status} message={message} />
          )}
          {data.reply.length !== 0 &&
            data.reply.map((item) => (
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
