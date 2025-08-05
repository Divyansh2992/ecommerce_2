import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser, updateUser, deleteUser } from '../../redux/slices/adminSlice';

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const {user}=useSelector((state)=>state.auth);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("userToken");
            const { data } = await axios.get("http://localhost:9000/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
        } catch {
            setError("Failed to fetch users");
        }
        setLoading(false);
    };

    useEffect(() => {
        if(user && user.role!=="admin"){
            navigate("/");
        }
    },[user,navigate]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
        role:"customer",
    });

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        await dispatch(addUser(formData));
        setFormData({
            name:"",
            email:"",
            password:"",
            role:"customer",  
        });
        fetchUsers();
    };

    const handleRoleChange=async(userId,newRole)=>{
        await dispatch(updateUser({id:userId,role:newRole}));
        fetchUsers();
    }

    const handleDeleteUser=async(userId)=>{
        if(window.confirm("Are you sure you want to delete this user?")){
            await dispatch(deleteUser(userId));
            fetchUsers();
        }
    }

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className='text-2xl font-bold mb-6'>User Management</h2>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {/* Add new User Form */}
            <div className="p-6 rounded-lg mb-6">
                <h3 className='text-lg font-bold mb-4'>Add new User</h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className='w-1/2 p-2 border rounded' required/>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700'>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className='w-1/2 p-2 border rounded' required/>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700'>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className='w-1/2 p-2 border rounded' required/>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700'>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className='w-1/2 p-2 border rounded'>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'>
                        Add User
                    </button>

                </form>
            </div>

            {/* User List Management */}
            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Name</th>
                            <th className='py-3 px-4'>Email</th>
                            <th className='py-3 px-4'>Role</th>
                            <th className='py-3 px-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user)=>(
                            <tr key={user._id} className='border-b hover:bg-gray-50'>
                                <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{user.name}</td>
                                <td className='p-4'>{user.email}</td>
                                <td className='p-4'>
                                    <select value={user.role} onChange={(e)=>handleRoleChange(user._id,e.target.value)} className='p-2 border rounded'>
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className='p-4'>
                                    <button onClick={()=>handleDeleteUser(user._id)} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:cursor-pointer'>Delete</button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}

export default UserManagement;
