import {useState,useEffect} from "react";
import { dbService } from "fbase";
import { collection, addDoc,serverTimestamp, getDocs,query, onSnapshot, orderBy} from "@firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({userObj}) => {

    const [nweet,setNweet] = useState("");
    const [nweets,setNweets] = useState([]);
    
    const onSubmit = async (event) =>{
        event.preventDefault();
        const docRef = await addDoc(collection(dbService,"nweets"),{
            text:nweet,
            createdAt:serverTimestamp(),
            creatorId:userObj.uid,
        });
        console.log("Documents written with ID:",docRef.id);
        setNweet("");
    };
    const onChange = (event) =>{
        event.preventDefault();
        const{
            target:{value},
        } = event;
        setNweet(value);
    };

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
    <>
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
            <input type="submit" value="Nweet"/>
        </form>
        <div>
            {nweets.map((nweet)=>(
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId ===userObj.uid}/>
            ))}
        </div>

    </> 
);
}

export default Home;
