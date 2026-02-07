import React, { useEffect, useState } from 'react';
import CountdownTimer from './components/CountdownTimer';
import { fetchCountdowns } from './api/backend';
import { login as backendLogin } from './api/backend';
import './styles/globals.css';

const TARGET_ISO = '2063-11-18T12:00:00';

type UserInfo = { uid: string; displayName: string; email: string } | null;

const Navbar: React.FC = () => {
  return (
    <nav className="nav">
      <div className="logo" aria-label="orange-logo"></div>
      <div className="user-tag">用户: <strong>FENGWEI</strong></div>
    </nav>
  );
};

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('ut_token'));
  const [user, setUser] = useState<UserInfo>(null);
  const [countdowns, setCountdowns] = useState<Array<any>>([]);

  useEffect(() => {
    if (token) {
      fetchCountdowns(token).then((data) => {
        const cds = data?.countdowns || [];
        if (Array.isArray(cds) && cds.length > 0) {
          setCountdowns(cds);
        }
      }).catch(() => {});
    }
  }, [token]);

  const login = async () => {
    const email = 'fengwei@example.com';
    const password = 'demo123';
    try {
      const res = await backendLogin(email, password);
      if (res && res.token) {
        localStorage.setItem('ut_token', res.token);
        setToken(res.token);
        setUser({ uid: res.user.uid, displayName: res.user.displayName, email: res.user.email });
      }
    } catch (e) {
      console.error('Demo login failed', e);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-area">
        <section className="hero">
          <h1 className="title">91岁生日倒计时</h1>
          <p className="subtitle">从 1972-11-18 12:00 到 2063-11-18 12:00 的生命倒计时，精确到年/月/日/时/分/秒</p>
        </section>
        {countdowns.length > 0 ? (
          countdowns.map((cd) => (
            <CountdownTimer key={cd.id} targetISO={cd.targetDateISO} title={cd.title} />
          ))
        ) : (
          <CountdownTimer targetISO={TARGET_ISO} title="倒计时（2063-11-18 12:00:00 本地时区）" />
        )}
        <section className="login-area">
          {token ? (
            <div>已登录</div>
          ) : (
            <button className="login-btn" onClick={login}>使用演示账号登录</button>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
