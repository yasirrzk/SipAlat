export interface User {
  id: string;
  nama: string;
  email: string;
  role: 'admin' | 'operator' | 'pelanggan';
}

export interface AuthResponse {
  user: User;
  token: string;
}
