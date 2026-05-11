import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser, clearAuth } from "../store/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const getWhoAmI = async () => {
    try {
      const response = await api.get("/whoami");
      localStorage.setItem("whoami", JSON.stringify(response.data));
      dispatch(setUser(response.data));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (data) => {
    try {
      const response = await api.post("/login", data);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      await getWhoAmI();
      toast.success("Login successful");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post("/register", data);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      await getWhoAmI();
      toast.success("Registration successful");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
      throw error;
    }
  };

  const purgeToken = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("whoami");
    dispatch(clearAuth());
  };

  const logout = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const refresh_token = localStorage.getItem("refresh_token");
      await api.post("/logout", { access_token, refresh_token });

      purgeToken();
      toast.success("Logged out successfully");
    } catch (error) {
      purgeToken();
    }
  };

  return {
    login,
    register,
    logout,
    purgeToken,
    getWhoAmI,
  };
};
