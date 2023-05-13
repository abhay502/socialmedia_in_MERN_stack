import { USERS_URL } from "Constants";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


 
const Chart = () => {
  const token = useSelector((state) => state.adminToken);

  const [users,SetUsers] = useState("");

  const FetchUsers = useCallback(async () => {
    const response = await fetch(
      `${USERS_URL}/get/activeDate`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    SetUsers(data);
  }, [token]);

  useEffect(()=>{
    FetchUsers()
  },[FetchUsers]) 

 
  return (
    <>
      <div>
        <h1 style={{marginLeft:'15rem'}}>ACTIVE USERS CHART 👤</h1>
        
        <ResponsiveContainer width={600} height={400}>
          <BarChart data={users?.activeUsers}>
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="__v" fill="#8884d8" /> 
          </BarChart>
        </ResponsiveContainer>
      </div>  
    </>
  );
};

export default Chart; 
 