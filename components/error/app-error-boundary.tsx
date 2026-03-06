import { Component, ErrorInfo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';
import { recordError } from '@/services/observability';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    recordError('render_boundary', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>An unexpected error occurred. Please reload this screen.</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.button}
            onPress={() => this.setState({ hasError: false })}>
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: AppTheme.spacing.lg,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  body: {
    color: AppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: AppTheme.colors.accent,
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonText: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
