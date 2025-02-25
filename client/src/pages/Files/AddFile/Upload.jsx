import axios from "axios";
import React, { useState } from "react";

const Upload = () => {
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file) return alert("No se ha subido ningún archivo");

      if (file.size > 4024 * 4024 * 2) return alert("Archivo demasiado grande");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("Formato de archivo no soportado");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/newFile`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
          withCredentials: true
        }
      );

      setLoading(false);
      setImages({
        data: res.data,
        url: res.data.newFile.secure_url,
        id: res.data.newFile.public_id,
      });
      console.log(res.data);
    } catch (err) {
      alert(err.message);
    }
  };
  //   const handleDelete = async (e) => {
  //     e.preventDefault();
  //     try {
  //       setLoading(true);
  //       await axios.post(
  //         `http://localhost:5000/post/deletePost`,
  //         { public_id: images.id },
  //         {
  //           headers: {
  //             token: window.sessionStorage.token,
  //           },
  //         }
  //       );
  //       setLoading(false);

  //       setImages(false);
  //     } catch (err) {
  //       alert(err.message);
  //     }
  //   };

  console.log(images);

  // const styleUpload = {
  //   display: images ? "block" : "none",
  // };

  const defaultImage =
    "https://st3.depositphotos.com/19428878/36349/v/600/depositphotos_363499050-stock-illustration-default-avatar-profile-vector-user.jpg";

  return (
    <div>
      <div>
        {loading ? (
          <div></div>
        ) : (
          // <div style={styleUpload}>
          <div className="containerImagePreview">
            <img
              src={images ? images.url : defaultImage}
              alt="foto"
              className="imagePreviewUpload"
            />
            {/* <span onClick={handleDelete} className="deleteImagePreview">X</span> */}
          </div>
        )}
        <label className="inputImageUpload">
          Subir Foto
          <input type="file" name="file" onChange={handleUpload} />
        </label>
      </div>
    </div>
  );
};

export default Upload;
