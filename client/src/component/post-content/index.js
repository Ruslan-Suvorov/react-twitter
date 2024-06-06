import "./index.css";
import Grid from "../grid";
import { getDate } from "../../util/getDate";
import { memo } from "react";

function PostContent({ username, text, date }) {
  return (
    <Grid>
      <div className="post-content">
        <span className="post-content__username">@{username}</span>
        <span className="post-content__date">{getDate(date)}</span>
      </div>
      <p className="post-content__text">{text}</p>
    </Grid>
  );
}

export default memo(PostContent);
