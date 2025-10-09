// src/AdminApp.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layout/AdminLayout";

import AdminDashboard from "./admin/pages/Dashboard";

import AdminCreateCourse from "./admin/pages/AdminCreateCourse";
import AllUser from "./admin/pages/AllUser";
import UploadCourse from "./admin/pages/UploadCourse";
import CreateBlog from "./admin/pages/CreateBlog";
import TalentList from "./admin/pages/TalentList";
import CourseAction from "./admin/pages/CourseAction";
import TransactionHistory from "./admin/pages/TransactionHistory";
import LessonPage from "./admin/pages/LessonPage";
import AllRegistered from "./admin/pages/AllRegistered";
import Subscription from "./admin/pages/Subscription";

const AdminApp = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="admin-create-course" element={<AdminCreateCourse />} />
        <Route path="all-user" element={<AllUser />} />
        <Route path="upload-course" element={<UploadCourse />} />
        <Route path="create-blog" element={<CreateBlog />} />
        <Route path="create-blog" element={<CreateBlog />} />
        <Route path="talent-list" element={<TalentList />} />
        <Route path="lesson-page" element={<LessonPage />} />
        <Route path="course-action" element={<CourseAction />} />
        <Route path="transaction-history" element={<TransactionHistory />} />
        <Route path="all-registered" element={<AllRegistered />} />
        <Route path="subscription" element={<Subscription />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
