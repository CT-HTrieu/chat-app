import React, { useState } from "react";
import { Row, Col, Button, Typography, Input, Modal, message } from "antd";
import { FacebookOutlined, GooglePlusOutlined } from "@ant-design/icons";
import firebase, { auth } from "../../firebase/config";

import { addDocument, generateKeywords } from "../../firebase/services";

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
export default function Login() {
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (provider) => {
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider);
    sendToEmail();
    if (additionalUserInfo?.isNewUser) {
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId,
        keywords: generateKeywords(user.displayName?.toLowerCase()),
      });
    }
  };

  const handleOk = async () => {
    if(email){
      const res =  await auth.sendPasswordResetEmail(email)
      message.success("Gửi Email thành công");
      setShowForgot(false);
    }
   
  };

  const handleCancel = () => {
    setShowForgot(false);
  };
  async function Signin() {
    try {
      const { additionalUserInfo, user } =
        await auth.signInWithEmailAndPassword(email, password);
      // sendToEmail();
    } catch (error) {
      message.error(error.message);
    }
  }
  const sendToEmail = () => {
    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
          firebaseUser.sendEmailVerification().then(function() {
            message.success("Gửi Email thành công");
          }, function(error) {
              console.log('not send Verification');
          });
      } else {
          console.log('not logged in');
          document.getElementById('btnLogout').style.display = 'none';
      }
  })
  };
  async function SignUp() {
    try {
      const { additionalUserInfo, user } =
        await auth.createUserWithEmailAndPassword(email, password);
        sendToEmail();
        addDocument("users", {
          displayName: user.email,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: additionalUserInfo.providerId,
          keywords: generateKeywords(user.email?.toLowerCase()),
        });
    } catch (error) {
      message.error(error.message);
    }
  }
  return (
    <div>
      {/* <Row justify='center' style={{ height: 800 }}>
        <Col span={8}>
          <Title style={{ textAlign: 'center' }} level={3}>
            Fun Chat
          </Title>
          <Button
            style={{ width: '100%', marginBottom: 5 }}
            onClick={() => handleLogin(googleProvider)}
          >
            Đăng nhập bằng Google
          </Button>
          <Button
            style={{ width: '100%' }}
            onClick={() => handleLogin(fbProvider)}
          >
            Đăng nhập bằng Facebook
          </Button>
        </Col>
      </Row> */}
      <Modal
        title="Xác nhận Email"
        visible={showForgot}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </Modal>
      <div className="container">
        <div className="row g-0 mt-5 mb-5 height-100">
          <div className="col-md-6">
            <div className="bg-dark p-4 h-100 sidebar">
              <ul className="chart-design">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="bg-white p-4 h-100">
              <div className="p-3 d-flex justify-content-center flex-column align-items-center">
                {" "}
                <span className="main-heading">Signin To Cever</span>
                <ul className="social-list mt-3">
                  <li onClick={() => handleLogin(fbProvider)}>
                    {/* <i className="fa fa-facebook"></i> */}
                    <FacebookOutlined />
                  </li>
                  <li onClick={() => handleLogin(googleProvider)}>
                    {/* <i className="fa fa-google"></i>
                     */}
                    <GooglePlusOutlined />
                  </li>
                </ul>
                <div className="form-data">
                  {" "}
                  <label>Email</label>{" "}
                  <Input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="email"
                    className="form-control w-100"
                  />{" "}
                </div>
                <div className="form-data">
                  {" "}
                  <label>Password</label>{" "}
                  <Input.Password
                    value={password}
                    width={100}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className="form-control w-100"
                  />{" "}
                </div>
                <div className="d-flex justify-content-between w-100 align-items-center">
                  <a
                    className="text-decoration-none forgot-text"
                    onClick={() => {
                      setShowForgot(true);
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="signin-btn w-100 mt-2">
                  {" "}
                  <button onClick={Signin} className="btn btn-danger btn-block">
                    Signin
                  </button>{" "}
                  <button onClick={SignUp} className="btn btn-block">
                    Signup
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
