import React from 'react';
import { render } from '@testing-library/react-native';
import { SigninScreen } from '../../components/SigninScreen';

describe('SigninScreen', () => {
  it('deve renderizar sem erros', () => {
    render(<SigninScreen />);
  });
});