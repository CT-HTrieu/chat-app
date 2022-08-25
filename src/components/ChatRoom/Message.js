import React, { useEffect,useState } from "react";
import { Avatar, Typography, Image, Popconfirm } from "antd";
import styled from "styled-components";
import { DeleteOutlined } from "@ant-design/icons";
import { formatRelative } from "date-fns/esm";
import { auth } from "../../firebase/config";
import { db } from "../../firebase/config";

const WrapperStyled = styled.div`
  margin-bottom: 10px;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
  }
`;

function formatDate(seconds) {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export default function Message({
  text,
  createdAt,
  imageUrl,
  id,
  uid,
  members
}) {
  const temp = auth.currentUser;
  const remodeMessge = async (id) => {
    await db.collection("messages").doc(id).delete();
  };
  const confirm = () => {
        remodeMessge(id);
  };
  return (
    <WrapperStyled>
      <div>
        <Avatar size="small" src={members.photoURL}>
         {members && members.photoURL ? "" : members.displayName?.charAt(0).toUpperCase()} 
        </Avatar>
        <Typography.Text className="author"> {members.displayName}</Typography.Text>
        <Typography.Text className="date">
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>
      <div>
        <Typography.Text className="content">
          {text}{" "}
          {uid === temp.uid ? (
            <Popconfirm
              placement="right"
              title={'Bạn chắc chắn muốn xoá'}
              onConfirm={confirm}
              okText="Yes"
              cancelText="No"
            >
              <a style={{ position: "relative", top: "-2px" }}>
                <DeleteOutlined />
              </a>
            </Popconfirm>
          ) : (
            ""
          )}
        </Typography.Text>
        <div className="content">
          {imageUrl &&
            imageUrl.map((item) => {
              return <Image width={100} height={100} src={item} />;
            })}
        </div>
      </div>
    </WrapperStyled>
  );
}
