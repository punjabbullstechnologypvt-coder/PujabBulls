import { useNavigate } from 'react-router-dom'
import AdminLoginPage from '../components/Admin/AdminLoginPage'

export default function AdminLogin() {
  const navigate = useNavigate()
  return (
    <AdminLoginPage
      onSuccess={() => navigate('/admin')}
      onBack={() => navigate('/')}
    />
  )
}