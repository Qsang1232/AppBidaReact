import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground, KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

// Màu xanh lá cây cho điểm nhấn trên giao diện đăng nhập
const ACCENT_COLOR = '#2ecc71';

export default function ProfileScreen() {
    const { user, isAuthenticated, logout, login, register } = useAuth();

    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // States cho form Đăng nhập
    const [loginUsername, setLoginUsername] = useState('johnd');
    const [loginPassword, setLoginPassword] = useState('m38rmF$');

    // States cho form Đăng ký
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regEmail, setRegEmail] = useState('');

    // Hàm xử lý logic Đăng nhập (giữ nguyên)
    const handleLogin = async () => {
        if (!loginUsername || !loginPassword) { Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập và mật khẩu.'); return; }
        setIsLoading(true);
        await login(loginUsername, loginPassword);
        setIsLoading(false);
    };

    // Hàm xử lý logic Đăng ký (giữ nguyên)
    const handleRegister = async () => {
        if (!regUsername || !regPassword || !regEmail) { Alert.alert('Lỗi', 'Vui lòng điền các trường bắt buộc'); return; }
        setIsLoading(true);
        const success = await register({
            email: regEmail, username: regUsername, password: regPassword,
            name: { firstname: 'New', lastname: 'User' },
            address: { city: 'hcm', street: 'test', number: 1, zipcode: '12345' },
            phone: '123-456-7890',
        });

        if (success) {
            Alert.alert('Đăng ký thành công!', 'Bây giờ bạn có thể đăng nhập bằng tài khoản vừa tạo.');
            setLoginUsername(regUsername);
            setLoginPassword('');
            setIsRegistering(false);
        }
        setIsLoading(false);
    };

    // =================================================================
    // GIAO DIỆN KHI CHƯA ĐĂNG NHẬP
    // =================================================================
    if (!isAuthenticated) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.authWrapper}
            >
                <ImageBackground
                    source={require('../../assets/images/login-background.jpg')}
                    style={styles.background}
                >
                    <View style={styles.overlay} />
                    <ScrollView contentContainerStyle={styles.authContainer}>
                        <Text style={styles.headerTitle}>BIDA STORE</Text>
                        <View style={styles.formContainer}>
                            {isRegistering ? (
                                // FORM ĐĂNG KÝ
                                <>
                                    <Text style={styles.formTitle}>Register</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="rgba(255,255,255,0.6)" value={regEmail} onChangeText={setRegEmail} keyboardType="email-address" autoCapitalize="none" />
                                        <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <TextInput style={styles.input} placeholder="Username" placeholderTextColor="rgba(255,255,255,0.6)" value={regUsername} onChangeText={setRegUsername} autoCapitalize="none" />
                                        <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.6)" />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="rgba(255,255,255,0.6)" value={regPassword} onChangeText={setRegPassword} secureTextEntry />
                                        <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                                    </View>
                                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>REGISTER</Text>}
                                    </TouchableOpacity>
                                    <View style={styles.linksContainer}>
                                        <Text style={styles.linkText}>Already a member? </Text>
                                        <TouchableOpacity onPress={() => setIsRegistering(false)}><Text style={styles.linkHighlight}>Login here</Text></TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                // FORM ĐĂNG NHẬP
                                <>
                                    <Text style={styles.formTitle}>Login Now</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput style={styles.input} placeholder="Username" placeholderTextColor="rgba(255,255,255,0.6)" value={loginUsername} onChangeText={setLoginUsername} autoCapitalize="none" />
                                        <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.6)" />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="rgba(255,255,255,0.6)" value={loginPassword} onChangeText={setLoginPassword} secureTextEntry />
                                        <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                                    </View>
                                    <View style={styles.linksContainer}>
                                        <TouchableOpacity><Text style={styles.linkText}>Forgot Password? <Text style={styles.linkHighlight}>Click here</Text></Text></TouchableOpacity>
                                        <TouchableOpacity onPress={() => setIsRegistering(true)}><Text style={styles.linkText}>New User? <Text style={styles.linkHighlight}>Register here</Text></Text></TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>LOGIN</Text>}
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </ImageBackground>
            </KeyboardAvoidingView>
        );
    }

    // =================================================================
    // GIAO DIỆN MỚI KHI ĐÃ ĐĂNG NHẬP THÀNH CÔNG
    // =================================================================
    return (
        <SafeAreaView style={styles.loggedInContainer}>
            <ScrollView>
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={50} color={Colors.primary} />
                    </View>
                    <Text style={styles.name}>{user?.name.firstname} {user?.name.lastname}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
                <View style={styles.menuGroup}>
                    <Text style={styles.menuGroupTitle}>Quản lý tài khoản</Text>
                    <Link href="/order-history" asChild>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuIconContainer}><Ionicons name="receipt-outline" size={22} color={Colors.primary} /></View>
                            <Text style={styles.menuItemText}>Lịch sử mua hàng</Text>
                            <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </Link>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}><Ionicons name="location-outline" size={22} color={Colors.primary} /></View>
                        <Text style={styles.menuItemText}>Địa chỉ của tôi</Text>
                        <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.menuGroup}>
                    <Text style={styles.menuGroupTitle}>Cài đặt & Hỗ trợ</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}><Ionicons name="settings-outline" size={22} color={Colors.primary} /></View>
                        <Text style={styles.menuItemText}>Cài đặt</Text>
                        <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Styles cho màn hình xác thực (đăng nhập/đăng ký)
    authWrapper: { flex: 1 },
    background: { flex: 1 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    authContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', textAlign: 'center', letterSpacing: 5, textTransform: 'uppercase', position: 'absolute', top: 60 },
    formContainer: { width: '100%', maxWidth: 400, backgroundColor: 'rgba(20, 20, 20, 0.8)', padding: 25, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
    formTitle: { fontSize: 22, fontWeight: '500', color: '#fff', textAlign: 'center', marginBottom: 30 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 8, paddingHorizontal: 15, marginBottom: 20 },
    input: { flex: 1, color: '#fff', fontSize: 16, height: 50 },
    linksContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    linkText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    linkHighlight: { color: ACCENT_COLOR, fontWeight: 'bold' },
    button: { backgroundColor: 'transparent', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#fff', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    // Styles cho màn hình profile đã đăng nhập
    loggedInContainer: { flex: 1, backgroundColor: Colors.background },
    profileHeader: { alignItems: 'center', paddingVertical: 30, backgroundColor: Colors.surface },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0EFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    name: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
    email: { fontSize: 16, color: Colors.textSecondary },
    menuGroup: { marginHorizontal: 16, marginTop: 24 },
    menuGroupTitle: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, paddingHorizontal: 10, textTransform: 'uppercase' },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 16, borderRadius: 12, marginBottom: 1 },
    menuIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0EFFF', justifyContent: 'center', alignItems: 'center' },
    menuItemText: { flex: 1, marginLeft: 16, fontSize: 16, fontWeight: '500', color: Colors.text },
    logoutButton: { backgroundColor: Colors.logoutBackground, padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 16, marginTop: 30 },
    logoutButtonText: { color: Colors.logoutText, fontSize: 16, fontWeight: 'bold' },
});