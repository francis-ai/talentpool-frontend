import { useEffect, useState, useContext, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SubscriptionPage() {
  const { axiosInstance, user, isAuthenticated } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch subscription plans
  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/subscription/plans");
      setPlans(data);
    } catch (err) {
      toast.error("❌ Failed to fetch plans");
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Subscribe handler
  const handleSubscribe = async (planId) => {
    if (!isAuthenticated || !user) {
      toast.error("⚠️ Please log in to subscribe.");
      navigate("/login");
      return;
    }

    try {
      setLoadingPlanId(planId);

      const { data } = await axios.post(
        `${BASE_URL}/api/subscription/subscribe/${planId}`,
        { user_email: user.email },
        { withCredentials: true }
      );

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.error("❌ Failed to start payment");
      }
    } catch (err) {
      console.error("Subscribe error:", err.response?.data || err.message);
      toast.error("❌ Error subscribing");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <ToastContainer />
      
      {/* Scrolling Note Banner */}
      <div className="mt-16 absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 py-3 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="text-gray-900 font-bold text-lg mx-8">
            ⚡ Note: All plans allow students to request recordings, get assignments & feedback, and contact tutors
          </span>
        </div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 mt-16"></div>
      <div className="absolute top-36 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-200/25 rounded-full blur-3xl animate-float-slow"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mt-16">
        <div className="text-center mb-20">
          <h1 className="text-2xl lg:text-5xl font-black text-gray-800 mb-4 tracking-tight">
            TalentPoolAfrica Video Recording Access Plans
          </h1>
          <p className="text-gray-700 text-lg font-medium max-w-2xl mx-auto mb-6">
            📌 These plans are for <span className="font-bold">video records</span>, mainly for busy people who can’t attend physical classes.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 w-full">
          {plans.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">No subscription plans available yet.</p>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 to-indigo-200/30 rounded-3xl blur-md group-hover:blur-lg transition-all duration-500"></div>
                <div className="relative rounded-3xl p-8 flex flex-col items-center bg-white/20 backdrop-blur-2xl border border-white/40 hover:border-white/60 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-3xl">
                  <h2 className="text-2xl font-bold mb-3 text-gray-800 relative z-10">{plan.name}</h2>
                  <p className="text-4xl font-black mb-4 text-gray-900 relative z-10">₦{plan.price.toLocaleString()}</p>
                  <p className="mb-6 text-center text-gray-700 font-medium relative z-10">Access Duration: {plan.duration_days} days</p>
                  <h3 className="text-center text-gray-900 font-bold text-xl mb-4 relative z-10">Features</h3>
                  <ul className="text-sm space-y-3 mb-8 w-full relative z-10">
                    {JSON.parse(plan.features).map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700">{f}</li>
                    ))}
                  </ul>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl px-8 py-4 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 w-full mt-auto font-bold border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl relative z-10 transform hover:-translate-y-1"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loadingPlanId === plan.id}
                  >
                    {loadingPlanId === plan.id ? "Processing..." : "Subscribe"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-20px) rotate(180deg);} }
        @keyframes float-delayed { 0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(30px) rotate(-180deg);} }
        @keyframes float-slow { 0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-15px) rotate(90deg);} }
        @keyframes scroll { 0%{transform:translateX(0);}100%{transform:translateX(-50%);} }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-scroll { animation: scroll 30s linear infinite; display:inline-block; }
        .animate-scroll:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
