import React from "react";
import {Suspense, useState, useEffect } from "react";
import { getAllUser } from "../service/api.service";

const UserTable = React.lazy(() => import("../component/user/user.table"))

const UserManagement = () => {
    const [dataUsers, setDataUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        loadUser(currentPage, pageSize);
    }, [currentPage]);

    const loadUser = async (page, pageSize) => {
        try {
            const res = await getAllUser(page, pageSize);
            if (res.data) {
                setDataUsers(res.data);
            }
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            <Suspense fallback={<div>Loading...</div>}>
                <UserTable dataUsers={dataUsers} />
            </Suspense>
        </div>
    );
};

export default UserManagement;
