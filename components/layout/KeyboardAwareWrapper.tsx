import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
  children: React.ReactNode;
}

export const KeyboardAwareWrapper: React.FC<Props> = ({ children }) => {
  return <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>;
};
