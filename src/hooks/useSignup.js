/* eslint-disable*/

import { useState } from "react"
import {appAuth} from '../firebase/config';
import {createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuthContext } from "./useAuthContext";
import { useFirestore } from "../hooks/useFirestore";

export const useSignup = () => {
    // 회원가입 시 에러가 발생했을 때 에러 정보를 저장함
    const [error,setError] = useState(null);

    // 현재 서버와 통신 상태를 저장
    const [isPending,setIsPending] = useState(false);
    
    // 인증과 관련된 훅
    const {dispatch} = useAuthContext();


    /**************************************************************
     * 회원 저장
     **************************************************************/
    // 컬렉션 이름 파라미터로 넣어주기, 저장소에 해당 이름의 컬렉션으로 저장됨
    const { addUser, response } = useFirestore("UserData");

    // 회원가입
    const signup = (email, password, displayName) =>{
        console.log('인자로 받아옴??',displayName);
        setError(null); // 아직 에러가 없음...
        setIsPending(true); // 통신을 진행중입니다...

        // 회원가입 진행
        createUserWithEmailAndPassword(appAuth, email, password)
        .then((userCredential)=>{
            const user = userCredential.user;
            console.log('회원가입user: ',user);

            if(!user){
                throw new Error('회원가입에 실패했습니다.');
            }

            // 회원가입이 완료되면 가입된 회원에 닉네임 저장시키기
            updateProfile(appAuth.currentUser,{displayName})
            .then(()=>{
                dispatch({type: 'login', payload:user})
                setError(null); //에러없다고 넣어주고
                setIsPending(false); //통신끊어주기
            }).catch((err) => {
                setError(err.message);
                setIsPending(false);
                console.log(err.message);
            }).finally(()=>{
                let UID = user.uid;
                let postILiked = [];

                // 유저 최초 저장 시 컬렉션 생성
                addUser({email, password, UID, postILiked});
            })

        })
        .catch((err) => {
            setError(err.message);
            setIsPending(false);
            console.log(err.message);
        })


    }
    return {error, isPending,signup}
}