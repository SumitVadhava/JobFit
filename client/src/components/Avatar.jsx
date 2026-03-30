import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Settings, LogOut, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';
import UserImage from '../assets/user.png';

const Avatar = ({ userData }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const [hoverManage, setHM] = useState(false);
    const [hoverSignout, setHS] = useState(false);
    const [hoverCancel, setHC] = useState(false);
    const ref = useRef(null);

    const openConfirm = useCallback(() => {
        setOpen(false);
        setShowConfirm(true);
    }, []);

    const doLogout = useCallback(() => {
        setSigningOut(true);
        localStorage.clear();
        setTimeout(() => {
            logout();
            navigate('/');
        }, 1200);
    }, [logout, navigate]);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target) && !showConfirm) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [showConfirm]);

    /* Listen for Ctrl+L shortcut event dispatched from Navbar */
    useEffect(() => {
        const handler = () => openConfirm();
        window.addEventListener('jobfit:signout-confirm', handler);
        return () => window.removeEventListener('jobfit:signout-confirm', handler);
    }, [openConfirm]);

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
        <>
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
                                onClick={openConfirm}
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

        {/* ── Sign-out confirmation modal ── */}
        {showConfirm && typeof document !== 'undefined' && createPortal(
            <div
                onClick={() => setShowConfirm(false)}
                style={{
                    position: 'fixed', inset: 0, zIndex: 99999,
                    background: 'rgba(15,10,30,0.55)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px',
                }}
            >
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        width: '100%', maxWidth: '380px',
                        padding: '32px 28px 24px',
                        boxShadow: '0 20px 60px rgba(107,70,193,.25), 0 4px 16px rgba(0,0,0,.12)',
                        border: '1px solid rgba(107,70,193,.12)',
                        textAlign: 'center',
                        animation: 'avatarSlideIn .2s ease',
                    }}
                >
                    {/* Icon */}
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'linear-gradient(135deg,#fff1f2,#fee2e2)',
                        border: '1.5px solid rgba(239,68,68,.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <LogOut size={26} style={{ color: '#ef4444' }} />
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e0a3c', marginBottom: '8px' }}>
                        Sign out?
                    </div>
                    <div style={{ fontSize: '14px', color: '#9b7db8', lineHeight: 1.5, marginBottom: '28px' }}>
                        Are you sure you want to sign out of your account?
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setShowConfirm(false)}
                            onMouseEnter={() => setHC(true)}
                            onMouseLeave={() => setHC(false)}
                            style={{
                                flex: 1, padding: '11px', borderRadius: '12px',
                                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                border: '1.5px solid rgba(107,70,193,.2)',
                                background: hoverCancel ? '#F5F0FF' : '#fff',
                                color: '#6B46C1',
                                transition: 'all .15s ease',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={doLogout}
                            disabled={signingOut}
                            style={{
                                flex: 1, padding: '11px', borderRadius: '12px',
                                fontSize: '14px', fontWeight: 600,
                                cursor: signingOut ? 'not-allowed' : 'pointer',
                                border: 'none',
                                background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                color: '#fff',
                                boxShadow: '0 4px 12px rgba(239,68,68,.35)',
                                transition: 'all .15s ease',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '8px',
                                opacity: signingOut ? 0.85 : 1,
                            }}
                        >
                            {signingOut ? (
                                <>
                                    <span style={{
                                        width: '15px', height: '15px',
                                        borderRadius: '50%',
                                        border: '2px solid rgba(255,255,255,.35)',
                                        borderTopColor: '#fff',
                                        animation: 'avatarSpin .65s linear infinite',
                                        display: 'inline-block', flexShrink: 0,
                                    }} />
                                    Signing out…
                                </>
                            ) : 'Sign out'}
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )}


        <style>{`
          @keyframes avatarSlideIn {
            from { opacity: 0; transform: scale(.92) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes avatarSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        </>
    );
};

export default Avatar;
