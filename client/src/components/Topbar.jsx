import React, { useEffect, useState } from 'react';
import ClearConfirmModal from './ClearConfirmModal';
import './Topbar.css';

export default function Topbar({ title, user, erp, session, setUser, setSession }) {
  const normalizedTitle = title.replace('-', ' ');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isEndingShift, setIsEndingShift] = useState(false);
  const [isStartingShift, setIsStartingShift] = useState(false);
  const [canStartNextShift, setCanStartNextShift] = useState(false);
  const [showNextShiftPrompt, setShowNextShiftPrompt] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const formatShiftDuration = () => {
    const loginTimeValue = user?.loginTime;
    if (!loginTimeValue) {
      return '00:00:00';
    }

    const loginTimestamp = new Date(loginTimeValue).getTime();
    if (Number.isNaN(loginTimestamp)) {
      return '00:00:00';
    }

    const elapsedSeconds = Math.max(0, Math.floor((currentTime - loginTimestamp) / 1000));
    const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const startNextShift = async () => {
    if (!erp || !user) {
      return;
    }

    setIsStartingShift(true);
    try {
      const response = await erp.startShift({
        user: user.user,
        role: user.role,
        shiftStart: new Date().toISOString()
      });

      const nextLoginTime = response?.shiftStart || new Date().toISOString();
      const nextSessionId = response?.sessionId || null;
      const nextUser = {
        ...user,
        loginTime: nextLoginTime
      };

      setUser(nextUser);
      localStorage.setItem('sri_nikil_user', JSON.stringify(nextUser));
      setSession(nextSessionId ? {
        id: nextSessionId,
        user: user.user,
        role: user.role,
        loginTime: nextLoginTime,
        logoutTime: null
      } : null);
      setCanStartNextShift(false);
      setShowNextShiftPrompt(false);
      alert(response?.message || 'Next shift started successfully');
    } catch (error) {
      alert(error.message || 'Failed to start next shift');
    } finally {
      setIsStartingShift(false);
    }
  };

  const endShift = async () => {
    if (!erp || !user) {
      return;
    }

    setIsEndingShift(true);
    try {
      const response = await erp.endShift({
        user: user.user,
        role: user.role,
        sessionId: session?.id,
        shiftStart: user.loginTime
      });

      const closedUser = {
        ...user,
        loginTime: null
      };

      setUser(closedUser);
      localStorage.setItem('sri_nikil_user', JSON.stringify(closedUser));
      setSession(null);
      setCanStartNextShift(Boolean(response?.promptNextShift));
      alert(response?.message || 'Shift closed and report sent successfully');

      if (response?.promptNextShift) {
        setShowNextShiftPrompt(true);
      }
    } catch (error) {
      alert(error.message || 'Failed to close shift');
    } finally {
      setIsEndingShift(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (canStartNextShift) {
      await startNextShift();
      return;
    }

    await endShift();
  };

  const primaryButtonLabel = canStartNextShift ? 'Next Shift' : 'End Shift';
  const isBusy = isEndingShift || isStartingShift;

  return (
    <>
      <div className="topbar">
        <div className="topbar-title gold-text">
          {normalizedTitle}
        </div>

        <div className="topbar-right">
          <div className="shift-action-wrap">
            <button className="overall-report-btn" onClick={handlePrimaryAction} disabled={isBusy}>
              <span>
                {isEndingShift ? 'Closing...' : isStartingShift ? 'Starting...' : primaryButtonLabel}
              </span>
              <span className="icon">{canStartNextShift ? '\u{23ED}' : '\u{1F4CA}'}</span>
            </button>
            <span className="shift-duration">{formatShiftDuration()}</span>
          </div>

          <div className="user-pill">
            <div className="dot"></div>
            <span>{user?.role ? `${user.role} User` : 'User'}</span>
          </div>

        </div>
      </div>

      <ClearConfirmModal
        open={showNextShiftPrompt}
        title="Start Next Shift"
        message="Do you want to start the next shift?"
        confirmLabel={isStartingShift ? 'Starting...' : 'Start Shift'}
        loading={isStartingShift}
        onConfirm={startNextShift}
        onClose={() => {
          if (!isStartingShift) {
            setShowNextShiftPrompt(false);
          }
        }}
      />
    </>
  );
}
