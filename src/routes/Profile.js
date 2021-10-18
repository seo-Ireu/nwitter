import { collection,query,where,getDocs,orderBy } from "@firebase/firestore";
import {  updateProfile } from "firebase/auth";
import {authService,dbService} from "fbase";
import {useEffect,useState} from "react";
import { useHistory } from "react-router";

const Profile = ({userObj,refreshUser}) => {
    const history = useHistory();
    const [newDisplayName,setNewDisplayName] = useState("");


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

    // const getMyNweets = async()=>{
        
    //     const q= query(collection(dbService,"nweets"),where("creatorId","==",userObj.uid),orderBy("createdAt","asc"));
    //     const nweets = await getDocs(q);
    //     nweets.forEach((doc)=>{
    //         console.log(doc.id, "=>",doc.data());
    //     })

    // };

    // useEffect(()=>{
    //     getMyNweets();
    // },[]);

    return(
        <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName}/>
            <input type="submit" value="Update Profile"/>
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
}

export default Profile;
