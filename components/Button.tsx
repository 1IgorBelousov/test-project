import React, {forwardRef} from 'react';
import {
  Pressable,
  Text,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface ButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const Button = forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({style, children, ...props}, ref) => (
    <Pressable
      ref={ref}
      style={({pressed}) => [
        {opacity: pressed ? 0.5 : 1}, // Прозрачность при нажатии
        style,
      ]}
      {...props}>
      <Text>{children}</Text>
    </Pressable>
  ),
);

export default Button;
