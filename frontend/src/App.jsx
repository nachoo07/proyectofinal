import React from 'react';
import { UserProvider } from './context/user/UserContext';
import Routing from './routes/Routing';
import { LoginProvider } from './context/login/LoginContext';
function App() {


  return (
    <>
      <LoginProvider>
        <UserProvider>
          <Routing />
        </UserProvider>
      </LoginProvider>
    </>
  )
}

export default App
