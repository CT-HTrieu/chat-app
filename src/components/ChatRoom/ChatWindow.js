import { UserAddOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Tooltip,
  Avatar,
  Form,
  Input,
  Alert,
  Upload,
  message,
} from "antd";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import Thumnail from "./Thumnail";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    const tempImageUrl = fileList.map((item) => {
      return item.url;
    });
    addDocument("messages", {
      text: inputValue,
      uid,
      roomId: selectedRoom.id,
      imageUrl: tempImageUrl ? tempImageUrl : [],
    });
    setFileList([]);
    form.resetFields(["message"]);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };
  const condition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore("messages", condition);
  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);
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
    const temp = { file: e, url: await createBase64Image(e) };
    let bytes = temp.url.length;
    if (bytes > 1048487) {
      message.error("Upload thất bại");
    } else {
      setFileList([...fileList, temp]);
    }
  };
  const remove = (index) => {
    const temp = [...fileList];
    temp.splice(index, 1);
    setFileList(temp);
  };
  const getMember = (id)=>{
   const temp =   members.filter((item)=>item.uid === id);
      if(temp.length > 0){
            return {
               displayName: temp[0].displayName,
               photoURL: temp[0].photoURL
            }
      }
      else{
        return {
          displayName:"",
          photoURL: ""
       }
      }
  }
  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <p className="header__title">{selectedRoom.name}</p>
              <span className="header__description">
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="text"
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size="small" maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ""
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes,index) => (
                <Message
                  key={`${mes.id} ${index}`}
                  text={mes.text}
                  photoURL={photoURL}
                  displayName={displayName}
                  createdAt={mes.createdAt}
                  imageUrl={mes.imageUrl}
                  id={mes.id}
                  uid={mes.uid}
                  members={getMember(mes.uid)}
                />
              ))}
            </MessageListStyled>
            <div>
              <Thumnail files={fileList} remove={remove} />
            </div>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input
                
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                />
              </Form.Item>
              <Upload
                showUploadList={false}
                beforeUpload={handleChange}
                accept="image/*"
              >
                <Button>+</Button>
              </Upload>
              <Button type="primary" onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
