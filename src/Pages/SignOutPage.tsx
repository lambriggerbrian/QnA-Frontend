import React, { FC, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Page } from './Page';
import { StatusText, SubtleText } from '../Styles';
import { useAuth } from '../Auth';

type SignOutAction = 'signout' | 'signout-callback';

interface Props {
  action: SignOutAction;
}

export const SignOutPage: FC<Props> = ({ action }) => {
  let message = 'Signing out...';
  let redirect = false;
  const [countdown, setCountdown] = useState(3);
  const { signOut } = useAuth();
  switch (action) {
    case 'signout':
      let status = signOut();
      console.log(status);
      if (!status.success)
        message = status.message
          ? status.message
          : 'Error signing out. Please try again';
      break;
    case 'signout-callback':
      message = 'You successfully signed out';
      redirect = true;
      break;
  }
  useEffect(() => {
    let isMounted = true;
    if (redirect) {
      setTimeout(() => {
        if (isMounted) setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      isMounted = false;
    };
  }, [countdown, redirect]);
  return (
    <Page title="Sign Out">
      <StatusText>{message}</StatusText>
      {redirect && (
        <SubtleText>You will be redirected in {countdown} seconds</SubtleText>
      )}
      {redirect && countdown <= 0 && <Redirect to="/" />}
    </Page>
  );
};
