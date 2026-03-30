import React, { useState, useEffect, useRef } from 'react';
import { Settings, LogOut, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';
import UserImage from '../assets/user.png';

const Avatar = ({ userData }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [hoverManage, setHM] = useState(false);
    const [hoverSignout, setHS] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    if (!userData) return null;

    const name = userData.userName || 'User Name';
    const email = userData.email || 'user@email.com';
    const pic = userData.picture || UserImage;

    /* ── shared style tokens ── */
    const radius = '16px';
    const purple = '#6B46C1';
    const purpleL = '#A78BFA';
    const purpleBg = '#F5F0FF';

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>

            {/* ── Trigger button ── */}
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '44px', height: '44px',
                    borderRadius: '50%', border: 'none',
                    padding: 0, cursor: 'pointer',
                    background: 'transparent',
                    outline: 'none', flexShrink: 0,
                    boxShadow: 'none',
                }}
            >
                <img
                    src={pic}
                    onError={e => { e.target.onerror = null; e.target.src = UserImage; }}
                    alt={name}
                    referrerPolicy="no-referrer"
                    style={{
                        width: '44px', height: '44px',
                        borderRadius: '50%', objectFit: 'cover',
                        display: 'block', border: 'none',
                    }}
                />
            </button>

            {/* ── Dropdown panel ── */}
            {open && (
                <>
                    {/* invisible backdrop */}
                    <div
                        onClick={() => setOpen(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                    />

                    <div style={{
                        position: 'absolute', right: 0, top: '54px', zIndex: 9999,
                        width: '290px', borderRadius: radius,
                        background: '#ffffff',
                        border: '1px solid rgba(107,70,193,.15)',
                        boxShadow: '0 8px 30px rgba(107,70,193,.15), 0 2px 8px rgba(0,0,0,.08)',
                        overflow: 'hidden',
                        animation: 'none',
                    }}>

                        {/* ── User block ── */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '13px',
                            padding: '18px 18px 16px',
                            borderBottom: '1px solid #f0ebff',
                        }}>
                            {/* avatar */}
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                flexShrink: 0,
                                background: 'transparent',
                                boxShadow: 'none',
                            }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#fff' }}>
                                    <img
                                        src={pic}
                                        onError={e => { e.target.onerror = null; e.target.src = UserImage; }}
                                        alt={name}
                                        referrerPolicy="no-referrer"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                            </div>
                            {/* info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontWeight: 700, fontSize: '15px', color: '#1e0a3c',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    letterSpacing: '-0.01em',
                                }}>{name}</div>
                                <div style={{
                                    fontSize: '12px', color: '#9b7db8', marginTop: '2px',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>{email}</div>
                            </div>
                        </div>

                        {/* ── Menu items ── */}
                        <div style={{ padding: '8px' }}>

                            {/* Manage account */}
                            {userData.role !== "admin" &&
                                (
                                    <div>
                                        <Link
                                            to="/candidate/profile"
                                            state={userData}
                                            onClick={() => setOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                padding: '10px 10px', borderRadius: '10px',
                                                textDecoration: 'none',
                                                background: hoverManage ? 'rgba(107,70,193,.04)' : 'transparent',
                                                border: `1px solid ${hoverManage ? 'rgba(107,70,193,.07)' : 'transparent'}`,
                                                transition: 'all .15s ease',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={() => setHM(true)}
                                            onMouseLeave={() => setHM(false)}
                                        >
                                            {/* icon box */}
                                            <div style={{
                                                width: '34px', height: '34px', borderRadius: '8px',
                                                background: purpleBg, border: '1px solid rgba(107,70,193,.15)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <Settings size={16} style={{ color: purple }} />
                                            </div>
                                            <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#1e0a3c' }}>
                                                Manage account
                                            </span>
                                            <span style={{
                                                fontSize: '11px', color: purpleL, fontWeight: 500,
                                                background: purpleBg, padding: '2px 7px',
                                                borderRadius: '5px', border: '1px solid rgba(107,70,193,.15)',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                Ctrl + A
                                            </span>
                                        </Link>

                                        <div style={{
                                            height: '1px', margin: '4px 2px',
                                            background: 'linear-gradient(90deg, transparent, #e9d5ff 40%, #fbcfe8 65%, transparent)',
                                        }} />
                                    </div>
                                )}

                            {/* Sign out */}
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                onMouseEnter={() => setHS(true)}
                                onMouseLeave={() => setHS(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '10px 10px', borderRadius: '10px',
                                    background: hoverSignout ? 'rgba(239,68,68,.04)' : 'transparent',
                                    border: `1px solid ${hoverSignout ? 'rgba(239,68,68,.07)' : 'transparent'}`,
                                    transition: 'all .15s ease',
                                    cursor: 'pointer', width: '100%', textAlign: 'left',
                                }}
                            >
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '8px',
                                    background: '#fff1f2', border: '1px solid rgba(239,68,68,.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <LogOut size={16} style={{ color: '#ef4444' }} />
                                </div>
                                <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#ef4444' }}>
                                    Sign out
                                </span>
                                <span style={{
                                    fontSize: '11px', color: '#ef4444', fontWeight: 500,
                                    background: '#fff1f2', padding: '2px 7px',
                                    borderRadius: '5px', border: '1px solid rgba(239,68,68,.15)',
                                    whiteSpace: 'nowrap',
                                }}>
                                    Ctrl + L
                                </span>
                            </button>
                        </div>

                        {/* ── Footer ── */}
                        <div style={{
                            borderTop: '1px solid #f0ebff',
                            padding: '10px 0 11px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                        }}>
                            <Lock size={11} style={{ color: purpleL }} />
                            <span style={{ fontSize: '11.5px', color: '#9b7db8', fontWeight: 500 }}>
                                Secured by{' '}
                                <strong style={{ color: purple, fontWeight: 700 }}>JobFit</strong>
                            </span>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default Avatar;