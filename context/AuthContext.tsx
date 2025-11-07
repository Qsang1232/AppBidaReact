import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// === QUAY VỀ CÁCH IMPORT CHUẨN ===
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { getUserProfile, loginUser, NewUserData, registerUser, UserProfile } from '../api/BidaAPI';

// Kiểu dữ liệu cho user đăng ký cục bộ (bao gồm cả password để kiểm tra)
interface RegisteredUser extends NewUserData {
    id: number;
}

// Định nghĩa các giá trị và hàm mà Context sẽ cung cấp
interface AuthContextType {
    user: UserProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    register: (userData: NewUserData) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

    // useEffect để load dữ liệu từ AsyncStorage khi app khởi động
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load thông tin người dùng đang đăng nhập
                const storedUser = await AsyncStorage.getItem('user');
                const storedToken = await AsyncStorage.getItem('token');
                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                }
                // Load danh sách người dùng đã đăng ký cục bộ
                const storedRegisteredUsers = await AsyncStorage.getItem('registered_users');
                if (storedRegisteredUsers) {
                    setRegisteredUsers(JSON.parse(storedRegisteredUsers));
                }
            } catch (e) {
                console.error("Lỗi khi tải dữ liệu xác thực:", e);
            }
        };
        loadData();
    }, []);

    // Hàm đăng ký
    const register = async (userData: NewUserData): Promise<boolean> => {
        if (registeredUsers.find(u => u.username === userData.username)) {
            Alert.alert('Lỗi', 'Tên đăng nhập này đã tồn tại.');
            return false;
        }
        const response = await registerUser(userData);
        if (response && response.id) {
            const newUser: RegisteredUser = { ...userData, id: response.id };
            const updatedUsers = [...registeredUsers, newUser];
            setRegisteredUsers(updatedUsers);
            await AsyncStorage.setItem('registered_users', JSON.stringify(updatedUsers));
            return true;
        }
        return false;
    };

    // Hàm đăng nhập
    const login = async (username: string, password: string): Promise<boolean> => {
        // Kiểm tra trong danh sách người dùng đã đăng ký cục bộ trước
        const localUser = registeredUsers.find(u => u.username === username && u.password === password);
        if (localUser) {
            const userProfile: UserProfile = {
                id: localUser.id, email: localUser.email, username: localUser.username,
                name: localUser.name, address: localUser.address, phone: localUser.phone
            };
            const fakeToken = `local_token_${Date.now()}`;
            setToken(fakeToken);
            setUser(userProfile);
            await AsyncStorage.setItem('token', fakeToken);
            await AsyncStorage.setItem('user', JSON.stringify(userProfile));
            return true;
        }

        // Nếu không có, kiểm tra với API FakeStore (cho các tài khoản test)
        const loginResponse = await loginUser(username, password);
        if (loginResponse && loginResponse.token) {
            setToken(loginResponse.token);
            await AsyncStorage.setItem('token', loginResponse.token);
            const userProfile = await getUserProfile(1);
            if (userProfile) {
                setUser(userProfile);
                await AsyncStorage.setItem('user', JSON.stringify(userProfile));
                return true;
            }
        }

        Alert.alert('Đăng nhập thất bại', 'Sai tên đăng nhập hoặc mật khẩu.');
        return false;
    };

    // Hàm đăng xuất
    const logout = async () => {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};