export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    try {
      const { initTracing } = await import('./lib/tracing');
      initTracing();
    } catch (e) {
      console.warn("OpenTelemetry initialization skipped:", e);
    }
  }
}
