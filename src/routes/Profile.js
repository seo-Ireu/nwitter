import { collection,query,where,getDocs,orderBy, onSnapshot } from "@firebase/firestore";
import {  updateProfile } from "firebase/auth";
import {authService,dbService} from "fbase";
import {useEffect,useState} from "react";
import { useHistory } from "react-router";
import Nweet from "components/Nweet";
const Profile = ({userObj,refreshUser}) => {
    const history = useHistory();
    const [newDisplayName,setNewDisplayName] = useState("");
    const [myNweets,setMyNweets] = useState([]);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onSubmit=async(event)=>{
        event.preventDefault();

        if(userObj.displayName!== newDisplayName){
            try{
                await updateProfile(authService.currentUser,{displayName:newDisplayName});
                refreshUser();
            }catch (err) {
                console.log(err,"!!!");
            }
        }


    };
    const onChange=(event)=>{
        const{
            target:{value},
        }= event;
        setNewDisplayName(value);
    }

    const getNweets = async()=>{
        
        const q= query(collection(dbService,"nweets"),where("creatorId","==",userObj.uid),orderBy("createdAt","asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const nextNweets = querySnapshot.docs.map((doc) => {
            return {
            id: doc.id,
            ...doc.data(),
            }
            })
            setMyNweets(nextNweets);
            })
            return () => {
                unsubscribe()
            }
    };

    useEffect(()=>{
        getNweets();
    },[]);

    return(
        <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
        </form>

      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>

        <div>
            {myNweets.map((nweet)=>(
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId ===userObj.uid}/>
            ))}
        </div>

        </div>
    );
};

export default Profile;