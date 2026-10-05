import React from 'react';
import { Landing } from './Landing';

export const LandingPage: React.FC<React.ComponentProps<typeof Landing>> = (props) => {
  return <Landing {...props} />;
};
