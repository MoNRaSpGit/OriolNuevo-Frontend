export function mensajeDeError(err: unknown, mensajePorDefecto: string): string {
  return err instanceof Error ? err.message : mensajePorDefecto
}
