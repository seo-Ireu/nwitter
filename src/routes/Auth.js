import {authService} from "fbase";
import {getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    } from '@firebase/auth';
import AuthForm from "components/AuthForm";

const Auth = () => {
    const onSocialClick =async (event) =>{
        const{
            target: {name},
        } =event;

        let provider;
        if(name==="google"){
            provider = new GoogleAuthProvider();
            signInWithPopup(authService,provider);
        }else if(name==="github"){
            provider = new GithubAuthProvider();
            signInWithPopup(authService,provider);
        }
        console.log(name,"....");

    };
return (
    <div>
        <AuthForm/>
        <div>
            <button onClick={onSocialClick} name="google">Continue with Google</button>
            <button onClick={onSocialClick} name="github">Continue with Github</button>
        </div>
        
    </div>
);
};

export default Auth;
