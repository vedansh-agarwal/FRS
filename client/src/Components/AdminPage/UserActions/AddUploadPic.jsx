import { useState, useEffect } from "react";
import {
  Modal,
  Fade,
  Stack,
  Grid,
  InputBase,
  Button,
  Box,
  Drawer,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addImageCamera,
  reset,
  resetImage,
  recognizeImage,
} from "../../../Redux/reducers/image";
import "../Admin.css";
import AddModal from "./AddModal";

const AddUploadPic = ({ uploadPic, setUploadPic, setCount, setAddOpen }) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.image.error);
  const resultCode = useSelector((state) => state.image.resultCode);
  const loading = useSelector((state) => state.image.loading);
  const user_id = useSelector((state) => state.image.user_id);
  const [selected, setSelected] = useState(false);
  const [files, setFiles] = useState();
  const image = useSelector((state) => state.image.base64img);
  useEffect(() => {
    if (resultCode === 211 && uploadPic === true) {
      setUploadPic(false);
      setAddOpen(true);
    }
  }, [resultCode]);

  const handleSubmit = () => {
    console.log(files);

    console.log("inside checkface");
    dispatch(recognizeImage());
  };
  const handleReset = () => {
    setFiles();
    dispatch(reset());
    setSelected(false);
  };

  const handleSelect = (e) => {
    const reader = new FileReader();
    var url = reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = (event) => {
      dispatch(addImageCamera({ image: event.target.result }));
    };
    setFiles(e.target.files[0]);
  };
  return (
    <>
      <Modal
        open={uploadPic}
        onClose={() => {
          setUploadPic(false);
          dispatch(resetImage());
          setFiles();
          setSelected(false);
        }}
      >
        <Fade in={uploadPic}>
          <Stack spacing={3} className='uploadPicStack'>
            {!image && (
              <input
                type='file'
                accept='.jpeg,.png'
                onChange={(e) => {
                  handleSelect(e);
                }}
              />
            )}
            {image && (
              <>
                <Box className='uploadPicBox'>
                  <img
                    src={image}
                    alt={"uploaded file"}
                    style={{ maxWidth: "400px" }}
                  />
                </Box>
                {error && (
                  <Typography variant='h6' align='center'>
                    {error}
                  </Typography>
                )}
                <Typography variant='h6' align='center'>
                  {user_id && error && <div>{user_id}</div>}
                  {resultCode === 200 && (
                    <div>Choose another face or the update in the database</div>
                  )}
                </Typography>
                {loading && (
                  <Box
                    sx={{
                      mx: "auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <Grid container justifyContent={"center"} columnGap={4}>
                  <Button variant='contained' onClick={handleReset}>
                    Reset
                  </Button>
                  <Button
                    variant='contained'
                    onClick={handleSubmit}
                    sx={{ display: resultCode === 200 ? "none" : "block" }}
                  >
                    Submit
                  </Button>
                </Grid>
              </>
            )}
          </Stack>
        </Fade>
      </Modal>
    </>
  );
};

export default AddUploadPic;
