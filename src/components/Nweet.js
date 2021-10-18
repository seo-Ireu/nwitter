import {useState} from "react";
import { dbService} from "fbase";
import { updateDoc, deleteDoc, doc } from "@firebase/firestore";
import { getStorage, ref,deleteObject} from "@firebase/storage";

const Nweet = ({nweetObj,isOwner})=>{
    const [editing,setEditing] = useState(false);
    const [newNweet,setNewNweet] =useState(nweetObj.text);

    const onDeleteClick= async ()=>{
        const ok = window.confirm("삭제하시겠습니까?");

        if(ok){
            await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
            if (nweetObj.attachmentUrl!==""){
                const storage =getStorage();
                const storageRef = ref(storage, nweetObj.attachmentUrl);
                deleteObject(storageRef);
            }
        }

    };

    const toggleEditing =()=>{
        setEditing((prev)=>!prev);
    };
    const onChange=(event)=>{
        const{
            target:{value},

        }=event;
        setNewNweet(value);
    }
    const onSubmit=async(event)=>{
        event.preventDefault();

        await updateDoc(doc(dbService,`nweets/${nweetObj.id}`),{
            text:newNweet,
        });
        setEditing(false);
    };

    return(
    <div>
        {editing?(
            <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={newNweet} required/>
                <input type="submit" value="수정하기"/>
            </form>
            <button onClick={toggleEditing}>cancle</button>
            </>
        ):(
            <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl&&(
                <img src={nweetObj.attachmentUrl} width="50px" height="50px"/>
            )}
            {isOwner &&(
                <>
                <button onClick={onDeleteClick}>Delete nweet</button>
                <button onClick={toggleEditing}>Edit Nweet</button>
                </>
            )}            
            </>
        )}
    </div>
);
};

export default Nweet;
