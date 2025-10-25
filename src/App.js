import './index.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import FloatingButton from "./components/FloatingButton"; // ⬅️ add this

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import HireTalent from "./pages/HireTalent";
import Talent from "./pages/Talent";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Reg";
import UpdatePassword from "./pages/auth/UpdatePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/dashboard/Dashboard";
import UserProfile from "./pages/dashboard/Profiile";
import Videos from "./pages/dashboard/Videos";

import CourseList from "./pages/CourseList";
import CourseInfo from "./pages/CourseInfo"
import ActiveCourse from "./pages/ActiveCourse";
import CoursesDetails from "./components/CourseDetails";
import AvailableCourse from "./pages/AvailableCourse";

import Internship from "./pages/Internship";
import Instructor from "./pages/Instructor";
import UserTable from "./pages/UserTable";
import Calender from "./pages/Calender";
import PaymentSuccess from "./pages/PaymentSuccess";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Notification from "./pages/Notification";

import Subscription from "./pages/Subscription";

import TutorDetails from "./pages/TutorsDetails";

import AdminApp from "./AdminApp";

function Layout({ children }) {
  const location = useLocation();

  const hideNavbar = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname) || location.pathname.startsWith("/admin");

  const hideFloating = hideNavbar; // same pages where navbar is hidden

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFloating && <FloatingButton />} {/* ⬅️ show only where allowed */}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="hire-talent" element={<HireTalent />}  />
            <Route path="talents" element={<Talent />}  />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/videos"
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              }
            />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/course-list" element={<CourseList />} />
            <Route path="/course-list/:id" element={<CourseInfo />} />
            <Route path="/active-course" element={<ActiveCourse />} />
            <Route path="/courses/:id" element={<CoursesDetails />} />
            <Route path="/listed-courses" element={<AvailableCourse />} />

            <Route path="/internship" element={<Internship />} />
            <Route path="/instructor" element={<Instructor />} />
            <Route path="/user-table" element={<UserTable />} />
            <Route path="/calender" element={<Calender />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/subscription-success" element={<SubscriptionSuccess />} />
            <Route path="/notification" element={<Notification />} />

            <Route path="/subscription" element={<Subscription />} />
            <Route path="/tutors/:id" element={<TutorDetails />} />

            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
