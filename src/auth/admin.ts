/*
 * Rol de administrador (DEMOSTRACIÓN).
 * Si se inicia sesión en Mi cuenta con uno de estos correos, se abre el panel /admin
 * (sesión aparte de la de clientes; cualquier contraseña sirve en la demostración). Cuando haya servicio de cuentas real, el rol vendrá
 * del servidor (nunca de una lista en el navegador).
 */
export const ADMIN_EMAILS = ['admin@lumina.test'];

export const isAdmin = (email: string | undefined | null) =>
  !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase());
