import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import logo from './my_logo.png';

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);


  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged out..
        setUser(authUser);
      } else {
        //user has logged out..
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);


  
  useEffect( () => {
    
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
      
    })
  }, [] ); 

  
  const signUp = (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then( (authUser) => {
      return authUser.user.updateProfile({
        displayName:username,
      })
    })
    .catch((error) => alert(error.message) );

    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="App"> 
      

      <Modal open={open} onClose={ () => setOpen(false) }>
        <div style={modalStyle} className={classes.paper}>

          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={ (e) => setUsername(e.target.value) }
             />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={ (e) => setEmail(e.target.value) }
             />
             <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={ (e) => setPassword(e.target.value) }
             />
             <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
                
      </div>
      </Modal>

      <Modal open={openSignIn} onClose={ () => setOpenSignIn(false) }>
        <div style={modalStyle} className={classes.paper}>

          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={ (e) => setEmail(e.target.value) }
             />
             <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={ (e) => setPassword(e.target.value) }
             />
             <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
                
      </div>
      </Modal>
      
      {/* Header */}
      <div className="app__header">
        <img className="app__headerImage" src={logo}  alt="" />

        {user ? (
        <Button onClick={() => auth.signOut() } > Logout</Button>
        ): (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true) } >Sign In</Button>
          <Button onClick={() => setOpen(true) } >Sign Up</Button>
        </div>
        
        )} 
      </div>   
      
      {/* Posts */}
      <div className="app_posts">
        <div className="app__postLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            
            url='https://www.instagram.com/p/B02YrqWhHL-/?utm_source=ig_web_copy_link'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
            {user?.displayName ? (
            <ImageUpload username={user.displayName} />
            ): (
              <strong>Note: You need to login to upload.</strong>
            )}
        </div>

        
      </div>
      

      
      

      {/* {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ): (
        <strong>Note: You need to login to upload.</strong>
      )} */}
      
      
    </div>
  );
}

export default App;
