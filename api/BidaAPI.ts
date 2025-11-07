import axios from 'axios';

// =======================================================
// === PHẦN 1: API CƠ BIDA CỦA BẠN (TỪ GIST) ===
// =======================================================
export interface BidaCue {
    id: number;
    name: string;
    brand: string;
    price: number;
    type: string;
    description: string;
    weight: string;
    image: string;
}

const BIDA_GIST_URL = 'https://gist.githubusercontent.com/Qsang1232/3c7e7f4a75b884daee7e2fe82ac1a18a/raw/1f3d4ffe6896f2698cbd32f15cf5eb250bb5eaee/bida_cues.json';

export const getBidaCues = async (): Promise<BidaCue[]> => {
    try {
        const response = await axios.get(BIDA_GIST_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu cơ bida:', error);
        return [];
    }
};

export const getBidaCueById = async (id: number): Promise<BidaCue | null> => {
    try {
        const allCues = await getBidaCues();
        return allCues.find(cue => cue.id === id) || null;
    } catch (error) {
        console.error(`Lỗi khi tìm cơ bida ID ${id}:`, error);
        return null;
    }
};


// =======================================================
// === PHẦN 2: API FAKE STORE (CHO CÁC CHỨC NĂNG KHÁC) ===
// =======================================================
const FAKE_STORE_URL = 'https://fakestoreapi.com';

// --- Xác thực (Authentication) ---
export interface UserProfile {
    id: number;
    email: string;
    username: string;
    name: { firstname: string; lastname: string; };
    address: { city: string; street: string; number: number; zipcode: string; };
    phone: string;
}
export interface NewUserData {
    email: string;
    username: string;
    password: string;
    name: { firstname: string; lastname: string; };
    address: { city: string; street: string; number: number; zipcode: string; };
    phone: string;
}

export const loginUser = async (username: string, password: string): Promise<{ token: string } | null> => {
    try {
        const response = await axios.post(`${FAKE_STORE_URL}/auth/login`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return null;
    }
};
export const getUserProfile = async (userId: number): Promise<UserProfile | null> => {
    try {
        const response = await axios.get(`${FAKE_STORE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        return null;
    }
};
export const registerUser = async (userData: NewUserData): Promise<{ id: number } | null> => {
    try {
        const response = await axios.post(`${FAKE_STORE_URL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        return null;
    }
};

// --- Giỏ hàng (Cart) ---
interface CartProductAPI {
    productId: number;
    quantity: number;
}
export interface ApiCart {
    id: number;
    userId: number;
    date: string;
    products: CartProductAPI[];
}
export const getCartByUserId = async (userId: number): Promise<ApiCart | null> => {
    try {
        const response = await axios.get<ApiCart[]>(`${FAKE_STORE_URL}/carts/user/${userId}`);
        return response.data?.[0] || null;
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        return null;
    }
};
export const updateCart = async (cartId: number, products: CartProductAPI[]): Promise<ApiCart | null> => {
    try {
        const response = await axios.put(`${FAKE_STORE_URL}/carts/${cartId}`, {
            userId: 1, date: new Date().toISOString(), products: products
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        return null;
    }
};

// --- Đơn hàng (Orders) ---
export interface NewOrderData {
    userId: number;
    date: string;
    products: CartProductAPI[];
}
export interface ApiOrder {
    id: number;
    userId: number;
    date: string;
    products: CartProductAPI[];
}
export const addOrder = async (orderData: NewOrderData): Promise<ApiOrder | null> => {
    try {
        const response = await axios.post(`${FAKE_STORE_URL}/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        return null;
    }
};
export const getOrdersByUserId = async (userId: number): Promise<ApiOrder[] | null> => {
    try {
        const response = await axios.get<ApiOrder[]>(`${FAKE_STORE_URL}/orders/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
        return null;
    }
};

export const generateVietQR = (accountInfo: {
    bankBin: string; // Mã BIN của ngân hàng (VD: Vietinbank là 970415)
    accountNo: string; // Số tài khoản
    amount: number; // Số tiền
    orderId: string; // Mã đơn hàng
}): string => {
    // Tạo chuỗi theo chuẩn VietQR (compact)
    // Ví dụ: Vietinbank - 123456789 - template - amount - DH12345
    const qrContent = `https://img.vietqr.io/image/${accountInfo.bankBin}-${accountInfo.accountNo}-compact2.png?amount=${accountInfo.amount}&addInfo=${accountInfo.orderId}`;

    // API miễn phí này sẽ trả về ảnh QR code dựa trên URL
    return qrContent;
}
