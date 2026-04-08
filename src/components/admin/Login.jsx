import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ShopBackground } from '../ShopBackground';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-x-hidden flex items-center justify-center">
      <ShopBackground />
      
      <div className="max-w-md md:max-w-lg w-full relative z-10 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border-[6px] border-brand-dark animate-fade-in-up">
        <div className="relative mb-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4 text-brand-dark/40 hover:text-brand-orange transition-all font-black text-[11px] uppercase tracking-widest group"
          >
            <span className="text-sm group-hover:-translate-x-1 transition-transform">←</span>
            <span>Volver</span>
          </button>
          
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter">Admin Login</h2>
          <p className="text-brand-orange font-bold text-sm tracking-widest uppercase mt-2">Estilo Cruz</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-brand-dark font-black text-sm uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-50 border-2 border-brand-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-brand-dark font-black text-sm uppercase tracking-wider mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full bg-gray-50 border-2 border-brand-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-brand-dark text-brand-light text-xl font-black rounded-2xl uppercase tracking-widest shadow-[0_6px_0_0_#372673] hover:shadow-[0_4px_0_0_#372673] hover:translate-y-1 active:shadow-none active:translate-y-2 transition-all ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
