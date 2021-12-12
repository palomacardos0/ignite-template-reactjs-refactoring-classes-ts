import { useField } from '@unform/core';
import { Container } from './styles';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

interface InputProps{
  name: string;
  placeholder: string;
}

export function Input ({name, placeholder}: InputProps) {
  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {  
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);


  return (
    <Container isFilled={isFilled} isFocused={isFocused}>

      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        name={name}
        placeholder={placeholder}
      />
    </Container>
  );
};

export default Input;
