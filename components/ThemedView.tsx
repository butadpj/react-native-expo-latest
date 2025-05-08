import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export type ThemedViewProps = ViewProps & {
  className?: string;
};

export function ThemedView({ className, ...otherProps }: ThemedViewProps) {
  return (
    <View className={cn('bg-white dark:bg-black', className)} {...otherProps} />
  );
}
