import React, { useState } from 'react';
import firebase from "firebase";
import { Button } from '@material-ui/core';
import { db, storage } from './firebase';
import './ImageUpload.css';
import SendIcon from '@material-ui/icons/Send';


function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //error function..
                console.log(error);
                alert(error.message);
            },
            () => {
                //upload function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post the image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url, 
                            username: username

                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        );
    };

    return (
        <div className="imageupload">
            {/* for uploading post */}
            {/* Caption input */}
            {/* File picker */}
            {/* post Button */}
            <h4 className="upload__header">Upload a new post</h4>
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption"  onChange={ e => setCaption(e.target.value)} />
            
            <input type="file" onChange={handleChange} />
            <Button  onClick={handleUpload}>Upload</Button>
            
            

        </div>
    )
}

export default ImageUpload
