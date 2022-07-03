import { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  Button,
  Stack,
  Box,
  Fade,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  resetImage,
  addImageCamera,
  recognizeImage,
} from "../../../Redux/reducers/image";
import Webcam from "react-webcam";

const AddImageCapture = ({ takePic, setTakePic, setAddOpenOne }) => {
  //Constants
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const imgSrc = useSelector((state) => state.image.base64img);
  const [ignore, setIgnore] = useState(false);
  // const [addOpenOne, setAddOpenOne] = useState(false);
  const error = useSelector((state) => state.image.error);
  const resultCode = useSelector((state) => state.image.resultCode);
  const loading = useSelector((state) => state.image.loading);
  const user_id = useSelector((state) => state.image.user_id);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    dispatch(addImageCamera({ image: imageSrc }));
  }, [webcamRef, imgSrc]);

  //useEffect
  useEffect(() => {
    console.log(resultCode);
    console.log(ignore);
    if (resultCode === 211 && takePic === true) {
      setTakePic(false);
      setAddOpenOne(true);
    }
  }, [resultCode]);

  //Functions
  const handleSubmit = () => {
    console.log("inside checkface");
    dispatch(recognizeImage());
  };

  const handleReset = () => {
    dispatch(resetImage());
    setIgnore(false);
  };

  //Implementation
  return (
    <>
      <Modal
        open={takePic}
        onClose={() => {
          setTakePic(false);
          setIgnore(false);
          dispatch(resetImage());
        }}
        className='takePicModal'
      >
        <Fade in={takePic}>
          <Stack spacing={3} className='takePicStack'>
            {!imgSrc && (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat='image/jpeg'
                />
                <Box
                  sx={{ mx: "auto", display: "flex", justifyContent: "center" }}
                >
                  <Button variant='contained' onClick={capture}>
                    Capture photo
                  </Button>
                </Box>
              </>
            )}
            {imgSrc && (
              <>
                <img src={imgSrc} />
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
                    Reset Image
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

export default AddImageCapture;
