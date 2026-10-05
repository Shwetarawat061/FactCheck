import React from 'react';
import { FactCheckPage } from './FactCheck';

export const AppHome: React.FC<React.ComponentProps<typeof FactCheckPage>> = (props) => {
  return <FactCheckPage {...props} />;
};
