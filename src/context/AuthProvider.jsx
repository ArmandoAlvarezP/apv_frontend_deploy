import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    
    const [ auth, setAuth ] = useState({});
    const [ cargando, setCargando ] = useState(true);

    useEffect(() => {
        const autenticarUsuario = async() => {
            const token = localStorage.getItem('token');
            
            if(!token) {
                setCargando(false);
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios('/veterinarios/perfil', config);
                setAuth(data);
            } catch (error) {
                console.log(error.response?.data.msg)
                setAuth({});
            }

            setCargando(false);
        }

        autenticarUsuario();
    }, [])
    
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({});
    }

    const actualizarPerfil = async perfil => {
        const token = localStorage.getItem('token');
            
            if(!token) {
                setCargando(false);
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios.put(`/veterinarios/perfil/${perfil._id}`, perfil, config);

                setAuth(data);

                return {
                    msg: 'Almacenado Correctamente',
                    error: false
                }
            } catch (error) {
                return {
                    msg: error.response?.data.msg,
                    error: true
                } 
            }
    } 

    const actualizarPassword = async datos => {
        const token = localStorage.getItem('token');
            
        if(!token) {
            setCargando(false);
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios.put('/veterinarios/actualizar-password', datos, config);
            return {
                msg: data?.msg, 
                error: false
            }
        } catch (error) {
            return {
                msg: error.response?.data.msg,
                error: true
            } 
        }
    }

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil, 
                actualizarPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;