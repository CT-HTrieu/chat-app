import React, { useState } from "react";
import {
  Button,
  Avatar,
  Typography,
  Modal,
  Row,
  Col,
  Input,
  Upload,
  Image,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { db } from "../../firebase/config";

import styled from "styled-components";

import { auth } from "../../firebase/config";
import { AuthContext } from "../../Context/AuthProvider";
import { AppContext } from "../../Context/AppProvider";
import { generateKeywords } from "../../firebase/services";

const { Title } = Typography;
const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;

export default function UserInfo() {
  const {
    user: { displayName, uid, photoURL },
    setUser
  } = React.useContext(AuthContext);
  const { clearState } = React.useContext(AppContext);
  const [isShow, setIsShow] = useState(false);
  const [display, setDisplay] = useState(displayName);
  const [imageUrl, setImageUrl] = useState(photoURL);
  const createBase64Image = (fileobj) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(fileobj);
    });
  };
  const handleChange = async (e) => {
    const temp = await createBase64Image(e);
    let bytes = temp.length;
    if (bytes > 1048487) {
      message.error("Upload thất bại");
    } else {
      setImageUrl(temp);
    }
  };
  async function editProfile() {
    const user = auth.currentUser;
    try {
      await user.updateProfile({
        displayName: display,
        photoURL: imageUrl,
      });
      let documents = [];
      const temp = await db.collection("users").where("uid", "==", uid);
      temp.onSnapshot(async(snapshot) => {
        documents = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        if (documents) {
        await  db.collection("users")
            .doc(documents[0].id)
            .update({
              displayName: display,
              photoURL: imageUrl,
              keywords: generateKeywords(display.toLowerCase()),
            });
        }
      });
      user.sendEmailVerification().then(() => {
        message.success("Gửi Email thành công");
      });
      setUser({
        displayName:user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        uid:user.uid, 
      })
      setIsShow(false);
    } catch (error) {
      message.error(error.message);
    }
  }

  return (
    <WrapperStyled>
      <div>
        <Avatar
          src={photoURL}
          onClick={() => {
            setIsShow(true);
          }}
        >
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          // clear state in App Provider when logout
          clearState();
          auth.signOut();
        }}
      >
        Đăng xuất
      </Button>
      <Modal
        visible={isShow}
        title={"Chỉnh sửa thông tin cá nhân"}
        onCancel={() => setIsShow(false)}
        onOk={editProfile}
      >
        <Row justify="center">
          <Col span={16}>
            <Title style={{ textAlign: "left" }} level={5}>
              Nick Name
            </Title>
            <Input
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
            />
          </Col>
          <Col span={16}>
            <Title style={{ textAlign: "left" }} level={5}>
              Ảnh
            </Title>
            <Image src={imageUrl} width={200} height={200} />
            <Upload
              beforeUpload={handleChange}
              accept="image/*"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Col>
        </Row>
      </Modal>
    </WrapperStyled>
  );
}
