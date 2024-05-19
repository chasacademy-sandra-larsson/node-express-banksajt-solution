import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateUserPage from './pages/CreateUserPage'
import LoginPage from './pages/LoginPage'
import AccountPage from './pages/AccountPage'
import Layout from './components/Layout'



function App() {

  

  return (
    <>
     <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<CreateUserPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
     </Layout>
    </>
  )
}

export default App
