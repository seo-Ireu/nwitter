import {useState,useEffect} from "react";
import { dbService } from "fbase";
import { collection,query, onSnapshot, orderBy, addDoc, serverTimestamp} from "@firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({userObj}) => {
    const [nweets,setNweets] = useState([]);

    useEffect(()=>{
        const q = query(collection(dbService, 'nweets'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const nextNweets = querySnapshot.docs.map((doc) => {
        return {
        id: doc.id,
        ...doc.data(),
        }
        })
        setNweets(nextNweets);
        })
        return () => {
            unsubscribe()
        }
    },[]);
return(
    <div className="container">
        <NweetFactory userObj={userObj} />
        <div style={{marginTop:30}}>
            {nweets.map((nweet)=>(
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId ===userObj.uid}/>
            ))}
        </div>
    </div>
);
}

export default Home;
