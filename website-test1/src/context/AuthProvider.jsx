import { useState } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);

    const login = () => {
        setIsLogin(true);
    };

    const logout = () => {
        setIsLogin(false);
    };

    return (
        <AuthContext.Provider value={{ isLogin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
