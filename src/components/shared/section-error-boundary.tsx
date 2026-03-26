"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
};

type State = {
  hasError: boolean;
};

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log to console in dev; Sentry will capture in production
    console.error("[SectionErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function SectionError({ title }: { title: string }) {
  return (
    <div className="border-border bg-card rounded-xl border px-4 py-8 text-center shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">Try refreshing the page.</p>
    </div>
  );
}
