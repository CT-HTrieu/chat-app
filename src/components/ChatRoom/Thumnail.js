/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import icons from "../../icon/ic_trash.svg";
export default function Thumnail(props) {
  const { files, remove } = props;
  return (
    <div>
      <div className="gallery">
        {files &&
          files.map((item, idx) => {
            return (
              <div
                className="gallery-img-wrapper"
                key={idx}
              >
                <div className="img-layout">
                  <img src={item.url} alt={item.file.name} />
                  <img
                    className="top"
                    src={icons}
                    onClick={() => remove(idx)}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
