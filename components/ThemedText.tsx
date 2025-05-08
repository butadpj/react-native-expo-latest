import { Text, type TextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textVariants = cva('text-black dark:text-white', {
  variants: {
    type: {
      default: 'text-base',
      defaultSemiBold: 'text-base font-semibold',
      title: 'text-3xl font-bold',
      subtitle: 'text-xl font-bold',
      link: 'text-base text-accent-dark underline dark:text-accent-light',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

export type ThemedTextProps = TextProps &
  VariantProps<typeof textVariants> & {
    className?: string;
  };

export function ThemedText({ className, type, ...rest }: ThemedTextProps) {
  return <Text className={cn(textVariants({ type }), className)} {...rest} />;
}
