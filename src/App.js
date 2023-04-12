/*eslint-disable */
import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/css/styles.css"; // 최종 스타일로 지정
import { useAuthContext } from "./hooks/useAuthContext";
import Loading from './layout/Loading';
import Error404 from './layout/Error404';
const Start = lazy(()=> import('./components/Start'))
const Feeds = lazy(()=> import('./components/Feeds'))
const Input = lazy(()=> import('./components/Input'))


function App() {
  const {isAuthReady, user } = useAuthContext();

  return(
    <>
      {
        isAuthReady?
        (
          <Suspense fallback={<Loading/>}> {/* Suspense로 감싸기(로딩중 보여줄 때) */}
            <Routes>
              <Route path="/" 
                element={
                  user ?
                   <Feeds/>
                 : <Start/>
                }
              />
              
              <Route path="/input" 
                      element={<Input/>}
              />

              <Route path="/log" 
                      // element={<Input/>}
              />

              <Route path="/profile" 
                      // element={<Input/>}
              />

              {/* Routes안에 명시되지 않은 페이지 주소 예외처리 */}
              <Route path="*" element={<Error404/>}/>
            </Routes>
          </Suspense>
        )
        : null
      }
    </>
  );

}

export default App;