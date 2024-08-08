import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, ReferenceLine, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import Loading from '../Loading';
import useRefreshToken from '../../hooks/useRefreshToken';
import { toast } from 'react-hot-toast';
import "./adminPanel.css";

const AdminPanel = () => {
  const [userCount, setUserCount] = useState(0);
  const [monthlyLogins, setMonthlyLogins] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [opinionCount, setOpinionCount] = useState(0);
  const [monthlyOpinions, setMonthlyOpinions] = useState([]);
  const [averageOpinions, setAverageOpinions] = useState(0);
  const [averageLogins, setAverageLogins] = useState(0);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const refreshToken = useRefreshToken(); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0] === '_auth');
    
    if (!authToken) {
      console.error('No auth token found');
      navigate('/loginform');
      toast.error('Authentication token missing. Please log in again.', {
        className: 'react-hot-toast',
      });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8000/admin/users/count', {
            headers: {
              'Authorization': `Bearer ${authToken[1]}`
            }
          });
        setUserCount(userResponse.data.count);

        const loginResponse = await axios.get('http://localhost:8000/admin/logins/monthly', {
            headers: {
              'Authorization': `Bearer ${authToken[1]}`
            }
          });
        const totalLogins = (loginResponse.data).reduce((sum, item) => sum + item.login_count, 0);
        const avgLogins = totalLogins / (loginResponse.data).length;

        setAverageLogins(avgLogins);
        setMonthlyLogins(loginResponse.data);

        const productResponse = await axios.get('http://localhost:8000/admin/products/count', {
            headers: {
              'Authorization': `Bearer ${authToken[1]}`
            }
          });
        setProductCount(productResponse.data.count);

        const opinionResponse = await axios.get('http://localhost:8000/admin/opinions/monthly', {
            headers: {
              'Authorization': `Bearer ${authToken[1]}`
            }
          });
        const totalOpinions = (opinionResponse.data).reduce((sum, item) => sum + item.opinions, 0);
        setOpinionCount(totalOpinions);
        const avgOpinions = totalOpinions / (opinionResponse.data).length;

        setAverageOpinions(avgOpinions);
        setMonthlyOpinions(opinionResponse.data);

        setLoading(false);
      } catch (error) {
        console.log("Error fetching data", error);
        //signOut();
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />; 
  }

  const maxLogins = Math.max(...monthlyLogins.map(item => item.login_count));
  const LoginPercentage = (averageLogins / maxLogins) * 100;

  const maxOpinions = Math.max(...monthlyOpinions.map(item => item.opinions));
  const opinionPercentage = (averageOpinions / maxOpinions) * 100;

  return (
    <>
    <header>Admin Panel</header>
    <div className='admin_container'>
      
      <div className='checked_opinion'>
            <div className='opinion_info'>
                <div><strong>Total Users:</strong> {userCount}</div>
                <div><strong>Total Products:</strong> {productCount}</div>
                <div><strong>Total Opinions:</strong> {opinionCount}</div>
            </div>
            <div className='opinion_info'>
                <div className='chart'><strong>Monthly Logins</strong> 
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart width={600} height={300} data={monthlyLogins} style={{ backgroundColor: '#fff' }}>
                        <defs>
                          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset={`${100 - LoginPercentage}%`} stopColor="#076478" stopOpacity={1} />
                              <stop offset="0" stopColor="#261132" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
                        <XAxis dataKey="year_month" stroke="#261132" />
                        <YAxis stroke="#261132" />
                        <Tooltip />
                        <Area type="monotone" dataKey="login_count" stroke="#261132" fillOpacity={0.8} fill="url(#splitColor)" />
                        <ReferenceLine y={averageLogins} label={`Average: ${averageLogins.toFixed(2)}`} stroke="#261132" strokeDasharray="3 3" />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
            </div>
            <div className='opinion_info'>
                <div className='chart'><strong>Monthly opinions</strong> 
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart width={600} height={300} data={monthlyOpinions} style={{ backgroundColor: '#fff', padding: '1em 1em 0 0'}}>
                      <defs>
                        <linearGradient id="splitColor2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={`${100 - opinionPercentage}%`} stopColor="#076478" stopOpacity={1} />
                            <stop offset="0" stopColor="#261132" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
                      <XAxis dataKey="year_month" stroke="#261132" />
                      <YAxis stroke="#261132" />
                      <Tooltip />
                      <Area type="monotone" dataKey="opinions" stroke="#261132" fillOpacity={0.8} fill="url(#splitColor2)" />
                      <ReferenceLine y={averageOpinions} label={`Average: ${averageOpinions.toFixed(2)}`} stroke="#261132" strokeDasharray="3 3" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
      </div>
    </div>
    </>
  );
};

export default AdminPanel;
