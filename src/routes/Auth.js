import {authService} from "fbase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    } from "@firebase/auth";
import{
    faTwitter,
    faGoogle,
    faGithub,
}from "@fortawesome/free-brands-svg-icons";
import AuthForm from "components/AuthForm";
//소셜로그인 time out 문제 해결 plz~~~~~~~~~
const Auth = () => {
    const onSocialClick =async (event) =>{
        const{
            target: {name},
        } =event;

        const auth = getAuth();

        let provider;
        if(name==="google"){
            provider = new GoogleAuthProvider();
        }else if(name==="github"){
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(auth, provider);

        console.log(data,"....");

    };
return (
    <div className="authContainer">
        <FontAwesomeIcon
            icon={faTwitter} color={"#04AAFF"} size="3x" style={{marginBotton:30}}/>
        <AuthForm/>
        <div className="authBtns">
            <button onClick={onSocialClick} name="google" className="authBtn">
                Continue with Google <FontAwesomeIcon icon={faGoogle}/>
            </button>
            <button onClick={onSocialClick} name="github" className="authBtn">
                Continue with Github<FontAwesomeIcon icon={faGithub}/>
            </button>
        </div>
        
    </div>
);
};

export default Auth;
