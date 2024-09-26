import { useState, useEffect } from "react"
import UserTable from "../component/user/user.table";
import { getAllUser } from "../service/api.service";

const UserManagement = () => {
    const [dataUsers, setDataUsers] = useState([]);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const res = await getAllUser();
        if (res.data) {
            setDataUsers(res.data)
        }

    }


    return (
        <div style={{ padding: "20px" }}>
            <UserTable dataUsers={dataUsers} loadUser={loadUser} />
        </div>
    )


}

export default UserManagement;