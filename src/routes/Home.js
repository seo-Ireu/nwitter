import {useState,useEffect} from "react";
import { dbService } from "fbase";
import { getStorage, ref,getDownloadURL,uploadString } from "@firebase/storage";
import { collection,query, onSnapshot, orderBy, addDoc, serverTimestamp} from "@firebase/firestore";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from 'uuid';

const Home = ({userObj}) => {

    const [nweet,setNweet] = useState("");
    const [nweets,setNweets] = useState([]);
    const [attachment, setAttachment] =useState("");

    const onSubmit = async (event) =>{
        event.preventDefault();
        let attachmentUrl = "";

        if(attachment!==""){
            const storage =getStorage();
            const storageRef = ref(storage,'images');
            const attachmentRef =ref(storageRef,`${userObj.uid}/${uuidv4()}`);
            const uploadTask = await uploadString(attachmentRef,attachment,'data_url');    
            attachmentUrl=(await getDownloadURL(attachmentRef)).toString();
        }
         
        const docRef = await addDoc(collection(dbService,"nweets"),{
            text:nweet,
            createdAt:serverTimestamp(),
            creatorId:userObj.uid,
            attachmentUrl,
        });

        setNweet(""); 
        setAttachment("");

    };
    const onChange = (event) =>{
        event.preventDefault();
        const{
            target:{value},
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) =>{
        const{
            target:{files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent)=>{
            const{
                currentTarget:{result},
            } = finishedEvent;
            setAttachment(result);
        };

        reader.readAsDataURL(theFile);

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

    const onClearAttachment=()=> setAttachment("");
return(
    <>
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
            <input type="file" onChange={onFileChange} accept="image/*"/>
            <input type="submit" value="Nweet"/>
            {attachment&& (
                <div>
                <img src={attachment} width ="50px" height="50px"/>
                <button onClick={onClearAttachment}>clear</button>
                </div>
            )}
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
