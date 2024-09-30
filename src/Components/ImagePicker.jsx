import styles from "./ImagePicker.module.css";
import { useRef, useState } from "react";
export default function ImagePicker() {
  const pictureRef = useRef();
  const [picture, setPicture] = useState(null);
  function handleClick() {
    pictureRef.current.click();
  }

  function handleChoosingPicture(event) {
    const file = event.target.files[0];
    if (!file) {
      setPicture(null);
      return;
    }
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPicture(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }
  return (
    <div className={styles.pictureContainer}>
      <input
        ref={pictureRef}
        name="image"
        required
        type="file"
        accept="image/*"
        onChange={(e) => handleChoosingPicture(e)}
        className={styles.photo}
      />
      <button
        onClick={handleClick}
        type="button"
        className={styles.pictureButton}
      >
        Upload a picture
      </button>
      <img className={styles.picture} src={picture} />
    </div>
  );
}
